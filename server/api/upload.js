import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { connectToDatabase } from '~/server/utils/db';

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      console.log('Parsing form data...');
      console.log('Fields:', fields);
      console.log('Files:', files);

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

      try {
        const filePath = files.file[0].filepath; // Доступ к первому файлу
        console.log('Uploading file to Cloudinary:', filePath);
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'sourcix',
        });

        console.log('Upload result:', uploadResult);

        const db = await connectToDatabase();
        const galleryCollection = db.collection('gallery');
        const newImage = {
          url: uploadResult.secure_url,
          label: fields.label[0],
          source: fields.source[0],
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
        reject(createError({ statusCode: 500, message: uploadError.message }));
      }
    });
  });
});
