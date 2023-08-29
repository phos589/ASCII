const imageInput = document.getElementById('imageInput');
const asciiArtElement = document.getElementById('asciiArt');

imageInput.addEventListener('change', handleImageUpload);


function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxWidth = 100; // Maximum width for ASCII art
        const aspectRatio = img.width / img.height;
        const newWidth = Math.min(maxWidth, img.width);
        const newHeight = newWidth / aspectRatio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
        const ascii = generateAsciiArt(imageData, newWidth, newHeight);
        asciiArtElement.textContent = ascii;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

imageInput.addEventListener('change', function(event) {
  const selectedImage = event.target.files[0];
  
  if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      uploadedImage.src = imageUrl;
  } else {
      uploadedImage.src = '';
  }
});

function generateAsciiArt(imageData, width, height) {
  const asciiCharacters = ['@', '#', '$', '&', 'o', ':', '*', '.', ' ','/']; // Adjust characters as desired
  let asciiArt = '';

  for (let y = 0; y < height - 1; y++) { // Exclude the last line
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const r = imageData.data[pixelIndex];
      const g = imageData.data[pixelIndex + 1];
      const b = imageData.data[pixelIndex + 2];
      const grayValue = (r + g + b) / 3;
      const asciiIndex = Math.floor((grayValue / 255) * (asciiCharacters.length - 1));
      asciiArt += asciiCharacters[asciiIndex];
    }
    asciiArt += '\n';
  }
  return asciiArt;
}
