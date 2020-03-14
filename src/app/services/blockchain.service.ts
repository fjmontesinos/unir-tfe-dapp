import { Injectable } from '@angular/core';
import Web3 from 'web3';
import {
  RCP_URL_WS,
  LOCAL_STORAGE_KEY_UNIVERSIDADES,
  LOCAL_STORAGE_KEY_PROFESORES,
  LOCAL_STORAGE_KEY_ALUMNOS,
  LOCAL_STORAGE_KEY_ASIGNATURAS,
  LOCAL_STORAGE_KEY_ENTIDADES_REG,
  LOCAL_STORAGE_KEY_UNIVERSIDADES_REG,
  LOCAL_STORAGE_KEY_ESTADO } from '../config/blockchain.dapp.config';
import { Subject, Observable } from 'rxjs';
import {
  accountEstado,
  accountUniversidad1,
  accountProfesor,
  accountAlumno,
  accountUniversidad2 } from '../config/blockchain.dapp.config';
import {
  estadoAddress,
  ectsTokenAddress } from '../config/blockchain.dapp.config';
import { estadoABI } from '../contracts/estado.smart.contract';
import { ectsTokenABI } from '../contracts/ectstoken.smart.contract';
import { asignaturaTokenABI } from '../contracts/asignaturatoken.smart.contracts';
import { BlockchainLocalStorageService } from './localstorage.service';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public consola$ = new Subject<string>();
  private web3: any;
  public asignaturas = new Map<string, any>();
  private estadoInstance: any;
  private ectsTokenInstance: any;

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
              simbolo: result.returnValues.simbolo, creditos: result.returnValues.creditos.toString()};
          let items: Array<{address: string, nombre: string, simbolo: string, creditos: number}>;
          items = this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ASIGNATURAS);
          if ( items === null ) {
            items = [];
          }
          items.push(item);
          this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_ASIGNATURAS, items);

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
    return (this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_UNIVERSIDADES) !== null &&
    this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_PROFESORES) !== null &&
    this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ALUMNOS) !== null &&
    this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ASIGNATURAS) !== null &&
    this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ENTIDADES_REG) === true &&
    this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_UNIVERSIDADES_REG) === true &&
    this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ESTADO) === accountEstado);
  }

  /**
   * Permite al estado parametrizar on-chain
   */
  async inicializarEntidades(addressFrom: string) {
    // save en localstorage el estado
    this.blockchainLocalStorage.save( LOCAL_STORAGE_KEY_ESTADO, accountEstado);

    // registrar universidades on-chain
    await this.registrarUniversidad(addressFrom, accountUniversidad1);
    await this.registrarUniversidad(addressFrom, accountUniversidad2);

    // save en localstorage
    let universidades: Array<{address: string, nombre: string}> = [];
    universidades.push({address: accountUniversidad1, nombre: 'UNIR'});
    universidades.push({address: accountUniversidad2, nombre: 'UNEX'});
    this.blockchainLocalStorage.save( LOCAL_STORAGE_KEY_UNIVERSIDADES, universidades);

    // registrar profesor on-chain
    await this.registrarProfesor(addressFrom, accountProfesor);

    // save en localstorage
    let profesores: Array<{address: string, nombre: string, apellidos: string, email: string}> = [];
    profesores.push({address: accountProfesor, nombre: 'Jose Luis', apellidos: 'Nieto García', email: 'jlnieto@gmail.com'});
    this.blockchainLocalStorage.save( LOCAL_STORAGE_KEY_PROFESORES, profesores);

    // registrar alumno
    await this.registrarAlumno(addressFrom, accountAlumno);

    // save en localstorage
    let alumnos: Array<{address: string, nombre: string, apellidos: string, email: string}> = [];
    alumnos.push({address: accountAlumno, nombre: 'Javier', apellidos: 'Montesinos Morcillo', email: 'fj.montesinos@gmail.com'});
    this.blockchainLocalStorage.save( LOCAL_STORAGE_KEY_ALUMNOS, alumnos);

    // crear asignatura 1
    await this.registrarAsignatura(addressFrom, 'Desarrollo de Aplicaciones Blockchain', 'DAB', 6, 3);

    // // crear asignatura 2
    await this.registrarAsignatura(addressFrom, 'Trabajo Final de Experto', 'TFE', 8, 3);

    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_ENTIDADES_REG, true);
  }

  async registrarUniversidades( addressFrom: string ) {
    // registrar universidad / profesor en asignatura
    for (let a of this.asignaturas.keys()) {
      await this.registrarUnivesidadEnAsignatura(addressFrom, a, accountUniversidad1, accountProfesor);
    }

    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_UNIVERSIDADES_REG, true);
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

  async getBalanceECTSToken(cuenta: string): Promise<any>{
    // Estimar el gas necesario
    const estimatedGas = await this.ectsTokenInstance.methods.balanceOf(
      cuenta
    ).estimateGas({from: cuenta});

    // ejecutar el añadido de la claim en la identidad del alumno
    return new Promise((resolve, reject) => {
      this.ectsTokenInstance.methods.balanceOf(
        cuenta
      ).call({
        from: cuenta,
        gas: estimatedGas + 1
      }, (error: any, balance: any) => {
        if (error) {
          this.consola$.next('Error: ' + error);
          reject(0);
        } else {
          resolve(balance);
        }
      });
    }) as Promise<any>;
  }

  async getBalanceEther(cuenta: string): Promise<any>{
    // ejecutar el añadido de la claim en la identidad del alumno
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(cuenta, (error: any, balance: any) => {
        if (error) {
          this.consola$.next('Error: ' + error);
          reject(0);
        } else {
          resolve(balance);
        }
      });
    }) as Promise<any>;
  }


  async calcularECTS(addressFrom: string, universidad: string,
      experimentabilidad: number, anioMatricula: number, creditos: number): Promise<any> {

        // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods.calcularECTSTokensParaAsignatura(
      universidad, experimentabilidad, anioMatricula, creditos
    ).estimateGas({from: addressFrom});

    // ejecutar el añadido de la claim en la identidad del alumno
    return new Promise((resolve, reject) => {
      this.estadoInstance.methods.calcularECTSTokensParaAsignatura(
        universidad, experimentabilidad, anioMatricula, creditos
      ).call({
        from: addressFrom,
        gas: estimatedGas + 1
      }, (error: any, tokens: any) => {
        if (error) {
          this.consola$.next('Error: ' + error);
          reject(0);
        } else {
          resolve(tokens);
        }
      });
    }) as Promise<any>;
  }



}
