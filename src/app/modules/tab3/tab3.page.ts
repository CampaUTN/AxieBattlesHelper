import { Component } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public ronin = 'ronin:ae826c8db12032fba5bbb4690aaf79cfeaa1e01c';

  public metamask = '0x35Acc86fd5752d4Ff5be49E1ee44D4E6bCD94bca';

  public paypal = 'https://www.paypal.com/donate?hosted_button_id=TSMGG8E4EHJRA';

  constructor(private toastController: ToastController) {}

  openDonate() {
    window.open(this.paypal);
  }

  async copyToClipboard(wallet: string) {
    if (wallet == 'ronin') {
      await Clipboard.write({
        string: this.ronin
      });
    } else if (wallet == 'metamask') {
      await Clipboard.write({
        string: this.metamask
      });
    }
    const toast = await this.toastController.create({
      message: 'Copied to clipboard!',
      duration: 3000,
      position: 'top',
      animated: true,
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
        }
      ]
    });
    await toast.present();
  }

}
