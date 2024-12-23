import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable'; // Node.js module that is used for parsing form data, especially file uploads
import { connectToDatabase } from '~/server/utils/db';

// Cloudinary - cloud storage for images
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default defineEventHandler(async (event) => {
  // multiple file uploads are not allowed
  const form = formidable({ multiples: false });

  // parse form data -> check if file is provided -> upload to cloudinary with additional metadata -> save to db
  return new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        reject(
          createError({ statusCode: 500, message: 'Failed to parse form data' })
        );
        return;
      }

      if (!files.file) {
        console.error('No file provided in the request.');
        reject(
          createError({
            statusCode: 400,
            message: 'Missing required parameter - file',
          })
        );
        return;
      }

      const source = fields.source || 'Anonymous';
      const label = fields.label || 'No Label';

      try {
        const filePath = files.file[0].filepath;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'sourcix',
          context: {
            source: source,
            label: label,
          },
        });

        const db = await connectToDatabase();
        const galleryCollection = db.collection('gallery');
        const newImage = {
          url: uploadResult.secure_url,
          label: fields?.label?.[0],
          source: fields?.source?.[0],
          createdAt: new Date(),
        };

        await galleryCollection.insertOne(newImage);

        resolve({
          message: 'Image uploaded successfully',
          image: newImage,
        });
      } catch (uploadError) {
        console.error(
          'Error uploading file or saving to database:',
          uploadError
        );
        if (uploadError instanceof Error) {
          reject(
            createError({
              statusCode: 500,
              message: uploadError.message,
            })
          );
        } else {
          reject(
            createError({
              statusCode: 500,
              message: 'An unknown error occurred during upload.',
            })
          );
        }
      }
    });
  });
});
