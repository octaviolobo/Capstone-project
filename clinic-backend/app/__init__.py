from flask import Flask
from app.models.models import db 
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager




def create_app():
    load_dotenv()

    app = Flask(__name__)

    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    db_uri = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

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