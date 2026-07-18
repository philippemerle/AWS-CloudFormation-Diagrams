"""Constants of the backend"""
import re

MIME_TYPES = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "pdf": "application/pdf",
    "dot": "text/vnd.graphviz",
    "dot_json": "application/json",
    "drawio": "application/xml",
    "mermaid": "text/vnd.mermaid",
    "d2": "text/vnd.d2",
}

TEXT_FORMATS = {"svg", "dot", "dot_json", "drawio", "mermaid", "d2"}

CFN_RESOURCES_RE = re.compile(r'^\s*Resources\s*:\s*$', re.MULTILINE)
CFN_TEMPLATE_RE = re.compile(
    r'^\s*(AWSTemplateFormatVersion|Description|Parameters|Resources|Outputs)\s*:',
    re.MULTILINE
)

MAX_LOG_LENGTH = 999999

YAML_EXTENSIONS = ['.yaml', '.yml']
JSON_EXTENSIONS = ['.json']

EXTRA_ARGS_ALLOWED_FLAGS = {
    "aws-cfn-diagrams": {"--embed-all-icons"},
}