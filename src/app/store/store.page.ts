import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss']
         
})
export class StorePage implements OnInit {

  constructor(
    private appService: AppServiceService,
    private alertCtrl: AlertController,
  
  ) { 
    
  }

  public  itemsInShop = []
  public quantities = []
  environment: typeof environment

  ngOnInit() {
    this.environment = environment

  }

  async ionViewWillEnter() {
    this.environment = environment;
  
    // for (var i = 0; i < environment.inCart.length; i++) {
    //   // if there are any items in the environment.inCart variable, add 
    //   // those items to the database, then empty the environment.inCart variable
    //   (await (await this.appService.addItemToCart(environment.inCart[i]['name'], environment.username, environment.inCart[i]['quantity'])).toPromise()
    //   .then(result => {
    //     console.log(result)
    //     console.log("added item to cart")
    //     })
    //   )
    // }
    
    if (environment.items = []) {
    (await this.appService.getItems()).subscribe((result) => {
      environment.items = result;
      this.appService.getItemsForDisplay();

      for (var i = 0; i < environment.itemsAsKeyValue.length; i++) {
        this.quantities.push(environment.itemsAsKeyValue[i]['name'])
        this.quantities[i] = "1";
        }

      })
    }




}

  async addToCart(which, ind) {

    console.log(this.quantities[ind])

    if (this.environment.loggedIn == true) {
      (await (await this.appService.addItemToCart(which, environment.username, this.quantities[ind])).toPromise()
      .then(result => {
        console.log(result)
        this.showAlert("Added to cart")
        })
      )
    } else {
      this.showAlert("Please log in to add items to your cart")

      // --- The original app allowed users to add items to their cart
      // --- without logging in, but I deactivated this feature

      // for (let key in environment.items) {
      //   let value = environment.items[key];
      //   if (value['name'] == which) {
      //     let itemId = value['id'];
      //     let itemName = value['name'];
      //     let itemPrice = value[`price`].replace('$', '');
      //     let itemQuantity = this.quantities[ind];

      //     let thisItem = {
      //         id: itemId,
      //         name: itemName,
      //         price: itemPrice,
      //         quantity: itemQuantity
      //       }

      //     environment.inCart.push(thisItem)
      //     this.showAlert("Added to your cart")
      //   }
      // }
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
