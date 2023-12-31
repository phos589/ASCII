const imageInput = document.getElementById('imageInput');
const uploadedImage = document.getElementById('uploadedImage');
const asciiArtElement = document.getElementById('asciiArt');
const downloadButton = document.getElementById('downloadButton');
const textColorPicker = document.getElementById('textColorPicker');

downloadButton.disabled = true;

imageInput.addEventListener('change', handleImageUpload);

textColorPicker.addEventListener('input', () => {
    const selectedColor = textColorPicker.value;
    asciiArtElement.style.color = selectedColor;
});


function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Adjust maxWidth as desired
                const maxWidth = 200;
                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                const imageData = ctx.getImageData(0, 0, newWidth, newHeight);

                // Generate and display ASCII art
                const asciiArt = generateAsciiArt(imageData, newWidth, newHeight);
                asciiArtElement.textContent = asciiArt;

                // Show the uploaded image
                uploadedImage.src = e.target.result;
                downloadButton.disabled = false;

            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    handleImageDrop(e.dataTransfer.files[0]);
});

// Handle dropped image
function handleImageDrop(imageFile) {
    if (imageFile && imageFile.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(imageFile);
        uploadedImage.src = imageUrl;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Adjust maxWidth as desired
                const maxWidth = 200;
                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                const imageData = ctx.getImageData(0, 0, newWidth, newHeight);

                // Generate ASCII art
                const asciiArt = generateAsciiArt(imageData, newWidth, newHeight);

                // Display ASCII art
                asciiArtElement.textContent = asciiArt;
                downloadButton.disabled = false;

            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    }
}

// Add download functionality
downloadButton.addEventListener('click', () => {
    const lines = asciiArtElement.textContent.split('\n');
    const lineHeight = 6;
    const charWidth = 6;
    const asciiWidth = lines.reduce((maxWidth, line) => Math.max(maxWidth, line.length), 0) * charWidth;
    const asciiHeight = lines.length * lineHeight;

    const borderSize = 10;
    const canvasAscii = document.createElement('canvas');
    const ctxAscii = canvasAscii.getContext('2d');
    canvasAscii.width = asciiWidth + 2 * borderSize;
    canvasAscii.height = asciiHeight + 2 * borderSize;

    // Fill the entire canvas with white color
    ctxAscii.fillStyle = 'white';
    ctxAscii.fillRect(0, 0, canvasAscii.width, canvasAscii.height);

    ctxAscii.font = '12px monospace';
    ctxAscii.fillStyle = textColorPicker.value; // Use the selected text color

    lines.forEach((line, lineIndex) => {
        ctxAscii.fillText(line, borderSize, borderSize + (lineIndex + 1) * lineHeight);
    });

    const dataURL = canvasAscii.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'ascii_image.png';

    // Programmatically trigger a click event on the link
    link.click();

    // Clean up
    setTimeout(() => URL.revokeObjectURL(dataURL), 1000);
});

function generateAsciiArt(imageData, width, height) {
    const asciiCharacters = ['@', '#', '$', '&', 'o', ':', '*', '.', ' ',]; // Adjust characters as desired
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

const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const zoomedContent = document.getElementById('asciiContainer');


let scale = 1;
    const minScale = 0.4;
    const maxScale = 1;

    zoomInButton.addEventListener('click', () => {
      if (scale < maxScale && (zoomedContent.clientWidth * (scale + 0.1)) <= zoomedContent.clientWidth * maxScale) {
        scale += 0.1;
        zoomedContent.style.transform = `scale(${scale})`;
      }
    });

    zoomOutButton.addEventListener('click', () => {
      if (scale > minScale) {
        scale -= 0.1;
        zoomedContent.style.transform = `scale(${scale})`;
      }
    });

zoomedContent.style.transformOrigin = 'top';
