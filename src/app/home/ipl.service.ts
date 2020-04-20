import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
declare var liff: any;

const api_url = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class IplService {
  constructor(private http: HttpClient) {}

  resolve(): Observable<any> | Promise<any> | any {
    // liff.init(
    //   async (data) => {
    //     let userProfile = await liff.getProfile();
    //     alert(userProfile.userId);
    //     this.http
    //       .post(`${api_url}/api/involvedpartys/query`, {
    //         lineUserId: userProfile.userId,
    //       })
    //       .subscribe((res) => {
    //         alert(JSON.stringify(res));
    //         return res;
    //       });
    //   },
    //   (err) => {
    //     // alert(JSON.stringify(err));
    //     return;
    //   }
    // );
    return new Promise((resolve, reject) => {
      liff.init(
        async (data) => {
          let user = await liff.getProfile();
          this.http
            .post(`${api_url}/api/involvedpartys/query`, {
              lineUserId: user.userId,
            })
            .subscribe(
              (res: any) => {
                alert(JSON.stringify(res));
                resolve(res);
              },
              (err) => {
                reject(err);
              }
            );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getPostcodesList() {
    return this.http.get(`${api_url}/api/postcodes`).toPromise();
  }

  queryIPL(body) {
    return this.http
      .post(`${api_url}/api/involvedpartys/query`, body)
      .toPromise();
  }

  saveIPL(body) {
    return this.http.post(`${api_url}/api/involvedpartys`, body).toPromise();
  }

  updateIPL(body) {
    return this.http
      .put(`${api_url}/api/involvedpartys/${body._id}`, body)
      .toPromise();
  }
}
