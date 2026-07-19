import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    # Path to the actual model file.
    MODEL_PATH = os.path.join(BASE_DIR, "models", "saved_model.keras")
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
