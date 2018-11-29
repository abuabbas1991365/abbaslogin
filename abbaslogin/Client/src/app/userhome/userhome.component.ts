import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent implements OnInit {

  username:String='';
  datahoi=[];
  constructor(private _user:UserService, private _router:Router) { 
    this._user.user()
    .subscribe(
      data=>this.addName(data),
      error=>this._router.navigate(['/login'])
    )
  }

  addName(data){
  	alert(JSON.stringify(data));
  	
    this.username = data.username;
    this.listdate();
  }
  listdate(){
    this._user.listout()
    .subscribe(
      data=>{
        console.log(data);
        alert(JSON.stringify(data));
        this.passvalue(data);
      },
      error=>console.error(error)
    )
  }
  passvalue(data){
    this.datahoi=data;
   }
  ngOnInit() {
  }

  logout(){
    this._user.logout()
    .subscribe(
      data=>{console.log(data);this._router.navigate(['/login'])},
      error=>console.error(error)
    )
  }

}
