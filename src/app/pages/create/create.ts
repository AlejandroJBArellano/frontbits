import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Config, Platform } from "@ionic/angular";
import { ConferenceData } from "../../providers/conference-data";

import {
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Camera, CameraResultType } from "@capacitor/camera";
import { AlertService } from "src/app/services/ui/alert.service";
import { IHabit } from "../../interfaces/habits";
import { UserData } from "../../providers/user-data";
import { ApiService } from "../../services/api.service";
import { SupabaseService } from "../../services/supabase.service";
import { LoadingService } from "../../services/ui/loading.service";
const congrats = ["Keep continue", "Go hard", "Very well", "Keep tracking it!"];
@Component({
  selector: "page-map",
  templateUrl: "create.html",
  styleUrls: ["./create.scss"],
})
export class CreatePage implements AfterViewInit, OnInit {
  @ViewChild("mapCanvas", { static: true }) mapElement: ElementRef;
  public declare imageHabit: {
    src: string;
    format: string;
  };
  public declare imagePublication: {
    src: string;
    format: string;
  };
  public max = new Date().toISOString();
  public publicationForm: UntypedFormGroup;
  public habitForm: UntypedFormGroup;
  public ios: boolean;
  public segment = "habits";
  public habits: IHabit[] = [];
  public customProperties = [
    {
      key: "Puntos a mejorar",
      value: "",
    },
    {
      key: "Puntos destacables",
      value: "",
    },
  ];
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform,
    public config: Config,
    private api: ApiService,
    public formBuilder: UntypedFormBuilder,
    private userData: UserData,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private supabaseService: SupabaseService
  ) {
    this.publicationForm = new FormGroup({
      habitId: new FormControl("", [Validators.required]),
      title: new FormControl("", [Validators.required]),
      description: new FormControl(""),
      improvables: new FormControl("", [Validators.required]),
      remarkables: new FormControl("", [Validators.required]),
      rate: new FormControl(0, [Validators.required]),
      customProperties: new FormArray([]),
    });
    this.habitForm = formBuilder.group({
      title: ["", Validators.required],
      description: ["", [Validators.required]],
    });
  }

  public initFormCustomProperty() {
    return new FormGroup({
      key: new FormControl("", [Validators.required]),
      value: new FormControl(""),
    });
  }

  public addCustomProperty() {
    const ref = this.publicationForm.get("customProperties") as FormArray;
    ref.push(this.initFormCustomProperty());
  }

  public getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

  private declare user;

  async ngOnInit() {
    await this.fetchData();
  }

  async fetchData() {
    await this.getUser();
    await this.getHabits();
  }

  async ngAfterViewInit() {
    this.ios = this.config.get("mode") === "ios";
    const appEl = this.doc.querySelector("ion-app");
    let isDark = false;
    let style = [];
  }
  private async getUser() {
    this.user = await this.userData.getUser();
  }
  public async getHabits() {
    this.habits = await this.api.ListHabits(this.user._id);
  }

  public onChangeCustomProperty() {}

  public async createPublication() {
    const loader = await this.loadingService.presentLoading({
      message: "Creating Publication",
      spinner: "circles",
    });
    await loader.present();

    if (!this.publicationForm.valid) {
      await loader.dismiss();
      await this.alertService.presentAlert({
        message: JSON.stringify(this.publicationForm.value),
      });
      return;
    }
    const customProperties = [
      {
        key: "improvables",
        value: this.publicationForm.get("improvables").value,
      },
      {
        key: "remarkables",
        value: this.publicationForm.get("remarkables").value,
      },
    ];
    console.log(this.publicationForm.get("customProperties").value);
    const publication = {
      title: this.publicationForm.get("title").value,
      description: this.publicationForm.get("description").value,
      customProperties: [
        ...customProperties,
        ...this.publicationForm.get("customProperties").value,
      ],
      userId: this.user._id,
      habitId: this.habits[0]._id,
      rate: this.publicationForm.get("rate").value,
      urlImg: "",
    };
    if (this.imagePublication && this.imagePublication.src) {
      const filePublication = await fetch(this.imagePublication.src)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], "XD", {
              type: `image/${this.imagePublication.format}`,
            })
        );
      const fileNamePublication = `${crypto.randomUUID()}.${
        this.imagePublication.format
      }`;
      const { data, error } = await this.supabaseService.uploadAvatar(
        fileNamePublication,
        filePublication
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
      publication.urlImg = data.path;
    }
    this.unSetImgPublication();
    try {
      await this.api.CreatePublication(publication);
    } catch (error) {
      await this.alertService.presentAlert({
        message: error,
      });
      await loader.dismiss();
      return;
    }
    this.publicationForm.reset();
    await loader.dismiss();
    await this.alertService.presentAlert({
      header: "Publication created!",
      subHeader: congrats[Math.round(Math.random() * congrats.length)],
      buttons: ["Thanks!"],
    });
  }

  public async createHabit() {
    const loader = await this.loadingService.presentLoading({
      message: "Creating Habit",
      spinner: "circles",
    });
    await loader.present();
    if (!this.habitForm.valid) return;

    const fileHabit = await fetch(this.imageHabit.src)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new File([blob], "XD", { type: `image/${this.imageHabit.format}` })
      );
    const fileNameHabit = `${crypto.randomUUID()}.${this.imageHabit.format}`;
    const { data, error } = await this.supabaseService.uploadAvatar(
      fileNameHabit,
      fileHabit
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
    const habit = {
      title: this.habitForm.get("title").value,
      description: this.habitForm.get("description").value,
      userId: this.user._id,
      urlImg: data.path,
    };

    this.unSetImgHabit();

    await this.api.CreateHabit(habit);
    this.habitForm.reset();
    this.getHabits();
    await loader.dismiss();
    await this.alertService.presentAlert({
      header: "Habit created!",
      subHeader: "Enjoy this new crossing",
      buttons: ["Thanks!"],
    });
  }

  public async takePictureForPublication() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      width: 400,
      height: 400,
    });

    console.log(image);

    const imageUrl = image.webPath;

    this.imagePublication = {
      src: imageUrl,
      format: image.format,
    };
  }

  public async takePictureForHabit() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      width: 400,
      height: 400,
    });

    const imageUrl = image.webPath;

    this.imageHabit = {
      src: imageUrl,
      format: image.format,
    };
  }

  public unSetImgPublication() {
    this.imagePublication = undefined;
  }

  public unSetImgHabit() {
    this.imageHabit = undefined;
  }
}
