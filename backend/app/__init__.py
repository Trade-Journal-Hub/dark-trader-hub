"""
Trading Journal Flask Application Factory
"""

import logging

from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import auth, db, storage
from app.middleware.auth_middleware import AuthMiddleware
from app.routes import api_bp
from app.routes.analytics_routes import analytics_bp
from app.routes.file_routes import file_bp
from app.utils.logger import setup_logging


def create_app(config_class=Config):
    """Create and configure Flask application instance."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Setup logging
    setup_logging(app)

    # Initialize extensions
    db.init_app(app)
    auth.init_app(app)
    storage.init_app(app)

    # Configure CORS
    CORS(
        app,
        origins=app.config.get("ALLOWED_ORIGINS", ["http://localhost:3000"]),
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(file_bp)
    app.register_blueprint(analytics_bp)

    # Add authentication middleware
    app.wsgi_app = AuthMiddleware(app.wsgi_app)

    # Health check endpoint
    @app.route("/health")
    def health_check():
        return {"status": "healthy", "service": "trading-journal-api"}, 200

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {
            "error": "Not found",
            "message": "The requested resource was not found",
        }, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {
            "error": "Internal server error",
            "message": "An unexpected error occurred",
        }, 500

    @app.errorhandler(400)
    def bad_request(error):
        return {"error": "Bad request", "message": "Invalid request data"}, 400

    return app
