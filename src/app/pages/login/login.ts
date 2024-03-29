import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserData } from "../../providers/user-data";

import { MenuController, ViewWillEnter } from "@ionic/angular";
import { AlertService } from "src/app/services/ui/alert.service";
import { UserOptions } from "../../interfaces/user-options";
import { LoadingService } from "../../services/ui/loading.service";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["./login.scss"],
})
export class LoginPage implements ViewWillEnter {
  login: UserOptions = { email: "", password: "" };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private menuCtrl: MenuController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async onLogin(form: NgForm) {
    this.submitted = true;
    if (!form.valid) return;
    const loader = await this.loadingService.presentLoading({
      message: "Fetching user...",
    });
    try {
      await loader.present();
      await this.userData.login(this.login.email, this.login.password);
      this.router.navigateByUrl("/app/tabs/habits");
    } catch (error) {
      console.info(error);
      await this.alertService.presentAlert({
        header: "Error!",
        message: error,
        buttons: ["OK"],
      });
    } finally {
      await loader.dismiss();
      this.login.email = "";
    }
  }

  onSignup() {
    this.router.navigateByUrl("/signup");
  }
}
