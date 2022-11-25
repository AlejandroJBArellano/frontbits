import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserData } from "../../providers/user-data";

import { AlertService } from "src/app/services/alert.service";
import { UserOptions } from "../../interfaces/user-options";

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
    private alertService: AlertService
  ) {}

  async onLogin(form: NgForm) {
    this.submitted = true;
    if (!form.valid) return;
    try {
      await this.userData.login(this.login.email);
    } catch (error) {
      console.info(error);
      this.alertService.presentAlert({
        header: "Error!",
        message: error,
        buttons: ["OK"],
      });
    }
  }

  onSignup() {
    this.router.navigateByUrl("/signup");
  }
}
