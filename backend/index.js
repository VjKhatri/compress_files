const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // Image compression library
const ffmpeg = require('fluent-ffmpeg'); // Video compression library
const fs = require('fs'); // File system module
//const ffmpeg = require('fluent-ffmpeg');

const app = express();

// Create a multer storage instance
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    cb(null, fileName + fileExtension);
  },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log(req.file);

  // Get the file path
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  // Determine the file type
  const fileType = req.file.mimetype.split('/')[0];

  // Handle image compression
  // Handle image compression
// Handle image compression
if (fileType === 'image') {
  const resizedFilePath = path.join(
    __dirname,
    'uploads',
    `resized_${req.file.filename}`
  );

  const targetSize = Math.round(req.file.size * 0.7); // Calculate the target size in bytes

  try {
    // Use Sharp library to resize and compress the image
    sharp(filePath)
      .metadata()
      .then((metadata) => {
        const originalWidth = metadata.width;

        sharp(filePath)
          .resize({ width: Math.round(originalWidth * 0.7) }) // Resize the image to 70% of its original width
          .jpeg({ quality: 80 }) // Set JPEG quality to 80 (adjust as needed)
          .toFile(resizedFilePath, (err) => {
            if (err) {
              console.error('Error resizing image:', err);
              res.sendStatus(500);
            } else {
              // Check if the resized image is smaller than the target size
              const resizedStats = fs.statSync(resizedFilePath);
              if (resizedStats.size <= targetSize) {
                console.log('Image resized and compressed successfully');
                res.sendStatus(200);
              } else {
                // If the resized image is larger than the target size, save the original image
                fs.copyFile(filePath, resizedFilePath, (copyErr) => {
                  if (copyErr) {
                    console.error('Error saving image:', copyErr);
                    res.sendStatus(500);
                  } else {
                    console.log('Image saved without resizing');
                    res.sendStatus(200);
                  }
                });
              }
            }
          });
      })
      .catch((err) => {
        console.error('Error retrieving image metadata:', err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.error('Error resizing image:', err);
    res.sendStatus(500);
  }
}

  // Handle video compression
  else if (fileType === 'video') {
    // Video compression logic
    const compressedFilePath = path.join(
      __dirname,
      'uploads',
      `compressed_${req.file.filename}`
    );

    try {
      // Use FFmpeg to compress the video
      ffmpeg(filePath)
        .videoCodec('libx264')
        .outputOptions('-crf 28') // Adjust the CRF value as needed for desired video quality
        .on('end', () => {
          console.log('Video compressed successfully');
          res.sendStatus(200);
        })
        .on('error', (error) => {
          console.error('Error compressing video:', error);
          res.sendStatus(500);
        })
        .save(compressedFilePath);
    } catch (error) {
      console.error('Error processing video:', error);
      res.sendStatus(500);
    }
  }
  // Handle audio compression
  // Handle audio compression
else if (fileType === 'audio') {
  const compressedFilePath = path.join(
    __dirname,
    'uploads',
    `compressed_${req.file.filename}`
  );

  try {
    // Use FFmpeg to compress the audio
    ffmpeg(filePath)
      .outputOptions('-c:a', 'libmp3lame') // Set the audio codec to libmp3lame (adjust as needed)
      .output(compressedFilePath)
      .on('end', () => {
        console.log('Audio compressed successfully');
        res.sendStatus(200);
      })
      .on('error', (err) => {
        console.error('Error compressing audio:', err.message);
        res.sendStatus(500);
      })
      .run();
  } catch (error) {
    console.error('Error processing audio:', error);
    res.sendStatus(500);
  }
}


  // Handle document files
  else if (fileType === 'application') {
    console.log('Document file uploaded successfully');
    res.sendStatus(200);
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
