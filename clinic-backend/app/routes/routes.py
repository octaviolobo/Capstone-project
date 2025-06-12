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
    user = Users.query.get_or_404(user_id)
    return jsonify({
        'user_id': user.user_id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'phone_number': user.phone_number,
        'user_type': user.user_type
    }), 200   

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

@main.route('/services', methods=['POST'])
def create_service():
    data = request.json
    service = Service(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        duration_minutes=data.get('duration_minutes')
    )
    db.session.add(service)
    db.session.commit()
    return jsonify({'message': 'service created', 'service_id': service.service_id}), 201

@main.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([{
        'service_id': s.service_id,
        'name': s.name,
        'description': s.description,
        'price': str(s.price),
        'duration_minutes': s.duration_minutes
    } for s in services]), 200

@main.route('/services/<service_id>', methods=['GET'])
def get_service_by_id(service_id):
    service = Service.query.get_or_404(service_id)
    return jsonify({
        'service_id': service.service_id,
        'name': service.name,
        'description': service.description,
        'price': str(service.price),
        'duration_minutes': service.duration_minutes
    }), 200

@main.route('/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    service = Service.query.get_or_404(service_id)
    data = request.json
    service.name = data.get('name', service.name)
    service.description = data.get('description', service.description)
    service.price = data.get('price', service.price)
    service.duration_minutes = data.get('duration_minutes', service.duration_minutes)
    db.session.commit()
    return jsonify({'message': 'service updated'}), 200

@main.route('/services/<service_id>', methods=['DELETE'])
def delete_service(service_id):
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'service deleted'}), 200

@main.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    appointment = Appointment(
        service_id=data.get('service_id'),
        appointment_time=data.get('appointment_time'),
        status=data.get('status', 'pending'),
        notes=data.get('notes'),
        doctor_id=data.get('doctor_id'),
        patient_id=data.get('patient_id')
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify({'message': 'appointment created', 'appointment_id': appointment.appointment_id}), 201

@main.route('/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([{
        'appointment_id': a.appointment_id,
        'service_id': a.service_id,
        'appointment_time': a.appointment_time.isoformat(),
        'status': a.status,
        'notes': a.notes,
        'doctor_id': a.doctor_id,
        'patient_id': a.patient_id
    } for a in appointments]), 200 

@main.route('/appointments/<appointment_id>', methods=['GET'])
def get_appointment_by_id(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    return jsonify({
        'appointment_id': appointment.appointment_id,
        'service_id': appointment.service_id,
        'appointment_time': appointment.appointment_time.isoformat(),
        'status': appointment.status,
        'notes': appointment.notes,
        'doctor_id': appointment.doctor_id,
        'patient_id': appointment.patient_id
    }), 200

@main.route('/appointments/<appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    data = request.json
    appointment.service_id = data.get('service_id', appointment.service_id)
    appointment.appointment_time = data.get('appointment_time', appointment.appointment_time)
    appointment.status = data.get('status', appointment.status)
    appointment.notes = data.get('notes', appointment.notes)
    appointment.doctor_id = data.get('doctor_id', appointment.doctor_id)
    appointment.patient_id = data.get('patient_id', appointment.patient_id)
    db.session.commit()
    return jsonify({'message': 'appointment updated'}), 200

@main.route('/appointments/<appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'appointment deleted'}), 200

