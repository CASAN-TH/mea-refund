import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  acceptCheckCardId = false;
  cardId: any;

  billData: any;
  totalAmount: Number;
  checkNoCardId = false;
  formCheckSecond = false;

  secondFormData: any = {};

  waysData: Array<any>;
  waySelected: any = {};

  constructor() { }

  ngOnInit() {
    this.waysData = [
      {
        name: "บัญชีพร้อมเพย์",
        checked: false
      },
      {
        name: "โอนเงินเข้าบัญชี",
        checked: false
      }
    ];
  };

  checkCardId() {
    if (this.acceptCheckCardId === true) {
      // this.cardId = this.cardId.padStart(13, '0');
      const noData = true // for mockup no service
      const res = noData ? undefined : {
        data: {
          items: [
            {
              "refno": "5303000001",
              "refdate": "15/03/2553",
              "contactname": "นายหลักประกัน การใช้ไฟฟ้า",
              "contacttype": "waitapprove",
              "amount": 2000
            },
            {
              "refno": "5502001001",
              "refdate": "14/02/2554",
              "contactname": "นายการใช้ไฟฟ้า ฉบับใหม่",
              "contacttype": "waitapprove",
              "amount": 300
            }
          ]
        }
      };

      if (res) {
        this.billData = res.data
        // console.log(this.billData)
        let total = 0

        this.billData.items.forEach(el => {
          total += el.amount;
        });

        this.totalAmount = total
      } else {
        this.checkNoCardId = true
      }
    };
  };

  changeForm() {
    this.formCheckSecond = true
  }

  applyFilter(event: any) {
    // console.log(this.secondFormData)
    if (this.secondFormData.ca_ref_no1.length === 9 && this.secondFormData.installation.length === 8) {
      try {
        const noData = false // for mockup no service
        const res = noData ? undefined : {
          data: {
            items: [
              {
                "refno": "5303000001",
                "refdate": "15/03/2553",
                "contactname": "นายหลักประกัน การใช้ไฟฟ้า",
                "contacttype": "waitapprove",
                "amount": 2000
              },
              {
                "refno": "5502001001",
                "refdate": "14/02/2554",
                "contactname": "นายการใช้ไฟฟ้า ฉบับใหม่",
                "contacttype": "waitapprove",
                "amount": 300
              }
            ]
          }
        };

        if (res) {
          this.billData = res.data
        };
      } catch (error) {
        throw (error)
      };
    };
  };

  selectWay(idx, item) {
    for (let i = 0; i < this.waysData.length; i++) {
      const data = this.waysData[i];
      data.checked = false
    }
    this.waysData[idx].checked === true;

    this.waySelected = item
    // console.log(this.waySelected)
  }

}
