import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LOCAL_STORAGE_KEY_UNIVERSIDADES, ECTS_DECIMALS } from '../../../config/blockchain.dapp.config';
import { BlockchainService } from '../../../services/blockchain.service';
import { BlockchainLocalStorageService } from '../../../services/localstorage.service';

@Component({
  selector: 'app-comprar-ects',
  templateUrl: './comprar-ects.component.html',
  styles: []
})
export class ComprarECTSComponent implements OnInit {

  universidades;

  @Input() selectedAccount: string;
  @Input() universidad: string;
  @Input() tokens: number;
  @Input() weis: number;

  @ViewChild('comprarEctsModal', {static: false}) modal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
              private blockchainService: BlockchainService,
              private blockchainLocalStorageService: BlockchainLocalStorageService) {}

  ngOnInit() {
    this.universidades = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_UNIVERSIDADES);
  }

  validarFormulario(comprar: boolean): string {
    let mensajeError = '';
    if ( this.universidad === undefined ) {
      mensajeError += ' - Debe seleccionar la universidad';
    }

    if ( this.tokens === undefined ) {
      mensajeError += ( mensajeError !== '' ? '\n' : '') + ' - Debe establecer los tokens que desea adquirir';
    }

    if(comprar) {
      if ( this.weis === undefined ) {
        mensajeError += ( mensajeError !== '' ? '\n' : '') + ' - Debe establecer los weis necesarios';
      }
    }

    return mensajeError;
  }

  async calcularWeis() {
    const mensajeError = this.validarFormulario(false);
    if (mensajeError === '') {
      const r = await this.blockchainService.calcularWeis(this.selectedAccount, this.universidad, this.tokens * ECTS_DECIMALS);
      this.weis = parseInt(r) ;
    } else {
      alert(mensajeError);
    }
  }

  comprarTokens() {
    const mensajeError = this.validarFormulario(true);

    if (mensajeError === '') {
      this.modalService.open(this.modal).result.then( (r) => {
        if (r === 'ok') {
          this.comprar();
        }

      }, error => {
        console.log(error);
      });
    } else {
      alert(mensajeError);
    }

  }

  async comprar() {
    await this.blockchainService.comprarTokens(this.selectedAccount, this.universidad, this.tokens * ECTS_DECIMALS, this.weis);
  }

}
