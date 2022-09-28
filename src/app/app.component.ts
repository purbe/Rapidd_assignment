import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  users: any;
  pieData:any;
  
  constructor(private http: HttpClient) {
    // console.log(this.users);
  }
  
  ngOnInit(): void {
    this.http
      .get(
        'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ=='
      )
      .subscribe((data: any) => this.cal(data)),
      (err: HttpErrorResponse) => {
        console.log(err.message);
      };
  }

  cal(data: any) {
    for (let i = 0; i < data.length; i++) {
      var then = data[i].StarTimeUtc;
      var now = data[i].EndTimeUtc;
      
      var ms = moment(now, 'YYYY-MM-DDTHH:mm:ss').diff(
        moment(then, 'YYYY-MM-DDTHH:mm:ss')
      );
      var d = moment.duration(ms);
      var s = Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
      data[i]['totaltime'] = s;
      data[i]['time'] = parseInt(s);
    }
    this.users = data;
    this.pieData = [
      {
        'hoursLabel' : "Worked Hours",
        'EmployeeName' : data[1]['EmployeeName'],
        'time' : data[1]['time'],
      },
      {
        'hoursLabel' : 'Remaining Hours', 
        'time' : 24-data[1]['time'],
      }
    ]
  }
  customizeLabel(arg:any) {
    return `${arg.valueText} (${arg.percentText})`;
  }
}
