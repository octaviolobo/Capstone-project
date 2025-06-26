from flask import request, jsonify, Blueprint
from app.models.models import Users,db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, get_jwt_identity


auth = Blueprint('auth', __name__,url_prefix='/api/v1/auth')


@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400

    email = data['email']
    password = data['password']

    if Users.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = Users(
        email=email,
        password_hash=hashed_password,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone_number=data.get('phone_number', ''),
        user_type='patient'
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500 
    
@auth.route('/login', methods=['POST'])
def login():
    
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"message": "Email and password are required"}), 400

        email = data['email']
        password = data['password']

        user = Users.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"message": "Invalid credentials"}), 401

        access_token = create_access_token(identity=str(user.user_id))
        return jsonify({"access_token": access_token}), 200


@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():  
    jti = get_jwt()['jti']
    return jsonify({"message": "User logged out successfully"}), 200

@auth.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    user = Users.query.get(current_user)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user_info = {
        "user_id": user.user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone_number": user.phone_number,
        "user_type": user.user_type
    }
    return jsonify({"user": user_info}), 200