class ServerCache {
  public cache: Map<string, string> = new Map();

  public has = (path: string): boolean => this.cache.has(path);

  public get_sync = (path: string): string | undefined => this.cache.get(path);
  public get = async (path: string): Promise<string | undefined> =>
    this.get_sync(path);

  public set = (path: string, content: string): void => (
    this.cache.set(path, content), undefined
  );
}

export default ServerCache;
