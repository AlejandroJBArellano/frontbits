import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";

import { IUser } from "../../interfaces/user";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
  styleUrls: ["./signup.scss"],
})
export class SignupPage {
  signup: IUser = { email: "", name: "", password: "" };
  submitted = false;

  constructor(public router: Router, public userData: UserData) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup);
      this.router.navigateByUrl("/app/tabs/habits");
    }
  }
}
