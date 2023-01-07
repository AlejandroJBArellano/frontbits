import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Config, IonList, IonRouterOutlet } from "@ionic/angular";

import { IHabit } from "../../interfaces/habits";
import { ConferenceData } from "../../providers/conference-data";
import { UserData } from "../../providers/user-data";
import { ApiService } from "../../services/api.service";
import { AlertService } from "../../services/ui/alert.service";
import { LoadingService } from "../../services/ui/loading.service";
import { ModalService } from "../../services/ui/modal.service";
import { ToastService } from "../../services/ui/toast.service";
import { ScheduleFilterPage } from "../schedule-filter/schedule-filter";

@Component({
  selector: "page-schedule",
  templateUrl: "home.html",
  styleUrls: ["./home.scss"],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild("scheduleList", { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = "";
  segment = "all";
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;

  public declare user;

  public habits: IHabit[] = [];

  constructor(
    public alertService: AlertService,
    public confData: ConferenceData,
    public loadingService: LoadingService,
    public modalService: ModalService,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public config: Config,
    private api: ApiService,
    private userData: UserData,
    private toastService: ToastService
  ) {}

  ngOnInit() {

    this.api.getToken().then(e => {
      console.log(e)
    }).catch(e => console.log(e))
    this.updateHabits();

    console.log(this.habits, this.user);

    this.ios = this.config.get("mode") === "ios";
  }

  async updateHabits() {
    // Close any open sliding items when the schedule updates
    // if (this.scheduleList) {
    //   this.scheduleList.closeSlidingItems();
    // }

    // this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
    //   this.shownSessions = data.shownSessions;
    //   this.groups = data.groups;
    //   console.log(this.groups)
    // });
    const loader = await this.loadingService.presentLoading({
      message: "Fetching data...",
    });
    try {
      await loader.present();

      this.user = await this.userData.getUser();

      if (!this.user) {
        this.router.navigateByUrl("/login");
        await loader.dismiss();
        return;
      }

      this.habits = await this.api.ListHabits(this.user?._id);

      await loader.dismiss();
      if (!this.habits.length) {
        await this.alertService.presentAlert({
          header: "Alert!",
          message: "There is no habits yet!",
          buttons: [
            {
              text: "Ok!",
              handler: () => this.router.navigateByUrl("/app/tabs/create"),
            },
          ],
        });
      }
    } catch (error) {
      await loader.dismiss();
      await this.alertService.presentAlert({
        header: "Error!",
        message: error,
        buttons: ["Ok"],
      });
    }
  }

  async presentFilter() {
    const modal = await this.modalService.presentModal({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks },
    });

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateHabits();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, "Favorite already added");
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      await this.toastService.presentToast({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [
          {
            text: "Close",
            role: "cancel",
          },
        ],
      });
    }
  }

  async removeFavorite(
    slidingItem: HTMLIonItemSlidingElement,
    sessionData: any,
    title: string
  ) {
    this.alertService.presentAlert({
      header: title,
      message: "Would you like to remove this session from your favorites?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
        {
          text: "Remove",
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateHabits();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
      ],
    });
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingService.presentLoading({
      message: `Posting to ${network}`,
      duration: Math.random() * 1000 + 500,
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
