from fastapi import FastAPI,File,UploadFile
import tensorflow as tf
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image

app =FastAPI()
MODEL = tf.keras.models.load_model("../saved_models/1.0.keras")
CLASS_NAMES=['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']

@app.get("/ping")

async def ping():
    return "Hello I am Alive"
    


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file:UploadFile=File(...)
):
   image = read_file_as_image(await file.read())
   img_batch = np.expand_dims(image, 0)
   predictions = MODEL.predict(img_batch)
   predicted_class= CLASS_NAMES[np.argmax(predictions[0])]
   confidence= np.max(predictions[0])
   return {
        'class': predicted_class,
        'confidence': float(confidence)
    }
   pass


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)  # port should be an integer