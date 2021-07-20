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
  environment: { production: boolean; apiUrl: string; username: any; token: any; items: any; itemsAsKeyValue: any[]; inCart: any[]; loggedIn: boolean; };
  form: FormGroup;
  itemsExist: Boolean;

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



protected async submit() {
  (await this.appService.getFilteredItems(this.form.value.searchString)).subscribe((result) => {
    environment.filteredItems = result;
    this.appService.getFilteredItemsForDisplay();
    })

    if (environment.filteredItemsAsKeyValue.length == 0) {
        this.itemsExist = false;
      } else {
        this.itemsExist = true;
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
