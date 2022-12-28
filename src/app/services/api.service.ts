import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { IHabit } from "../interfaces/habits";
import { IUser } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

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
