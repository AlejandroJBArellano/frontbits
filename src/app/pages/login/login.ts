import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserData } from "../../providers/user-data";

import { AlertService } from "src/app/services/ui/alert.service";
import { UserOptions } from "../../interfaces/user-options";
import { LoadingService } from "../../services/ui/loading.service";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["./login.scss"],
})
export class LoginPage {
  login: UserOptions = { email: "" };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {}

  async onLogin(form: NgForm) {
    this.submitted = true;
    if (!form.valid) return;
    try {
      const loader = await this.loadingService.presentLoading({
        message: "Fetching user...",
      });
      await loader.present();
      await this.userData.login(this.login.email);
      await loader.dismiss();
      this.router.navigateByUrl("/app/tans/habits");
    } catch (error) {
      console.info(error);
      this.alertService.presentAlert({
        header: "Error!",
        message: error,
        buttons: ["OK"],
      });
    } finally {
      this.login.email = "";
    }
  }

  onSignup() {
    this.router.navigateByUrl("/signup");
  }
}
