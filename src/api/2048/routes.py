from flask import Blueprint, jsonify

# Create a blueprint for the 2048 API
api_2048_bp = Blueprint('api_2048', __name__)

@api_2048_bp.route('/2048', methods=['GET'])
def get_game_message():
    return jsonify({"message": "2048 Game Placeholder"})
