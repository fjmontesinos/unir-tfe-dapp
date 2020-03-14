import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { ComprarECTSComponent } from './components/alumno/comprar-ects/comprar-ects.component';
import { MatricularAsignaturaComponent } from './components/alumno/matricular-asignatura/matricular-asignatura.component';
import { EvaluarAsignaturaComponent } from './components/profesor/evaluar-asignatura/evaluar-asignatura.component';
import { TrasldarAsignaturaComponent } from './components/alumno/trasldar-asignatura/trasldar-asignatura.component';
import { CalcularEctsComponent } from './components/publico/calcular-ects/calcular-ects.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    ComprarECTSComponent,
    MatricularAsignaturaComponent,
    EvaluarAsignaturaComponent,
    TrasldarAsignaturaComponent,
    CalcularEctsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
