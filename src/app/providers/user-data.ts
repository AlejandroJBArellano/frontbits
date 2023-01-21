import { Injectable } from "@angular/core";
import { IUser } from "../interfaces/user";
import { ApiService } from "../services/api.service";
import { ParseService } from "../services/parse.service";
import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: "root",
})
export class UserData {
  declare user: IUser;
  favorites: string[] = [];
  HAS_LOGGED_IN = "hasLoggedIn";
  HAS_SEEN_TUTORIAL = "hasSeenTutorial";

  constructor(
    private storage: StorageService,
    private apiService: ApiService,
    private parseService: ParseService
  ) {}

  hasFavorite(sessionName: string): boolean {
    return this.favorites.indexOf(sessionName) > -1;
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  async login(email: string): Promise<boolean> {
    this.user = await this.apiService.GetUser({
      email,
    });
    if (!this.user) {
      return Promise.reject("User does not exist");
    }
    await this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUser(this.user);
    this.setUsername(email);
    return window.dispatchEvent(new CustomEvent("user:login"));
  }

  async signup(user: IUser): Promise<boolean> {
    this.user = await this.apiService.CreateUser(user).toPromise();
    if (!this.user) {
      return Promise.reject("Something went wrong. Try Again");
    }
    await this.parseService.signUp(user.email, user.password);
    await this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUser(this.user);
    this.setUsername(this.user.email);
    return window.dispatchEvent(new CustomEvent("user:signup"));
  }

  async logout(): Promise<boolean> {
    await this.storage.remove(this.HAS_LOGGED_IN);
    await this.storage.remove("email");
    await this.storage.remove("user");
    return window.dispatchEvent(new CustomEvent("user:logout"));
  }

  setUsername(email: string): Promise<any> {
    return this.storage.set("email", email);
  }

  setUser(user: IUser): Promise<any> {
    return this.storage.set("user", user);
  }

  async getUser(): Promise<IUser> {
    return this.storage.get("user");
  }

  async getUsername(): Promise<string> {
    const value = await this.storage.get("email");
    console.log(value);
    return value;
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
