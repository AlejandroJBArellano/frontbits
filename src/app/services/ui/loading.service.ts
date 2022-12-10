import { Injectable } from "@angular/core";
import { LoadingController, LoadingOptions } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}
  public async presentLoading(opts: LoadingOptions) {
    const loader = await this.loadingController.create(opts);
    await loader.present();
    return loader;
  }
}
