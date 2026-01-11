import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

export const readData = async (filename) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, return empty array and create it
            await writeData(filename, []);
            return [];
        }
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

export const writeData = async (filename, data) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
    }
};

export const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
