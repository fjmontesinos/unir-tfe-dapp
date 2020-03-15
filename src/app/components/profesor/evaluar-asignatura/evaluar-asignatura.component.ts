import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockchainService } from '../../../services/blockchain.service';
import { BlockchainLocalStorageService } from '../../../services/localstorage.service';
import { LOCAL_STORAGE_KEY_ASIGNATURAS } from 'src/app/config/blockchain.dapp.config';
import { LOCAL_STORAGE_KEY_ALUMNOS, LOCAL_STORAGE_KEY_MATRICULAS, NOTAS_DECIMALS } from '../../../config/blockchain.dapp.config';

@Component({
  selector: 'app-evaluar-asignatura',
  templateUrl: './evaluar-asignatura.component.html',
  styles: []
})
export class EvaluarAsignaturaComponent implements OnInit {

  asignaturas;
  alumnos;

  @Input() selectedAccount: string;
  @Input() asignatura: string;
  @Input() alumno: string;
  @Input() tokenId: number;
  @Input() nota: number;

  @ViewChild('evaluarModal', {static: false}) modal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
              private blockchainService: BlockchainService,
              private blockchainLocalStorageService: BlockchainLocalStorageService) { }

  ngOnInit() {
    this.asignaturas = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_ASIGNATURAS);
    if (this.asignaturas !== null) {
      this.asignatura = this.asignaturas[0].address;
    }
    this.alumnos = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_ALUMNOS);
    if (this.alumnos !== null) {
      this.alumno = this.alumnos[0].address;
    }
    this.tokenId = 0;
    this.nota = 0;
  }

  validarFormulario(): string {
    let mensajeError = '';
    if ( this.asignatura === undefined || this.asignatura === '') {
      mensajeError += ' - Debe seleccionar la asignatura';
    }
    if ( this.alumno === undefined || this.alumno === '') {
      mensajeError += ' - Debe seleccionar el alumno';
    }
    if ( this.tokenId === undefined || this.tokenId.toString() === '') {
      mensajeError += ' - El Token ID de la asignatura es ablogatorio';
    }
    if ( this.nota === undefined || this.nota.toString() === '') {
      mensajeError += ' - Debe informar la nota';
    }

    return mensajeError;
  }

  obtenerTokenId() {
    this.tokenId = this.blockchainLocalStorageService.getTokenId(this.selectedAccount, this.alumno, this.asignatura);
  }

  evaluar() {
    const mensajeError = this.validarFormulario();

    if (mensajeError === '') {
      this.modalService.open(this.modal).result.then( (r) => {
        if (r === 'ok') {
          this.ejecutarEvaluar();
        }
      }, error => {
        console.log(error);
      });
    } else {
      alert(mensajeError);
    }
  }

  /**
   * Ejecuta la evaluación del alumno en la asignatura
   */
  async ejecutarEvaluar() {
    await this.blockchainService.evaluarAsignatura(this.selectedAccount, this.asignatura,
                                                   this.alumno, this.tokenId,
                                                   this.nota * NOTAS_DECIMALS);
  }

}
