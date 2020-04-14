import { Component, OnInit, ViewChild } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IplService } from "./ipl.service";

declare var liff: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild("stepper") private myStepper: MatStepper;

  userProfile: any;
  isExiting: boolean = false;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  acceptPolicy = false;
  myLiffId: string;
  _id: any;

  constructor(
    private formBuilder: FormBuilder,
    private iplService: IplService
  ) {
    this.myLiffId = "1654060178-kB8gYpra";
  }

  ngOnInit() {
    if (!this.myLiffId) {
      this.initializeApp();
    } else {
      this.initializeLiff(this.myLiffId);
    }
  }

  initializeLiff(myLiffId) {
    this.initializeApp();
    liff.init(
      async (data) => {
        this.userProfile = await liff.getProfile();
        // get user information data
        // if existing then set form user information data (firstFormGroup, secondFormGroup)
        // this.getExistingDataByLineUserId(this.userProfile.userId)
        let res = await this.iplService.queryIPL({
          lineUserId: this.userProfile.userId,
        });
        console.log(res);

        this.bindingData(res);
        // if not existing then set form blank
        this.firstFormGroup.controls["lineUID"].setValue(
          this.userProfile.userId
        );
      },
      (err) => {
        // alert(JSON.stringify(err));
      }
    );
  }

  initializeApp() {
    let MOBILE_PATTERN = /^[0-9]{10,10}$/;
    let PERSONAL_CARDID_PATTERN = /^[0-9]{13,13}$/;
    let POSTCODE_PATTERN = /^[0-9]{5,5}$/;

    this.firstFormGroup = this.formBuilder.group({
      firstNameThai: ["", [Validators.required]],
      lastNameThai: ["", [Validators.required]],
      citizenId: [
        "",
        [Validators.required, Validators.pattern(PERSONAL_CARDID_PATTERN)],
      ],
      mobileNumber: [
        "",
        [Validators.required, Validators.pattern(MOBILE_PATTERN)],
      ],
      lineUID: this.userProfile ? this.userProfile.userId : null,
    });
    this.secondFormGroup = this.formBuilder.group({
      addressPostalCode: [
        "",
        [Validators.required, , Validators.pattern(POSTCODE_PATTERN)],
      ],
      addressProvince: ["", Validators.required],
      addressDistrict: ["", Validators.required],
      addressSubDistrict: ["", Validators.required],
      addressStreet: ["", Validators.required],
      addressLine1: ["", Validators.required],
    });
  }

  bindingData(res: any) {
    if (res.data) {
      this.isExiting = true;
      this._id = res.data._id;

      if (res.data.personalInfo.firstNameThai)
        this.firstFormGroup.controls["firstNameThai"].setValue(
          res.data.personalInfo.firstNameThai
        );

      if (res.data.personalInfo.lastNameThai)
        this.firstFormGroup.controls["lastNameThai"].setValue(
          res.data.personalInfo.lastNameThai
        );

      if (res.data.personalInfo.citizenId)
        this.firstFormGroup.controls["citizenId"].setValue(
          res.data.personalInfo.citizenId
        );

      this.secondFormGroup.controls["addressPostalCode"].setValue(
        res.data.contactAddress.addressPostalCode
      );
      this.secondFormGroup.controls["addressProvince"].setValue(
        res.data.contactAddress.addressProvince
      );
      this.secondFormGroup.controls["addressDistrict"].setValue(
        res.data.contactAddress.addressDistrict
      );
      this.secondFormGroup.controls["addressSubDistrict"].setValue(
        res.data.contactAddress.addressSubDistrict
      );
      this.secondFormGroup.controls["addressStreet"].setValue(
        res.data.contactAddress.addressStreet
      );
      this.secondFormGroup.controls["addressLine1"].setValue(
        res.data.contactAddress.addressLine1
      );
    }
  }

  async getExistingDataByName() {
    if (!this.isExiting) {
      let res: any = await this.iplService.queryIPL({
        firstNameThai: this.firstFormGroup.get("firstNameThai").value,
        lastNameThai: this.firstFormGroup.get("lastNameThai").value,
        mobileNumber: this.firstFormGroup.get("mobileNumber").value,
      });
      this.bindingData(res);
      console.log("ssss");
      this.myStepper.next();
    } else {
      this.myStepper.next();
    }
  }

  async save() {
    if (this._id) {
      let body = {
        _id: this._id,
        personalInfo: {
          firstNameThai: this.firstFormGroup.get("firstNameThai").value,
          lastNameThai: this.firstFormGroup.get("lastNameThai").value,
          citizenId: this.firstFormGroup.get("citizenId").value,
        },
        directContact: [
          {
            method: "mobile",
            value: this.firstFormGroup.get("mobileNumber").value,
          },
          {
            method: "lineUID",
            value: this.firstFormGroup.get("lineUID").value,
          },
        ],
        contactAddress: this.secondFormGroup.value
        // contactAddress: {
        //   addressLine1: "บ้านเลขที่ 78/1",
        //   addressStreet: "วงแหวนลำลูกกา",
        //   addressSubDistrict: "บึงคำพร้อย",
        //   addressDistrict: "ลำลูกกา",
        //   addressProvince: "ปทุมธานี",
        //   addressCountry: "ไทย",
        //   addressPostalCode: "12130"
        // }
      };
      await this.iplService.updateIPL(body);
      this.myStepper.next();
    } else {
      let body = {
        personalInfo: {
          firstNameThai: this.firstFormGroup.get("firstNameThai").value,
          lastNameThai: this.firstFormGroup.get("lastNameThai").value,
          citizenId: this.firstFormGroup.get("citizenId").value,
        },
        directContact: [
          {
            method: "mobile",
            value: this.firstFormGroup.get("mobileNumber").value,
          },
          {
            method: "lineUID",
            value: this.firstFormGroup.get("lineUID").value,
          },
        ],
        contactAddress: this.secondFormGroup.value
      };
      await this.iplService.saveIPL(body);
      this.myStepper.next();
    }
  }

  async closeWindows() {
    try {
      const successMsgs = await liff.sendMessages([
        {
          type: "text",
          text: "ยืนยันการลงทะเบียน",
        },
      ]);
      liff.closeWindow();
    } catch (error) {}
  }
}
