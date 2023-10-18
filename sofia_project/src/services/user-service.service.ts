import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonServices} from "../app/CommonServices";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseUrl = ''

  constructor(private _http: HttpClient, private _common: CommonServices) {
    this.baseUrl = this._common.BASE_URL + ''
  }

  getUser(id: string) {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}users/${id}`, headers)
  }

  saveUser(body: {
    name: string | null,
    lastname: string | null,
    age: string | null,
    email: string | null,
    id_School: string | null,
    studentCode: string | null,
    firstQuestion: string | null,
    secondQuestion: string | null,
    thirdQuestion: string | null,
    password: string | null
  }) {
    return this._http.post(`${this.baseUrl}users`, body)
  }

  login(body: { password: string | null; email: string | null; id_School: string | null }) {
    return this._http.post(`${this.baseUrl}login`, body)
  }

  verifyAnswers(email: string | null, firstQuestion: string | null, secondQuestion: string | null, thirdQuestion: string | null) {
    const body = {
      email: email,
      firstQuestion: firstQuestion,
      secondQuestion: secondQuestion,
      thirdQuestion: thirdQuestion
    };

    return this._http.post(`${this.baseUrl}/users/check-security-answer`, body);
  }

  searchEmail(email: string) {
    return this._http.post<any>(`${this.baseUrl}users/${email}`, {email});
  }

  resetPassword(email: string | null, newPassword: string | null) {
    const body = {email, newPassword};
    return this._http.post(`${this.baseUrl}/users/reset-password`, body);
  }
}
