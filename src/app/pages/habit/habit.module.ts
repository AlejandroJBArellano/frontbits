import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HabitPage } from "./habit";
import { HabitRoutingModule } from "./habit-routing.module";

@NgModule({
  imports: [CommonModule, IonicModule, HabitRoutingModule],
  declarations: [HabitPage],
})
export class HabitModule {}
