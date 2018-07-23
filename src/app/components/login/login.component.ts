import { Component, OnInit } from '@angular/core';
import {LoginModel} from '../../models/login.model';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {Router,RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  login: LoginModel = new LoginModel();
  loginForm: FormGroup;
  hide:true;

  constructor(private formBuilder: FormBuilder,private router : Router){ }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          'email':[this.login.email,
          [Validators.email,
            Validators.required
          ]],

          'password':[this.login.password,
          [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)]]
      });
  }


  employeeData = {
    email: '',
    password:'',
  };

 
  LoginDone(){
    this.router.navigate(['/tasks']).then(()=>{
        alert('Login Successfull You can create your tasks now!!!');
    });
  }



  onLoginSubmit(){
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.employeeData.email = this.loginForm.value.email;
      this.employeeData.password = this.loginForm.value.password;
    }
    var employeeData1 = this.employeeData;
    var db;
    const DB_NAME = 'TaskManagement1';
    var Version =1;
    // Use a long long for this value (don't use a float)

    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME,Version);
    
    req.onsuccess = function (evt) { 
      db = this.result;
      console.log(db);
      
      var version =  parseInt(db.version);
      
      console.log("openDb DONE"); 
      
    function getAllItems(callback){
        var transaction = db.transaction(["employees"]);
        var objectStore = transaction.objectStore("employees");
        var items = [];
    
        transaction.oncomplete = function(evt) {  
          callback(items);
        };
    
        var cursorRequest = objectStore.openCursor();
        console.log(cursorRequest);
        cursorRequest.onerror = function(error) {
                console.log(error);
        };
        
        cursorRequest.onsuccess = function(evt) {                    
            var cursor = evt.target.result;
              if (cursor) {
                  items.push(cursor.value);
                  cursor.continue();
              }
          }; 
      }
      
  getAllItems(function (items) {
        var len = items.length;
        var flag=0; 
        for (var i = 0; i < len; i += 1) {
          if(employeeData1.email == items[i].email && employeeData1.password == items[i].password ){
            flag= 1;
            
            break;
          }
        }
        if(flag==0)
         alert('Username or Password is incorrect!!!');
         });
        }
      
  
    req.onerror = function (evt:any) {
      console.error("openDb:", evt.target.errorCode);
      alert(evt.target.errorCode);
    };

    this.LoginDone();
  }

  
  


}
