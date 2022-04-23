export const loans = {
  LOAN_ADDRESS: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
  WBTC_ADDRESS: "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  RBTC_ADDRESS: "0xCfEB869F69431e42cdB54A4F4f105C19C080A601",
  
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "batchedLenderKeys1",
          "type": "string[]"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "batchedLenderKeys2",
          "type": "string[]"
        },
        {
          "indexed": false,
          "internalType": "bytes32[]",
          "name": "batchedLenderSecrets",
          "type": "bytes32[]"
        }
      ],
      "name": "AddBatchLenderBtcPubKeyAndSecret",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "hashedSecret",
          "type": "bytes32"
        }
      ],
      "name": "AddLenderSecret",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "lenderID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "pubKey1",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "pubKey2",
          "type": "string"
        }
      ],
      "name": "AssignNextLenderBtcPubKeyPair",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "lenderID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "hashedSecret",
          "type": "bytes32"
        }
      ],
      "name": "AssignNextLenderSecret",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "func",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "ConsoleLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "RequestLoan",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "SetLendableToken",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        }
      ],
      "name": "loanAssignedToLender",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "TotalAvailableFunds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userID",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "UserTotalVaultFunds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userID",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "UserVaultAvailFunds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "batchedLenderKeys1",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "batchedLenderKeys2",
          "type": "string[]"
        },
        {
          "internalType": "bytes32[]",
          "name": "batchedLenderSecrets",
          "type": "bytes32[]"
        }
      ],
      "name": "addBatchLenderBtcPubKeyAndSecret",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "addLender",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "btcPubKey",
          "type": "string"
        }
      ],
      "name": "addLenderBtcPubKey",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "hashedSecret",
          "type": "bytes32"
        }
      ],
      "name": "addLenderSecret",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lenderID",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "assignNextLenderBtcPubKeyPair",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lenderID",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "assignNextLenderSecret",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "getLenderBtcPubKeyPair",
      "outputs": [
        {
          "internalType": "string[2]",
          "name": "",
          "type": "string[2]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "LenderID",
          "type": "address"
        }
      ],
      "name": "getLenderBtcPubKeys",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "getLenderHashedSecret",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lenderID",
          "type": "address"
        }
      ],
      "name": "getNextLenderSecret",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "isAproved",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "isLendable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "lender",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "lenderGuarantee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userID",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "reservedFunds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        }
      ],
      "name": "setLendableToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "guarantee",
          "type": "uint256"
        }
      ],
      "name": "setLenderGuarantee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "secret",
          "type": "bytes32"
        }
      ],
      "name": "shaify",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lenderID",
          "type": "address"
        }
      ],
      "name": "lenderLoans",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "borrowerID",
          "type": "address"
        }
      ],
      "name": "borrowerLoans",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "getLoanDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "tokenID",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanTerm",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "lenderHashedSecret",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "lenderSecret",
              "type": "bytes32"
            },
            {
              "internalType": "string[2]",
              "name": "lenderBtcPubKeys",
              "type": "string[2]"
            },
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "borrowerHashedSecret",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "borrowerSecret",
              "type": "bytes32"
            },
            {
              "internalType": "string[2]",
              "name": "borrowerBtcPubKeys",
              "type": "string[2]"
            },
            {
              "internalType": "uint256",
              "name": "rate",
              "type": "uint256"
            },
            {
              "internalType": "enum Loans.FundsLocation",
              "name": "fundsLocation",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "locationExpiryDate",
              "type": "uint256"
            }
          ],
          "internalType": "struct Loans.Loan",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "getGuaranteePeriodEndTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "newExpiration",
          "type": "uint256"
        }
      ],
      "name": "setGuaranteePeriodEndTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "getEscrowToBorrowerEndTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "newExpiration",
          "type": "uint256"
        }
      ],
      "name": "setEscrowToBorrowerEndTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "getEscrowToLenderEndTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "newExpiration",
          "type": "uint256"
        }
      ],
      "name": "setEscrowToLenderEndTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanAmount",
          "type": "uint256"
        }
      ],
      "name": "loanApplicationFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "term",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "borrowerHashedSecret",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "borrowerBtcPubKey1",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "borrowerBtcPubKey2",
          "type": "string"
        }
      ],
      "name": "requestLoan",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "signedBtcTx",
          "type": "string"
        }
      ],
      "name": "addBorrowerSignedBtcTx",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "loanEscrowAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "fundLoanEscrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "balanceInRepayEscrow",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "fundRepaymentEscrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "secret",
          "type": "bytes32"
        }
      ],
      "name": "claimLoanEscrowFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "Secret",
          "type": "bytes32"
        }
      ],
      "name": "claimRepayEscrowFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "paymentDate",
          "type": "uint256"
        }
      ],
      "name": "getPaymentDemand",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "revertEscrowToLender",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "revertRepaymentToBorrower",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "claimAbandonmentFee",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "loanID",
          "type": "address"
        }
      ],
      "name": "claimInvalidSignedTxFee",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    }
  ],
};
