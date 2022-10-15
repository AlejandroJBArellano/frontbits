import { Injectable } from "@angular/core";
import { CanLoad, Router } from "@angular/router";
import { Storage } from "@ionic/storage-angular";
import { StorageService } from "../services/storage.service";
@Injectable({
  providedIn: "root",
})
export class CheckTutorial implements CanLoad {
  constructor(private storage: StorageService, private router: Router) {}

  canLoad() {
    return this.storage.get("ion_did_tutorial").then((res) => {
      console.log("res", res);
      if (res) {
        this.router.navigate(["/app", "tabs", "habits"]);
        return false;
      } else {
        return true;
      }
    });
  }
}
