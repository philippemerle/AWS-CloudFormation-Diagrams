'''
    Setup PyPI package.
'''
import glob
from setuptools import setup

with open("README.md", encoding="utf-8") as readme:
    setup(
        name="AWS-CloudFormation-Diagrams",
        version="0.2.0",
        author="Philippe Merle",
        author_email="philippe.merle@inria.fr",
        maintainer="Philippe Merle",
        maintainer_email="philippe.merle@inria.fr",
        url="https://github.com/philippemerle/AWS-CloudFormation-Diagrams",
        description="A simple CLI script to generate AWS infrastructure diagrams from AWS CloudFormation templates",
        long_description=readme.read(),
        long_description_content_type="text/markdown",
        license="Apache-2.0",
        classifiers=[
            "Topic :: Software Development :: Documentation",
            "Topic :: Utilities",
            "Development Status :: 5 - Production/Stable",
            "Programming Language :: Python :: 3.9",
            "Programming Language :: Python :: 3.10",
            "Programming Language :: Python :: 3.11",
            "Programming Language :: Python :: 3.12",
            "Programming Language :: Python :: 3.13",
            "Operating System :: OS Independent",
            "Environment :: Console",
            "Intended Audience :: Developers",
            "Intended Audience :: Information Technology",
            "Natural Language :: English",
        ],
        keywords = "aws cloudformation diagrams python graphviz",
        python_requires=">=3.9",
        install_requires=[
            "PyYAML",
            "diagrams",
        ],
        packages=[],
        package_dir={},
        scripts=[
            "aws-cfn-diagrams",
        ],
        data_files=[
            ("bin", ["aws-cfn-diagrams.yaml"]),
            ("bin/icons", glob.glob("icons/*")),
        ],
        project_urls={
            "Issues": "https://github.com/philippemerle/AWS-CloudFormation-Diagrams/issues",
            "Discussions": "https://github.com/philippemerle/AWS-CloudFormation-Diagrams/discussions",
            "Wiki": "https://github.com/philippemerle/AWS-CloudFormation-Diagrams/wiki",
        },
    )
