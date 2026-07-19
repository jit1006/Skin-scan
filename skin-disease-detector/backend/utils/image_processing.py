import numpy as np
from PIL import Image
import io

def preprocess_image(file_storage, target_size=(299, 299)):
    """
    Reads an uploaded file image, resizes it, converts to array, and normalizes it.
    """
    try:
        # Read image
        image = Image.open(io.BytesIO(file_storage.read()))
        
        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Resize
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize to [0, 1]
        img_array = np.array(image) / 255.0
        
        # Expand dims to create batch shape (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")
