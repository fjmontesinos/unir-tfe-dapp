import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { claimHolderABI, claimHolderBytecode } from '../contracts/claimHolder';
import { claimVerifierABI, claimVerifierBytecode } from '../contracts/claimVerifier';
import { addressAlumno, addressUniversidad, addressEmpresa } from '../config/diplomas-blockchain.config';
import { KEY_TYPES, RCP_URL_WS, CLAIM_TYPES } from '../config/diplomas-blockchain.config';
import { identidades, IDENTITY_TYPE } from '../model/identidad-unir';
import { Subject, Observable } from 'rxjs';

import { accountEstado, accountUniversidad1, accountProfesor, accountAlumno, accountUniversidad2 } from '../config/diplomas-blockchain.config';
import { estadoAddress, ectsTokenAddress } from '../config/diplomas-blockchain.config';
import { estadoABI } from '../contracts/estado.smart.contract';
import { ectsTokenABI } from '../contracts/ectstoken.smart.contract';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class DiplomasBlockchainService {

  public consola$ = new Subject<string>();

  private totalIdentidadesDesplegadas = 0;
  private web3: any;

  constructor() {
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
    }

    // Verificar si el sc ects está en la red blockchain
    const code2 = await this.web3.eth.getCode(ectsTokenAddress);
    // Si el code es distinto de 0x -> el contrato está desplegado
    if ( code2 !== '0x' ) {
      this.ectsTokenInstance = new this.web3.eth.Contract(ectsTokenABI, ectsTokenAddress);
    }
  }

  // /**
  //  * Inicializa las instancias de los sc que representan a las identidades digitales
  //  * Para ello utiliza el abi de cada tipo de instancia ClaimHolder y
  //  * ClaimVerifier disponibles en la aplicación
  //  */
  // async initIdentidadesDigitales() {
  //   // inicializar las instancias de los SC en función del tipo de identidad
  //   for ( let identidad of identidades.values() ) {
  //     if ( identidad.type === IDENTITY_TYPE.CLAIM_HOLDER ) {
  //       identidad.instancia = new this.web3.eth.Contract(claimHolderABI, identidad.smartContractAddress);
  //     } else if ( identidad.type === IDENTITY_TYPE.CLAIM_VERIFIER ) {
  //       identidad.instancia = new this.web3.eth.Contract(claimVerifierABI, identidad.smartContractAddress);
  //     }

  //     // Verificar si el sc i.e. la identidad está desplegada en la red blockchain
  //     const code = await this.web3.eth.getCode(identidad.smartContractAddress);
  //     // Si el code es distinto de 0x -> el contrato está desplegado
  //     if ( code !== '0x' ) {
  //       this.totalIdentidadesDesplegadas++;
  //     }
  //   }

  //   // Si se han desplegado las 3 identidades ->
  //   // se añaden los listeners de eventos a las diferentes instancias
  //   if ( this.totalIdentidadesDesplegadas === 3 ) {
  //     // capturar evento para obtener el id de ejecución
  //     identidades.get(addressAlumno).instancia.events.ExecutionRequested({}, ( error, result ) => {
  //       if ( !error ) {
  //         const mensaje = 'CLAIM añadido con id de ejecución: ' + result.returnValues.executionId;
  //         this.consola$.next(mensaje);
  //       } else {
  //         this.consola$.next('Error: ' + error);
  //       }
  //     });

  //     // capturar evento para obtener claim valido
  //     identidades.get(addressEmpresa).instancia.events.ClaimValid({}, ( error, result ) => {
  //       if ( !error ) {
  //         this.consola$.next('CLAIM válido');
  //       } else {
  //         this.consola$.next('Error: ' + error);
  //       }
  //     });

  //     // capturar evento para obtener claim NO valido
  //     identidades.get(addressEmpresa).instancia.events.ClaimInvalid({}, ( error, result ) => {
  //       if ( !error ) {
  //         this.consola$.next('CLAIM NO válido');
  //       } else {
  //         this.consola$.next('Error: ' + error);
  //       }
  //     });
  //   }
  // }

  /**
   * Obtiene una key de un propósito concreto para una dirección concreto realizando la llamada
   * desde una dirección diferente. Hace uso de instancia.methods.getKeysByPurpose
   * @param addressFrom Dirección desde la que se realiza la petición
   * @param address Dirección a la que pertenece el sc sobre la que se realiza la consulta
   * @param purpose Tipo de próposito de la key que se desea obtener
   */
  async getKeyByPurpose( addressFrom: string, address: string, purpose: number ) {
    // Estimación del gas a utilizar
    const estimatedGas = await identidades.get(address).instancia.methods.getKeysByPurpose(purpose).estimateGas({
        from: addressFrom
      }
    );

    identidades.get(address).instancia.methods.getKeysByPurpose(purpose).call({
      from: addressFrom,
      gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
            if (result.length > 0) {
                this.consola$.next('Clave de tipo ' + purpose + ' de ' + address + ':\n'  + result);
            } else {
                this.consola$.next('La identidad de ' + address + ' no tiene clave de tipo: ' + purpose);
            }
        } else {
            this.consola$.next('Error: ' + error);
        }
    });
  }

  /**
   * Añadir clave a la universidad para firmar alegaciones. Hace uso de instacia.methods.addKey.
   * @param addressFrom Dirección desde la que se realiza la petición y por lo tanto vinculada al
   * sc sobre el que se desea añadir la key
   * @param purpose Tipo de próposito de la key que se desea añadir
   * @param type Tipo de key que se desea añadir
   */
  async addKeyUniversidad( addressFrom: string, purpose: number, type: number ) {
    // generación de la key en base a una segunda dirección que la identidad universidad
    // dispone para firmar alegaciones
    const claimKey = this.web3.utils.keccak256(identidades.get(addressFrom).accountClaim);

    // Estimación del gas a utilizar
    const estimatedGas = await identidades.get(addressFrom).instancia.methods.addKey(
      claimKey,
      purpose,
      type
    ).estimateGas({from: addressFrom});

    this.consola$.next('Gas estimado para añadir la key: ' + estimatedGas);

    // Usar la función instanciaUni.methods.addKey() de tipo CLAIM
    identidades.get(addressFrom).instancia.methods.addKey(
      claimKey,
      purpose,
      type
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          this.consola$.next('Añadida clave de tipo ' + purpose + ' para la dirección: ' +
            identidades.get(addressFrom).accountClaim + ':\n'
            + 'Key: ' + claimKey);
        } else {
          this.consola$.next('Error: ' + error);
        }
    });
  }

  /**
   *
   * @param addressFrom Dirección desde la que se realiza la petición y por lo tanto vinculada al
   * sc que emite la claim. Hace uso de instancia.methods.addClaim
   * @param alumnoAccount Dirección asociada a la identidad digital (sc) sobre la que se desea añadir
   * el claim concreto
   * @param alegacion Claim que se desea añadir
   */
  async addClaimUniversidadToAlumno( addressFrom: string, alumnoAccount: string, alegacion: string ) {
    const hexedData = this.web3.utils.asciiToHex(alegacion);
    // console.log('hexedData: ' + hexedData);

    const hashedDataToSign = this.web3.utils.soliditySha3(
      identidades.get(alumnoAccount).smartContractAddress,
      CLAIM_TYPES.TITULO_ACADEMICO,
      hexedData);
    // console.log('hashedData: ' + hashedDataToSign);

    const signature = await this.web3.eth.sign(hashedDataToSign, identidades.get(addressFrom).accountClaim);
    // console.log('signature: ' + signature);

    // Obtener Abi de instanciaAlumno.methods.addClaim()
    const claimAbi = await identidades.get(alumnoAccount).instancia.methods.addClaim(
        CLAIM_TYPES.TITULO_ACADEMICO, // Certificado de universidad
        KEY_TYPES.ECDSA, // ECDSA
        identidades.get(addressFrom).smartContractAddress,
        signature,
        hexedData,
        'sin url'
    ).encodeABI();
    // console.log('claimabi: ' + claimAbi);

    // Estimación del gas a utilizar
    const estimatedGas = await identidades.get(alumnoAccount).instancia.methods.execute(
      identidades.get(alumnoAccount).smartContractAddress,
      0,
      claimAbi
    ).estimateGas({from: addressFrom});

    this.consola$.next('Gas estimado para añadir el CLAIM: ' + estimatedGas);

    // ejecutar el añadido de la claim en la identidad del alumno
    identidades.get(alumnoAccount).instancia.methods.execute(
        identidades.get(alumnoAccount).smartContractAddress,
        0,
        claimAbi
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          this.consola$.next('CLAIM añadido a la identidad del alumno correctamente');

        } else {
          this.consola$.next('Error: ' + error);

        }
    });
  }

  /**
   * Aprobar la alegación añadida por la universidad al Alumno (approve). Hace uso de
   * instancia.methods.approve.
   * @param alumnoAccount Dirección asociada a la identidad digital (sc) sobre la que se desea aprobar
   * el claim concreto. Debe ser la del alumno.
   * @param executionId Id de ejecución asociado al claim que se desea aprobar.
   */
  async approbarClaimByAlumno( addressFrom: string, executionId: number ) {
    // Estimar el gas necesario
    const estimatedGas = await identidades.get(addressFrom).instancia.methods.approve(
      executionId,
      true
    ).estimateGas({from: addressFrom});

    this.consola$.next('Gas estimado para aprobar el CLAIM: ' + estimatedGas);

    // ejecutar el añadido de la claim en la identidad del alumno
    identidades.get(addressFrom).instancia.methods.approve(
        executionId,
        true
    ).send({
        from: addressFrom,
        gas: estimatedGas + 1
    }, (error: any, result: any) => {
        if (!error) {
          // console.log(result);
          this.consola$.next('CLAIM aprobado por el alumno');
        } else {
          this.consola$.next('Error: ' + error);
        }
    });
  }

  // Verificar la alegación por parte de la empresa (checkClaim)
  // de que una identidad tiene el claim solicitado es válido y está aprobado
  /**
   * Verificar la alegación añadida por la universidad al Alumno. Hace uso de
   * instancia.methods.checkClaim
   * @param addressFrom Dirección desde la que se desea realizar la verificación. Dado que es
   * una consulta pública no está restringido a ninguna dirección concreta.
   * @param alumnoAccount Dirección asociado a la identidad digital sobre la que se desea realizar
   * la verificación
   * @param tipoClaim Tipo de Claim que se desea verificar.
   */
  async verificarClaimIdentidadByEmpresa( addressFrom: string, alumnoAccount: string, tipoClaim: number) {
    // Estimar el gas necesario
    const estimatedGas = await identidades.get(addressEmpresa).instancia.methods.checkClaim(
        identidades.get(alumnoAccount).smartContractAddress,
        tipoClaim
    ).estimateGas({from: addressFrom});

    this.consola$.next('Gas estimado para verificar el CLAIM: ' + estimatedGas);

    //  Usar la función  instanciaEmpresa.methods.checkClaim()
    identidades.get(addressEmpresa).instancia.methods.checkClaim(
        identidades.get(alumnoAccount).smartContractAddress,
        tipoClaim
    ).send({
        from: addressFrom,
        gas: estimatedGas +  1
    }, (error: any, result: any) => {
        if (error) {
          this.consola$.next('Error: ' + error);
        }
    });
  }


  private parametrizado : boolean = false;

  /**
   * Retorna si ha sido parametrizado on-chain la app
   */
  isParametrizado() {
    return this.parametrizado;
  }

  /**
   * Permite al estado parametrizar on-chain
   */
  async parametrizar(addressFrom: string) {
    // registrar universidades
    await this.registrarUniversidad(addressFrom, accountUniversidad1);
    await this.registrarUniversidad(addressFrom, accountUniversidad2);

    // registrar profesor
    await this.registrarProfesor(addressFrom, accountProfesor);

    // registrar alumno
    await this.registrarAlumno(addressFrom, accountAlumno);

    // crear asignatura
    this.registrarAsignatura('Desarrollo de Aplicaciones Blockchain', 'DAB', 6, 3);

    // registrar universidad / profesor en asignatura
    this.registrarUnivesidadEnAsignatura('0x...', accountUniversidad1, accountProfesor);

    this.parametrizado = true;
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
    // todo llamada al smart contract que crea la universidad
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
  async registrarAsignatura( _nombre : string, _simbolo : string, _creditos : number, _experimentabilidad : number ) {
    // todo llamada al smart contract que crea la asignatura
    const direccionAsignatura = '0x...';
    this.consola$.next('Registrada asignatura: ' + _nombre + ', en la dirección: ' + direccionAsignatura);
  }

  /**
   * Registra una universidad y asignatura en una asignatura on-chain
   * @param _asignatura
   * @param _universidad
   * @param _profesor
   */
  async registrarUnivesidadEnAsignatura( _asignatura: string, _universidad: string, _profesor: string ) {
    // todo llamada al smart contract que registra el profesor en la asignatura
    this.consola$.next('Registrada universidad / profesor:\n' + _universidad + ' / ' + _profesor + '\nen asignatura: ' + _asignatura);
  }





}
