export const estadoABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_ectsTokenAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "AlumnoRegistrado",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "nombre",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "simbolo",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "creditos",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "experimentabilidad",
          "type": "uint256"
        }
      ],
      "name": "AsignaturaCreada",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "_anio",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_precio",
          "type": "uint256"
        }
      ],
      "name": "PrecioAnioMatriculaActualizado",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_precioCredito",
          "type": "uint256"
        }
      ],
      "name": "PrecioCreditoActualizado",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "_tipoPrecio",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_precio",
          "type": "uint256"
        }
      ],
      "name": "PrecioExperimentabilidadActualizado",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "ProfesorRegistrado",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_alumno",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_universidad",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokens",
          "type": "uint256"
        }
      ],
      "name": "TokensComprados",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_precioCredito",
          "type": "uint256"
        }
      ],
      "name": "UniversidadRegistrada",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_universidad",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_creditos",
          "type": "uint256"
        }
      ],
      "name": "calcularCreditosToWeis",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_universidad",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_experimentabilidad",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_anioMatricula",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_creditos",
          "type": "uint256"
        }
      ],
      "name": "calcularECTSTokensParaAsignatura",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAlumnos",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "getPrecioCredio",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getProfesores",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "getUniPreciosAnioMatricula",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "getUniPreciosExperimentabilidad",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getUniversidades",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "isAlumno",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "isProfesor",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "isUniversidad",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_anio",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_precio",
          "type": "uint256"
        }
      ],
      "name": "updatePrecioAnioMatricula",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_precioCredito",
          "type": "uint256"
        }
      ],
      "name": "updatePrecioCredito",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_tipo",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_precio",
          "type": "uint256"
        }
      ],
      "name": "updatePrecioExperimentabilidad",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAsignaturas",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "registrarUniversidad",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "registrarAlumno",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_cuenta",
          "type": "address"
        }
      ],
      "name": "registrarProfesor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_universidad",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_creditos",
          "type": "uint256"
        }
      ],
      "name": "comprarTokens",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_creditos",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_experimentabilidad",
          "type": "uint256"
        }
      ],
      "name": "crearAsignatura",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferECTSTokens",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "asignaturaAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_matriculaId",
          "type": "uint256"
        }
      ],
      "name": "transferAsginaturaToken",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];