import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";

import { MenuController, ViewWillEnter } from "@ionic/angular";
import { IUser } from "../../interfaces/user";

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
    private menuCtrl: MenuController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup);
      this.router.navigateByUrl("/app/tabs/habits");
    }
  }
}
