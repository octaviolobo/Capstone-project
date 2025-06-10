from flask import Blueprint, request, jsonify
from app.models.models import db, Users, Service, Appointment

main = Blueprint('main', __name__,url_prefix='/api/v1')




@main.route('/')
def home():
    return 'test'

@main.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = Users(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        password_hash=data.get('password_hash'),
        phone_number=data.get('phone_number'),
        user_type='patient'
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'user created', 'user_id': user.user_id}), 201

@main.route('/users', methods=['GET'])
def get_user():
    users = Users.query.all()
    return jsonify([{
        'user_id': u.user_id,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'email': u.email,
        'phone_number': u.phone_number,
        'user_type': u.user_type


    }for u in users]), 200

@main.route('/users/<user_id>', methods=['GET'])
def get_userById(user_id):
    users = Users.query.get_or_404(user_id)
    return jsonify([{
        'user_id': users.user_id,
        'first_name': users.first_name,
        'last_name': users.last_name,
        'email': users.email,
        'phone_number': users.phone_number,
        'user_type': users.user_type
    }]), 200

@main.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get_or_404(user_id)
    data = request.json
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.user_type = data.get('user_type', user.user_type)
    db.session.commit()
    return jsonify({'message': 'user updated'}), 200

@main.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'user deleted'}), 200




