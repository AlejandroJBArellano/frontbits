import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.onInit();
  }

  async onInit() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  public async set(key: string, value: any) {
    await this.onInit();
    await this.storage.set(key, value);
  }
  public async get(key: string) {
    await this.onInit();
    const objDb = await this.storage.get(key);
    return objDb;
  }
  public async remove(key: string) {
    await this.onInit();
    await this.storage.remove(key);
  }
  public async clear() {
    await this.onInit();
    await this.storage.clear();
  }
}
