import { Component, OnInit } from '@angular/core';
import {RegisterModel} from '../../models/register.model';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {ValidationService} from '../register/register.validator';
import {MatSnackBar,MatSnackBarModule,} from '@angular/material';
import {Router,RouterModule} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  user: RegisterModel = new RegisterModel();
  registerForm: FormGroup;
  hide:true;
  constructor(private formBuilder: FormBuilder,private router : Router){
    
   }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({

          'ecode': [this.user.ecode,
          [Validators.required]
        ],

          'email':[this.user.email,
          [Validators.email,
            Validators.required]
            ],

          'password':[this.user.password,
          [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)]]
      });
  }

  employeeData = {
    ecode: '',
    email: '',
    password:'',
  };

  RegisterDone(){
    this.router.navigate(['/login']).then(()=>{
        alert('Registration Done Successfully now you can Login With your email and password!!');
    });
  }

  onRegisterSubmit(){
    if (this.registerForm.dirty && this.registerForm.valid) {
      this.employeeData.ecode = this.registerForm.value.ecode;
      this.employeeData.email = this.registerForm.value.email;
      this.employeeData.password = this.registerForm.value.password;
    }

    if(window.indexedDB){
      console.log('IndexedDB is supported');
      }

  
    const DB_NAME = 'TaskManagement1';
    // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = 'employees';

    var db;
    var employeeData1 = this.employeeData;
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME);
      console.log(req);
      
    req.onsuccess = function (evt) {
        db = this.result;
        var version =  parseInt(db.version);
        
        console.log("openDb DONE");
        addPublication(employeeData1.ecode ,employeeData1.email,employeeData1.password);
      };



    req.onerror = function (evt:any) {
        console.error("openDb:", evt.target.errorCode);
        alert(evt.target.errorCode);
      };
      
      req.onupgradeneeded = function (evt:any) {
        console.log("openDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
          DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

        store.createIndex('code', 'code', { unique: true });
        store.createIndex('email', 'email', { unique: false });
        store.createIndex('password', 'password', { unique: false });
      };
      

    function getObjectStore(store_name, mode) {
      var tx = db.transaction(store_name, mode);
      return tx.objectStore(store_name);
    }
    

    function addPublication(ecode, email, password) {
      var obj = { ecode:ecode, email: email, password: password };
     
      var store = getObjectStore(DB_STORE_NAME, 'readwrite');
      var req;
      
      req = store.add(obj);
      
      req.onsuccess = function (evt) {
        console.log("Insertion in DB successful");
        db.close();
      };

      req.onerror = function() {
        console.error("addPublication error", this.error);
        alert(this.error);
      };
    }
  
    this.RegisterDone();  
  }

  
 
}
