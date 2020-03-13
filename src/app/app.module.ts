import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComprarECTSComponent } from './components/alumno/comprar-ects/comprar-ects.component';
import { MatricularAsignaturaComponent } from './components/alumno/matricular-asignatura/matricular-asignatura.component';
import { EvaluarAsignaturaComponent } from './components/profesor/evaluar-asignatura/evaluar-asignatura.component';
import { TrasldarAsignaturaComponent } from './components/alumno/trasldar-asignatura/trasldar-asignatura.component';
import { CalcularEctsComponent } from './components/publico/calcular-ects/calcular-ects.component';

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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
