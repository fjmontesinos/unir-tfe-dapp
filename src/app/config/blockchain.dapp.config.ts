// ENUMERACIONES NECESARIAS EN LA APP
// .......................................................
// ejemplo
// export enum PURPOSE_TYPES {MANAGEMENT = 1, ACTION, CLAIM, ENCRYPTION}

// CONEXIÓN AL SERVICIO RCP DE GANACHE
// .......................................................
export const RCP_URL_HTTP = 'http://localhost:8545';
export const RCP_URL_WS = 'ws://localhost:8545';

export const DAPP_TITULO = 'UNIR :: TFE - Digitalización Títulos Académicos';
export const ESTADO_NOMBRE = 'Estado';
export const WEIS_POR_ETHER = 1000000000000000000;
export const ECTS_DECIMALS = 10000;
export const NOTAS_DECIMALS = 100;

export const EXPERIMENTABILIDAD = [{id: 0, label: 'Exp. Grado 1'}, {id: 1, label: 'Exp. Grado 2'},
    {id: 2, label: 'Exp. Grado 3'}, {id: 3, label: 'Exp. Grado >= 4'}];

export const ANIOS_MATRICULA = [{id: 0, label: '1º Año'}, {id: 1, label: '2º Año'},
    {id: 2, label: '3º Año'}, {id: 3, label: '4º Año o superior'}];

export const LOCAL_STORAGE_KEY_ESTADO = 'estado';
export const LOCAL_STORAGE_KEY_UNIVERSIDADES = 'universidades';
export const LOCAL_STORAGE_KEY_PROFESORES = 'profesores';
export const LOCAL_STORAGE_KEY_ALUMNOS = 'alumnos';
export const LOCAL_STORAGE_KEY_ENTIDADES_REG = 'entidades-registradas';
export const LOCAL_STORAGE_KEY_ASIGNATURAS = 'asignaturas';
export const LOCAL_STORAGE_KEY_UNIVERSIDADES_REG = 'universidades-registradas';
export const LOCAL_STORAGE_KEY_MATRICULAS = 'matriculas';
export const LOCAL_STORAGE_KEY_MATRICULAS_EVALUADAS = 'matriculas-evaluadas';
export const LOCAL_STORAGE_KEY_APP_RECARGADA = 'app-recargada';

// Direcciones de los diferentes, usuarios
// .......................................................
export const accountEstado = '0x5C4756bb912Dea209B94587D4d761aCE5d321054';
export const accountUniversidad1 = '0x951d59346352577920DbB5DCA241Fc5c346FE950';
export const accountProfesor = '0x7a55Fdcb796BA184fDA57530af3303b5553efC56';
export const accountAlumno = '0xFc83780Dd8bc6eAE4DEe1f12F7976251D2753DfD';
export const accountUniversidad2 = '0xE081280929D611D12EA7EcC7Cb700282755531BC';

export const estadoAddress = '0xb482955f78b3a86a1d7275a7fa5bA122250424FF';
export const ectsTokenAddress = '0x4cAB8f9DFAefea8eb69261560a024cf9B3f0b69E';