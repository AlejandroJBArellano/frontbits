import { Component, OnInit } from "@angular/core";

import { PopoverController } from "@ionic/angular";
import { ApiService } from "../../services/api.service";

import { PopoverPage } from "../about-popover/about-popover";
import { EChartsOption } from "echarts";
import { IHabit } from "src/app/interfaces/habits";

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

  declare habits: IHabit[];

  private userId = this.apiService.GetActualUserId();

  constructor(
    public popoverCtrl: PopoverController,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    await this.fetchData();
  }

  public async fetchData() {
    this.habits = await this.apiService.ListHabits(this.userId);
    this.initializeChart();
  }

  public initializeChart() {
    this.apiService.GetGraphicsRating(this.userId).then((e: any) => {
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

  public onChange($event: any) {
    console.log($event);
  }
}
