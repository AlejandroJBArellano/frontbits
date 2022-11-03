import { Component, OnInit } from "@angular/core";

import { PopoverController } from "@ionic/angular";
import { ApiService } from "../../services/api.service";

import { EChartsOption } from "echarts";
import { IHabit } from "src/app/interfaces/habits";
import { PopoverPage } from "../about-popover/about-popover";

@Component({
  selector: "page-about",
  templateUrl: "graphics.html",
  styleUrls: ["./graphics.scss"],
})
export class GraphicsPage implements OnInit {
  declare echartInstance;

  declare chartOption: EChartsOption;

  declare habits: IHabit[];

  private userId = this.apiService.GetActualUserId();

  public declare habitId: string;
  public declare noPublicationWarning: string;

  constructor(
    public popoverCtrl: PopoverController,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    await this.fetchData();
  }

  public async fetchData() {
    this.habits = await this.apiService.ListHabits(this.userId);
    this.habitId = this.habits[0]._id;
    this.initializeChart();
  }

  public initializeChart() {
    this.apiService.GetGraphicsRating(this.userId, this.habitId).then(
      (e: {
        user_rating: {
          createdAt: string;
          publicationId: string;
          rate: number;
        }[];
      }) => {
        if (e.user_rating.length) {
          this.noPublicationWarning = "";
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
          return;
        }
        this.noPublicationWarning =
          "You don't have yet publications on this Habit";
      }
    );
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
    const habitId = $event.detail.value;
    this.habitId = this.habits.find(({ _id }) => _id === habitId)._id;
    this.initializeChart();
  }
}
