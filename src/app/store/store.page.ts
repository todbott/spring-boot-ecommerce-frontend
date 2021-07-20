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
    private alertCtrl: AlertController
  ) { 
    
  }

  public environment;
  public  itemsInShop = []
  private errorMessage;

  ngOnInit() {
    this.environment = environment
  }

  async ionViewWillEnter() {
    this.environment = environment;
  
    for (var i = 0; i < environment.inCart.length; i++) {
      // if there are any items in the environment.inCart variable, add 
      // those items to the database, then empty the environment.inCart variable
      (await (await this.appService.addItemToCart(environment.inCart[i]['id'], environment.username)).toPromise()
      .then(result => {
        console.log(result)
        console.log("added item to cart")
        })
      )
    }
    
    if (environment.items = []) {
    (await this.appService.getItems()).subscribe((result) => {
      environment.items = result;
      this.appService.getItemsForDisplay();

      })
    }
}

  async addToCart(which) {
    if (this.environment.loggedIn == true) {
      (await (await this.appService.addItemToCart(which, environment.username)).toPromise()
      .then(result => {
        console.log(result)
        this.showAlert("Item has been added to your cart")
        })
      )
    } else {
      for (let key in environment.items) {
        let value = environment.items[key];
        if (value['id'] == which) {
          let itemId = value['id'];
          let itemName = value['name'];
          let itemPrice = value[`price`].replace('$', '')

          let thisItem = {
              id: itemId,
              name: itemName,
              price: itemPrice
            }

          environment.inCart.push(thisItem)
          this.showAlert("Item has been added to your cart")
        }
      }
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
