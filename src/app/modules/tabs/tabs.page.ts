import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InstructionsPage } from '../instructions/instructions.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public modalController: ModalController) {}

  async openHelp() {
    const modal = await this.modalController.create({
      component: InstructionsPage,
    });
    return await modal.present();
  }
}
