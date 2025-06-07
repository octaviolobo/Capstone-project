from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


db_uri = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

try:
    with app.app_context():
        with db.engine.connect() as connection:
            result = connection.execute(db.text("SELECT 1"))
            print("Database connection successful! Result:", result.scalar())
except Exception as e:
    print(f"Database connection failed: {e}")

@app.route("/")
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)