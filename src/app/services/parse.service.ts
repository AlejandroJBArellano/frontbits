import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import Parse from "parse";

@Injectable({
  providedIn: "root",
})
export class ParseService {
  constructor(private platform: Platform) {}
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
  public async logOut() {
    try {
      await Parse.User.logOut();
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async current() {
    try {
      const user = await Parse.User.currentAsync();
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async requestPasswordReset(email: string) {
    return await Parse.User.requestPasswordReset(email);
  }
  public async editUser(email: string) {
    try {
      const user = await Parse.User.currentAsync();
      user.set("username", email);
      user.set("email", email);
      await user.save();
      return Promise.resolve(user);
    } catch (error) {
      return Promise.resolve(error);
    }
  }
}
