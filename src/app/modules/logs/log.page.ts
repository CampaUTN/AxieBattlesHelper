import { Component } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: 'log.page.html',
  styleUrls: ['log.page.scss']
})
export class LogPage {

  history = [];

  historyGallery = [];

  winPercentage = 0;

  wins = 0;
  losses = 0;
  draws = 0;

  constructor() {}

  ionViewDidEnter() {
    const historyString = localStorage.getItem('history');
    let winCount = 0, drawCount = 0, lossCount = 0;
    if (historyString) {
      this.history = JSON.parse(historyString);
      this.calculateStatistics();
      for (const h of this.history) {
        if (h.result == 'win')
        winCount += 1;
        else if (h.result == 'draw')
        drawCount += 1;
        else if (h.result == 'loss')
        lossCount += 1;
      }
      this.wins = winCount;
      this.draws = drawCount;
      this.losses = lossCount;
      this.createGallerySlider();
    }
  }

  createGallerySlider() {
    const dicHistory = {};
    const retData = [];
    for (const reg of this.history) {
      const stringDate = new Date(new Date(reg.date).getFullYear(), new Date(reg.date).getMonth(), new Date(reg.date).getDate()).toString();
      if (!dicHistory[stringDate]) {
        dicHistory[stringDate] = {
          data: [],
          won: 0,
          draw: 0,
          loss: 0
        }
      }
      dicHistory[stringDate]['data'].push(reg);
    }
    for (const [key, v] of Object.entries(dicHistory)) {
      const won = (v['data'] as any).filter(x => x.result == 'win').length;
      const draw = (v['data'] as any).filter(x => x.result == 'draw').length;
      const loss = (v['data'] as any).filter(x => x.result == 'loss').length;
      v['won'] = won;
      v['draw'] = draw;
      v['loss'] = loss;
      v['date'] = key;
      if (won > loss) {
        v['color'] = '#2dd36f';
      } else if (won == loss) {
        v['color'] = '#ffc409';
      } else {
        v['color'] = '#eb445a';
      }
      retData.push(v);
    }
    retData.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
    this.historyGallery = retData;
  }

  calculateStatistics() {
    const historyString = localStorage.getItem('history');
    if (historyString) {
      let history = JSON.parse(historyString);
      const wins = history.filter(h => h.result == 'win');
      this.winPercentage = Number(((wins.length / history.length) * 100).toFixed(2));
    }
  }

  reset() {
    localStorage.removeItem('history');
    this.history=[];
    this.historyGallery=[];
    this.winPercentage = 0;
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
  }
}
