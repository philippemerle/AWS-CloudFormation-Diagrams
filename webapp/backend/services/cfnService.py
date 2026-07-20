"""Service for generating diagrams from AWS CloudFormation templates."""
import os
import subprocess

from constants import MIME_TYPES
from utils import get_app_logger, log_unexpected_error
from .models import DiagramResult
from .file_manager import FileManager
from .utils import parse_extra_args, has_fatal_error, encode_content, redact_temp_paths

logger = get_app_logger(__name__)


def generate_from_cfn_template(
    template_content: str,
    output_format: str = "png",
    extra_args: str = "",
    embed_all_icons: bool = False
) -> DiagramResult:
    """
    Generate a diagram from an AWS CloudFormation template.

    Args:
        template_content: Content of the CloudFormation template (YAML or JSON)
        output_format: Output format (png, svg, pdf, dot, dot_json, drawio, mermaid, d2, ...)
        extra_args: Additional arguments for aws-cfn-diagrams
        embed_all_icons: Embed all icons into the output (--embed-all-icons flag)

    Returns:
        DiagramResult: Result of the generation
    """
    with FileManager.create_temp_file(template_content, suffix='.yaml') as tmp_template:
        base_name = FileManager.get_base_name_from_path(tmp_template)
        requested_output, png_output = FileManager.get_output_paths(tmp_template, output_format)
        # aws-cfn-diagrams -o takes the output base name WITHOUT extension
        # The tool creates {output_base}.{format} automatically
        output_base = os.path.splitext(requested_output)[0]

        def _redact(text):
            return redact_temp_paths(text, tmp_template, requested_output, png_output, output_base)

        try:
            cmd = ["aws-cfn-diagrams", tmp_template, "-f", output_format, "-o", output_base]
            if embed_all_icons:
                cmd.append("--embed-all-icons")
            if extra_args.strip():
                cmd.extend(parse_extra_args(extra_args, "aws-cfn-diagrams"))

            proc = subprocess.run(cmd, check=False, capture_output=True, text=True)
            stdout_output = _redact(proc.stdout or "")
            stderr_output = _redact(proc.stderr or "")
            command_str = _redact(" ".join(cmd))

            if proc.returncode != 0 or has_fatal_error(stdout_output, stderr_output):
                FileManager.cleanup_files(requested_output, png_output)
                return DiagramResult(
                    success=False,
                    error="aws-cfn-diagrams failed. See command output below.",
                    command=command_str,
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            output_info = FileManager.find_output_file(requested_output, png_output)
            if not output_info:
                return DiagramResult(
                    success=False,
                    error="Output file not found (the aws-cfn-diagrams command did not produce the expected output).",
                    command=command_str,
                    stdout=stdout_output,
                    stderr=stderr_output
                )

            output_file, produced_format = output_info
            content = FileManager.read_file_content(output_file, binary=True)
            encoded = encode_content(content, produced_format)

            FileManager.cleanup_files(requested_output, png_output)

            return DiagramResult(
                success=True,
                diagram=encoded,
                mime_type=MIME_TYPES.get(produced_format, "application/octet-stream"),
                filename=f"{base_name}.{produced_format}",
                message="Diagram successfully generated.",
                command=command_str,
                stdout=stdout_output,
                stderr=stderr_output
            )

        except Exception:
            FileManager.cleanup_files(requested_output, png_output)
            return DiagramResult(
                success=False,
                error=log_unexpected_error(logger, "generating CFN diagram"),
                command=_redact(" ".join(cmd)) if 'cmd' in locals() else None
            )