import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { IHabit } from "../interfaces/habits";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  concatenateUrl(url: string) {
    return `${environment.api}${url}`;
  }

  GetActualUserId() {
    return "631ab5ad5c606381baf74b34";
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
      .get(this.concatenateUrl("/graphics/rating"), {
        params,
      })
      .toPromise();
  }

  CreatePublication(publication: any) {
    return this.http
      .post(this.concatenateUrl("/publication"), publication)
      .toPromise();
  }
  CreateUser(user: any) {
    return this.http.post(this.concatenateUrl("/user"), user);
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
