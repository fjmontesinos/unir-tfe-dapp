import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { EXPERIMENTABILIDAD, ANIOS_MATRICULA, LOCAL_STORAGE_KEY_UNIVERSIDADES, ECTS_DECIMALS, LOCAL_STORAGE_KEY_ASIGNATURAS } from '../../../config/blockchain.dapp.config';
import { BlockchainLocalStorageService } from '../../../services/localstorage.service';
import { BlockchainService } from '../../../services/blockchain.service';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-calcular-ects',
  templateUrl: './calcular-ects.component.html',
  styles: []
})
export class CalcularEctsComponent implements OnInit {

  asignaturas;
  universidades;
  experimentabilidad;
  anios;

  @Input() selectedAccount: string;
  @Input() universidad: string;
  @Input() exp: number;
  @Input() anio: number;
  @Input() creditos: number;
  @Input() ects: number;

  constructor(private blockchainService: BlockchainService, private blockchainLocalStorageService: BlockchainLocalStorageService) {
    this.experimentabilidad = EXPERIMENTABILIDAD;
    this.anios = ANIOS_MATRICULA;
    this.universidades = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_UNIVERSIDADES);
    this.asignaturas = this.blockchainLocalStorageService.get(LOCAL_STORAGE_KEY_ASIGNATURAS);
  }

  ngOnInit() {
  }

  async calcularECTS() {
    let calcular = false;
    let mensajeError = '';
    if ( this.universidad === undefined ) {
      mensajeError += ' - Debe seleccionar la universidad';
    }

    if ( this.exp === undefined ) {
      mensajeError += ( mensajeError !== '' ? '\n' : '') + ' - Debe seleccionar la experimentabilidad';
    }

    if ( this.anio === undefined ) {
      mensajeError += ( mensajeError !== '' ? '\n' : '') + ' - Debe seleccionar el año de matrícula';
    }

    if ( this.creditos === undefined ) {
      mensajeError += ( mensajeError !== '' ? '\n' : '') + ' - Debe establecer los créditos';
    }

    if (mensajeError === '') {
      const r = await this.blockchainService.calcularECTS(this.selectedAccount, this.universidad, this.exp, this.anio, this.creditos);
      this.ects = parseInt(r) / ECTS_DECIMALS;
    } else {
      alert(mensajeError);
    }
  }

}
