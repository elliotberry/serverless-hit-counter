import fs from 'fs/promises';
import path from 'path';

async function main() {
  const ttfFilePath = path.resolve('7segment.ttf'); // Replace with your TTF file path
  const outputJsonFilePath = path.resolve('./out.json'); // Replace with your desired output JSON file path

  try {
    // Read the TTF file
    const ttfFile = await fs.readFile(ttfFilePath);

    // Convert TTF file to Base64 string
    const base64Data = ttfFile.toString('base64');

    // Create a JSON object with the base64-encoded TTF data
    const jsonData = {
      ttf: base64Data
    };

    // Save the JSON object to a file
    await fs.writeFile(outputJsonFilePath, JSON.stringify(jsonData, null, 2));

    console.log(`File has been successfully saved to ${outputJsonFilePath}`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

main();