import { Injectable } from '@angular/core';

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
    return (localStorage.getItem('estado') === account);
  }

  isUniversidad( account: string ) {
    const universidades = this.get('universidades');
    if ( universidades ) {
      for (let i = 0; i < universidades.length; i++) {
        if ( universidades[i].address === account ) { return true; }
      }
    }

    return false;
  }

  getUniversidad( account: string ) {
    const universidades = this.get('universidades');
    if ( universidades != null ) {
      for (let i = 0; i < universidades.length; i++) {
        if ( universidades[i].address === account ) { return universidades[i]; }
      }
    }

    return null;
  }

  isProfesor( account: string ) {
    const profesores = this.get('profesores');
    if ( profesores != null ) {
      for (let i = 0; i < profesores.length; i++) {
        if ( profesores[i].address === account ) { return true; }
      }
    }
    return false;
  }

  getProfesor( account: string ) {
    const profesores = this.get('profesores');
    if ( profesores != null ) {
      for (let i = 0; i < profesores.length; i++) {
        if ( profesores[i].address === account ) { return profesores[i]; }
      }
    }

    return null;
  }

  isAlumno( account: string ) {
    const alumnos = this.get('alumnos');
    if ( alumnos != null ) {
      for (let i = 0; i < alumnos.length; i++) {
        if ( alumnos[i].address === account ) { return true; }
      }
    }

    return false;
  }

  getAlumno( account: string ) {
    const alumnos = this.get('alumnos');
    if ( alumnos != null ) {
      for (let i = 0; i < alumnos.length; i++) {
        if ( alumnos[i].address === account ) { return alumnos[i]; }
      }
    }

    return null;
  }

}
