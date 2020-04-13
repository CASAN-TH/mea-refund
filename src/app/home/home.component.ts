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
    liff
      .init({
        liffId: myLiffId,
      })
      .then(() => {
        // start to use LIFF's api
        this.userProfile = liff.getProfile();
        this.initializeApp();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  initializeApp() {
    let MOBILE_PATTERN = /^[0-9]{10,10}$/;
    let PERSONAL_CARDID_PATTERN = /^[0-9]{13,13}$/;

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
      postCode: ["", Validators.required],
      provinceName: ["", Validators.required],
      districtName: ["", Validators.required],
      subDistrictName: ["", Validators.required],
    });
  }

  checkExitingData() {}

  changeForm() {
    this.myStepper.next();
  }
}
