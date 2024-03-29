import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SchedulePage } from "../home/home";
import { PublicationComponent } from "../publication/publication.component";
import { TabsPage } from "./tabs-page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "habits",
        children: [
          {
            path: "",
            component: SchedulePage,
          },
          {
            path: ":habitId",
            loadChildren: () =>
              import("../habit/habit.module").then((m) => m.HabitModule),
          },
          {
            path: "session/:sessionId",
            loadChildren: () =>
              import("../session-detail/session-detail.module").then(
                (m) => m.SessionDetailModule
              ),
          },
        ],
      },
      {
        path: "publications",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../speaker-list/speaker-list.module").then(
                (m) => m.SpeakerListModule
              ),
          },
          {
            path: ":publicationId",
            component: PublicationComponent,
          },
          {
            path: "session/:sessionId",
            loadChildren: () =>
              import("../session-detail/session-detail.module").then(
                (m) => m.SessionDetailModule
              ),
          },
          {
            path: "speaker-details/:speakerId",
            loadChildren: () =>
              import("../speaker-detail/speaker-detail.module").then(
                (m) => m.SpeakerDetailModule
              ),
          },
        ],
      },
      {
        path: "create",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../create/create.module").then((m) => m.CreateModule),
          },
        ],
      },
      {
        path: "graphics",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../graphics/graphics.module").then((m) => m.AboutModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/app/tabs/schedule",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
