import { Provide } from '@midwayjs/decorator';
import { FileServeType } from '../../typings/service/file';

const fse = require('fs-extra');
const path = require('path');

@Provide()
export class FileService extends FileServeType {
  /**
   * @deprecated 读取所有chunks 并写入文件的
   * @param filePath
   * @param filehash
   * @param size
   */
  async mergeFile(filePath: string, filehash: string, size: string) {
    const chunkDir = path.resolve('public/uploads', filehash);
    let chunks = await fse.readdir(chunkDir);

    chunks.sort((a, b) => a.split('-'[1]) - b.split('-')[1]);

    chunks = chunks.map(cp => path.resolve(chunkDir, cp));

    await this.mergeChunks(chunks, filePath, size);
  }

  /**
   * @deprecated 读取并写入文件的
   * @param files
   * @param dest
   * @param size
   */
  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) =>
      new Promise<void>(resolve => {
        const readStream = fse.createReadStream(filePath);
        readStream.on('end', () => {
          fse.unlinkSync(filePath);
          resolve();
        });
        readStream.pipe(writeStream);
      });

    const request = files.map((file, index) => {
      pipStream(
        file,
        fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        })
      );
    });
    await Promise.all(request);
  }
}
