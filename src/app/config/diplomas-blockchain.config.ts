// ENUMERACIONES NECESARIAS EN LA APP
// .......................................................
// TIPOS DE PROPOSITOS PARA LAS KEYS
export enum PURPOSE_TYPES {MANAGEMENT = 1, ACTION, CLAIM, ENCRYPTION}
// TIPOS DE KEYS
export enum KEY_TYPES {ECDSA = 1, RSA}
// TIPOS DE CLAIMS
export enum CLAIM_TYPES {TITULO_ACADEMICO = 4}

// CONEXIÓN AL SERVICIO RCP DE GANACHE
// .......................................................
export const RCP_URL_HTTP = 'http://localhost:8545';
export const RCP_URL_WS = 'ws://localhost:8545';

// Direcciones de los diferentes, usuarios
// .......................................................
// Direcciones asociadas al alumno (wallet y dirección del SmartContract ClaimHolder)
export const addressAlumno = '0x5c4756bb912dea209b94587d4d761ace5d321054';
export const addressSmartContractAlumno = '0xCDa08398d531B34fCDF6abFa40CEfd6fb399DA1A';
// Direcciones asociadas a la universidad (wallet, dirección del SmartContract ClaimHolder y dirección para firmar Claims)
export const addressUniversidad = '0x951d59346352577920dbb5dca241fc5c346fe950';
export const addressSmartContractUniversidad = '0x64fAF8cAa1E5D5ded13AFab5cF2b986121269C5C';
export const addressUniversidadClaim = '0xFc83780Dd8bc6eAE4DEe1f12F7976251D2753DfD';
// Direcciones asociadas al alumno (wallet y dirección del SmartContract ClaimHolder)
export const addressEmpresa = '0x7a55fdcb796ba184fda57530af3303b5553efc56';
export const addressSmartContractEmpresa = '0xb1a0dEB41a2D4891fD5a107DB3214Dcc8764D8f7';

export const accountEstado = '0x5C4756bb912Dea209B94587D4d761aCE5d321054';
export const accountUniversidad1 = '0x951d59346352577920DbB5DCA241Fc5c346FE950';
export const accountProfesor = '0x7a55Fdcb796BA184fDA57530af3303b5553efC56';
export const accountAlumno = '0xFc83780Dd8bc6eAE4DEe1f12F7976251D2753DfD';
export const accountUniversidad2 = '0xE081280929D611D12EA7EcC7Cb700282755531BC';
