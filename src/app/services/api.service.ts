import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IHabits } from '../interfaces/habits';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  concatenateUrl(url: string){
    return `${environment.api}${url}`;
  }

  ListHabits(id: string) {
    const params = new HttpParams().set('userId', id);
    return this.http.get<IHabits[]>(this.concatenateUrl("/"), {
      params
    }).toPromise();
  }
  ListUserPublications(id: string) {
    const params = new HttpParams().set('userId', id);
    return this.http.get(this.concatenateUrl('/user/publications'), {
      params
    });
  }
  UserPublication(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.get(this.concatenateUrl('/user/publication/'), {
      params
    });
  }
  UserHabit(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.get(this.concatenateUrl('/user/habit/'), {
      params
    });
  }
  GetGraphicsRating(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.get(this.concatenateUrl('/user/graphics/'), {
      params
    });
  }

  CreatePublication(publication: any){
    return this.http.post(this.concatenateUrl('/publication/'), publication);
  }
  CreateUser(user: any){
    return this.http.post(this.concatenateUrl('/user'), user);
  }
  CreateHabit(habit: any){
    return this.http.post(this.concatenateUrl('/habit'), habit);
  }

  UpdatePublication(publication: any){
    const params = new HttpParams().set('id', publication.id);
    return this.http.put(this.concatenateUrl('/publication'), publication, {
      params
    });
  }
  UpdateUser(user: any){
    const params = new HttpParams().set('id', user.id);
    return this.http.put(this.concatenateUrl('/user'), user, {
      params
    });
  }
  UpdateHabit(habit: any){
    const params = new HttpParams().set('id', habit.id);
    return this.http.put(this.concatenateUrl('/habit'), habit, {
      params
    });
  }

  DeletePublication(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.concatenateUrl('/publication'), {
      params
    });
  }
  DeleteUser(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.concatenateUrl('/user'), {
      params
    });
  }
  DeleteHabit(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.concatenateUrl('/habit'), {
      params
    });
  }
}
