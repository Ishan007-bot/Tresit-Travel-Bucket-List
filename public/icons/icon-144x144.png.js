// This file creates a Data URI for a 144x144 PNG icon
// You can copy the data URI and save it as a .png file directly

// Canvas and context
const canvas = document.createElement('canvas');
canvas.width = 144;
canvas.height = 144;
const ctx = canvas.getContext('2d');

// Fill with gradient background
const gradient = ctx.createLinearGradient(0, 0, 144, 144);
gradient.addColorStop(0, '#4a80f5');
gradient.addColorStop(1, '#3a6ad4');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 144, 144);

// Draw "T" text
ctx.fillStyle = 'white';
ctx.font = 'bold 72px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('T', 72, 72);

// Draw a small plane icon
ctx.beginPath();
const planeSize = 144 * 0.2;
const planeX = 144 * 0.7;
const planeY = 144 * 0.3;
ctx.moveTo(planeX, planeY);
ctx.lineTo(planeX - planeSize, planeY + planeSize * 0.5);
ctx.lineTo(planeX, planeY + planeSize);
ctx.closePath();
ctx.fillStyle = 'white';
ctx.fill();

// Get data URL
const dataUrl = canvas.toDataURL('image/png');
console.log('Data URL for icon-144x144.png:');
console.log(dataUrl);

/*
Copy the data URL output from the console and use a data URL to PNG converter tool online,
or paste it directly in your browser address bar (remove the 'console.log') and save the image.

Once you have the PNG file, place it at:
tresit/public/icons/icon-144x144.png
*/ 