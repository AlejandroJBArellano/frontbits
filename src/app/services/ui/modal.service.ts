import { Injectable } from "@angular/core";
import { ModalController, ModalOptions } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private modalController: ModalController) {}
  public async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();
    return modal;
  }
}
