import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _storage: Storage | null;

  constructor(private storage: Storage) {
    this.onInit();
  }

  async onInit() {
    this._storage = await this.storage.create();
  }

  set(key: string, value: any) {
    this.storage.set(key, value);
  }
  get(key: string) {
    return this.storage.get(key);
  }
  remove(key: string) {
    this.storage.remove(key);
  }
  clear() {
    this.storage.clear();
  }
}
