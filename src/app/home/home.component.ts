import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cardId: any;

  acceptCheckCardId = false;

  waysData = [
    {
      name: "บัญชีพร้อมเพย์",
      checked: false
    },
    {
      name: "โอนเงินเข้าบัญชี",
      checked: false
    }
  ];

  waySelected: any = {};

  constructor() { }

  ngOnInit() {
  }

  selectWay(idx, item) {
    for (let i = 0; i < this.waysData.length; i++) {
      const data = this.waysData[i];
      data.checked = false
    }
    this.waysData[idx].checked === true;

    this.waySelected = item
    console.log(this.waySelected)
  }

  fillCardId() {
    if (this.acceptCheckCardId === true) this.cardId = this.cardId.padStart(13, '0');
  }

}
