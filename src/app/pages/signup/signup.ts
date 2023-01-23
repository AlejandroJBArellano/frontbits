import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";

import { MenuController, ViewWillEnter } from "@ionic/angular";
import { IUser } from "../../interfaces/user";
import { AlertService } from "../../services/ui/alert.service";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
  styleUrls: ["./signup.scss"],
})
export class SignupPage implements ViewWillEnter {
  signup: IUser = { email: "", name: "", password: "" };
  submitted = false;

  constructor(
    public router: Router,
    public userData: UserData,
    private menuCtrl: MenuController,
    private alertService: AlertService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      await this.userData.signup(this.signup);
      await this.alertService.presentAlert({
        header: "Welcome 😁",
        subHeader: "Successfully signed up! ",
        buttons: [
          {
            text: "Thanks!",
            handler: () => {
              this.router.navigateByUrl("/app/tabs/habits");
            },
          },
        ],
      });
    }
  }
}
