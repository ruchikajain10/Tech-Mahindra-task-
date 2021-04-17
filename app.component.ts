import { EnrollService } from './enroll.service';
import { Orderer } from './orderer';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  [x: string]: any;
  title = 'task1';
  orderType = false;
  data = ['','Kafka','etcdraft'];
  
  orderTypeContain = [];
  numbers = [];
  numbers1 = [];
  numbers2 = [[],[],[],[],[],[],[],[],[],[]];
  numbers3 = [];
  userForm: any;
  
  

  updateValues(order){
    if(order != ''){
      this.orderType = true 
    }
    if(order == 'Kafka'){
      this.orderTypeContain = [1,2,3,4,5,6,7,8,9,10];
    }else{
      this.orderTypeContain = [3,5,7,9];
    } 
  }


  addTextbox(num){
    this.numbers = [];
    for(let i = 0;i<num;i++){
      this.numbers.push(i);
    }
    console.log(this.numbers)
  }
  addbox(num1){
    this.numbers1 = [];
    for(let i = 0;i<num1;i++){
      this.numbers1.push(i);
    }
    console.log(this.numbers1)
  }

  addbox2(num1){
    this.numbers3 = [];
    for(let i = 0;i<num1;i++){
      this.numbers3.push(i);
    }
    console.log(this.numbers3)
  }


  addbox1(num1,num2){
    this.numbers2[num1] = [];
    for(let i = 0;i<num2 ;i++){
      
      this.numbers2[num1].push(i);
    }
    console.log(this.numbers2)
  }
  ordererModule = new Orderer('',0,[''],0,[''],[''],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],0,[],[[],[],[],[],[],[],[],[],[],[]],[[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[]]])
  constructor(private _enrollService : EnrollService){}
  submitted = false;
  

  onSubmit(){
    this.submitted=true;
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userForm.value, null, 4));
    //console.log(this.ordererModule);
    this._enrollService.enroll(this.ordererModule)
      .subscribe(
        data => console.log("Success", data),
        error => console.error("Error",error)
      )

  }
  
}