from flask import Flask
from app.models.models import db 
import os
from dotenv import load_dotenv


def create_app():
    load_dotenv()

    app = Flask(__name__)


    db_uri = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    

    from app.routes.routes import main
    app.register_blueprint(main)
    try:
        with app.app_context():
            with db.engine.connect() as connection:
                result = connection.execute(db.text("SELECT 1"))
                print("Database connection successful! Result:", result.scalar())
    except Exception as e:
        print(f"Database connection failed: {e}")
    
    return app