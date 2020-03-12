import { Component, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { DiplomasBlockchainService } from './services/diplomas-blockchain.service';
import { Title } from '@angular/platform-browser';
import { addressAlumno, addressUniversidad, addressEmpresa, accountEstado } from './config/diplomas-blockchain.config';
import { identidades, IDENTITY_TYPE, IDENTITY_ROLES } from './model/identidad-unir';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  consola$: Subscription;
  title = 'UNIR :: TFE - Digitilzación Blockchain de Asignaturas';
  accounts = [addressUniversidad, addressAlumno, addressEmpresa];
  accountIdentities = [addressUniversidad, addressAlumno];
  selectedAccount = this.accounts[0];
  consola = '';
  disableOpcionesAlumno = false;
  disableOpcionesUniversidad = false;

  @ViewChild('keyPurpose', {static: true}) keyPurposeAlumnoInput: ElementRef;
  @ViewChild('accountGetKey', {static: true}) accountGetKey: ElementRef;
  @ViewChild('keyPurpose', {static: true}) keyPurpose: ElementRef;
  @ViewChild('keyType', {static: true}) keyType: ElementRef;
  @ViewChild('claim', {static: true}) claim: ElementRef;
  @ViewChild('accountIdentityCheckClaim', {static: true}) accountIdentityCheckClaim: ElementRef;
  @ViewChild('executionId', {static: true}) executionId: ElementRef;
  @ViewChild('claimType', {static: true}) claimType: ElementRef;

  constructor(private diplomasBlockchainService: DiplomasBlockchainService,
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
    // if ( identidades.get(this.selectedAccount).rol === IDENTITY_ROLES.ALUMNO ) {
    //   this.disableOpcionesUniversidad = true;
    //   this.disableOpcionesAlumno = false;
    // } else if ( identidades.get(this.selectedAccount).rol === IDENTITY_ROLES.UNIVERSIDAD ) {
    //   this.disableOpcionesUniversidad = false;
    //   this.disableOpcionesAlumno = true;
    // } else {
    //   this.disableOpcionesUniversidad = true;
    //   this.disableOpcionesAlumno = true;
    // }
  }

  /**
   * Realiza un "clear" de la consola
   */
  limpiarConsola() {
    this.consola = '';
  }

  pendienteDesarrollar(){
    this.consola += 'Pendiente Desarrollar';
  }
  /**
   * Desplegar sobre la red blockchain los sc necesarios para la aplicación
   */
  async inicializarEntidades() {
    await this.diplomasBlockchainService.inicializarEntidades(accountEstado);
  }

  async registrarUniversidadesEnAsignatura() {
    await this.diplomasBlockchainService.registrarUniversidades(accountEstado);
  }

  /**
   * Establece si se han desplegado los sc en la red blockchain para habilitar en el ui
   * la funcionalidad necesaria para desplegar si no están desplegados o para interactuar con ella
   * si ya han sido desplegados.
   */
  isParametrizado() {
    return this.diplomasBlockchainService.isParametrizado();
  }

}
