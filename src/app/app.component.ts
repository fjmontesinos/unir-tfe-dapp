import { Component, OnDestroy, NgZone } from '@angular/core';
import { DiplomasBlockchainService } from './services/blockchain.service';
import { Title } from '@angular/platform-browser';
import {
  accountEstado,
  accountAlumno,
  accountProfesor,
  accountUniversidad1,
  accountUniversidad2,
  LOCAL_STORAGE_KEY_ENTIDADES_REG,
  LOCAL_STORAGE_KEY_UNIVERSIDADES_REG,
  ESTADO_NOMBRE,
  DAPP_TITULO } from './config/blockchain.dapp.config';
import { Subscription } from 'rxjs';
import { BlockchainLocalStorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  consola$: Subscription;
  title = DAPP_TITULO;
  accounts = [accountEstado, accountUniversidad1, accountProfesor, accountAlumno, accountUniversidad2];
  selectedAccount = this.accounts[0];
  consola = '';
  disableOpcionesEstado = true;
  disableOpcionesUniversidad = true;
  disableOpcionesProfesor = true;
  disableOpcionesAlumno = true;
  usuario: any;

  constructor(private diplomasBlockchainService: DiplomasBlockchainService,
              private blockchainLocalStorageService: BlockchainLocalStorageService,
              private ngZone: NgZone,
              private titleServe: Title) {
                this.titleServe.setTitle(this.title);
                this.setSecurityByAccount();
                this.consola$ = this.diplomasBlockchainService.getConsola$().subscribe( (_mensaje) => {
                  this.ngZone.run( () => {
                    this.consola +=  '<pre>' + _mensaje + '</pre>';
                    document.getElementById('consola').scrollTop +=
                      document.getElementById('consola').scrollHeight;
                  });
                });
              }

  onChange(newValue) {
    // establecer la nueva cuenta seleccionada
    this.selectedAccount = newValue;
    // aplicar la seguridad en base a la nueva cuenta seleccionada
    this.setSecurityByAccount();
  }

  async ngOnDestroy() {
    this.consola$.unsubscribe();
  }

  /**
   * Establece en base al rol de la dirección selección que opciones está activas y cuales
   * no lo están.
   */
  setSecurityByAccount( ) {
    this.disableOpcionesAlumno = true;
    this.disableOpcionesProfesor = true;
    this.disableOpcionesUniversidad = true;
    this.disableOpcionesEstado = true;

    if ( this.blockchainLocalStorageService.isEstado(this.selectedAccount) || (this.selectedAccount === accountEstado) ) {
      this.disableOpcionesEstado = false;
      this.usuario = {nombre: ESTADO_NOMBRE};
    } else if ( this.blockchainLocalStorageService.isUniversidad(this.selectedAccount) ) {
      this.disableOpcionesUniversidad = false;
      this.usuario = this.blockchainLocalStorageService.getUniversidad(this.selectedAccount);
    } else if ( this.blockchainLocalStorageService.isProfesor(this.selectedAccount) ) {
      this.disableOpcionesProfesor = false;
      this.usuario = this.blockchainLocalStorageService.getProfesor(this.selectedAccount);
    } else if ( this.blockchainLocalStorageService.isAlumno(this.selectedAccount) ) {
      this.disableOpcionesAlumno = false;
      this.usuario = this.blockchainLocalStorageService.getAlumno(this.selectedAccount);
    }
  }

  /**
   * Realiza un "clear" de la consola
   */
  borrarConsola() {
    this.consola = '';
  }

  pendienteDesarrollar() {
    this.consola +=  '<pre>En desarrollo</pre>';

  }
  /**
   * Desplegar sobre la red blockchain los sc necesarios para la aplicación
   */
  async inicializarEntidades() {
    await this.diplomasBlockchainService.inicializarEntidades(this.selectedAccount);
  }

  async registrarUniversidadesEnAsignatura() {
    await this.diplomasBlockchainService.registrarUniversidades(this.selectedAccount);
  }

  /**
   * Establece si se han desplegado los sc en la red blockchain para habilitar en el ui
   * la funcionalidad necesaria para desplegar si no están desplegados o para interactuar con ella
   * si ya han sido desplegados.
   */
  isParametrizado() {
    return this.diplomasBlockchainService.isParametrizado();
  }

  isEntidadesInicializadas() {
    return (this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_ENTIDADES_REG) === true);
  }

  isUniversidadesRegistradas() {
    return (this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_UNIVERSIDADES_REG) === true);
  }

}
