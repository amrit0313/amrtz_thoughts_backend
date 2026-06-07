import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import 'multer';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      console.log(file);
      console.log(file.buffer);
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'profile-pics' },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('Upload failed: no response from Cloudinary'),
            );
          resolve(result); // TypeScript now knows result is UploadApiResponse
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }
}

// import { Injectable } from '@nestjs/common';
// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import { Readable } from 'stream';

// @Injectable()
// export class CloudinaryService {
//   async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
//     return new Promise((resolve, reject) => {
//       const upload = cloudinary.uploader.upload_stream(
//         { folder: 'profile-pics' },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         },
//       );
//       Readable.from(file.buffer).pipe(upload);
//     });
//   }
// }
