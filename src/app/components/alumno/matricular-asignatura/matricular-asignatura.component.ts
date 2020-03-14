import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { LOCAL_STORAGE_KEY_ASIGNATURAS, LOCAL_STORAGE_KEY_UNIVERSIDADES, ECTS_DECIMALS } from '../../../config/blockchain.dapp.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockchainService } from '../../../services/blockchain.service';
import { BlockchainLocalStorageService } from '../../../services/localstorage.service';

@Component({
  selector: 'app-matricular-asignatura',
  templateUrl: './matricular-asignatura.component.html',
  styles: []
})
export class MatricularAsignaturaComponent implements OnInit {

  universidades;
  asignaturas;

  @Input() selectedAccount: string;
  @Input() universidad: string;
  @Input() tokens: number;
  @Input() asignatura: string;
  @Input() curso: string;

  @ViewChild('matricularModal', {static: false}) modal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
              private blockchainService: BlockchainService,
              private blockchainLocalStorageService: BlockchainLocalStorageService) { }

  ngOnInit() {
    this.universidades = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_UNIVERSIDADES);
    this.universidad = this.universidades[0].address;
    this.asignaturas = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_ASIGNATURAS);
    this.asignatura = this.asignaturas[0].address;
    this.curso = '2019 / 2020';
  }

  validarFormulario(): string {
    let mensajeError = '';
    if ( this.universidad === undefined ) {
      mensajeError += ' - Debe seleccionar la universidad';
    }

    if ( this.asignatura === undefined ) {
      mensajeError += ( mensajeError !== '' ? '\n' : '') + ' - Debe seleccionar la asignatura';
    }

    return mensajeError;
  }

  async obtenerECTSTokensPorUniversidad() {
    const t = await this.blockchainService.getBalanceECTSTokenPorUniversidad(this.selectedAccount, this.universidad);
    this.tokens = t / ECTS_DECIMALS;
  }

  matricular() {
    const mensajeError = this.validarFormulario();

    if (mensajeError === '') {
      this.modalService.open(this.modal).result.then( (r) => {
        if (r === 'ok') {
          this.ejecutarMatricula();
        }

      }, error => {
        console.log(error);
      });
    } else {
      alert(mensajeError);
    }
  }

  /**
   * Ejecuta la matrícula del alumno en la asignatura
   */
  async ejecutarMatricula() {
    await this.blockchainService.matricularEnAsignatura(this.selectedAccount, this.universidad, this.asignatura, this.curso);

    // Actualizar balance de ECTS tras la matrícula
    this.blockchainService.getBalanceECTSToken(this.selectedAccount);
  }
}
