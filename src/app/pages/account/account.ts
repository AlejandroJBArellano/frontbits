import { AfterViewInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { Camera, CameraResultType } from "@capacitor/camera";

import { IUser } from "../../interfaces/user";
import { UserData } from "../../providers/user-data";
import { ApiService } from "../../services/api.service";
import { ParseService } from "../../services/parse.service";
import { SupabaseService } from "../../services/supabase.service";
import { AlertService } from "../../services/ui/alert.service";
import { LoadingService } from "../../services/ui/loading.service";

@Component({
  selector: "page-account",
  templateUrl: "account.html",
  styleUrls: ["./account.scss"],
})
export class AccountPage implements AfterViewInit {
  private image: {
    src: string;
    format: string;
    changed: boolean;
  } = {
    src: "https://www.gravatar.com/avatar?d=mm&s=140",
    format: "png",
    changed: false,
  };
  declare email: string;
  declare user: IUser;

  constructor(
    public router: Router,
    public userData: UserData,
    private alertService: AlertService,
    private apiService: ApiService,
    private supabaseService: SupabaseService,
    private loadingService: LoadingService,
    private parseService: ParseService
  ) {}

  async ngAfterViewInit() {
    this.getUsername();
    await this.getUser();
  }

  private async getUser() {
    this.user = await this.userData.getUser();
    if (this.user.avatarUrl) {
      const {
        data: { publicUrl: src },
      } = this.supabaseService.getPublicUrl(this.user.avatarUrl);

      this.image = {
        src,
        format: "",
        changed: true,
      };
    }
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    await this.alertService.presentAlert({
      header: "Change Username",
      buttons: [
        "Cancel",
        {
          text: "Ok",
          handler: async ({ email, name }: any) => {
            console.log(email, name);
            try {
              const message =
                email !== this.user.email
                  ? "Log in in the app with the new email :)"
                  : "";
              await this.userData.changeUser({ ...this.user, email, name });
              await this.alertService.presentAlert({
                header: "Success!",
                message,
                buttons: ["OK!"],
              });
              await this.userData.logout();
            } catch (error) {
              await this.alertService.presentAlert({
                header: "Error! Try again later.",
                message: JSON.stringify(error),
                buttons: ["OK!"],
              });
            }
          },
        },
      ],
      inputs: [
        {
          type: "text",
          name: "name",
          value: this.user.name,
          placeholder: "John Smith",
        },
        {
          type: "text",
          name: "email",
          value: this.user.email,
          placeholder: "john.smith@gmail.com",
        },
      ],
    });
  }

  async getUsername() {
    this.email = await this.userData.getUsername();
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl("/login");
  }

  support() {
    this.router.navigateByUrl("/support");
  }

  public async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      width: 400,
      height: 400,
    });

    console.log(image);

    const imageUrl = image.webPath;

    this.image = {
      src: imageUrl,
      format: image.format,
      changed: true,
    };
  }

  public async upload() {
    const loader = await this.loadingService.presentLoading({
      message: "Uploading avatar",
      spinner: "circles",
    });
    await loader.present();
    const file = await fetch(this.image.src)
      .then((res) => res.blob())
      .then(
        (blob) => new File([blob], "XD", { type: `image/${this.image.format}` })
      );

    const fileName = `${crypto.randomUUID()}.${this.image.format}`;

    const { data, error } = await this.supabaseService.uploadAvatar(
      fileName,
      file
    );

    if (error) {
      await loader.dismiss();
      await this.alertService.presentAlert({
        header: "Error trying to upload the image!",
        message: error.message,
        buttons: ["Ok!"],
      });
      return;
    }

    console.log(this.user);

    await this.apiService
      .UpdateUser({
        ...this.user,
        avatarUrl: data.path,
      })
      .toPromise();
    await loader.dismiss();
  }

  public unSetImg() {
    this.image = {
      src: "https://www.gravatar.com/avatar?d=mm&s=140",
      format: "png",
      changed: false,
    };
  }

  public async changePassword() {
    await this.alertService.presentAlert({
      header: "Wait!",
      message:
        "Are you sure you want to change your password? A mail will be sent.",
      buttons: [
        {
          text: "Accept",
          handler: async () => {
            const loader = await this.loadingService.presentLoading({
              message: "Sending petition for change password!",
            });
            try {
              await this.parseService.requestPasswordReset(this.user.email);
              await loader.dismiss();
              await this.alertService.presentAlert({
                header: "Email Sent!",
                buttons: [
                  {
                    text: "Perfect 😁!",
                    role: "cancel",
                    handler: () => {
                      this.userData.logout();
                    },
                  },
                ],
              });
            } catch (error) {
              await this.alertService.presentAlert({
                header: "Error",
                buttons: [
                  {
                    text: "An error happened in the operation! Try again later.",
                    role: "cancel",
                  },
                ],
              });
            }
          },
        },
      ],
    });
  }
}
