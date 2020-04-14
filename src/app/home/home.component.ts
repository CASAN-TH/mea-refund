import { Component, OnInit, ViewChild } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

declare var liff: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild("stepper") private myStepper: MatStepper;

  userProfile: any;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  acceptPolicy = false;
  myLiffId: string;

  constructor(private formBuilder: FormBuilder) {
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

        // if not existing then set form blank
        this.firstFormGroup.controls['lineUID'].setValue(this.userProfile.userId);
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
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      personalCardID: [
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
      postCode: ["", [Validators.required, , Validators.pattern(POSTCODE_PATTERN)]],
      provinceName: ["", Validators.required],
      districtName: ["", Validators.required],
      subDistrictName: ["", Validators.required],
    });
  }

  getExistingDataByName() {
    this.myStepper.next();
  }

  save() {
    this.myStepper.next();
  }

  closeWindows() {
    try {
      liff.closeWindow();
    } catch (error) {
      
    }
    
  }
  
}
