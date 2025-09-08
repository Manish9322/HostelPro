
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Saves an uploaded file to the public directory.
 * @param {File} file - The uploaded file object.
 * @param {string} subfolder - The subfolder within public/images to save the file.
 * @returns {Promise<string>} - The public path of the saved file.
 */
export async function saveImage(file, subfolder) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const fileExtension = path.extname(file.name);
  const fileName = `${uuidv4()}${fileExtension}`;

  // Define the upload directory and ensure it exists
  const uploadDir = path.join(process.cwd(), 'public', 'images', subfolder);
  await mkdir(uploadDir, { recursive: true });

  // Define the full file path
  const filePath = path.join(uploadDir, fileName);

  // Write the file to the server
  await writeFile(filePath, buffer);

  // Return the public path to be stored in the database
  return `/images/${subfolder}/${fileName}`;
}
