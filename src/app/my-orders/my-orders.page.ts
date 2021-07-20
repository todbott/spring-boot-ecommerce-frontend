import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  environment: { production: boolean; apiUrl: string; username: any; token: any; items: any; itemsAsKeyValue: any[]; inCart: any[]; loggedIn: boolean; };
  

  constructor(  
    private appService: AppServiceService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  private items = []
  private itemsExist = false;



  ngOnInit() {
    this.environment = environment

  }

  async ionViewWillEnter() {

    this.environment = environment;

    (await (await this.appService.getOrders(environment.username)).toPromise()
    .then(result => {
      console.log(result)
      for (let key in result) {
        let value = result[key];

          let itemId = value['id'];
          let itemName = value['name'];
          let itemPrice = value[`price`].replace('$', '')

          let thisItem = {
              id: itemId,
              name: itemName,
              price: itemPrice
            }

          this.items.push(thisItem)
          this.itemsExist = true;

          }
      }))
    }



}
