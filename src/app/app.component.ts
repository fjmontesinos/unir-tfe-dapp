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

  /**
   * Obtiene una key por proposito para una cuenta seleccionada
   */
  async getKeyByPurpose() {
    const purpose = this.keyPurpose.nativeElement.value;
    const account = this.accountGetKey.nativeElement.value;
    await this.diplomasBlockchainService.getKeyByPurpose(this.selectedAccount, account, purpose);
  }

  /**
   * Añade la key a la universidad en principio debe ser de tipo claim
   */
  async addKeyUniversidad() {
    // TODO validar que sea de tipo claim y que sea la universidad
    await this.diplomasBlockchainService.addKeyUniversidad(this.selectedAccount,
      this.keyPurpose.nativeElement.value,
      this.keyType.nativeElement.value);
  }

  /**
   * Añade la claim por parte de la universidad al alumno
   */
  async addClaimUniversidadToAlumno() {
    const claim = this.claim.nativeElement.value;
    // TODO validar que el claim no venga vacío, que es la universidad y que la dirección alumno es ClaimHolder
    await this.diplomasBlockchainService.addClaimUniversidadToAlumno(this.selectedAccount, addressAlumno, claim);
  }

  /**
   * Aprobar claim por parte del alumno añadido por la universidad
   */
  async aprobarClaimByAlumno() {
    const executionId = this.executionId.nativeElement.value;
    // TODO validar que es el alumno el que emite la acción y que executionId es un valor numérico
    await this.diplomasBlockchainService.approbarClaimByAlumno(this.selectedAccount, executionId);
  }

  /**
   * Verificar claim sobre una identidad digital
   */
  async verificarClaimIdentidadByEmpresa( ) {
    const claimType = this.claimType.nativeElement.value;
    const accountIdentity = this.accountIdentityCheckClaim.nativeElement.value;
    await this.diplomasBlockchainService.verificarClaimIdentidadByEmpresa(this.selectedAccount,
      accountIdentity, claimType);
  }

  /**
   * Desplegar sobre la red blockchain los sc necesarios para la aplicación
   */
  async parametrizar() {
    await this.diplomasBlockchainService.parametrizar(accountEstado);

    this.consola +=  '****Sistema Parametrizado****';
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
