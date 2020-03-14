import { Injectable } from "@angular/core";
import Web3 from "web3";
import {
  RCP_URL_WS,
  LOCAL_STORAGE_KEY_UNIVERSIDADES,
  LOCAL_STORAGE_KEY_PROFESORES,
  LOCAL_STORAGE_KEY_ALUMNOS,
  LOCAL_STORAGE_KEY_ASIGNATURAS,
  LOCAL_STORAGE_KEY_ENTIDADES_REG,
  LOCAL_STORAGE_KEY_UNIVERSIDADES_REG,
  LOCAL_STORAGE_KEY_ESTADO
} from "../config/blockchain.dapp.config";
import { Subject, Observable } from "rxjs";
import {
  accountEstado,
  accountUniversidad1,
  accountProfesor,
  accountAlumno,
  accountUniversidad2
} from "../config/blockchain.dapp.config";
import {
  estadoAddress,
  ectsTokenAddress
} from "../config/blockchain.dapp.config";
import { estadoABI } from "../contracts/estado.smart.contract";
import { ectsTokenABI } from "../contracts/ectstoken.smart.contract";
import { asignaturaTokenABI } from "../contracts/asignaturatoken.smart.contracts";
import { BlockchainLocalStorageService } from "./localstorage.service";

declare let window: any;

@Injectable({
  providedIn: "root"
})
export class BlockchainService {
  private consola$ = new Subject<string>();
  private balanceEther$ = new Subject<number>();
  private balanceECTS$ = new Subject<number>();
  private balanceAsignaturaToken$ = new Subject<number>();

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

  getBalanceEther$(): Observable<number> {
    return this.balanceEther$.asObservable();
  }

  getBalanceECTS$(): Observable<number> {
    return this.balanceECTS$.asObservable();
  }

  getBalanceAsignaturaToken$(): Observable<number> {
    return this.balanceAsignaturaToken$.asObservable();
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
    window.web3 = new Web3(
      new Web3.providers.WebsocketProvider(RCP_URL_WS),
      null,
      optionsProvider
    );
    this.web3 = window.web3;

    // inicializar las instancias de los sc que representan las identidades digitales
    this.initSmartContracts();
  }

  /**
   * Inicialización de los smart contracts basados en su código ABI.
   *
   */
  async initSmartContracts() {
    // Verificar si el sc estado está en la red blockchain
    const code = await this.web3.eth.getCode(estadoAddress);
    // Si el code es distinto de 0x -> el contrato está desplegado
    if (code !== "0x") {
      this.estadoInstance = new this.web3.eth.Contract(
        estadoABI,
        estadoAddress
      );

      // añadir listener para el evento AsignaturaCreada
      this.estadoInstance.events.AsignaturaCreada({}, (error, result) => {
        if (!error) {
          const contratoAsignatura = new this.web3.eth.Contract(
            asignaturaTokenABI,
            result.returnValues.asignatura
          );
          this.asignaturas.set(
            result.returnValues.asignatura,
            contratoAsignatura
          );
          this.consola$.next(
            "Registrada asignatura: " +
              result.returnValues.nombre +
              " (" +
              result.returnValues.simbolo +
              "),\nen la dirección: " +
              result.returnValues.asignatura
          );

          // salvar en el localstorage
          const item = {
            address: result.returnValues.asignatura,
            nombre: result.returnValues.nombre,
            simbolo: result.returnValues.simbolo,
            creditos: result.returnValues.creditos.toString(),
            experimentabilidad:
              parseInt(result.returnValues.experimentabilidad.toString()) + 1
          };
          let items: Array<{
            address: string;
            nombre: string;
            simbolo: string;
            creditos: number;
          }>;
          items = this.blockchainLocalStorage.get(
            LOCAL_STORAGE_KEY_ASIGNATURAS
          );
          if (items === null) {
            items = [];
          }
          items.push(item);
          this.blockchainLocalStorage.save(
            LOCAL_STORAGE_KEY_ASIGNATURAS,
            items
          );
        } else {
          this.consola$.next("Error: " + error);
        }
      });
    }

    // Verificar si el sc ects está en la red blockchain
    const code2 = await this.web3.eth.getCode(ectsTokenAddress);
    // Si el code es distinto de 0x -> el contrato está desplegado
    if (code2 !== "0x") {
      this.ectsTokenInstance = new this.web3.eth.Contract(
        ectsTokenABI,
        ectsTokenAddress
      );
    }
  }

  /**
   * Retorna si ha sido parametrizado on-chain la app
   */
  isParametrizado() {
    return (
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_UNIVERSIDADES) !==
        null &&
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_PROFESORES) !== null &&
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ALUMNOS) !== null &&
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ASIGNATURAS) !== null &&
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ENTIDADES_REG) ===
        true &&
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_UNIVERSIDADES_REG) ===
        true &&
      this.blockchainLocalStorage.get(LOCAL_STORAGE_KEY_ESTADO) ===
        accountEstado
    );
  }

  /**
   * Paso 1 de la inicialización Permite al estado parametrizar on-chain
   */
  async inicializarEntidades(addressFrom: string) {
    // save en localstorage el estado
    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_ESTADO, accountEstado);

    // registrar universidades on-chain
    await this.registrarUniversidad(addressFrom, accountUniversidad1);
    await this.registrarUniversidad(addressFrom, accountUniversidad2);

    // save en localstorage
    let universidades: Array<{ address: string; nombre: string }> = [];
    universidades.push({ address: accountUniversidad1, nombre: "UNIR" });
    universidades.push({ address: accountUniversidad2, nombre: "UNEX" });
    this.blockchainLocalStorage.save(
      LOCAL_STORAGE_KEY_UNIVERSIDADES,
      universidades
    );

    // registrar profesor on-chain
    await this.registrarProfesor(addressFrom, accountProfesor);

    // save en localstorage
    let profesores: Array<{
      address: string;
      nombre: string;
      apellidos: string;
      email: string;
    }> = [];
    profesores.push({
      address: accountProfesor,
      nombre: "Jose Luis",
      apellidos: "Nieto García",
      email: "jlnieto@gmail.com"
    });
    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_PROFESORES, profesores);

    // registrar alumno
    await this.registrarAlumno(addressFrom, accountAlumno);

    // save en localstorage
    let alumnos: Array<{
      address: string;
      nombre: string;
      apellidos: string;
      email: string;
    }> = [];
    alumnos.push({
      address: accountAlumno,
      nombre: "Javier",
      apellidos: "Montesinos Morcillo",
      email: "fj.montesinos@gmail.com"
    });
    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_ALUMNOS, alumnos);

    // crear asignatura 1
    await this.registrarAsignatura(
      addressFrom,
      "Desarrollo de Aplicaciones Blockchain",
      "DAB",
      6,
      3
    );

    // // crear asignatura 2
    await this.registrarAsignatura(
      addressFrom,
      "Trabajo Final de Experto",
      "TFE",
      8,
      3
    );

    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_ENTIDADES_REG, true);
  }

  /**
   * Paso 2 de la inicialización para registrar en las diferentes asignaturas
   * disponibles on-chain a las universidades y profesores necesarios
   * @param addressFrom
   */
  async registrarUniversidades(addressFrom: string) {
    // registrar universidad / profesor en asignatura
    for (let a of this.asignaturas.keys()) {
      await this.registrarUnivesidadEnAsignatura(
        addressFrom,
        a,
        accountUniversidad1,
        accountProfesor
      );
    }

    this.blockchainLocalStorage.save(LOCAL_STORAGE_KEY_UNIVERSIDADES_REG, true);
  }

  /**
   * Registra una universidad on-chain
   * @param _account
   */
  async registrarUniversidad(addressFrom: string, _account: string) {
    // todo llamada al smart contract que crea la universidad
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods
      .registrarUniversidad(_account)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.registrarUniversidad(_account).send(
      {
        from: addressFrom,
        gas: estimatedGas + 1
      },
      (error: any, result: any) => {
        if (!error) {
          this.consola$.next(
            "Universidad registrada para la dirección: " + _account
          );
        } else {
          this.consola$.next("Error: " + error);
        }
      }
    );
  }

  /**
   * Registrar un profesor on-chain
   * @param _account
   */
  async registrarProfesor(addressFrom: string, _account: string) {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods
      .registrarProfesor(_account)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.registrarProfesor(_account).send(
      {
        from: addressFrom,
        gas: estimatedGas + 1
      },
      (error: any, result: any) => {
        if (!error) {
          this.consola$.next(
            "Profesor registrado para la dirección: " + _account
          );
        } else {
          this.consola$.next("Error: " + error);
        }
      }
    );
  }

  /**
   * Registra un alumno on-chain
   * @param _account
   */
  async registrarAlumno(addressFrom: string, _account: string) {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods
      .registrarAlumno(_account)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods.registrarAlumno(_account).send(
      {
        from: addressFrom,
        gas: estimatedGas + 1
      },
      (error: any, result: any) => {
        if (!error) {
          this.consola$.next(
            "Alumno registrado para la dirección: " + _account
          );
        } else {
          this.consola$.next("Error: " + error);
        }
      }
    );
  }

  /**
   * Registra una asignatura on-chain
   * @param _nombre
   * @param _simbolo
   * @param _creditos
   * @param _experimentabilidad
   */
  async registrarAsignatura(
    addressFrom: string,
    nombre: string,
    simbolo: string,
    creditos: number,
    experimentabilidad: number
  ) {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods
      .crearAsignatura(nombre, simbolo, creditos, experimentabilidad)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    this.estadoInstance.methods
      .crearAsignatura(nombre, simbolo, creditos, experimentabilidad)
      .send({
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
  async registrarUnivesidadEnAsignatura(
    addressFrom: string,
    asignatura: string,
    universidad: string,
    profesor: string
  ) {
    // Estimar el gas necesario
    const estimatedGas = await this.asignaturas
      .get(asignatura)
      .methods.registrarUniversidadProfesor(universidad, profesor)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    this.asignaturas
      .get(asignatura)
      .methods.registrarUniversidadProfesor(universidad, profesor)
      .send(
        {
          from: addressFrom,
          gas: estimatedGas + 1
        },
        (error: any, result: any) => {
          if (!error) {
            this.consola$.next(
              "Registrada universidad / profesor:\n" +
                universidad +
                " / " +
                profesor +
                "\nen asignatura: " +
                asignatura
            );
          } else {
            this.consola$.next("Error: " + error);
          }
        }
      );
  }

  /**
   * Obtiene el balance en tokens ECTS de una cuenta
   * @param cuenta
   */
  async getBalanceECTSToken(cuenta: string) {
    // Estimar el gas necesario
    const estimatedGas = await this.ectsTokenInstance.methods
      .balanceOf(cuenta)
      .estimateGas({ from: cuenta });

    // ejecutar el añadido de la claim en la identidad del alumno
    this.ectsTokenInstance.methods.balanceOf(cuenta).call(
      {
        from: cuenta,
        gas: estimatedGas + 1
      },
      (error: any, balance: any) => {
        if (error) {
          this.consola$.next("Error: " + error);
          this.balanceECTS$.next(0);
        } else {
          this.balanceECTS$.next(balance);
        }
      }
    );
  }

  /**
   * Obtiene el balance en tokens ECTS de una cuenta para una universidad concreta
   * @param cuenta
   */
  async getBalanceECTSTokenPorUniversidad(addressFrom: string, universidad: string): Promise<any> {
    // Estimar el gas necesario
    const estimatedGas = await this.ectsTokenInstance.methods
      .getTokensPorUniversidad(universidad)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    return new Promise((resolve, reject) => {
      this.ectsTokenInstance.methods
        .getTokensPorUniversidad(
          universidad
        )
        .call(
          {
            from: addressFrom,
            gas: estimatedGas + 1
          },
          (error: any, tokens: any) => {
            if (error) {
              this.consola$.next('Error: ' + error);
              reject(0);
            } else {
              resolve(tokens);
            }
          }
        );
    }) as Promise<any>;
  }

  /**
   * Obtiene el balance de una cuenta en weis
   * @param cuenta
   */
  async getBalanceEther(cuenta: string) {
    // ejecutar el añadido de la claim en la identidad del alumno
    this.web3.eth.getBalance(cuenta, (error: any, balance: any) => {
      if (error) {
        this.consola$.next("Error: " + error);
        this.balanceEther$.next(0);
      } else {
        this.balanceEther$.next(balance);
      }
    });
  }

  /**
   * Calcula los ECTS necesarios para matricularnos en una asignatura de una universidad
   * El precio se basa en la universidad dado que esta puede tener hasta 4 factores de correción
   * configurados para 4 distintos grados de experimentabilidad de la asigntura. Del mismo
   * modo la universidad dispone 4 factores de corrección configurados según el año de matrícula
   * del alumno en la asignatura
   * @param addressFrom
   * @param universidad
   * @param experimentabilidad
   * @param anioMatricula
   * @param creditos
   */
  async calcularECTS(
    addressFrom: string,
    universidad: string,
    experimentabilidad: number,
    anioMatricula: number,
    creditos: number
  ): Promise<any> {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods
      .calcularECTSTokensParaAsignatura(
        universidad,
        experimentabilidad,
        anioMatricula,
        creditos
      )
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    return new Promise((resolve, reject) => {
      this.estadoInstance.methods
        .calcularECTSTokensParaAsignatura(
          universidad,
          experimentabilidad,
          anioMatricula,
          creditos
        )
        .call(
          {
            from: addressFrom,
            gas: estimatedGas + 1
          },
          (error: any, tokens: any) => {
            if (error) {
              this.consola$.next("Error: " + error);
              reject(0);
            } else {
              resolve(tokens);
            }
          }
        );
    }) as Promise<any>;
  }

  /**
   * Calcula los weis necesarios para adquirir X tokens en una universidad
   * El precio retornado está basado en el precio configurado on-chain
   * por la universidad para cada 0,0001 ECTS Token
   * @param addressFrom
   * @param universidad
   * @param tokens
   */
  async calcularWeis(
    addressFrom: string,
    universidad: string,
    tokens: number
  ): Promise<any> {
    // Estimar el gas necesario
    const estimatedGas = await this.estadoInstance.methods
      .calcularTokensToWeis(universidad, tokens)
      .estimateGas({ from: addressFrom });

    // ejecutar el añadido de la claim en la identidad del alumno
    return new Promise((resolve, reject) => {
      this.estadoInstance.methods
        .calcularTokensToWeis(universidad, tokens)
        .call(
          {
            from: addressFrom,
            gas: estimatedGas + 1
          },
          (error: any, weis: any) => {
            if (error) {
              this.consola$.next("Error: " + error);
              reject(0);
            } else {
              resolve(weis);
            }
          }
        );
    }) as Promise<any>;
  }

  /**
   * Permite comprar a un alumno los tokens necesarios a una universidad realizando
   * el pago de los weis necesarios
   * @param addressFrom
   * @param universidad
   * @param tokens
   * @param weis
   */
  async comprarTokens(
    addressFrom: string,
    universidad: string,
    tokens: number,
    weis: number
  ) {
    this.estadoInstance.methods.comprarTokens(universidad, tokens).send(
      {
        from: addressFrom,
        gas: 120000,
        value: weis
      },
      (error: any, r: any) => {
        if (error) {
          this.consola$.next("Error: " + error);
        }
      }
    );
  }

  async matricularEnAsignatura(addressFrom: string, universidad: string, asignatura: string, curso: string) {
    const contratoAsignatura = new this.web3.eth.Contract(
      asignaturaTokenABI,
      asignatura
    );
    // Estimar el gas necesario
    const estimatedGas = await contratoAsignatura.methods.matricular(universidad, curso)
      .estimateGas({ from: addressFrom });

    // realizar la matrícula del alumno en la asignatura
    contratoAsignatura.methods.matricular(universidad, curso).send(
      {
        from: addressFrom,
        gas: estimatedGas + 1
      },
      (error: any, r: any) => {
        if (error) {
          this.consola$.next("Error: " + error);
        }
      }
    );
  }
}
