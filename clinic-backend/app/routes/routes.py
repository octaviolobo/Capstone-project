from flask import Blueprint, request, jsonify
from app.models.models import db, Users, Service, Appointment, Specialty, DoctorSpecialty, Availability, GuestAppointment
from app.routes.utils import admin_required
from flask_mail import Message
from app import mail

main = Blueprint('main', __name__,url_prefix='/api/v1')




@main.route('/users', methods=['POST'])
@admin_required
def create_user():
    data = request.json
    user = Users(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        password_hash=data.get('password_hash'),
        phone_number=data.get('phone_number'),
        user_type='patient',  # Default user 
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
    prev_status = appointment.status
    appointment.status = data.get('status', appointment.status)
    db.session.commit()

    # Send confirmation email if status changed to confirmed
    if prev_status != 'confirmed' and appointment.status == 'confirmed':
        user = Users.query.get(appointment.patient_id)
        if user:
            msg = Message(
                subject="Confirmação de Consulta",
                recipients=[user.email],
                body=f"Olá {user.first_name}, sua consulta foi confirmada para {appointment.appointment_time.strftime('%d/%m/%Y as %H:%M')}."
            )
            mail.send(msg)

    return jsonify({'message': 'appointment updated'}), 200

@main.route('/appointments/<appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'appointment deleted'}), 200

@main.route('/guest_appointments', methods=['POST'])
def create_guest_appointment():
    data = request.json
    appointment = GuestAppointment(
        service_id=data.get('service_id'),
        appointment_time=data.get('appointment_time'),
        status=data.get('status', 'pending'),
        notes=data.get('notes'),
        doctor_id=data.get('doctor_id'),
        patient_id=data.get('patient_id')
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify({'message': 'guest appointment created', 'appointment_id': appointment.appointment_id}), 201

@main.route('/guest_appointments', methods=['GET'])
def get_guest_appointments():
    appointments = GuestAppointment.query.all()
    return jsonify([{
        'appointment_id': a.appointment_id,
        'service_id': a.service_id,
        'appointment_time': a.appointment_time.isoformat(),
        'status': a.status,
        'notes': a.notes,
        'doctor_id': a.doctor_id,
        'patient_id': a.patient_id
    } for a in appointments]), 200

@main.route('/guest_appointments/<appointment_id>', methods=['GET'])
def get_guest_appointment_by_id(appointment_id):
    appointment = GuestAppointment.query.get_or_404(appointment_id)
    return jsonify({
        'appointment_id': appointment.appointment_id,
        'service_id': appointment.service_id,
        'appointment_time': appointment.appointment_time.isoformat(),
        'status': appointment.status,
        'notes': appointment.notes,
        'doctor_id': appointment.doctor_id,
        'patient_id': appointment.patient_id
    }), 200

@main.route('/guest_appointments/<appointment_id>', methods=['PUT'])
def update_guest_appointment(appointment_id):
    appointment = GuestAppointment.query.get_or_404(appointment_id)
    data = request.json
    appointment.service_id = data.get('service_id', appointment.service_id)
    appointment.appointment_time = data.get('appointment_time', appointment.appointment_time)
    appointment.status = data.get('status', appointment.status)
    appointment.notes = data.get('notes', appointment.notes)
    appointment.doctor_id = data.get('doctor_id', appointment.doctor_id)
    appointment.patient_id = data.get('patient_id', appointment.patient_id)
    db.session.commit()
    return jsonify({'message': 'guest appointment updated'}), 200

@main.route('/guest_appointments/<appointment_id>', methods=['DELETE'])
def delete_guest_appointment(appointment_id):
    appointment = GuestAppointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'guest appointment deleted'}), 200

@main.route('/specialties', methods=['POST'])
def create_specialty():
    data = request.json
    specialty = Specialty(
        name=data.get('name'),
        description=data.get('description')
    )
    db.session.add(specialty)
    db.session.commit()
    return jsonify({'message': 'specialty created', 'specialty_id': specialty.specialty_id}), 201

@main.route('/specialties', methods=['GET'])
def get_specialties():
    specialties = Specialty.query.all()
    return jsonify([{
        'specialty_id': s.specialty_id,
        'name': s.name,
        'description': s.description
    } for s in specialties]), 200

@main.route('/specialties/<specialty_id>', methods=['GET'])
def get_specialty_by_id(specialty_id):
    specialty = Specialty.query.get_or_404(specialty_id)
    return jsonify({
        'specialty_id': specialty.specialty_id,
        'name': specialty.name,
        'description': specialty.description
    }), 200

@main.route('/specialties/<specialty_id>', methods=['PUT'])
def update_specialty(specialty_id):
    specialty = Specialty.query.get_or_404(specialty_id)
    data = request.json
    specialty.name = data.get('name', specialty.name)
    specialty.description = data.get('description', specialty.description)
    db.session.commit()
    return jsonify({'message': 'specialty updated'}), 200

@main.route('/specialties/<specialty_id>', methods=['DELETE'])
def delete_specialty(specialty_id):
    specialty = Specialty.query.get_or_404(specialty_id)
    db.session.delete(specialty)
    db.session.commit()
    return jsonify({'message': 'specialty deleted'}), 200

@main.route('/doctors/<doctor_id>/specialties', methods=['POST'])
def add_doctor_specialty(doctor_id):
    data = request.json
    specialty_id = data.get('specialty_id')
    if not specialty_id:
        return jsonify({'error': 'specialty_id is required'}), 400
    # duplicates check
    exists = DoctorSpecialty.query.filter_by(doctor_id=doctor_id, specialty_id=specialty_id).first()
    if exists:
        return jsonify({'error': 'Doctor already has this specialty'}), 400
    doctor_specialty = DoctorSpecialty(doctor_id=doctor_id, specialty_id=specialty_id)
    db.session.add(doctor_specialty)
    db.session.commit()
    return jsonify({'message': 'specialty added to doctor'}), 201

@main.route('/doctors/<doctor_id>/specialties', methods=['GET'])
def get_doctor_specialties(doctor_id):
    specialties = (
        db.session.query(Specialty)
        .join(DoctorSpecialty, Specialty.specialty_id == DoctorSpecialty.specialty_id)
        .filter(DoctorSpecialty.doctor_id == doctor_id)
        .all()
    )
    return jsonify([
        {
            'specialty_id': s.specialty_id,
            'name': s.name,
            'description': s.description
        } for s in specialties
    ]), 200

@main.route('/doctors/<doctor_id>/specialties/<sid>', methods=['DELETE'])
def delete_doctor_specialty(doctor_id, sid):
    doctor_specialty = DoctorSpecialty.query.filter_by(doctor_id=doctor_id, specialty_id=sid).first_or_404()
    db.session.delete(doctor_specialty)
    db.session.commit()
    return jsonify({'message': 'specialty removed from doctor'}), 200

@main.route('/availabilities', methods=['POST'])
def create_availability():
    data = request.json
    availability = Availability(
        doctor_id=data.get('doctor_id'),
        start_time=data.get('start_time'),
        end_time=data.get('end_time')
    )
    db.session.add(availability)
    db.session.commit()
    return jsonify({'message': 'availability created', 'availability_id': availability.availability_id}), 201

@main.route('/availabilities', methods=['GET'])
def get_availabilities():
    availabilities = Availability.query.all()
    return jsonify([{
        'availability_id': a.availability_id,
        'doctor_id': a.doctor_id,
        'start_time': a.start_time,
        'end_time': a.end_time
    } for a in availabilities]), 200

@main.route('/availabilities/<availability_id>', methods=['GET'])
def get_availability_by_id(availability_id):
    availability = Availability.query.get_or_404(availability_id)
    return jsonify({
        'availability_id': availability.availability_id,
        'doctor_id': availability.doctor_id,
        'start_time': availability.start_time,
        'end_time': availability.end_time
    }), 200

@main.route('/availabilities/<availability_id>', methods=['PUT'])
def update_availability(availability_id):
    availability = Availability.query.get_or_404(availability_id)
    data = request.json
    availability.doctor_id = data.get('doctor_id', availability.doctor_id)
    availability.start_time = data.get('start_time', availability.start_time)
    availability.end_time = data.get('end_time', availability.end_time)
    db.session.commit()
    return jsonify({'message': 'availability updated'}), 200

@main.route('/availabilities/<availability_id>', methods=['DELETE'])
def delete_availability(availability_id):
    availability = Availability.query.get_or_404(availability_id)
    db.session.delete(availability)
    db.session.commit()
    return jsonify({'message': 'availability deleted'}), 200
