# =============================================================================
# AWS CloudFormation Diagrams Backend - Dockerfile
# =============================================================================

FROM docker.io/python:3.13-alpine AS base

RUN apk update && apk add --no-cache \
    graphviz \
    graphviz-dev \
    bash \
    ttf-freefont \
    curl \
    git \
    gcc \
    musl-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p logs && chmod 755 logs

ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV BEHIND_PROXY=true
ENV PROXY_X_FOR=1

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl --fail --silent http://localhost:5000/api/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
