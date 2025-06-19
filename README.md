# 🏥 Appointment Scheduler for Clinics

## 📖 Problem Statement

Many smaller clinics still rely on manual appointment booking, which can be frustrating and time-consuming for both staff and patients. Long phone calls, scheduling errors, and a lack of real-time availability often result in a poor experience. There is a clear need for a modern, user-friendly, and efficient online appointment system that simplifies scheduling for all parties involved.

## 🌐 Overview

**[App Name TBD]** is a custom appointment booking web application, initially developed for a family clinic as a pilot project, with potential to evolve into a full-scale product. The app allows patients to:

- Schedule, cancel, or reschedule appointments with clinic doctors
- Select services such as flu shots or general consultations
- View real-time doctor availability
- Receive confirmations via SMS or email

Clinic staff can manage schedules, view patient information, and access booking history through an intuitive admin dashboard.

---

## ⚙️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- FullCalendar.js

### Backend
- Flask
- Flask-RESTful
- Flask-JWT-Extended
- Flask-Mail
- Flask-CORS
- SQLAlchemy

### Database
- PostgreSQL or MongoDB (to be determined)

### Other Tools
- Twilio (for SMS notifications)

---

## 🔑 Features

### Core Features
- Patient login and registration
- Schedule, reschedule, and cancel appointments
- Email and SMS appointment notifications
- Admin dashboard for clinic staff

### Planned Features (Future Releases)
- Filter services by doctor
- Patient visit history
- Personalized service recommendations based on age and gender

---

## 👤 User Stories

- As a **patient**, I want to schedule an appointment with a gynecologist so that I can have my exams checked by a doctor.
- As a **returning patient**, I want to view past visits so I can reference my medical history.
- As a **doctor**, I want to review upcoming appointments so I can prepare ahead.
- As a **clinic receptionist**, I want to update doctor availability so that patients can only book valid time slots.

---

## ✅ Project Status

- [x] Project proposal completed
- [ ] Frontend layout and basic routing
- [ ] REST API endpoints
- [ ] Appointment scheduling system
- [ ] Admin dashboard
- [ ] Notification system

---

## 🧩 System Responsibilities

### 🖥️ Frontend (React + Axios + Tailwind CSS + FullCalendar.js)
- Render real-time doctor availability using FullCalendar
- Appointment booking form with validation
- Login and registration forms
- Patient dashboard (upcoming & past appointments)
- Admin panel for:
  - User and doctor management
  - Schedule and availability control

### 🔧 Backend (Flask + Extensions)
- Secure user authentication with JWT (Flask-JWT-Extended)
- Input validation to prevent scheduling conflicts or duplicate bookings
- CRUD operations for:
  - Users
  - Appointments
  - Availability slots
- Email and SMS notifications (Flask-Mail + Twilio)
- Serve and consume JSON through RESTful API endpoints

### 🗃️ Database (PostgreSQL)
- Persistent storage of:
  - Users
  - Appointments
  - Services
  - Availability
- Enforce data integrity with foreign key relationships
- Support both **registered** and **guest** appointments

---

## 🔌 API Endpoints Overview

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/auth/login` | Log in a user |
| POST   | `/api/v1/auth/logout` | Log out a user |
| GET    | `/api/v1/auth/me` | Get current authenticated user |

### 👤 Users
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/users` |
| GET    | `/api/v1/users` |
| GET    | `/api/v1/users/:id` |
| PUT    | `/api/v1/users/:id` |
| DELETE | `/api/v1/users/:id` |
| GET    | `/api/v1/users/:id/appointments` |

### 📅 Appointments
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/appointments` |
| GET    | `/api/v1/appointments` |
| GET    | `/api/v1/appointments/:id` |
| PUT    | `/api/v1/appointments/:id` |
| DELETE | `/api/v1/appointments/:id` |
| GET    | `/api/v1/doctors/:id/appointments` |

### 🧾 Guest Appointments
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/guest-appointments` |
| GET    | `/api/v1/guest-appointments` |
| GET    | `/api/v1/guest-appointments/:id` |
| PUT    | `/api/v1/guest-appointments/:id` |
| DELETE | `/api/v1/guest-appointments/:id` |

### ⏰ Availability
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/availability` |
| GET    | `/api/v1/availability` |
| GET    | `/api/v1/availability/:id` |
| GET    | `/api/v1/doctors/:id/availability` |
| PUT    | `/api/v1/availability/:id` |
| DELETE | `/api/v1/availability/:id` |

### 💼 Services
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/services` |
| GET    | `/api/v1/services` |
| GET    | `/api/v1/services/:id` |
| PUT    | `/api/v1/services/:id` |
| DELETE | `/api/v1/services/:id` |

### 🩺 Specialties
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/specialties` |
| GET    | `/api/v1/specialties` |
| GET    | `/api/v1/specialties/:id` |
| PUT    | `/api/v1/specialties/:id` |
| DELETE | `/api/v1/specialties/:id` |

### 🧠 Doctor Specialties
| Method | Endpoint |
|--------|----------|
| POST   | `/api/v1/doctors/:id/specialties` |
| GET    | `/api/v1/doctors/:id/specialties` |
| DELETE | `/api/v1/doctors/:id/specialties/:sid` |

---

## 🛡️ API Design Notes

- All request and response formats use **JSON**.
- **JWT (JSON Web Tokens)** via `Flask-JWT-Extended` will be used for secure authorization.
- Proper HTTP status codes and error messages will be returned for each endpoint.

## 📊 Project Progress

### ✅ Backend - Completed

The backend for the Clinic Appointment Scheduler is **fully implemented and functional**. All core features are in place:

#### 🔐 Authentication
- `POST /auth/login`: User login with JWT issuance
- `GET /auth/me`: Returns the authenticated user's info

#### 👥 User Management
- Full CRUD operations:
  - `POST /users`
  - `GET /users`
  - `GET /users/:id`
  - `PUT /users/:id`
  - `DELETE /users/:id`
- Role-based access control (admin, doctor, patient)

#### 📅 Appointments
- Users can:
  - Book new appointments
  - View upcoming appointments
  - Update or cancel them
- Doctors can see their schedule
- Admins have access to all appointments

#### 🏥 Clinic Data
- Services and Specialties endpoints implemented
- Availability system tied to doctor scheduling

#### 🗃️ Database
- Built using PostgreSQL
- Tables include: `Users`, `Appointments`, `Services`, `Specialties`, `Doctor_Specialties`, `Availability`, `Guest_Appointments`

#### ✅ Testing & Configuration
- Backend tested with realistic data
- JWT authentication fully secured
- Flask environment configured with `.env` file
