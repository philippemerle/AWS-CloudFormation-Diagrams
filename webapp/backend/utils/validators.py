"""Validation of user inputs."""
import re
import shlex
from typing import Optional, Tuple
from constants import CFN_RESOURCES_RE, CFN_TEMPLATE_RE, EXTRA_ARGS_ALLOWED_FLAGS


class ValidationError(Exception):
    """Exception error validation."""
    pass


class InputValidator:
    """Validator for user inputs."""

    SUPPORTED_FORMATS = [
        'png', 'jpg', 'jpeg', 'gif', 'svg', 'pdf',
        'dot', 'dot_json', 'drawio', 'mermaid', 'd2'
    ]

    @classmethod
    def validate_cfn_template(cls, content: str) -> Tuple[bool, Optional[str]]:
        """
        Validate an AWS CloudFormation template content.

        Args:
            content: Template content (YAML or JSON)

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not content or not content.strip():
            return False, "Template content cannot be empty."

        if len(content.strip()) < 10:
            return False, "Template content is too short."

        if not cls.looks_like_cfn_template(content):
            return False, (
                "Content does not appear to be a valid AWS CloudFormation template "
                "(missing Resources or AWSTemplateFormatVersion key)."
            )

        return True, None

    @classmethod
    def validate_output_format(cls, format_str: str) -> Tuple[bool, Optional[str]]:
        if not format_str:
            return False, "Output format cannot be empty."

        format_str = format_str.lower().strip()

        if format_str not in cls.SUPPORTED_FORMATS:
            return False, (
                f"Unsupported output format '{format_str}'. "
                f"Supported formats: {', '.join(cls.SUPPORTED_FORMATS)}"
            )

        return True, None

    @staticmethod
    def find_disallowed_flag(tokens: list, tool: str) -> Optional[str]:
        """
        Return the first token that looks like a CLI flag not in that tool's
        allowlist (EXTRA_ARGS_ALLOWED_FLAGS), or None if all tokens are allowed.

        Args:
            tokens: Already-tokenized extra args (see shlex.split)
            tool: Key into EXTRA_ARGS_ALLOWED_FLAGS identifying the target CLI tool

        Returns:
            Optional[str]: The disallowed flag, or None if all tokens are allowed
        """
        allowed_flags = EXTRA_ARGS_ALLOWED_FLAGS[tool]
        for token in tokens:
            if token.startswith('-'):
                flag = token.split('=', 1)[0]
                if flag not in allowed_flags:
                    return flag
        return None

    @classmethod
    def validate_extra_args(cls, args: str, tool: str) -> Tuple[bool, Optional[str]]:
        """
        Validate extra args against the allowlist of flags for the given tool.

        Args:
            args: extra_args
            tool: Key into EXTRA_ARGS_ALLOWED_FLAGS identifying the target CLI tool

        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not args or not args.strip():
            return True, None

        try:
            tokens = shlex.split(args.strip())
        except ValueError:
            return False, "Invalid extraArgs: could not parse the value (check for unmatched quotes)."

        bad_flag = cls.find_disallowed_flag(tokens, tool)
        if bad_flag:
            allowed_flags = EXTRA_ARGS_ALLOWED_FLAGS[tool]
            return False, (
                f"Extra arg flag '{bad_flag}' is not allowed. "
                f"Allowed flags: {', '.join(sorted(allowed_flags))}"
            )

        return True, None

    @staticmethod
    def looks_like_cfn_template(text: str) -> bool:
        """
        Heuristic to detect an AWS CloudFormation template.

        Args:
            text: content to check

        Returns:
            bool: True if it looks like a CFN template
        """
        if not text:
            return False
        t = text.strip()
        return bool(CFN_TEMPLATE_RE.search(t))
