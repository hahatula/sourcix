import { connectToDatabase } from '~/server/utils/db';

type QueryParams = {
  source?: string;
  label?: string;
  page?: string;
  limit?: string;
};

type Filters = {
  source?: string;
  label?: { $regex: string; $options: string };
};

export default defineEventHandler(async (event) => {
  const db = await connectToDatabase();
  const query: QueryParams = getQuery(event); // get query params which are strings
  const { source, label, page = '1', limit = '20' } = query;

  const filters: Filters = {};
  if (source) filters.source = source;
  if (label) filters.label = { $regex: label, $options: 'i' };

  try {
    const images = await db
      .collection('gallery')
      .find(filters) // MongoDB method to find documents in a collection
      .sort({ createdAt: -1 }) // newest first
      .skip((Number(page) - 1) * Number(limit)) // for pagination
      .limit(Number(limit))
      .toArray();

    const total = await db.collection('gallery').countDocuments(filters);

    const allSources = await db.collection('gallery').distinct('source');

    return {
      images,
      total,
      allSources,
      page: Number(page),
      limit: Number(limit),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    throw createError({ statusCode: 500, message: 'Unknown error' });
  }
});
