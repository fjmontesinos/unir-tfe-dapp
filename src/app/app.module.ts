import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComprarECTSComponent } from './alumno/comprar-ects/comprar-ects.component';
import { MatricularAsignaturaComponent } from './alumno/matricular-asignatura/matricular-asignatura.component';
import { EvaluarAsignaturaComponent } from './profesor/evaluar-asignatura/evaluar-asignatura.component';
import { TrasldarAsignaturaComponent } from './alumno/trasldar-asignatura/trasldar-asignatura.component';

@NgModule({
  declarations: [
    AppComponent,
    ComprarECTSComponent,
    MatricularAsignaturaComponent,
    EvaluarAsignaturaComponent,
    TrasldarAsignaturaComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
