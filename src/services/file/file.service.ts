import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Multer } from 'multer';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadDir = path.join('src', 'files', folder);
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, filename);

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Crear directorios recursivamente si es necesario
      }
      await fs.promises.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      throw new Error(`Error al guardar el archivo: ${error.message}`);
    }
  }
}
