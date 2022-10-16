import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { AboutPage } from "./about";
import { PopoverPage } from "../about-popover/about-popover";
import { AboutPageRoutingModule } from "./about-routing.module";
import { NgxEchartsModule } from "ngx-echarts";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AboutPageRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
  ],
  declarations: [AboutPage, PopoverPage],
  bootstrap: [AboutPage],
})
export class AboutModule {}
