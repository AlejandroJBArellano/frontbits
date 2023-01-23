import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IHabit } from "../../interfaces/habits";
import { ApiService } from "../../services/api.service";
import { SupabaseService } from "../../services/supabase.service";
import { LoadingService } from "../../services/ui/loading.service";

@Component({
  selector: "page-habit",
  styleUrls: ["./habit.scss"],
  templateUrl: "./habit.html",
})
export class HabitPage {
  declare habitId: string;
  public declare habit: IHabit;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public loadingService: LoadingService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    const habitId = this.route.snapshot.paramMap.get("habitId");
    this.habitId = this.route.snapshot.paramMap.get("habitId");
    this.fetchHabitInformation();
  }

  async fetchHabitInformation() {
    const loader = await this.loadingService.presentLoading({
      message: "Fetching Habit...",
    });
    await loader.present();
    // Payload API: cannot populate
    // const res = await (
    //   await fetch("http://localhost:3000/api/habits/63942339eb0c2d389c69fc2a")
    // ).json();
    this.habit = await this.apiService.GetHabit(this.habitId);
    this.habit.urlImg = this.supabaseService.getPublicUrl(
      this.habit.urlImg
    ).data.publicUrl;
    await loader.dismiss();
  }
  renderPublicationImg(publication: any) {
    publication.urlImg = this.supabaseService.getPublicUrl(
      publication.urlImg
    ).data.publicUrl;
  }
}
