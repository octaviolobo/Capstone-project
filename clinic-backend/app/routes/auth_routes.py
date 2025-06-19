from flask import request, jsonify, Blueprint
from app.models.models import Users  
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, get_jwt_identity


auth = Blueprint('auth', __name__,url_prefix='/api/v1/auth')


@auth.route('/register', methods=['POST']) #TODO
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required"}), 400

    username = data['username']
    password = data['password']

    if Users.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password, method='sha256')
    new_user = Users(username=username, password=hashed_password)
    
    try:
        new_user.save()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500 
    
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required"}), 400

    username = data['username']
    password = data['password']

    user = Users.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200 

@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    # Add the JWT ID to the blacklist
    return jsonify({"message": "User logged out successfully"}), 200