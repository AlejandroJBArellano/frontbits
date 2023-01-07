import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { AppCheck, AppCheckTokenResult, getToken, initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppCheckService {
  declare app: FirebaseApp;
  declare appCheck: AppCheck;
  constructor() {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "399371E8-01A9-45D1-8336-5C17A000A559";

    this.app = initializeApp(environment.firebase);

    // Create a ReCaptchaEnterpriseProvider instance using reCAPTCHA Enterprise.
    this.appCheck = initializeAppCheck(this.app, {
      provider: new ReCaptchaEnterpriseProvider(environment.reCaptchaProvider),
      isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
    });
  }

  async getToken(): Promise<AppCheckTokenResult | undefined> {
    try {
      const appCheckTokenResponse = await getToken(this.appCheck);
      return appCheckTokenResponse;
    } catch (err) {
      console.log(err)
      return err;
    }
  }
}
