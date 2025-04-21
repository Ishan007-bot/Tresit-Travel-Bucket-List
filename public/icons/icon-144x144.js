// This is a Node.js script to generate a placeholder 144x144 icon
// You can run this script with Node.js to generate the icon

const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas
const size = 144;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Background gradient - we'll use a solid color as a fallback
ctx.fillStyle = '#4a80f5';
ctx.fillRect(0, 0, size, size);

// Draw text
ctx.fillStyle = 'white';
ctx.font = `bold ${size * 0.5}px Arial`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('T', size / 2, size / 2);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('icon-144x144.png', buffer);

console.log('Icon created: icon-144x144.png'); 