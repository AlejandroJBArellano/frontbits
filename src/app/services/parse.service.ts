import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import Parse from "parse";

@Injectable({
  providedIn: "root",
})
export class ParseService {
  constructor(private platform: Platform) {}
  public async newInstallation() {
    try {
      const install = new Parse.Installation();
      install.set("deviceType", this.platform.platforms().toString());
      await install.save();
      return Promise.resolve(install);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async signUp(email: string, password: string) {
    try {
      const user = await Parse.User.signUp(email, password, {
        email,
      });
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async logIn(email: string, password: string) {
    try {
      const user = await Parse.User.logIn(email, password);
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
