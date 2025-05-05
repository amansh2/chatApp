import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http :HttpClient) { }

  authenticateUser(data){
    return this.http.post('https://chatapp-v9pa.onrender.com/api/authenticate', data);
  }
  getAllUsers(){
    return this.http.get('https://chatapp-v9pa.onrender.com/api/getAllUsers');
  }
}
