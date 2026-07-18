"""Route for diagram generation from AWS CloudFormation templates."""
from flask import Blueprint, request

from services import generate_from_cfn_template
from utils import InputValidator, ResponseBuilder
from .utils import compact_for_log, log_to_csv

cfn_bp = Blueprint('cfn', __name__)


@cfn_bp.route('/api/generate-cfn-diagram', methods=['POST'])
def generate_cfn_diagram():
    """Diagram generation from an AWS CloudFormation template."""
    data = request.get_json()
    template_content = data.get('template', '')
    output_format = (data.get('outputFormat') or 'png').lower()
    extra_args = data.get('extraArgs', '')
    embed_all_icons = data.get('embedAllIcons', False)

    client_ip = request.remote_addr
    route = request.path
    params = (
        f"format={output_format};"
        f"extraArgs={compact_for_log(extra_args)};"
        f"embedAllIcons={embed_all_icons};"
        f"template={compact_for_log(template_content)}"
    )
    log_to_csv(client_ip, route, params)

    is_valid, error_msg = InputValidator.validate_cfn_template(template_content)
    if not is_valid:
        return ResponseBuilder.validation_error("template", error_msg)

    is_valid, error_msg = InputValidator.validate_output_format(output_format)
    if not is_valid:
        return ResponseBuilder.validation_error("outputFormat", error_msg)

    is_valid, error_msg = InputValidator.validate_extra_args(extra_args, "aws-cfn-diagrams")
    if not is_valid:
        return ResponseBuilder.validation_error("extraArgs", error_msg)

    result = generate_from_cfn_template(
        template_content=template_content,
        output_format=output_format,
        extra_args=extra_args,
        embed_all_icons=embed_all_icons
    )

    return ResponseBuilder.from_diagram_result(result)
