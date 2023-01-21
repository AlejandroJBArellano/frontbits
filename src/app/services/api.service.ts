import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";
import { IHabit } from "../interfaces/habits";
import { IUser } from "../interfaces/user";
import { AppCheckService } from "./app-check.service";

interface IHeaders {
  [header: string]: string | string[];
}
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private declare headers: IHeaders;

  constructor(
    private http: HttpClient,
    private appCheckService: AppCheckService
  ) {
    this.appCheckService.getToken().then(({ token }) => {
      this.headers = {
        "X-Firebase-AppCheck": token,
      };
    });
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
        headers: this.headers,
      })
      .toPromise();
  }

  GetHabit(_id: string) {
    const params = new HttpParams().set("_id", _id);
    return this.http
      .get<IHabit>(this.concatenateUrl("/habit"), {
        params,
        headers: this.headers,
      })
      .toPromise();
  }
  ListHabits(id: string, headers?: IHeaders) {
    const params = new HttpParams().set("userId", id);
    return this.http
      .get<IHabit[]>(this.concatenateUrl("/"), {
        params,
        headers: this.headers,
      })
      .toPromise();
  }
  ListUserPublications(id: string) {
    const params = new HttpParams().set("userId", id);
    return this.http.get(this.concatenateUrl("/user/publications"), {
      params,
      headers: this.headers,
    });
  }
  UserPublication(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.get(this.concatenateUrl("/user/publication/"), {
      params,
      headers: this.headers,
    });
  }
  UserHabit(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.get(this.concatenateUrl("/user/habit/"), {
      params,
      headers: this.headers,
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
        headers: this.headers,
      })
      .toPromise();
  }

  CreatePublication(publication: any, headers?: IHeaders) {
    return this.http
      .post(this.concatenateUrl("/publication"), publication, {
        headers: this.headers,
      })
      .toPromise();
  }
  CreateUser(user: IUser) {
    return this.http.post<IUser>(this.concatenateUrl("/user"), user, {
      headers: this.headers,
    });
  }
  CreateHabit(habit: any, headers?: IHeaders) {
    return this.http
      .post(this.concatenateUrl("/habit"), habit, { headers: this.headers })
      .toPromise();
  }

  UpdatePublication(publication: any) {
    const params = new HttpParams().set("id", publication.id);
    return this.http.put(this.concatenateUrl("/publication"), publication, {
      params,
      headers: this.headers,
    });
  }
  UpdateUser(user: any) {
    const params = new HttpParams().set("id", user.id);
    return this.http.put(this.concatenateUrl("/user"), user, {
      params,
      headers: this.headers,
    });
  }
  UpdateHabit(habit: any) {
    const params = new HttpParams().set("id", habit.id);
    return this.http.put(this.concatenateUrl("/habit"), habit, {
      params,
      headers: this.headers,
    });
  }

  DeletePublication(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.delete(this.concatenateUrl("/publication"), {
      params,
      headers: this.headers,
    });
  }
  DeleteUser(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.delete(this.concatenateUrl("/user"), {
      params,
      headers: this.headers,
    });
  }
  DeleteHabit(id: string) {
    const params = new HttpParams().set("id", id);
    return this.http.delete(this.concatenateUrl("/habit"), {
      params,
      headers: this.headers,
    });
  }
}
