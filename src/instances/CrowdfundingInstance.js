import { ethers } from "ethers"

const address = "0x247da571BBD9234668FB01F18F570b2e270fe835"
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "projectOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "projectTitle",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "projectDesc",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "goalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imgHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "name": "ProjectCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "durationInDays",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountToRaise",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "imgHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "name": "createProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "returnAllProjects",
    "outputs": [
      {
        "internalType": "contract Project[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

const CrowdfundingInstance = (providerOrSigner) => {
  const instance = new ethers.Contract(address, abi, providerOrSigner)
  return instance
}

export default CrowdfundingInstance