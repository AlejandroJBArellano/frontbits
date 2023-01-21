import { Injectable } from "@angular/core";
import { CanLoad, Router } from "@angular/router";
import { StorageService } from "../services/storage.service";
@Injectable({
  providedIn: "root",
})
export class CheckTutorial implements CanLoad {
  constructor(private storage: StorageService, private router: Router) {}

  canLoad() {
    return this.storage.get("ion_did_tutorial").then((res) => {
      if (res) {
        this.router.navigate(["/app", "tabs", "habits"]);
        return false;
      } else {
        return true;
      }
    });
  }
}
