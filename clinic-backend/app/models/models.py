from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import relationship


db = SQLAlchemy()

user_type_enum = Enum('patient', 'doctor', 'admin', name='user_type_enum')
appointment_status_enum = Enum('pending', 'confirmed', 'cancelled', 'done', name='appointment_status_enum')


class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash= db.Column(db.Text, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    user_type = db.Column(user_type_enum, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    patient_appointments = relationship('Appointment', foreign_keys='Appointment.patient_id', back_populates='patient')
    doctor_appointments = relationship('Appointment', foreign_keys='Appointment.doctor_id', back_populates='doctor')
    availabilities = relationship('Availability', back_populates='doctor')
    doctor_specialties = relationship('DoctorSpecialty', back_populates='doctor')



class Service(db.Model):
    __tablename__ = 'services'

    service_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2))
    duration_minutes = db.Column(db.Integer)

    appointments = relationship('Appointment', back_populates='service')
    guest_appointments = relationship('GuestAppointment', back_populates='service')


class Specialty(db.Model):
    __tablename__ = 'specialties'

    specialty_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    doctor_specialties = relationship('DoctorSpecialty', back_populates='specialty')


class Appointment(db.Model):
    __tablename__ = 'appointments'

    appointment_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    doctor_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    service_id = db.Column(db.Integer, ForeignKey('services.service_id'), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(appointment_status_enum, default='pending')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    patient = relationship('Users', foreign_keys=[patient_id], back_populates='patient_appointments')
    doctor = relationship('Users', foreign_keys=[doctor_id], back_populates='doctor_appointments')
    service = relationship('Service', back_populates='appointments')


class Availability(db.Model):
    __tablename__ = 'availability'

    availability_id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    is_recurring = db.Column(db.Boolean, default=False)
    recurrence_pattern = db.Column(db.String(50))  #    "weekly", "daily"

    doctor = relationship('Users', back_populates='availabilities')


class GuestAppointment(db.Model):
    __tablename__ = 'guest_appointments'

    guest_appointment_id = db.Column(db.Integer, primary_key=True)
    guest_name = db.Column(db.String(100), nullable=False)
    guest_email = db.Column(db.String(120), nullable=False)
    guest_phone = db.Column(db.String(20))
    service_id = db.Column(db.Integer, ForeignKey('services.service_id'), nullable=False)
    doctor_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(appointment_status_enum, default='pending')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    service = relationship('Service', back_populates='guest_appointments')
    doctor = relationship('Users')


class DoctorSpecialty(db.Model):   
    __tablename__ = 'doctor_specialties'

    doctor_id = db.Column(db.Integer, ForeignKey('users.user_id'), primary_key=True)
    specialty_id = db.Column(db.Integer, ForeignKey('specialties.specialty_id'), primary_key=True)

    doctor = relationship('Users', back_populates='doctor_specialties')
    specialty = relationship('Specialty', back_populates='doctor_specialties')