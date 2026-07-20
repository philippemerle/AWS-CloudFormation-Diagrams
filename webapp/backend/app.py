"""Flask Application for AWS CloudFormation Diagrams Web UI."""
from flask import Flask, g, request, jsonify
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config, setup_logging
from routes.cfn import cfn_bp
from routes.submit import submit_bp
from routes.render import render_bp
from utils.access_logger import log_request, get_real_ip, get_all_ip_headers
from time import time


def create_app():
    app = Flask(__name__)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'aws-cfn-diagrams-backend',
            'version': '1.0.0'
        }), 200

    @app.route('/api/debug/ip', methods=['GET'])
    def debug_ip():
        if not Config.DEBUG:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({
            'detected_ip': get_real_ip(),
            'remote_addr': request.remote_addr,
            'headers': get_all_ip_headers(),
            'behind_proxy': Config.BEHIND_PROXY,
            'proxy_x_for': Config.PROXY_X_FOR
        }), 200

    if Config.BEHIND_PROXY:
        app.wsgi_app = ProxyFix(
            app.wsgi_app,
            x_for=Config.PROXY_X_FOR,
            x_proto=Config.PROXY_X_PROTO,
            x_host=Config.PROXY_X_HOST,
            x_prefix=Config.PROXY_X_PREFIX
        )

    if Config.CORS_ENABLED:
        CORS(app)

    setup_logging()

    @app.before_request
    def before_request():
        g.request_start_time = time()

    @app.after_request
    def after_request(response):
        if request.path == '/api/health':
            return response
        response_size = response.calculate_content_length() or 0
        log_request(status_code=response.status_code, response_size=response_size)
        return response

    app.register_blueprint(cfn_bp)
    app.register_blueprint(submit_bp)
    app.register_blueprint(render_bp)

    return app


app = create_app()

if __name__ == "__main__":
    print("=" * 50)
    print("Flask Application Configuration")
    print("=" * 50)
    print(f"BEHIND_PROXY: {Config.BEHIND_PROXY}")
    print(f"PROXY_X_FOR: {Config.PROXY_X_FOR}")
    print(f"PROXY_X_PROTO: {Config.PROXY_X_PROTO}")
    print(f"PROXY_X_HOST: {Config.PROXY_X_HOST}")
    print(f"PROXY_X_PREFIX: {Config.PROXY_X_PREFIX}")
    print(f"DEBUG: {Config.DEBUG}")
    print(f"PORT: {Config.PORT}")
    print(f"HOST: {Config.HOST}")
    print("=" * 50)
    print("")
    app.run(port=Config.PORT, debug=Config.DEBUG)