import { Component, OnInit } from "@angular/core";

import { PopoverController } from "@ionic/angular";
import { ApiService } from "../../services/api.service";

import { PopoverPage } from "../about-popover/about-popover";
import { EChartsOption } from "echarts";

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
  declare echartInstance;

  declare chartOption: EChartsOption;

  private userId = this.apiService.GetActualUserId();

  constructor(
    public popoverCtrl: PopoverController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.GetGraphicsRating(this.userId).then((e: any) => {
      console.log(e);
      this.chartOption = {
        xAxis: {
          type: "category",
          data: e?.user_rating?.map((obj) => obj.createdAt.slice(0, 10)),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: e?.user_rating?.map((obj) => obj.rate),
            type: "line",
          },
        ],
      };
      console.log(this.chartOption);
    });
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event,
    });
    await popover.present();
  }

  public onChartInit(ec) {
    this.echartInstance = ec;
  }
}
