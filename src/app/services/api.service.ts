import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FirebaseApp, initializeApp } from 'firebase/app';
import 'firebase/app-check';
import { AppCheck, AppCheckTokenResult, getToken, initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { environment } from "../../environments/environment";
import { IHabit } from "../interfaces/habits";
import { IUser } from "../interfaces/user";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  declare app: FirebaseApp
  declare appCheck: AppCheck;

  constructor(private http: HttpClient) {
    // (<any>window).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "399371E8-01A9-45D1-8336-5C17A000A559";

    this.app = initializeApp(environment.firebase);

    // Create a ReCaptchaEnterpriseProvider instance using reCAPTCHA Enterprise.
    this.appCheck = initializeAppCheck(this.app, {
      provider: new ReCaptchaEnterpriseProvider(environment.reCaptchaProvider),
      isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
    });
  }

  async getToken(): Promise<AppCheckTokenResult | undefined> {
    try {
      const appCheckTokenResponse = await getToken(this.appCheck);
      return appCheckTokenResponse;
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  concatenateUrl(url: string) {
    return `${environment.api}${url}`;
  }

  GetUser(query: any) {
    let params = new HttpParams();
    Object.keys(query).forEach((k) => (params = params.set(k, query[k])));
    return this.http
      .get<IUser>(this.concatenateUrl("/user"), {
        params,
      })
      .toPromise();
  }

  GetHabit(_id: string) {
    const params = new HttpParams().set("_id", _id);
    return this.http
      .get<IHabit>(this.concatenateUrl("/habit"), {
        params,
      })
      .toPromise();
  }
  ListHabits(id: string) {
    const params = new HttpParams().set("userId", id);
    return this.http
      .get<IHabit[]>(this.concatenateUrl("/"), {
        params,
      })
      .toPromise();
  }
  ListUserPublications(id: string) {
    const params = new HttpParams().set("userId", id);
    return this.http.get(this.concatenateUrl("/user/publications"), {
      params,
    });
  }
  UserPublication(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.get(this.concatenateUrl("/user/publication/"), {
      params,
    });
  }
  UserHabit(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.get(this.concatenateUrl("/user/habit/"), {
      params,
    });
  }
  GetGraphicsRating(id: string, habitId: string) {
    const params = new HttpParams().set("userId", id).set("habitId", habitId);
    return this.http
      .get<{
        user_rating: {
          createdAt: string;
          publicationId: string;
          rate: number;
        }[];
      }>(this.concatenateUrl("/graphics/rating"), {
        params,
      })
      .toPromise();
  }

  CreatePublication(publication: any) {
    return this.http
      .post(this.concatenateUrl("/publication"), publication)
      .toPromise();
  }
  CreateUser(user: IUser) {
    return this.http.post<IUser>(this.concatenateUrl("/user"), user);
  }
  CreateHabit(habit: any) {
    return this.http.post(this.concatenateUrl("/habit"), habit).toPromise();
  }

  UpdatePublication(publication: any) {
    const params = new HttpParams().set("id", publication.id);
    return this.http.put(this.concatenateUrl("/publication"), publication, {
      params,
    });
  }
  UpdateUser(user: any) {
    const params = new HttpParams().set("id", user.id);
    return this.http.put(this.concatenateUrl("/user"), user, {
      params,
    });
  }
  UpdateHabit(habit: any) {
    const params = new HttpParams().set("id", habit.id);
    return this.http.put(this.concatenateUrl("/habit"), habit, {
      params,
    });
  }

  DeletePublication(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.delete(this.concatenateUrl("/publication"), {
      params,
    });
  }
  DeleteUser(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.delete(this.concatenateUrl("/user"), {
      params,
    });
  }
  DeleteHabit(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.delete(this.concatenateUrl("/habit"), {
      params,
    });
  }
}
