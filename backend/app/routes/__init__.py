"""
API routes blueprint
"""

from flask import Blueprint

api_bp = Blueprint("api", __name__)

# Import route modules
from . import analytics_routes, auth_routes, file_routes, user_routes
