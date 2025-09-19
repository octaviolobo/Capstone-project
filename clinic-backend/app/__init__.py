from flask import Flask
from app.models.models import db 
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail

mail = Mail()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')
    
    db_uri = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    mail.init_app(app)

    jwt = JWTManager(app)

    from app.routes.routes import main
    app.register_blueprint(main)

    from app.routes.auth_routes import auth
    app.register_blueprint(auth)

    try:
        with app.app_context():
            with db.engine.connect() as connection:
                result = connection.execute(db.text("SELECT 1"))
                print("Database connection successful! Result:", result.scalar())
    except Exception as e:
        print(f"Database connection failed: {e}")
    
    return app