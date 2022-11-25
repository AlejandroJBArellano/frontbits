import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  Config,
  IonList,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";

import { IHabit } from "../../interfaces/habits";
import { ConferenceData } from "../../providers/conference-data";
import { UserData } from "../../providers/user-data";
import { AlertService } from "../../services/alert.service";
import { ApiService } from "../../services/api.service";
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
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    private api: ApiService,
    private userData: UserData
  ) {}

  ngOnInit() {
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

    this.user = await this.userData.getUser();

    this.habits = await this.api.ListHabits(this.user?._id);

    if (!this.habits.length) {
      this.alertService.presentAlert({
        header: "Alert!",
        message: "There is no habits yeat!",
        buttons: [
          {
            text: "Ok!",
            handler: () => this.router.navigateByUrl("/app/tabs/create"),
          },
        ],
      });
    }
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks },
    });
    await modal.present();

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

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [
          {
            text: "Close",
            role: "cancel",
          },
        ],
      });

      // Present the toast at the bottom of the page
      await toast.present();
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
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: Math.random() * 1000 + 500,
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
