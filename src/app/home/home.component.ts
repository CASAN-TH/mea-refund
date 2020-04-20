import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IplService } from "./ipl.service";
import { ValidatePID } from "./pid.validate";
import { ActivatedRoute } from "@angular/router";

declare var liff: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild("stepper") private myStepper: MatStepper;
  @ViewChild("firstNameThai") nameInput: ElementRef;

  userProfile: any;
  isExiting: boolean = false;

  postcodesList: any = [];
  temp: any = [];

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  acceptPolicy = false;
  myLiffId: string;
  _id: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private iplService: IplService
  ) {
    this.myLiffId = "1654060178-kB8gYpra";
  }

  async ngOnInit() {
    console.log("ngOnInit");
    // if (!this.myLiffId) {
    //   this.initializeApp();
    // } else {
    //   this.initializeLiff(this.myLiffId);
    // }
    alert(this.route.snapshot.data);
    let res = this.route.snapshot.data.items;
    this.isExiting = res ? true : false;
    this.initializeApp(res || "");
    let postCodeList: any = await this.iplService.getPostcodesList();
    this.temp = postCodeList.data;
    this.postcodesList = postCodeList.data;
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    // this.initializeLiff("");
  }

  initializeLiff(myLiffId) {
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
        // this.nameInput.nativeElement.focus();
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

  initializeApp(res: any) {
    let MOBILE_PATTERN = /^[0-9]{10,10}$/;
    let PERSONAL_CARDID_PATTERN = /^[0-9]{13,13}$/;
    let POSTCODE_PATTERN = /^[0-9]{5,5}$/;

    if (res.data) {
      this.firstFormGroup = this.formBuilder.group({
        firstNameThai: [
          res.data.personalInfo.firstNameThai || "",
          [Validators.required],
        ],
        lastNameThai: [
          res.data.personalInfo.lastNameThai || "",
          [Validators.required],
        ],
        citizenId: [res.data.personalInfo.citizenId || "", [ValidatePID]],
        mobileNumber: [
          res.data.directContact.forEach((element) => {
            if (element.method === "mobile") {
              return element.value;
            }
          }) || "",
          [Validators.required, Validators.pattern(MOBILE_PATTERN)],
        ],
        lineUID:
          res.data.directContact.forEach((element) => {
            if (element.method === "lineUserId") {
              return element.value;
            }
          }) || "",
      });
      this.secondFormGroup = this.formBuilder.group({
        addressPostalCode: [
          res.data.contactAddress.addressPostalCode || "",
          [Validators.required, , Validators.pattern(POSTCODE_PATTERN)],
        ],
        addressProvince: [
          res.data.contactAddress.addressProvince || "",
          Validators.required,
        ],
        addressDistrict: [
          res.data.contactAddress.addressDistrict || "",
          Validators.required,
        ],
        addressSubDistrict: [
          res.data.contactAddress.addressSubDistrict || "",
          Validators.required,
        ],
        addressStreet: [
          res.data.contactAddress.addressStreet || "",
          Validators.required,
        ],
        addressLine1: [
          res.data.contactAddress.addressLine1 || "",
          Validators.required,
        ],
        latitude: [res.data.contactAddress.latitude],
        longitude: [res.data.contactAddress.longitude],
      });
    } else {
      this.firstFormGroup = this.formBuilder.group({
        firstNameThai: ["", [Validators.required]],
        lastNameThai: ["", [Validators.required]],
        citizenId: ["", [ValidatePID]],
        mobileNumber: [
          "",
          [Validators.required, Validators.pattern(MOBILE_PATTERN)],
        ],
        lineUID: "",
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
        latitude: [""],
        longitude: [""],
      });
    }
  }

  bindingData(res: any) {
    if (res.data) {
      this.isExiting = true;
      this._id = res.data._id;
      //this.acceptPolicy = true;

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

      res.data.directContact.forEach((element) => {
        if (element.method === "mobile") {
          this.firstFormGroup.controls["mobileNumber"].setValue(element.value);
        }
      });

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
      this.secondFormGroup.controls["latitude"].setValue(
        res.data.contactAddress.latitude
      );
      this.secondFormGroup.controls["longitude"].setValue(
        res.data.contactAddress.longitude
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
            method: "lineUserId",
            value: this.firstFormGroup.get("lineUID").value,
          },
        ],
        contactAddress: this.secondFormGroup.value,
      };
      await this.iplService.updateIPL(body);
      // this.myStepper.next();
      this.closeWindows();
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
            method: "lineUserId",
            value: this.firstFormGroup.get("lineUID").value,
          },
        ],
        contactAddress: this.secondFormGroup.value,
      };
      await this.iplService.saveIPL(body);
      // this.myStepper.next();
      this.closeWindows();
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

  async close() {
    try {
      liff.closeWindow();
    } catch (error) {}
  }

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.postcode.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.postcodesList = temp;
    console.log(this.postcodesList);
  }

  getPosts(val) {
    //12150 | บึงคำพร้อย | อำเภอลำลูกกา | ปทุมธานี
    let viewValue = val.viewValue;
    let arrValue = val.viewValue.split("|");
    let subdistrict = arrValue[1].trim();
    let district = arrValue[2].trim();
    let province = arrValue[3].trim();

    this.secondFormGroup.controls["addressProvince"].setValue(province);
    this.secondFormGroup.controls["addressDistrict"].setValue(district);
    this.secondFormGroup.controls["addressSubDistrict"].setValue(subdistrict);
  }
}
