import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppServiceService } from './app-service.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Login', url: '/login', icon: 'paper-plane' },
    { title: 'Store', url: '/store', icon: 'mail' },
    { title: 'Search', url: '/search', icon: 'paper-plane' },
    { title: 'My cart', url: '/my-cart', icon: 'heart' },
    { title: 'My orders', url: '/my-orders', icon: 'paper-plane' },
  ];

  private loader;


  constructor(
    private loadingCtrl: LoadingController,
    private appService: AppServiceService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  environment: typeof environment;

  async ngOnInit() {
    // this runs every time the app is started up.
    // put the environment variable in a place where we can access it from other
    // tabs
    this.environment = environment;

  }

  logout() {
    environment.token = null;
    environment.loggedIn = false;
    environment.username = null;

    this.showAlert("You have been logged out");
    this.router.navigateByUrl('login')
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
