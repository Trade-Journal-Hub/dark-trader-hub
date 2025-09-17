"""
Logging configuration and utilities
"""

import logging
import sys
from typing import Optional

from flask import current_app


def setup_logging(app):
    """Setup logging configuration for Flask app."""
    if not app.debug and not app.testing:
        # Production logging
        logging.basicConfig(
            level=getattr(logging, app.config.get("LOG_LEVEL", "INFO")),
            format=app.config.get(
                "LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            ),
            handlers=[
                logging.StreamHandler(sys.stdout),
                logging.FileHandler("app.log"),
            ],
        )
    else:
        # Development logging
        logging.basicConfig(
            level=logging.DEBUG,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[logging.StreamHandler(sys.stdout)],
        )


def get_logger(name: str) -> logging.Logger:
    """Get logger instance for a module."""
    return logging.getLogger(name)


class RequestLogger:
    """Logger for HTTP requests."""

    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Initialize request logging."""
        app.before_request(self.before_request)
        app.after_request(self.after_request)

    def before_request(self):
        """Log incoming request."""
        if current_app.debug:
            from flask import request
            logger = get_logger(__name__)
            logger.info(f"Request: {request.method} {request.path}")

    def after_request(self, response):
        """Log outgoing response."""
        if current_app.debug:
            from flask import request
            logger = get_logger(__name__)
            logger.info(
                f"Response: {response.status_code} for {request.method} {request.path}"
            )
        return response
