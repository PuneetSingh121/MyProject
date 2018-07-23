import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {CreateTasksModel} from '../../models/createTasks.model';
import {Router,RouterModule} from '@angular/router';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  task: CreateTasksModel = new CreateTasksModel();
  taskForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private router : Router) { }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({

      'ecode': [this.task.ecode,
      [Validators.required]
    ],
    'tname':[this.task.tname,
      [Validators.required]],

    'start':[this.task.tname,
          [Validators.required]],
    'end':[this.task.tname,
            [Validators.required]],
    'description':[this.task.tname,
              [Validators.required]]

  });
  }
  
  employeeData = {
    tname: '',
    ecode: '',
    start:'',
    end:'',
    description:''
  };

  CreateTaskDone(){
    this.router.navigate(['/tasks']).then(()=>{
      alert('Task Created Successfully Now You can edit or Delete your');
  });
  }

  onTaskSubmit(){
    if (this.taskForm.dirty && this.taskForm.valid) {
      this.employeeData.tname = this.taskForm.value.tname;
      this.employeeData.ecode = this.taskForm.value.ecode;
      this.employeeData.start = this.taskForm.value.start;
      this.employeeData.end = this.taskForm.value.end;
      this.employeeData.description = this.taskForm.value.description;
    }

    if(window.indexedDB){
      console.log('IndexedDB is supported');
      }

  
    const DB_NAME = 'TaskManagement1';
    // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = 'CreatedTasks';

    var db;

    var employeeData1 = this.employeeData;

    
      console.log("openDb ...");

      var req = indexedDB.open(DB_NAME);
      console.log(req);
      req.onsuccess = function (evt) {
        db = this.result;

        var version =  parseInt(db.version);

        console.log("openDb DONE");
        addPublication(employeeData1.tname ,employeeData1.ecode,employeeData1.start,employeeData1.end,employeeData1.description);
      };

      req.onerror = function (evt:any) {
        console.error("openDb:", evt.target.errorCode);
        alert(evt.target.errorCode);
      };
      
      req.onupgradeneeded = function (evt:any) {
        console.log("openDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
          DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

        store.createIndex('tname', 'tname', { unique: false });
        store.createIndex('ecode', 'ecode', { unique: false });
        store.createIndex('start', 'start', { unique: false });
        store.createIndex('end', 'end', { unique: false });
        store.createIndex('description', 'description', { unique: false });
      };

      function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
      }
      
  
      function addPublication(tname, ecode, start,end,description) {
        var obj = { tname:tname, ecode: ecode, start: start, end:end, description:description};
       
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
    
      this.CreateTaskDone();
  }

}
