import { Component, OnInit } from "@angular/core";

import { PopoverController } from "@ionic/angular";
import { ApiService } from "../../services/api.service";

import { PopoverPage } from "../about-popover/about-popover";

@Component({
  selector: "page-about",
  templateUrl: "about.html",
  styleUrls: ["./about.scss"],
})
export class AboutPage implements OnInit {
  location = "madison";
  conferenceDate = "2047-05-17";

  selectOptions = {
    header: "Select a Location",
  };

  private userId = this.apiService.GetActualUserId();

  constructor(
    public popoverCtrl: PopoverController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.GetGraphicsRating(this.userId).then((e) => {
      console.log(e);
    });
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event,
    });
    await popover.present();
  }
}
