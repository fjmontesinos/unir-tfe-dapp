import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEY_MATRICULAS, LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS } from '../config/blockchain.dapp.config';
import {
  LOCAL_STORAGE_KEY_ESTADO,
  LOCAL_STORAGE_KEY_UNIVERSIDADES,
  LOCAL_STORAGE_KEY_PROFESORES,
  LOCAL_STORAGE_KEY_ALUMNOS } from '../config/blockchain.dapp.config';

@Injectable({
  providedIn: 'root'
})
export class BlockchainLocalStorageService {

  constructor() { }

  save( key: string, data: any ) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get( key: string ) {
    return JSON.parse(localStorage.getItem(key));
  }

  isEstado( account: string ) {
    return (localStorage.getItem(LOCAL_STORAGE_KEY_ESTADO) === account);
  }

  isUniversidad( account: string ) {
    const universidades = this.get(LOCAL_STORAGE_KEY_UNIVERSIDADES);
    if ( universidades ) {
      for (let i = 0; i < universidades.length; i++) {
        if ( universidades[i].address === account ) { return true; }
      }
    }

    return false;
  }

  getUniversidad( account: string ) {
    const universidades = this.get(LOCAL_STORAGE_KEY_UNIVERSIDADES);
    if ( universidades != null ) {
      for (let i = 0; i < universidades.length; i++) {
        if ( universidades[i].address === account ) { return universidades[i]; }
      }
    }

    return null;
  }

  isProfesor( account: string ) {
    const profesores = this.get(LOCAL_STORAGE_KEY_PROFESORES);
    if ( profesores != null ) {
      for (let i = 0; i < profesores.length; i++) {
        if ( profesores[i].address === account ) { return true; }
      }
    }
    return false;
  }

  getProfesor( account: string ) {
    const profesores = this.get(LOCAL_STORAGE_KEY_PROFESORES);
    if ( profesores != null ) {
      for (let i = 0; i < profesores.length; i++) {
        if ( profesores[i].address === account ) { return profesores[i]; }
      }
    }

    return null;
  }

  isAlumno( account: string ) {
    const alumnos = this.get(LOCAL_STORAGE_KEY_ALUMNOS);
    if ( alumnos != null ) {
      for (let i = 0; i < alumnos.length; i++) {
        if ( alumnos[i].address === account ) { return true; }
      }
    }

    return false;
  }

  getAlumno( account: string ) {
    const alumnos = this.get(LOCAL_STORAGE_KEY_ALUMNOS);
    if ( alumnos != null ) {
      for (let i = 0; i < alumnos.length; i++) {
        if ( alumnos[i].address === account ) { return alumnos[i]; }
      }
    }

    return null;
  }

  saveMatricula( item: any ) {
    let items: Array<{
      universidad: string;
      profesor: string;
      asignatura: string;
      alumno: string;
      curso: string;
      id: number;
    }>;
    items = this.get(LOCAL_STORAGE_KEY_MATRICULAS);
    if (items === null) {
      items = [];
    }
    items.push(item);
    this.save(LOCAL_STORAGE_KEY_MATRICULAS, items);
  }

  getTokenId(profesor: string, alumno: string, asignatura: string){
    let matriculas = this.get(LOCAL_STORAGE_KEY_MATRICULAS);
    for( let i = 0; i < matriculas.length; i++ ) {
      if ( matriculas[i].profesor === profesor &&
        matriculas[i].alumno === alumno &&
        matriculas[i].asignatura === asignatura) {
          return matriculas[i].id;
        }
    }
    return 0;
  }

  getTokenIdAprobado(alumno: string, asignatura: string){
    let matriculas = this.get(LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS);
    for( let i = 0; i < matriculas.length; i++ ) {
      if (matriculas[i].alumno === alumno && matriculas[i].asignatura === asignatura && parseInt(matriculas[i].nota) >= 500) {
          return matriculas[i].id;
        }
    }
    return 0;
  }

  saveMatriculaEvaluada(profesor: string, alumno: string, asignatura: string, nota: number){
    let matriculas = this.get(LOCAL_STORAGE_KEY_MATRICULAS);
    let indice: number;
    for( let i = 0; i < matriculas.length; i++ ) {
      if ( matriculas[i].profesor === profesor &&
        matriculas[i].alumno === alumno &&
        matriculas[i].asignatura === asignatura) {
          matriculas[i].nota = nota;
          indice = i;
          break;
        }
    }
    let mEvaluada = matriculas[indice];
    matriculas.splice(indice, 1);
    this.save(LOCAL_STORAGE_KEY_MATRICULAS, matriculas);

    // actualizar el array de matrículas evaluadas
    let matriculasEvaluadas = this.get(LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS);
    if (matriculasEvaluadas === null) {
      matriculasEvaluadas = [];
    }
    matriculasEvaluadas.push(mEvaluada);
    this.save(LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS, matriculasEvaluadas);
  }

  trasladarMatricula(asignatura: string, tokenId: number, universidad: string){
    let matriculas = this.get(LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS);
    for( let i = 0; i < matriculas.length; i++ ) {
      if ( matriculas[i].id === tokenId && matriculas[i].asignatura === asignatura ) {
          matriculas[i].universidad = universidad;
          break;
        }
    }
    this.save(LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS, matriculas);
  }

}
