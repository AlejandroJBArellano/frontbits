import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";
import { ExportAsModule } from "ngx-export-as";
import { PopoverPage } from "../about-popover/about-popover";
import { GraphicsPage } from "./graphics";
import { GraphicsPageRoutingModule } from "./graphics-routing.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    GraphicsPageRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    ExportAsModule,
  ],
  declarations: [GraphicsPage, PopoverPage],
  bootstrap: [GraphicsPage],
})
export class AboutModule {}
