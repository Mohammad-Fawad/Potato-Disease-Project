document.getElementById("predictButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const uploadedImage = document.getElementById("uploadedImage");
  const predictionLabel = document
    .getElementById("predictionLabel")
    .querySelector("span");
  const predictionConfidence = document
    .getElementById("predictionConfidence")
    .querySelector("span");

  // Check if a file is uploaded
  if (fileInput.files.length === 0) {
    alert("Please upload an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    // Send the image to the backend API for prediction
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    // Handle non-OK responses from the API
    if (!response.ok) throw new Error("Prediction failed.");

    const data = await response.json();

    // Display the prediction results
    predictionLabel.textContent = `Label: ${data.class}`;
    predictionConfidence.textContent = `Confidence: ${(
      data.confidence * 100
    ).toFixed(2)}%`;
  } catch (error) {
    alert(error.message);
  }
});

// Image preview in the dropzone and clear fields before new prediction
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const predictionLabel = document
  .getElementById("predictionLabel")
  .querySelector("span");
const predictionConfidence = document
  .getElementById("predictionConfidence")
  .querySelector("span");

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];

  // Clear previous prediction and image preview when new file is uploaded
  predictionLabel.textContent = "";
  predictionConfidence.textContent = "";
  imagePreview.style.display = "none";
  imagePreview.src = ""; // Clear the previous image preview

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      imagePreview.src = event.target.result;
      imagePreview.style.display = "block"; // Show the new preview image
    };
    reader.readAsDataURL(file);
  }
});
