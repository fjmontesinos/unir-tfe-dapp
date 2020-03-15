import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockchainLocalStorageService } from '../../../services/localstorage.service';
import { BlockchainService } from '../../../services/blockchain.service';
import { LOCAL_STORAGE_KEY_ASIGNATURAS, LOCAL_STORAGE_KEY_UNIVERSIDADES } from '../../../config/blockchain.dapp.config';

@Component({
  selector: 'app-trasldar-asignatura',
  templateUrl: './trasldar-asignatura.component.html',
  styles: []
})
export class TrasldarAsignaturaComponent implements OnInit {

  asignaturas;
  universidades;

  @Input() selectedAccount: string;
  @Input() asignatura: string;
  @Input() universidad: string;
  @Input() tokenId: number;

  @ViewChild('trasladarModal', {static: false}) modal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
              private blockchainService: BlockchainService,
              private blockchainLocalStorageService: BlockchainLocalStorageService) { }

  ngOnInit() {
    this.asignaturas = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_ASIGNATURAS);
    if (this.asignaturas !== null) {
      this.asignatura = this.asignaturas[0].address;
    }
    this.universidades = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_UNIVERSIDADES);
    if (this.universidades !== null) {
      this.universidad = this.universidades[0].address;
    }
    this.tokenId = 0;
  }

  validarFormulario(): string {
    let mensajeError = '';
    if ( this.asignatura === undefined || this.asignatura === '') {
      mensajeError += ' - Debe seleccionar la asignatura';
    }
    if ( this.universidad === undefined || this.universidad === '') {
      mensajeError += ' - Debe seleccionar el universidad';
    }
    if ( this.tokenId === undefined || this.tokenId.toString() === '' || this.tokenId === 0) {
      mensajeError += ' - El Token ID de la asignatura es ablogatorio';
    }
    return mensajeError;
  }

  obtenerTokenId() {
    this.tokenId = this.blockchainLocalStorageService.getTokenIdAprobado(this.selectedAccount, this.asignatura);
  }

  trasladar() {
    const mensajeError = this.validarFormulario();

    if (mensajeError === '') {
      this.modalService.open(this.modal).result.then( (r) => {
        if (r === 'ok') {
          this.ejecutarTrasladar();
        }
      }, error => {
        console.log(error);
      });
    } else {
      alert(mensajeError);
    }
  }

  /**
   * Ejecuta el traslado de la asignatura del alumno a otra universidad
   */
  async ejecutarTrasladar() {
    await this.blockchainService.trasladarAsignatura(this.selectedAccount, this.asignatura, this.universidad, this.tokenId);
  }
}
