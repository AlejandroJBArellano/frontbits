import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";

import { MenuController, Platform, ToastController } from "@ionic/angular";

import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar } from "@capacitor/status-bar";

import { Storage } from "@ionic/storage-angular";

import { UserData } from "./providers/user-data";
import { AppCheckService } from "./services/app-check.service";
import { ParseService } from "./services/parse.service";
import { StorageService } from "./services/storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: "Habits",
      url: "/app/tabs/habits",
      icon: "calendar",
    },
    {
      title: "Publications",
      url: "/app/tabs/publications",
      icon: "timer",
    },
    {
      title: "Create",
      url: "/app/tabs/create",
      icon: "clipboard",
    },
    {
      title: "Graphics",
      url: "/app/tabs/graphics",
      icon: "analytics",
    },
  ];
  declare loggedIn: boolean;
  dark = window.matchMedia("(prefers-color-scheme: dark)");
  declare current: any;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private appCheck: AppCheckService,
    private storageService: StorageService,
    private parseService: ParseService
  ) {
    this.initializeApp();
  }

  async setCurrent() {
    this.current = await this.parseService.current();
  }

  async ngOnInit() {
    this.setCurrent();
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async (res) => {
      const toast = await this.toastCtrl.create({
        message: "Update available!",
        position: "bottom",
        buttons: [
          {
            role: "cancel",
            text: "Reload",
          },
        ],
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("hybrid")) {
        StatusBar.hide();
        SplashScreen.hide();
      }
    });
  }

  async checkLoginStatus() {
    const loggedIn = await this.userData.isLoggedIn();
    return this.updateLoggedInStatus(loggedIn);
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener("user:login", () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener("user:signup", () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener("user:logout", () => {
      this.updateLoggedInStatus(false);
      return this.router.navigateByUrl("/login");
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl("/login");
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set("ion_did_tutorial", false);
    this.router.navigateByUrl("/tutorial");
  }
}
