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
import { IHabit } from "../../interfaces/habits";
import { UserData } from "../../providers/user-data";
import { ApiService } from "../../services/api.service";
import { darkStyle } from "./map-dark-style";

@Component({
  selector: "page-map",
  templateUrl: "create.html",
  styleUrls: ["./create.scss"],
})
export class CreatePage implements AfterViewInit, OnInit {
  @ViewChild("mapCanvas", { static: true }) mapElement: ElementRef;
  public max = new Date().toISOString();
  public publicationForm: UntypedFormGroup;
  public habitForm: UntypedFormGroup;
  public ios: boolean;
  public segment = "publication";
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
    private userData: UserData
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
    this.user = this.userData.getUser();
    console.log("onInit");
  }

  async ngAfterViewInit() {
    this.getHabits();
    this.ios = this.config.get("mode") === "ios";
    const appEl = this.doc.querySelector("ion-app");
    let isDark = false;
    let style = [];
    if (appEl.classList.contains("dark-theme")) {
      style = darkStyle;
    }
  }
  public async getHabits() {
    this.habits = await this.api.ListHabits(this.user._id);
  }

  public onChangeCustomProperty() {
    console.log("onChangeCustomProperty");
  }
  public addCustomPropertyToForm(index, input) {
    console.log(index, input);
    // const customProperties = this.publicationForm.get('customProperties') as FormArray;
    // customProperties.at(index).setValue({
    //   key: input.key,
    //   value: input.value
    // });
  }
  public async createPublication() {
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
  }

  public async createHabit() {
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
  }
}
