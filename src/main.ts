import "@angular/compiler";

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import Parse from "parse";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
Parse.serverURL = "https://parseapi.back4app.com/";
Parse.initialize(environment.appIdBack4App, environment.jsKeyBack4App);
