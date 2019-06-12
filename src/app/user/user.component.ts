import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  email;
  username;
  password;
  password2;
  task_name;
  name;
  _id=null;

  tasks=[];

  logInForm = false;
  signUpForm = false;
  userButtons = true;
  taskarea = false;
  showLogout = false;

  constructor(private api: ApiService) { }

  ngOnInit() {

    if(localStorage.getItem('myToken')){
      this.userButtons = false;
      this.taskarea = true;
      this.showLogout = true;
      this.displayTasks();
    }
  }

    logIn(){
      const data1 = {
        email: this.email,
        password: this.password
      }
      this.api.logIn(data1).subscribe(response=>{
        const res= JSON.parse(JSON.stringify(response));
  //      console.log(res);
        if(res.success){
          this.name=res.data.username;
          alert(res.message);
          this.logInForm = false;
          this.userButtons = false;
          this.taskarea = true;
          this.showLogout = true;
          let key = 'myToken';
          localStorage.setItem(key, res.data.token );
          this.displayTasks();
        }else{
          alert(res.message);
        }
      })
    }

  signUp(){
    const data = {
      email: this.email,
      username: this.username,
      password: this.password,
      password2: this.password2
    }
    this.api.register(data).subscribe(response=>{
      const res= JSON.parse(JSON.stringify(response));

      if(res.success){
        alert(res.message);
        this.signUpForm = false;
        this.logInForm = true;
      }else{
        alert(res.message);
      }
    })
  }

  displayTasks(){
    this.tasks=[];
    this.api.getTasks().subscribe(response=>{
      const res= JSON.parse(JSON.stringify(response));
  //    console.log(res);
      if(res.success){
        for (var i = 0; i < res.data.length; i++) {
          this.tasks.push({name: res.data[i].task_name, id:res.data[i]._id});
        }
        if(this.tasks.length) document.getElementById("taskLength").innerHTML = this.tasks.length.toString();
        else document.getElementById("taskLength").innerHTML = "0";
    //console.log('tasks--->',this.tasks);
      }
    });
  }

  submitTask(){
    if(this.task_name==null){
      alert('please enter!');
    }
    else{
    let data;
      if(this._id){
        data = {
          _id:this._id,
          task_name: this.task_name
        }
      }else{
        data = {
          task_name: this.task_name
        }
      }

      this.api.postTask(data).subscribe(response=>{
        const res= JSON.parse(JSON.stringify(response));
        if(res.success){
      //    alert(res.message);
          this.displayTasks();
          this.task_name=null;
          this._id=null;
        }else{
          alert(res.message);
        }
      })
    }
  }

  updateTask(id, name){
    const data = {
      _id:id,
      task_name: name
    }
    this._id=id;
  //  document.getElementById("taskname").value = name;
    (<HTMLInputElement>document.getElementById("taskname")).value = name;

  }

  removeTask(id){
      this.api.deleteTask(id).subscribe(response=>{
        const res= JSON.parse(JSON.stringify(response));
        if(res.success){
          this.displayTasks();
          this.task_name=null;
        }else{
          alert(res.message);
        }
      })
    }

  forwardTask(name){
    const email= prompt("Enter email..");
    console.log(email);
    const data = {
      tasks: name
    }
    if(email!=null){
      this.api.sendTask(data, email).subscribe(response=>{
        const res= JSON.parse(JSON.stringify(response));
        if(res.success){
          alert('Send to '+ email);
        }else{
          alert(res.message);
        }
      })
    }
  }

  btn(obj){
    if(obj=='logInBtn'){
      this.signUpForm=false;
      this.logInForm=!this.logInForm;
    }
    else if(obj=='logoutBtn'){
      localStorage.clear();
    }
    else{
      this.logInForm=false;
      this.signUpForm=!this.signUpForm;
    }
  }

}
