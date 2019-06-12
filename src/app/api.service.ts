import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers = {
    "Content-Type": "application/json",
    "Authorization": "null"
  }

  constructor(private http: HttpClient) { }

  register(data){
    return this.http.post('http://192.168.10.37:4000/api/users/register', data, {headers:this.headers})
  }

  logIn(data1){
    return this.http.post('http://192.168.10.37:4000/api/users/login', data1, {headers: this.headers})
  }

  getTasks(){
    let obj = localStorage.getItem('myToken');
    this.headers.Authorization=obj;
    //console.log(this.headers);
    return this.http.get('http://192.168.10.37:4000/api/tasks', {headers: this.headers})
  }

  postTask(data){
    let obj = localStorage.getItem('myToken');
    this.headers.Authorization=obj;
//console.log(this.headers);
    return this.http.post('http://192.168.10.37:4000/api/tasks',data ,{headers: this.headers})
  }

  deleteTask(id){
    return this.http.delete('http://192.168.10.37:4000/api/tasks/'+id,{headers: this.headers})
  }

  sendTask(data, email){
    return this.http.post('http://192.168.10.37:4000/api/tasks/collab/'+email, data ,{headers: this.headers})
  }
}
