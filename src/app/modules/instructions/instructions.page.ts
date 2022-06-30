import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-instructions',
  templateUrl: 'instructions.page.html',
  styleUrls: ['instructions.page.scss']
})
export class InstructionsPage {

  @ViewChild('slides') slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  disablePrevBtn = true;
  disableNextBtn = false;

  constructor() {}

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  async isBegin() {
    debugger;
    if (this.slides) {
      const isBegin = await this.slides.isBeginning();
      return isBegin;
    }
  }

  async isEnd() {
    debugger;
    if (this.slides) {
      const isEnd = await this.slides.isEnd();
      return isEnd;
    }
  }

  doCheck() {
    const prom1 = this.slides.isBeginning();
    const prom2 = this.slides.isEnd();
  
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }
}
