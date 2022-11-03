import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GraphicsPage } from "./graphics";

const routes: Routes = [
  {
    path: "",
    component: GraphicsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraphicsPageRoutingModule {}
