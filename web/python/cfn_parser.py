import json
import re
import yaml


def _make_scalar(key):
    return yaml.constructor.SafeConstructor.add_constructor


_CFN_TAGS = {}

def _tag(tag, fn):
    _CFN_TAGS[tag] = fn

_tag("!Ref",         lambda l, n: {"Ref": l.construct_scalar(n)})
_tag("!Condition",   lambda l, n: {"Condition": l.construct_scalar(n)})
_tag("!Base64",      lambda l, n: {"Fn::Base64": l.construct_scalar(n)})
_tag("!ImportValue", lambda l, n: {"Fn::ImportValue": l.construct_scalar(n)})
_tag("!GetAZs",      lambda l, n: {"Fn::GetAZs": l.construct_scalar(n)})
_tag("!And",         lambda l, n: {"Fn::And": l.construct_sequence(n, deep=True)})
_tag("!Or",          lambda l, n: {"Fn::Or": l.construct_sequence(n, deep=True)})
_tag("!Not",         lambda l, n: {"Fn::Not": l.construct_sequence(n, deep=True)})
_tag("!If",          lambda l, n: {"Fn::If": l.construct_sequence(n, deep=True)})
_tag("!Join",        lambda l, n: {"Fn::Join": l.construct_sequence(n, deep=True)})
_tag("!Split",       lambda l, n: {"Fn::Split": l.construct_sequence(n, deep=True)})
_tag("!Select",      lambda l, n: {"Fn::Select": l.construct_sequence(n, deep=True)})
_tag("!FindInMap",   lambda l, n: {"Fn::FindInMap": l.construct_sequence(n, deep=True)})
_tag("!ValueOf",     lambda l, n: {"Fn::ValueOf": l.construct_sequence(n, deep=True)})
_tag("!Equals",      lambda l, n: {"Fn::Equals": l.construct_sequence(n, deep=True)})


def _getatt_constructor(loader, node):
    if isinstance(node, yaml.ScalarNode):
        val = loader.construct_scalar(node)
        parts = val.split(".", 1)
        return {"Fn::GetAtt": parts}
    return {"Fn::GetAtt": loader.construct_sequence(node, deep=True)}


def _sub_constructor(loader, node):
    if isinstance(node, yaml.ScalarNode):
        return {"Fn::Sub": loader.construct_scalar(node)}
    return {"Fn::Sub": loader.construct_sequence(node, deep=True)}


class _CFNLoader(yaml.SafeLoader):
    pass


for _tag_name, _fn in _CFN_TAGS.items():
    _CFNLoader.add_constructor(_tag_name, _fn)

_CFNLoader.add_constructor("!GetAtt", _getatt_constructor)
_CFNLoader.add_constructor("!Sub",    _sub_constructor)


_SUB_RESOURCE_RE = re.compile(r"\$\{([A-Za-z][A-Za-z0-9]*)(\.([A-Za-z0-9_.]+))?\}")


def _find_refs(value, resource_names):
    found = set()

    def walk(v):
        if v is None:
            return
        if isinstance(v, (int, float, bool, str)):
            return
        if isinstance(v, list):
            for item in v:
                walk(item)
            return
        if isinstance(v, dict):
            if "Ref" in v and isinstance(v["Ref"], str) and v["Ref"] in resource_names:
                found.add(v["Ref"])
                return
            if "Fn::GetAtt" in v:
                att = v["Fn::GetAtt"]
                target = att[0] if isinstance(att, list) else str(att).split(".")[0]
                if target in resource_names:
                    found.add(target)
                return
            if "Fn::Sub" in v:
                sub = v["Fn::Sub"]
                s = sub[0] if isinstance(sub, list) else sub
                if isinstance(s, str):
                    for m in _SUB_RESOURCE_RE.finditer(s):
                        name = m.group(1)
                        if name in resource_names:
                            found.add(name)
                return
            for child in v.values():
                walk(child)

    walk(value)
    return found


def _promote_parameters(data):
    params = data.get("Parameters") or {}
    resources = data.get("Resources") or {}
    promoted = []

    for pname, pdata in params.items():
        ptype = pdata.get("Type", "")
        if ptype.startswith("List<") and ptype.endswith(">"):
            ptype = ptype[5:-1]
        elif ptype.startswith("AWS::SSM::Parameter::Value<") and ptype.endswith(">"):
            ptype = ptype[len("AWS::SSM::Parameter::Value<"):-1]
        if ptype.endswith("::Id"):
            rtype = ptype[:-3]
            if pname not in resources:
                resources[pname] = {"Type": rtype, "Properties": {}, "_from_parameter": True}
                promoted.append(pname)

    data["Resources"] = resources
    return promoted


def parse_template(yaml_or_json_text, filename="template.yaml"):
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "json":
        data = json.loads(yaml_or_json_text)
    else:
        data = yaml.load(yaml_or_json_text, Loader=_CFNLoader)

    if not data or "Resources" not in data:
        raise ValueError("No 'Resources' section found in template.")

    promoted = _promote_parameters(data)
    resources = data["Resources"]
    resource_names = set(resources.keys())

    nodes = []
    for rname, rdata in resources.items():
        rtype = rdata.get("Type", "Unknown")
        if isinstance(rtype, dict):
            rtype = "Custom"
        nodes.append({
            "id":             rname,
            "type":           rtype,
            "from_parameter": rdata.get("_from_parameter", False),
        })

    edges = []
    seen = set()

    def add_edge(src, dst, kind):
        key = f"{src}->{dst}"
        if src == dst or key in seen:
            return
        seen.add(key)
        edges.append({"from": src, "to": dst, "kind": kind})

    for rname, rdata in resources.items():
        deps = rdata.get("DependsOn")
        if isinstance(deps, str) and deps in resource_names:
            add_edge(rname, deps, "depends")
        elif isinstance(deps, list):
            for d in deps:
                if isinstance(d, str) and d in resource_names:
                    add_edge(rname, d, "depends")

        refs = _find_refs(rdata.get("Properties") or {}, resource_names)
        for target in refs:
            add_edge(rname, target, "ref")

    vpc_children = {}
    subnet_children = {}
    for rname, rdata in resources.items():
        rtype = rdata.get("Type", "")
        if rtype == "AWS::EC2::VPC":
            vpc_children[rname] = []
        if rtype == "AWS::EC2::Subnet":
            subnet_children[rname] = []

    for rname, rdata in resources.items():
        props = rdata.get("Properties") or {}

        vpc_ref = props.get("VpcId")
        if isinstance(vpc_ref, dict) and "Ref" in vpc_ref:
            target = vpc_ref["Ref"]
            if target in vpc_children and rname != target:
                vpc_children[target].append(rname)

        subnet_ref = props.get("SubnetId")
        if not subnet_ref:
            subnet_ids = props.get("SubnetIds")
            if isinstance(subnet_ids, list) and subnet_ids:
                subnet_ref = subnet_ids[0]
        if isinstance(subnet_ref, dict) and "Ref" in subnet_ref:
            target = subnet_ref["Ref"]
            if target in subnet_children and rname != target:
                subnet_children[target].append(rname)

    return json.dumps({
        "nodes":           nodes,
        "edges":           edges,
        "vpc_children":    vpc_children,
        "subnet_children": subnet_children,
        "stats": {
            "resources": len([n for n in nodes if not n["from_parameter"]]),
            "parameters": len(data.get("Parameters") or {}),
            "outputs":    len(data.get("Outputs") or {}),
        },
    })