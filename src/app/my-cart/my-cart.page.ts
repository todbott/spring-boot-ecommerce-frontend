
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage implements OnInit {
  environment: { production: boolean; apiUrl: string; username: any; token: any; items: any; itemsAsKeyValue: any[]; inCart: any[]; loggedIn: boolean; };
  

  constructor(  
    private appService: AppServiceService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  private items = []
  private itemsExist = false;
  private orderTotal: number;



  ngOnInit() {
    this.environment = environment
    this.orderTotal = 0.00
  }

  async ionViewWillEnter() {

    this.itemsExist = false;
    this.items = [];

    this.environment = environment;
    this.orderTotal = 0.00;

    if (this.environment.loggedIn == true) {

      (await (await this.appService.getCartItems(environment.username)).toPromise()
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
            this.orderTotal += parseFloat(itemPrice);
            }
        })
      )
    } else {
      this.items = environment.inCart
    }

    if (this.items.length > 0) {
      this.itemsExist = true;
    }

}


  

  async removeFromCart(id) {
    console.log(this.items)
    for (var i=0; i < this.items.length; i++) {
      if (this.items[i]['id'] == id) {
        this.items.splice(i, 1)
      }
    }
    console.log(this.items)


    if (this.environment.loggedIn == true) {
      (await (await this.appService.deleteItemFromCart(id)).toPromise()
      .then(result => {
        console.log(result)
        })
      )
    }

    if (this.items.length == 0) {
      this.itemsExist = false;
    }
    await this.showAlert("Item has been removed from your cart.")
    environment.inCart = this.items;
    console.log(environment.inCart)
    this.router.navigateByUrl('store')
 }

 async placeOrder() {

  if (this.environment.loggedIn == false) {
    this.showAlert("Please log in to place an order")
    this.router.navigateByUrl('login');
  } else {
    for (var i=0; i < this.items.length; i++) {
      (await (await this.appService.buyItem(this.items[i]['id'], environment.username)).toPromise()
      .then(result => {
        console.log(result)
        })
      )
    }
    this.items = [];
    environment.inCart = [];
    await this.showAlert("Order has been placed, thank you!")
    this.router.navigateByUrl('store')
  }
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
