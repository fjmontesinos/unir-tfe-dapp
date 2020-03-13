import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { RCP_URL_WS } from '../config/blockchain.dapp.config';
import { Subject, Observable } from 'rxjs';

import { accountEstado, accountUniversidad1, accountProfesor, accountAlumno, accountUniversidad2 } from '../config/blockchain.dapp.config';
import { estadoAddress, ectsTokenAddress } from '../config/blockchain.dapp.config';
import { estadoABI } from '../contracts/estado.smart.contract';
import { ectsTokenABI } from '../contracts/ectstoken.smart.contract';
import { asignaturaTokenABI } from '../contracts/asignaturatoken.smart.contracts';
import { BlockchainLocalStorageService } from './localstorage.service';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class DiplomasBlockchainService {

  public consola$ = new Subject<string>();

  private totalIdentidadesDesplegadas = 0;
  private web3: any;
  public asignaturas = new Map<string, any>();

  constructor(private blockchainLocalStorage: BlockchainLocalStorageService) {
    this.init();
  }

  /**
   * Retorna un observable que representa la consola en la que se muestra información
   * en el interfaz de usuario
   */
  getConsola$(): Observable<string> {
    return this.consola$.asObservable();
  }

  /**
   * Inicializa el servicio blockchain estableciendo conexión con el Provider e
   * inicializando las instancias de los smartcontracts
   */
  async init() {
    // necesario para que se confirmen las transacciones
    // desde el segundo bloque en la versión 1.0.0-beta.55 de web3
    const optionsProvider = {
      transactionConfirmationBlocks: 1
    };

    // inicializar web3
    window.web3 = new Web3(new Web3.providers.WebsocketProvider(RCP_URL_WS), null, optionsProvider);
    this.web3 = window.web3;

    // inicializar las instancias de los sc que representan las identidades digitales
    this.initSmartContracts();
  }

  private estadoInstance:any;
  private ectsTokenInstance:any;

  async initSmartContracts() {
    // Verificar si el sc estado está en la red blockchain
    const code = await this.web3.eth.getCode(estadoAddress);
    // Si el code es distinto de 0x -> el contrato está desplegado
    if ( code !== '0x' ) {
      this.estadoInstance = new this.web3.eth.Contract(estadoABI, estadoAddress);

      // añadir listener para el evento AsignaturaCreada
      this.estadoInstance.events.AsignaturaCreada({}, ( error, result ) => {
        if ( !error ) {
          const contratoAsignatura = new this.web3.eth.Contract(asignaturaTokenABI, result.returnValues.asignatura);
          this.asignaturas.set(result.returnValues.asignatura, contratoAsignatura);
          this.consola$.next('Registrada asignatura: ' + result.returnValues.nombre + ' (' +
            result.returnValues.simbolo +  '),\nen la dirección: ' + result.returnValues.asignatura);

          // salvar en el localstorage
          const item = {address: result.returnValues.asignatura, nombre: result.returnValues.nombre,
              simbolo: result.returnValues.simbolo, creditos: result.returnValues.creditos};
          let items: Array<{address: string, nombre: string, simbolo: string, creditos: number}>;
          items = this.blockchainLocalStorage.get("asignaturas");
          if ( items === null ) {
            items = [];
          }
          items.push(item);
          this.blockchainLocalStorage.save("asignaturas", items);

        } else {
          this.consola$.next('Error: ' + error);
        }
      });
    }

    // Verificar si el sc ects está en la red blockchain
    const code2 = await this.web3.eth.getCode(ectsTokenAddress);
    // Si el code es distinto de 0x -> el contrato está desplegado
    if ( code2 !== '0x' ) {
      this.ectsTokenInstance = new this.web3.eth.Contract(ectsTokenABI, ectsTokenAddress);
    }
  }

  /**
   * Retorna si ha sido parametrizado on-chain la app
   */
  isParametrizado() {
    return (this.blockchainLocalStorage.get("universidades") !== null &&
    this.blockchainLocalStorage.get("profesores") !== null &&
    this.blockchainLocalStorage.get("alumnos") !== null &&
    this.blockchainLocalStorage.get("asignaturas") !== null &&
    this.blockchainLocalStorage.get("confFinalizada") === true &&
    this.blockchainLocalStorage.get("estado") === accountEstado);
  }

  /**
   * Permite al estado parametrizar on-chain
   */
  async inicializarEntidades(addressFrom: string) {
    // save en localstorage el estado
    this.blockchainLocalStorage.save( 'estado', accountEstado);

    // registrar universidades on-chain
    await this.registrarUniversidad(addressFrom, accountUniversidad1);
    await this.registrarUniversidad(addressFrom, accountUniversidad2);

    // save en localstorage
    let universidades: Array<{address: string, nombre: string}> = [];
    universidades.push({address: accountUniversidad1, nombre: 'UNIR'});
    universidades.push({address: accountUniversidad2, nombre: 'UNEX'});
    this.blockchainLocalStorage.save( 'universidades', universidades);

    // registrar profesor on-chain
    await this.registrarProfesor(addressFrom, accountProfesor);

    // save en localstorage
    let profesores: Array<{address: string, nombre: string, apellidos: string, email: string}> = [];
    profesores.push({address: accountProfesor, nombre: 'Jose Luis', apellidos: 'Nieto García', email: 'jlnieto@gmail.com'});
    this.blockchainLocalStorage.save( 'profesores', profesores);

    // registrar alumno
    await this.registrarAlumno(addressFrom, accountAlumno);

    // save en localstorage
    let alumnos: Array<{address: string, nombre: string, apellidos: string, email: string}> = [];
    alumnos.push({address: accountAlumno, nombre: 'Javier', apellidos: 'Montesinos Morcillo', email: 'fj.montesinos@gmail.com'});
    this.blockchainLocalStorage.save( 'alumnos', alumnos);

    // crear asignatura 1
    await this.registrarAsignatura(addressFrom, 'Desarrollo de Aplicaciones Blockchain', 'DAB', 6, 3);

    // // crear asignatura 2
    await this.registrarAsignatura(addressFrom, 'Trabajo Final de Experto', 'TFE', 8, 3);
  }

  async registrarUniversidades( addressFrom: string ) {
    // registrar universidad / profesor en asignatura
    for (let a of this.asignaturas.keys()) {
      await this.registrarUnivesidadEnAsignatura(addressFrom, a, accountUniversidad1, accountProfesor);
    }

    this.blockchainLocalStorage.save("confFinalizada", true);
  }

  /**
   * Registra una universidad on-chain
   * @param _account
   */
  async registrarUniversidad( addressFrom: string, _account : string ) {
    // todo llamada al smart contract que crea la universidad
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods.registrarUniversidad(
      _account
    ).estimateGas({from: addressFrom});

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.registrarUniversidad(
        _account
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          this.consola$.next('Universidad registrada para la dirección: ' + _account);
        } else {
          this.consola$.next('Error: ' + error);
        }
    });

  }

  /**
   * Registrar un profesor on-chain
   * @param _account
   */
  async registrarProfesor( addressFrom: string, _account : string ) {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods.registrarProfesor(
      _account
    ).estimateGas({from: addressFrom});

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.registrarProfesor(
        _account
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          this.consola$.next('Profesor registrado para la dirección: ' + _account);
        } else {
          this.consola$.next('Error: ' + error);
        }
    });
  }

  /**
   * Registra un alumno on-chain
   * @param _account
   */
  async registrarAlumno( addressFrom: string, _account : string ) {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods.registrarAlumno(
      _account
    ).estimateGas({from: addressFrom});

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.registrarAlumno(
        _account
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          this.consola$.next('Alumno registrado para la dirección: ' + _account);
        } else {
          this.consola$.next('Error: ' + error);
        }
    });
  }

  /**
   * Registra una asignatura on-chain
   * @param _nombre
   * @param _simbolo
   * @param _creditos
   * @param _experimentabilidad
   */
  async registrarAsignatura( addressFrom: string, nombre: string, simbolo: string, creditos: number, experimentabilidad: number ) {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods.crearAsignatura(
      nombre, simbolo, creditos, experimentabilidad
    ).estimateGas({from: addressFrom});

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.crearAsignatura(
      nombre, simbolo, creditos, experimentabilidad
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    });

  }

  /**
   * Registra una universidad y asignatura en una asignatura on-chain
   * @param _asignatura
   * @param _universidad
   * @param _profesor
   */
  async registrarUnivesidadEnAsignatura(addressFrom: string, asignatura: string, universidad: string, profesor: string) {
    console.log(asignatura);
    // Estimar el gas necesario
    const estimatedGas = await this.asignaturas.get(asignatura).methods.registrarUniversidadProfesor(
      universidad, profesor
    ).estimateGas({from: addressFrom});

    // ejecutar el añadido de la claim en la identidad del alumno
    this.asignaturas.get(asignatura).methods.registrarUniversidadProfesor(
      universidad, profesor
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          this.consola$.next('Registrada universidad / profesor:\n' + universidad + ' / ' + profesor + '\nen asignatura: ' + asignatura);
        } else {
          this.consola$.next('Error: ' + error);
        }
    });


  }





}
