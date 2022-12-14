import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { TabsPage } from "./tabs-page";
import { TabsPageRoutingModule } from "./tabs-page-routing.module";

import { AboutModule } from "../graphics/graphics.module";
import { HabitModule } from "../habit/habit.module";
import { ScheduleModule } from "../home/home.module";
import { SessionDetailModule } from "../session-detail/session-detail.module";
import { SpeakerDetailModule } from "../speaker-detail/speaker-detail.module";
import { SpeakerListModule } from "../speaker-list/speaker-list.module";

@NgModule({
  imports: [
    AboutModule,
    CommonModule,
    IonicModule,
    ScheduleModule,
    SessionDetailModule,
    SpeakerDetailModule,
    SpeakerListModule,
    TabsPageRoutingModule,
    HabitModule,
  ],
  declarations: [TabsPage],
})
export class TabsModule {}
