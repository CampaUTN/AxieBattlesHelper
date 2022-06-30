import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initializeApp();
  }

  initializeApp() {
    const language = navigator.language;
    if (language == 'es-ES' || language == 'spa') {
      this.translate.setDefaultLang('es');
    } else {
      this.translate.setDefaultLang('en');
    }
  }
}
