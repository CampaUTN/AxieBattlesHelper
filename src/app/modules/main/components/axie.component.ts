import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { EventTypes } from '../EventTypes';

@Component({
  selector: 'app-axie',
  templateUrl: 'axie.component.html',
  styleUrls: ['axie.component.scss']
})
export class AxieComponent {

  id;

  axieNotFound = false;

  @Input()
  axieNumber: number;

  @Input() 
  energies: number;

  @Input() 
  resetCards: boolean;

  @Output()
  parentCallback: EventEmitter<any> = new EventEmitter();

  private eventsSubscription: Subscription;

  @Input() events: Observable<EventTypes>;

  ngOnInit(){
    this.eventsSubscription = this.events.subscribe((event: EventTypes) => {
      if (event == EventTypes.NEW_GAME) {
        this.newGame();
      } else if (event == EventTypes.RESET_CARDS) {
        this.restartCards();
      }
    });
  }
  
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  newGame() {
    this.id = null;
    this.stateVariable = {
      live: true,
      data: null,
      1: {
        'a': false,
        'b': false,
        'c': false,
        'd': false
      },
      2: {
        'a': false,
        'b': false,
        'c': false,
        'd': false
      }
    };
  }

  restartCards() {
    this.stateVariable = {
      ...this.stateVariable,
      1: {
        'a': false,
        'b': false,
        'c': false,
        'd': false
      },
      2: {
        'a': false,
        'b': false,
        'c': false,
        'd': false
      }
    };
  }

  stateVariable = {
    live: true,
    data: null,
    1: {
      'a': false,
      'b': false,
      'c': false,
      'd': false
    },
    2: {
      'a': false,
      'b': false,
      'c': false,
      'd': false
    }
  };

  change(first, second) {
    const energyCost = this.stateVariable.data.axie.parts[this.letterToPartNumber(second)].abilities[0].energy;
    if (!this.stateVariable[first][second] && (this.energies - energyCost) >= 0) {
      this.parentCallback.emit({ energies: -energyCost, cards: -1 });
      if (!this.resetCards) {
        this.stateVariable[first][second] = !this.stateVariable[first][second];
      }

    } else if (this.stateVariable[first][second]) {
      this.parentCallback.emit({ energies: energyCost, cards: 1 });
      if (!this.resetCards) {
        this.stateVariable[first][second] = !this.stateVariable[first][second];
      }
    }
  }

  letterToPartNumber(letter: string) {
    switch(letter) {
      case 'a': return 2;
      case 'b': return 3;
      case 'c': return 4;
      case 'd': return 5;
    }
  }

  async findAxie() {
    try {
      if (this.id) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { 
              "operationName": "GetAxieDetail",
              "query": "query GetAxieDetail($axieId: ID!) {\n    axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\nfragment AxieDetail on Axie {\n  id\n  image\n  class\n  name\n  genes\n  birthDate\n  bodyShape\n  class\n  sireId\n  sireClass\n  matronId\n  matronClass\n  stage\n  title\n  breedCount\n  figure {\n    atlas\n    model\n    image\n    __typename\n  }\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  children {\n    id\n    name\n    class\n    image\n    title\n    stage\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}",
              "variables": {"axieId": this.id?.toString()},
              "axieId": this.id?.toString()
            }
          )
        };
        const response = await fetch('https://axieinfinity.com/graphql-server-v2/graphql?r=freak', requestOptions);
        const res = await response.json();
        if (res.data.axie) {
          this.stateVariable['data'] = res.data;
          this.axieNotFound = false;
        } else {
          this.axieNotFound = true;
          this.stateVariable.data = null;
        }
      }
    } catch(err) {
      this.axieNotFound = true;
      this.stateVariable.data = null;
    }
  }

  killOrResurrect() {
    if (this.stateVariable.live) {
      this.parentCallback.emit({ energies: 0, cards: -(this.remainingCardsUnused()) });
      this.stateVariable.live = false;
    } else {
      this.parentCallback.emit({ energies: 0, cards: this.remainingCardsUnused() });
      this.stateVariable.live = true;
    }
  }
  
  remainingCardsUnused() {
    let totalRemaining = 0;
    for (const card of Object.values(this.stateVariable[1])) {
      if (!card) {
        totalRemaining += 1;
      }
    }
    for (const card of Object.values(this.stateVariable[2])) {
      if (!card) {
        totalRemaining += 1;
      }
    }
    return totalRemaining;
  }

  isUsed(first, second) {
    return this.stateVariable[first][second];
  }

  constructor() {}
}
