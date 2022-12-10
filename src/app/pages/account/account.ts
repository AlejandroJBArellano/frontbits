import { AfterViewInit, Component } from "@angular/core";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";
import { AlertService } from "../../services/ui/alert.service";

@Component({
  selector: "page-account",
  templateUrl: "account.html",
  styleUrls: ["./account.scss"],
})
export class AccountPage implements AfterViewInit {
  email: string;

  constructor(
    public router: Router,
    public userData: UserData,
    private alertService: AlertService
  ) {}

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log("Clicked to update picture");
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    this.alertService.presentAlert({
      header: "Change Username",
      buttons: [
        "Cancel",
        {
          text: "Ok",
          handler: (data: any) => {
            this.userData.setUsername(data.username);
            this.getUsername();
          },
        },
      ],
      inputs: [
        {
          type: "text",
          name: "email",
          value: this.email,
          placeholder: "hello@gmail.com",
        },
      ],
    });
  }

  async getUsername() {
    this.email = await this.userData.getUsername();
  }

  changePassword() {
    console.log("Clicked to change password");
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl("/login");
  }

  support() {
    this.router.navigateByUrl("/support");
  }
}
