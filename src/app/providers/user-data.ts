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

  public async invalidate() {
    const username = await this.getUsername();
    this.user = await this.apiService.GetUser({
      email: username,
    });

    this.setUser(this.user);
  }

  async login(email: string, password: string): Promise<boolean> {
    this.user = await this.apiService.GetUser({
      email,
    });
    if (!this.user) {
      return Promise.reject("User does not exist");
    }
    await this.parseService.logIn(email, password);
    await this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUser(this.user);
    this.setUsername(email);
    return window.dispatchEvent(new CustomEvent("user:login"));
  }

  async signup(user: IUser): Promise<boolean> {
    try {
      const { user: userData, error } = await this.apiService
        .CreateUser(user)
        .toPromise();
      if (error) {
        return Promise.reject(error);
      }
      this.user = userData;
      if (!this.user) {
        return Promise.reject("Something went wrong. Try Again");
      }
      await this.parseService.signUp(user.email, user.password);
      await this.storage.set(this.HAS_LOGGED_IN, true);
      this.setUser(this.user);
      this.setUsername(this.user.email);
      return window.dispatchEvent(new CustomEvent("user:signup"));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async logout(): Promise<boolean> {
    await this.parseService.logOut();
    await this.storage.remove(this.HAS_LOGGED_IN);
    await this.storage.remove("email");
    await this.storage.remove("user");
    return window.dispatchEvent(new CustomEvent("user:logout"));
  }

  public async changeUser({ email, name, _id, avatarUrl }: IUser) {
    try {
      const user = await this.apiService
        .UpdateUser({ email, name, _id, avatarUrl })
        .toPromise();
      console.log("", user);
      await this.parseService.editUser(email);
      await this.setUser(user);
      await this.setUsername(user.email);
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  setUsername(email: string): Promise<any> {
    return this.storage.set("email", email);
  }

  setUser(user: IUser): Promise<any> {
    return this.storage.set("user", user);
  }

  async getUser(): Promise<IUser> {
    const user = await this.parseService.current();
    if (!user) {
      return Promise.reject(null);
    }
    return this.storage.get("user");
  }

  async getUsername(): Promise<string> {
    const value = await this.storage.get("email");
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
