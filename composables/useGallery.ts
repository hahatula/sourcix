export async function fetchImages(
  page: number,
  limit: number,
  source: string,
  label: string
) {
  try {
    const response = await fetch(
      `/api/images?page=${page}&limit=${limit}&source=${source}&label=${label}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching images: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchImagesApi:', error);
    throw error;
  }
}

export async function uploadImage(file: File, label: string, source: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('label', label);
  formData.append('source', source);
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error uploading file: ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadFileApi:', error);
    throw error;
  }
}
