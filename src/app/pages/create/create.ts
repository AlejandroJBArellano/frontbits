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
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Camera, CameraResultType } from "@capacitor/camera";
import { AlertService } from "src/app/services/ui/alert.service";
import { IHabit } from "../../interfaces/habits";
import { UserData } from "../../providers/user-data";
import { ApiService } from "../../services/api.service";
import { LoadingService } from "../../services/ui/loading.service";
const congrats = ["Keep continue", "Go hard", "Very well", "Keep tracking it!"];

@Component({
  selector: "page-map",
  templateUrl: "create.html",
  styleUrls: ["./create.scss"],
})
export class CreatePage implements AfterViewInit, OnInit {
  @ViewChild("mapCanvas", { static: true }) mapElement: ElementRef;
  private declare image: {
    src: string;
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
    private loadingService: LoadingService
  ) {
    this.publicationForm = formBuilder.group({
      habitId: ["", Validators.required],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      improvables: ["", Validators.required],
      remarkables: ["", Validators.required],
      rate: [0, Validators.required],
    });
    this.habitForm = formBuilder.group({
      title: ["", Validators.required],
      description: ["", [Validators.required]],
    });
  }

  private declare user;

  // public customProperty = "";
  // public customPropertyValues = [];

  ngOnInit() {
    console.log(this.max);
  }

  async fetchData() {
    await this.getUser();
    await this.getHabits();
  }

  async ngAfterViewInit() {
    await this.fetchData();
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

  public onChangeCustomProperty() {
    console.log("onChangeCustomProperty");
  }

  public async createPublication() {
    const loader = await this.loadingService.presentLoading({
      message: "Creating Publication",
      spinner: "circles",
    });
    await loader.present();

    console.log(this.publicationForm.value);
    if (!this.publicationForm.valid) return;
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
    const publication = {
      title: this.publicationForm.get("title").value,
      description: this.publicationForm.get("description").value,
      customProperties,
      userId: this.user._id,
      habitId: this.habits[0]._id,
      rate: this.publicationForm.get("rate").value,
    };
    if (publication.rate < 0 || publication.rate > 10) return;
    console.log(publication);
    await this.api.CreatePublication(publication);
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
    console.log(this.habitForm.value);
    if (!this.habitForm.valid) return;
    const habit = {
      title: this.habitForm.get("title").value,
      description: this.habitForm.get("description").value,
      userId: this.user._id,
    };
    await this.api.CreateHabit(habit);
    console.log(habit);
    this.habitForm.reset();
    this.getHabits();
    await loader.dismiss();
    await this.alertService.presentAlert({
      header: "Habit created!",
      subHeader: "Enjoy this new crossing",
      buttons: ["Thanks!"],
    });
  }

  public async selectFileOrigin() {
    const alert = this.alertService.presentAlert({
      header: "Attach media",
      buttons: [
        {
          text: "Camera",
          handler: this.takePicture,
        },
        {
          text: "Files on device",
        },
      ],
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    const imageUrl = image.webPath;

    this.image.src = imageUrl;
  }
}
