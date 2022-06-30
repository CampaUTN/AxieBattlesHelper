import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { InstructionsPage } from '../../instructions/instructions.page';
import { EventTypes } from '../EventTypes';

@Component({
  selector: 'app-tab1',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {

  energies = 3;

  cards = 24;

  round = 1;

  resetCards = false;

  eventsSubject: Subject<EventTypes> = new Subject<EventTypes>();

  alreadySeenInstructions = true;

  constructor(private toastController: ToastController, public modalController: ModalController) {
    const showed = localStorage.getItem('alreadySeenInstructions')
    if (!showed) {
      this.presentModal();
      localStorage.setItem('alreadySeenInstructions', 'true');
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: InstructionsPage,
    });
    return await modal.present();
  }

  async nextRound() { 
    this.energies= this.energies + 2;
    if (this.cards >= 3 && !this.resetCards) {
      this.cards = this.cards-3;
    } else {
      this.cards = this.cards + 3;
    }
    this.round = this.round + 1;
    if (this.cards < 6) { 
      if (!this.resetCards) {
        this.resetCards = true;
        this.eventsSubject.next(EventTypes.RESET_CARDS);
        await this.presentCardsToast();
      }
    }
  }

  async presentCardsToast() {
    const toast = await this.toastController.create({
      message: 'From now, opponent may have any random card. Cards will not shadow',
      duration: 3000,
      color: 'warning',
      position: 'bottom',
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

  callbackFunction(callbackData){ 
    this.energies = this.energies + callbackData.energies;
    this.cards = this.cards + callbackData.cards;
  }

  addEnergy() {
    this.energies += 1;
  }

  removeEnergy() {
    if (this.energies > 0) {
      this.energies -= 1;
    }
  }

  addCard() {
    this.cards += 1;
  }

  removeCard() {
    if (this.cards > 0) {
      this.cards -= 1;
    }
  }

  register(result: string) {
    const item = {
      result,
      date: new Date()
    }
    const historyString = localStorage.getItem('history');
    let history = [];
    if (historyString) {
      history.push(...JSON.parse(historyString));
      history.push(item);
    } else {
      history.push(item);
    }
    localStorage.setItem('history', JSON.stringify(history));
    this.restart();
  }

  restart() {
    this.energies = 3;
    this.cards = 24;
    this.round = 1;
    this.resetCards = false;
    this.eventsSubject.next(EventTypes.NEW_GAME);
  }

}
