"""
File upload and processing routes
"""

import os
import tempfile

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from app.middleware.auth_middleware import require_auth
from app.services.file_processing_service import file_processing_service
from app.services.firebase_service import firebase_service
from app.utils.logger import get_logger
from app.utils.validation import validate_file_upload

logger = get_logger(__name__)

file_bp = Blueprint("file", __name__, url_prefix="/api/files")


@file_bp.route("/upload", methods=["POST"])
@require_auth
def upload_file():
    """
    Upload and process a trading data file.

    Expected form data:
    - file: The uploaded file
    - user_id: User ID (from auth token)

    Returns:
        JSON response with processing results
    """
    try:
        # Check if file is present
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"success": False, "error": "No file selected"}), 400

        # Get user ID from auth token
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Validate file
        filename = secure_filename(file.filename)
        file_extension = filename.lower().split(".")[-1]

        if file_extension not in ["csv", "xls", "xlsx"]:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Unsupported file format. Please upload CSV, XLS, or XLSX files.",
                    }
                ),
                400,
            )

        # Check file size (10MB limit)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning

        if file_size > 10 * 1024 * 1024:  # 10MB
            return (
                jsonify({"success": False, "error": "File size exceeds 10MB limit"}),
                400,
            )

        # Save file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=f".{file_extension}"
        ) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        try:
            # Process the file
            logger.info(f"Processing file {filename} for user {user_id}")
            result = file_processing_service.process_file(temp_file_path, user_id)

            if result["success"]:
                # Store processed data in Firestore
                store_processed_data(user_id, result)

                logger.info(
                    f"Successfully processed {len(result['trades'])} trades from {filename}"
                )
                return (
                    jsonify(
                        {
                            "success": True,
                            "message": f'Successfully processed {len(result["trades"])} trades',
                            "data": {
                                "trades_count": len(result["trades"]),
                                "metrics": result["metrics"],
                                "summary": result["summary"],
                                "file_info": result["file_info"],
                            },
                        }
                    ),
                    200,
                )
            else:
                logger.error(
                    f"File processing failed: {result.get('error', 'Unknown error')}"
                )
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": result.get("error", "File processing failed"),
                        }
                    ),
                    400,
                )

        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except OSError:
                logger.warning(f"Could not delete temporary file: {temp_file_path}")

    except Exception as e:
        logger.error(f"Error in file upload: {str(e)}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Internal server error during file processing",
                }
            ),
            500,
        )


@file_bp.route("/history", methods=["GET"])
@require_auth
def get_file_history():
    """
    Get file upload history for the user.

    Returns:
        JSON response with file history
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get file history from Firestore
        history = get_user_file_history(user_id)

        return jsonify({"success": True, "data": history}), 200

    except Exception as e:
        logger.error(f"Error getting file history: {str(e)}")
        return (
            jsonify({"success": False, "error": "Failed to retrieve file history"}),
            500,
        )


@file_bp.route("/<file_id>", methods=["DELETE"])
@require_auth
def delete_file(file_id):
    """
    Delete a processed file and its data.

    Args:
        file_id: ID of the file to delete

    Returns:
        JSON response with deletion status
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Delete file data from Firestore
        success = delete_user_file_data(user_id, file_id)

        if success:
            return (
                jsonify({"success": True, "message": "File deleted successfully"}),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "File not found or could not be deleted",
                    }
                ),
                404,
            )

    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        return jsonify({"success": False, "error": "Failed to delete file"}), 500


@file_bp.route("/<file_id>/trades", methods=["GET"])
@require_auth
def get_file_trades(file_id):
    """
    Get trades from a specific file.

    Args:
        file_id: ID of the file

    Returns:
        JSON response with trades data
    """
    try:
        user_id = request.user_id
        if not user_id:
            return (
                jsonify({"success": False, "error": "User authentication required"}),
                401,
            )

        # Get trades from Firestore
        trades = get_file_trades_data(user_id, file_id)

        return jsonify({"success": True, "data": trades}), 200

    except Exception as e:
        logger.error(f"Error getting file trades: {str(e)}")
        return jsonify({"success": False, "error": "Failed to retrieve trades"}), 500


def store_processed_data(user_id: str, result: dict):
    """Store processed file data in Firestore."""
    try:
        # Create file document
        file_doc = {
            "user_id": user_id,
            "filename": result["file_info"]["file_type"],
            "processed_at": result["file_info"]["processed_at"],
            "trades_count": len(result["trades"]),
            "metrics": result["metrics"],
            "summary": result["summary"],
        }

        # Store file metadata
        file_ref = firebase_service.db.collection("user_files").add(file_doc)
        file_id = file_ref[1].id

        # Store individual trades
        trades_collection = firebase_service.db.collection("trades")
        for trade in result["trades"]:
            trade["file_id"] = file_id
            trades_collection.add(trade)

        logger.info(f"Stored {len(result['trades'])} trades for file {file_id}")

    except Exception as e:
        logger.error(f"Error storing processed data: {str(e)}")
        raise


def get_user_file_history(user_id: str) -> list:
    """Get file upload history for a user."""
    try:
        files_ref = firebase_service.db.collection("user_files")
        query = files_ref.where("user_id", "==", user_id).order_by(
            "processed_at", direction="DESCENDING"
        )

        files = []
        for doc in query.stream():
            file_data = doc.to_dict()
            file_data["id"] = doc.id
            files.append(file_data)

        return files

    except Exception as e:
        logger.error(f"Error getting file history: {str(e)}")
        return []


def delete_user_file_data(user_id: str, file_id: str) -> bool:
    """Delete file data and associated trades."""
    try:
        # Delete trades associated with the file
        trades_ref = firebase_service.db.collection("trades")
        trades_query = trades_ref.where("file_id", "==", file_id).where(
            "user_id", "==", user_id
        )

        for doc in trades_query.stream():
            doc.reference.delete()

        # Delete file document
        file_ref = firebase_service.db.collection("user_files").document(file_id)
        file_doc = file_ref.get()

        if file_doc.exists and file_doc.to_dict()["user_id"] == user_id:
            file_ref.delete()
            return True

        return False

    except Exception as e:
        logger.error(f"Error deleting file data: {str(e)}")
        return False


def get_file_trades_data(user_id: str, file_id: str) -> list:
    """Get trades data for a specific file."""
    try:
        trades_ref = firebase_service.db.collection("trades")
        query = trades_ref.where("file_id", "==", file_id).where(
            "user_id", "==", user_id
        )

        trades = []
        for doc in query.stream():
            trade_data = doc.to_dict()
            trade_data["id"] = doc.id
            trades.append(trade_data)

        return trades

    except Exception as e:
        logger.error(f"Error getting file trades: {str(e)}")
        return []
