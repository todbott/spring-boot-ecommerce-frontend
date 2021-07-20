import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public errorMessage: string;
  public form: FormGroup;
  private loader;
  public showPassword = false;
  public passwordInputType = 'password';
  environment: { production: boolean; apiUrl: string; username: any; token: any; items: any; itemsAsKeyValue: any[]; inCart: any[]; loggedIn: boolean; };

  constructor(
      private router: Router,
      private loadingController: LoadingController,
      private alertCtrl: AlertController,
      public platform: Platform,
      public appService: AppServiceService,
  ) { }


  ngOnInit(): void {

    this.environment = environment
      

      this.form = new FormGroup({
          email: new FormControl(null, [
              Validators.required,
          ]),
          password: new FormControl(null, [
              Validators.required
          ])
      });
  }

  async IonViewWillEnter() {
    this.environment = environment
  }



  async submit() {
    this.loader = await this.loadingController.create({
        message: 'Please wait',
    });
    this.loader.present();
      this.errorMessage = '';
      if (this.form.valid) {
          const loginInfo = {
              name: this.form.value.email,
              password: this.form.value.password
          };
    
          (await this.appService.tryLogin(loginInfo)).toPromise()
          .then(res => {
            var token = res.headers.get('token')
            this.loader.dismiss();
            environment.loggedIn = true;
            environment.username = this.form.value.email;
            environment.token = token;
            this.router.navigateByUrl('store')


      }).catch(err => this.catchError())
  }
}

  catchError() {
    this.errorMessage = "invalid credentials"
    this.loader.dismiss();
  }

  isShowPassword(): void {
      this.showPassword = !this.showPassword;
      this.passwordInputType = this.showPassword ? 'text' : 'password';
  }

  async showAlert(message) {
      const alert = await this.alertCtrl.create({
          message: message,
          buttons: [
              {
                  text: 'OK',
                  role: 'ok',
              }
          ]
      });
      await alert.present();
  }
}


