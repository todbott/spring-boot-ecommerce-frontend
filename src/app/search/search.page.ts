import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  public environment;
  form: FormGroup;
  itemsExist: Boolean;
  public quantities = [];

  constructor(
    private appService: AppServiceService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.environment = environment;
  
    this.form = new FormGroup({
      searchString: new FormControl(null)
      });

    this.itemsExist = false;

  }

  ionViewWillEnter() {
    if (environment.filteredItemsAsKeyValue.length == 0) {
      this.itemsExist = false;
    }
  }



async submit() {
  (await this.appService.getFilteredItems(this.form.value.searchString)).subscribe((result) => {
    environment.filteredItems = result;
    this.appService.getFilteredItemsForDisplay();

    for (var i = 0; i < environment.itemsAsKeyValue.length; i++) {
      this.quantities.push(environment.itemsAsKeyValue[i]['name'])
      this.quantities[i] = "1";
      }
    })

    if (environment.filteredItemsAsKeyValue.length == 0) {
        this.itemsExist = false;
      } else {
        this.itemsExist = true;
      }
    }

  

  async addToCart(which, ind) {
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
      //     let itemPrice = value[`price`].replace('$', '')
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
