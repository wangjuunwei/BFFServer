export abstract class FileServeType {
  public abstract mergeFile(
    filePath: string,
    filehash: string,
    size: string
  ): Promise<void>;

  public abstract mergeChunks(
    files: [],
    dest: string,
    size: number
  ): Promise<void>;
}
