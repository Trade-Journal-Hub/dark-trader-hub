"""
Analytics routes for trading data analysis
"""

from flask import Blueprint, jsonify, request

from app.middleware.enhanced_auth_middleware import medium_security, high_security
from app.services.analytics_service import analytics_service
from app.utils.logger import get_logger
from app.utils.validation import validate_analytics_request

logger = get_logger(__name__)

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.route("/overview", methods=["GET"])
@medium_security  # Standard analytics viewing
def get_overview():
    """
    Get trading overview analytics.

    Query parameters:
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)
    - symbols: Comma-separated list of symbols to filter

    Returns:
        JSON response with overview analytics
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        symbols = (
            request.args.get("symbols", "").split(",")
            if request.args.get("symbols")
            else []
        )

        # Validate request
        request_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "symbols": [s.strip() for s in symbols if s.strip()],
        }

        validate_analytics_request(request_data)

        # Get analytics data
        analytics_data = analytics_service.get_overview_analytics(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            symbols=request_data["symbols"],
        )

        return jsonify({"success": True, "data": analytics_data}), 200

    except Exception as e:
        logger.error(f"Error getting overview analytics: {str(e)}")
        return (
            jsonify(
                {"success": False, "error": "Failed to retrieve overview analytics"}
            ),
            500,
        )


@analytics_bp.route("/performance", methods=["GET"])
@medium_security  # Standard analytics viewing
def get_performance():
    """
    Get detailed performance analytics.

    Query parameters:
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)
    - symbols: Comma-separated list of symbols to filter
    - period: Analysis period (daily, weekly, monthly)

    Returns:
        JSON response with performance analytics
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        symbols = (
            request.args.get("symbols", "").split(",")
            if request.args.get("symbols")
            else []
        )
        period = request.args.get("period", "daily")

        # Validate request
        request_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "symbols": [s.strip() for s in symbols if s.strip()],
        }

        validate_analytics_request(request_data)

        # Get performance analytics
        performance_data = analytics_service.get_performance_analytics(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            symbols=request_data["symbols"],
            period=period,
        )

        return jsonify({"success": True, "data": performance_data}), 200

    except Exception as e:
        logger.error(f"Error getting performance analytics: {str(e)}")
        return (
            jsonify(
                {"success": False, "error": "Failed to retrieve performance analytics"}
            ),
            500,
        )


@analytics_bp.route("/risk", methods=["GET"])
@medium_security  # Standard analytics viewing
def get_risk_analysis():
    """
    Get risk analysis metrics.

    Query parameters:
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)
    - symbols: Comma-separated list of symbols to filter

    Returns:
        JSON response with risk analysis
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        symbols = (
            request.args.get("symbols", "").split(",")
            if request.args.get("symbols")
            else []
        )

        # Validate request
        request_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "symbols": [s.strip() for s in symbols if s.strip()],
        }

        validate_analytics_request(request_data)

        # Get risk analysis
        risk_data = analytics_service.get_risk_analysis(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            symbols=request_data["symbols"],
        )

        return jsonify({"success": True, "data": risk_data}), 200

    except Exception as e:
        logger.error(f"Error getting risk analysis: {str(e)}")
        return (
            jsonify({"success": False, "error": "Failed to retrieve risk analysis"}),
            500,
        )


@analytics_bp.route("/symbols", methods=["GET"])
@medium_security  # Standard analytics viewing
def get_symbol_analytics():
    """
    Get analytics for specific symbols.

    Query parameters:
    - symbols: Comma-separated list of symbols (required)
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)

    Returns:
        JSON response with symbol-specific analytics
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        symbols = request.args.get("symbols", "").split(",")
        if not symbols or not any(s.strip() for s in symbols):
            return (
                jsonify({"success": False, "error": "At least one symbol is required"}),
                400,
            )

        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        # Validate request
        request_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "symbols": [s.strip() for s in symbols if s.strip()],
        }

        validate_analytics_request(request_data)

        # Get symbol analytics
        symbol_data = analytics_service.get_symbol_analytics(
            user_id=user_id,
            symbols=request_data["symbols"],
            start_date=start_date,
            end_date=end_date,
        )

        return jsonify({"success": True, "data": symbol_data}), 200

    except Exception as e:
        logger.error(f"Error getting symbol analytics: {str(e)}")
        return (
            jsonify({"success": False, "error": "Failed to retrieve symbol analytics"}),
            500,
        )


@analytics_bp.route("/dashboard", methods=["GET"])
@medium_security  # Standard analytics viewing
def get_dashboard_data():
    """
    Get comprehensive dashboard analytics data.

    Query parameters:
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)
    - symbols: Comma-separated list of symbols to filter

    Returns:
        JSON response with complete dashboard data
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        symbols = (
            request.args.get("symbols", "").split(",")
            if request.args.get("symbols")
            else []
        )

        # Validate request
        request_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "symbols": [s.strip() for s in symbols if s.strip()],
        }

        validate_analytics_request(request_data)

        # Get dashboard data
        dashboard_data = analytics_service.get_dashboard_data(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            symbols=request_data["symbols"],
        )

        return jsonify({"success": True, "data": dashboard_data}), 200

    except Exception as e:
        logger.error(f"Error getting dashboard data: {str(e)}")
        return (
            jsonify({"success": False, "error": "Failed to retrieve dashboard data"}),
            500,
        )


@analytics_bp.route("/advanced", methods=["GET"])
@high_security  # Advanced analytics requires App Check
def get_advanced_analytics():
    """
    Get advanced analytics with sophisticated metrics.

    Query parameters:
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)
    - symbols: Comma-separated list of symbols to filter

    Returns:
        JSON response with advanced analytics
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        symbols = (
            request.args.get("symbols", "").split(",")
            if request.args.get("symbols")
            else []
        )

        # Validate request
        request_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "symbols": [s.strip() for s in symbols if s.strip()],
        }

        validate_analytics_request(request_data)

        # Get advanced analytics
        advanced_data = analytics_service.get_advanced_analytics(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            symbols=request_data["symbols"],
        )

        return jsonify({"success": True, "data": advanced_data}), 200

    except Exception as e:
        logger.error(f"Error getting advanced analytics: {str(e)}")
        return (
            jsonify(
                {"success": False, "error": "Failed to retrieve advanced analytics"}
            ),
            500,
        )


@analytics_bp.route("/export", methods=["GET"])
@high_security  # Data export requires highest security
def export_analytics():
    """
    Export analytics data in various formats.

    Query parameters:
    - format: Export format (csv, json, xlsx)
    - start_date: Start date for analysis (ISO format)
    - end_date: End date for analysis (ISO format)
    - symbols: Comma-separated list of symbols to filter
    - analytics_type: Type of analytics to export (overview, performance, risk)

    Returns:
        File download or JSON response
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get query parameters
        export_format = request.args.get("format", "json").lower()
        analytics_type = request.args.get("analytics_type", "overview")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        symbols = (
            request.args.get("symbols", "").split(",")
            if request.args.get("symbols")
            else []
        )

        # Validate export format
        if export_format not in ["csv", "json", "xlsx"]:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Invalid export format. Supported formats: csv, json, xlsx",
                    }
                ),
                400,
            )

        # Validate analytics type
        if analytics_type not in ["overview", "performance", "risk", "symbols"]:
            return jsonify({"success": False, "error": "Invalid analytics type"}), 400

        # Get analytics data
        if analytics_type == "overview":
            data = analytics_service.get_overview_analytics(
                user_id=user_id,
                start_date=start_date,
                end_date=end_date,
                symbols=[s.strip() for s in symbols if s.strip()],
            )
        elif analytics_type == "performance":
            data = analytics_service.get_performance_analytics(
                user_id=user_id,
                start_date=start_date,
                end_date=end_date,
                symbols=[s.strip() for s in symbols if s.strip()],
            )
        elif analytics_type == "risk":
            data = analytics_service.get_risk_analysis(
                user_id=user_id,
                start_date=start_date,
                end_date=end_date,
                symbols=[s.strip() for s in symbols if s.strip()],
            )
        else:  # symbols
            data = analytics_service.get_symbol_analytics(
                user_id=user_id,
                symbols=[s.strip() for s in symbols if s.strip()],
                start_date=start_date,
                end_date=end_date,
            )

        # Export data
        export_result = analytics_service.export_analytics(
            data=data, format=export_format, analytics_type=analytics_type
        )

        if export_format == "json":
            return jsonify({"success": True, "data": export_result}), 200
        else:
            # For CSV and XLSX, return file download
            return export_result, 200

    except Exception as e:
        logger.error(f"Error exporting analytics: {str(e)}")
        return (
            jsonify({"success": False, "error": "Failed to export analytics data"}),
            500,
        )
