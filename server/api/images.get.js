import { connectToDatabase } from '~/server/utils/db'; // Подключение MongoDB

export default defineEventHandler(async (event) => {
  const db = await connectToDatabase();
  const query = getQuery(event); // Получаем параметры запроса
  const { source, label, page = 1, limit = 20 } = query;

  const filters = {};
  if (source) filters.source = source;
  if (label) filters.label = { $regex: label, $options: 'i' };

  try {
    const images = await db
      .collection('gallery')
      .find(filters)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit) // for pagination
      .limit(Number(limit))
      .toArray();

    const total = await db.collection('gallery').countDocuments(filters);

    const allSources = await db
            .collection('gallery')
            .distinct('source');

    return {
      images,
      total,
      allSources,
      page: Number(page),
      limit: Number(limit),
    };
  } catch (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
});
