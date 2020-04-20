import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
declare var liff: any;

const api_url = environment.apiUrl;


@Injectable({
  providedIn: "root",
})
export class IplService {
  constructor(private http: HttpClient) {}

  resolve(): Observable<any> | Promise<any> | any {
    liff.init(
      async (data) => {
        let userProfile = await liff.getProfile();
        // return this.queryIPL({ lineUserId: userProfile.userId })
        return this.http.post(`${api_url}/api/involvedpartys/query`, { lineUserId: userProfile.userId })
      },
      (err) => {
        // alert(JSON.stringify(err));
        return;
      }
    );
  }

  getPostcodesList() {
    return this.http.get(`${api_url}/api/postcodes`).toPromise();
  }

  queryIPL(body) {
    return this.http.post(`${api_url}/api/involvedpartys/query`, body).toPromise();
  }

  saveIPL(body) {
    return this.http.post(`${api_url}/api/involvedpartys`, body).toPromise();
  }

  updateIPL(body) {
    return this.http.put(`${api_url}/api/involvedpartys/${body._id}`, body).toPromise();
  }
}
