import {
  Inject,
  Controller,
  Provide,
  Post,
  ALL,
  Body,
  Config,
} from '@midwayjs/decorator';

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
// 文件写入
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
import { Context } from 'egg';

import { FileControllerType } from '../../../typings/controller/file';
import { Objectdata } from '../../../typings/controller/baseController';
import { FileService } from '../../service/file';

@Provide()
@Controller('/file')
export class FileController extends FileControllerType {
  @Inject()
  ctx: Context;

  @Inject()
  fileService: FileService;

  @Config('UPLOAD_DIR')
  uploadConfig;

  @Post('/uploadfile')
  public async uploadfile() {
    // const { ctx } = this;
    // console.log(ctx.request);
    // const file = ctx.request.files[0];
    // const { hash, name } = ctx.request.body;
    //
    // const chunkPath = path.resolve('public/uploads', hash);
    // if (!fse.existsSync(chunkPath)) {
    //   await fse.mkdir(chunkPath);
    // }
    //
    // await fse.move(file.filepath, `${chunkPath}/${name}`);
    //
    // return this.message('切片上传成功');
    if (Math.random() > 0.7) {
      return this.error('上传失败');
    }
    const stream = await this.ctx.getFileStream();

    const { hash, name } = stream.fields;
    const chunkPath = path.resolve('public/uploads', hash);
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath);
    }

    try {
      const target = path.resolve(chunkPath, name);
      const writeStream = fs.createWriteStream(target);
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (e) {
      await sendToWormhole(stream);
      return this.error('上传失败');
    }

    return this.success({ message: '上传成功' });
  }

  @Post('/mergefile')
  public async mergeFile(@Body(ALL) fileData): Promise<Objectdata> {
    const { ext, size, hash } = fileData;
    const filePath = path.resolve('public/uploads', `${hash}.${ext}`);
    await this.fileService.mergeFile(filePath, hash, size);

    return this.success({ url: `/public/${hash}.${ext}` });
  }

  @Post('/validate')
  public async validateFile(
    @Body(ALL) validateFile: { ext: string; hash: unknown }
  ): Promise<Objectdata> {
    const { ext, hash } = validateFile;
    const filePath = path.resolve('public/uploads', `${hash}.${ext}`);

    let uploaded = false;
    let uploadedList: string[] = [];
    let url = '';
    if (fse.existsSync(filePath)) {
      uploaded = true;
      url = `/public/${hash}.${ext}`;
    } else {
      uploadedList = await this.getUploadList(
        path.resolve('public/uploads', hash)
      );
    }
    return this.success({
      url,
      uploaded,
      uploadedList,
    });
  }

  async getUploadList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
      : [];
  }
}
