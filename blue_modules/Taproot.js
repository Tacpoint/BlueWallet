import AsyncStorage from '@react-native-async-storage/async-storage';

const schnorr = require('bip-schnorr');
const Buffer = require('safe-buffer').Buffer;

const FUNDING_ADDRESS = 'funding_address_';
const VAULT_ADDRESS = 'vault_address_';
const USED_PUB_KEYS = 'used_pub_keys_';
const API_SERVER = 'http://52.10.139.220:8080';
const FUNDING_TX_LOCKTIME = 144;

module.exports.FUNDING_TX_LOCKTIME = FUNDING_TX_LOCKTIME;

module.exports.spendFundingLender = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, borrowerHash, spendingTxHex, inputTxHex, borrowerSig, borrowerPreImage, lenderSig) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('lenderPubKey', pubKeyLender);
    form_data.append('borrowerHash', borrowerHash);
    form_data.append('spendingTxHex', spendingTxHex);
    form_data.append('inputTxHex', inputTxHex);
    form_data.append('scriptPathIndex', '1');
    form_data.append('borrowerSig', borrowerSig);
    form_data.append('lenderSig', lenderSig);
    form_data.append('borrowerPreImage', borrowerPreImage);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/spendFundingLender',form_data);

    console.log("Taproot.spendFundingLender() : "+JSON.stringify(response.data));

    let signedTx = response.data['LenderFundingSpendTxHex'];

    return signedTx;

};

module.exports.spendVaultBorrower = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, lenderHash, 
                                                    lenderHashPreImage, spendingTxHex, inputTxHex, numBlocks, scriptPathIndex, borrowerSig) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('lenderPubKey', pubKeyLender);
    form_data.append('lenderHash', lenderHash);
    form_data.append('lenderPreImage', lenderHashPreImage);
    form_data.append('spendingTxHex', spendingTxHex);
    form_data.append('inputTxHex', inputTxHex);
    form_data.append('scriptPathIndex', scriptPathIndex);
    form_data.append('numBlocks', numBlocks);
    form_data.append('borrowerSig', borrowerSig);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/spendVaultBorrower',form_data);

    console.log("Taproot.spendVaultBorrower() : "+JSON.stringify(response.data));

    let signedTx = response.data['BorrowerVaultSpendTxHex'];

    return signedTx;

};

module.exports.spendFundingBorrower = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, borrowerHash, spendingTxHex, inputTxHex, scriptPathIndex, borrowerSig) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('lenderPubKey', pubKeyLender);
    form_data.append('borrowerHash', borrowerHash);
    form_data.append('spendingTxHex', spendingTxHex);
    form_data.append('inputTxHex', inputTxHex);
    form_data.append('scriptPathIndex', scriptPathIndex);
    form_data.append('borrowerSig', borrowerSig);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/spendFundingBorrower',form_data);

    console.log("Taproot.spendFundingBorrower() : "+JSON.stringify(response.data));

    let signedTx = response.data['BorrowerFundingSpendTxHex'];

    return signedTx;

};

module.exports.createVaultSigHash = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, lenderHash, spendingTxHex, inputTxHex, numBlocks, scriptPathIndex) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('lenderHash', lenderHash);
    form_data.append('lenderPubKey', pubKeyLender);
    form_data.append('spendingTxHex', spendingTxHex);
    form_data.append('inputTxHex', inputTxHex);
    form_data.append('numBlocks', numBlocks);
    form_data.append('scriptPathIndex', scriptPathIndex);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/createVaultSighash',form_data);

    console.log("Taproot.createVaultSigHash() : "+JSON.stringify(response.data));

    let sigHash = response.data['Sighash'];

    return sigHash;

};

module.exports.createFundingSigHash = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, borrowerHash, spendingTxHex, inputTxHex, scriptPathIndex) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('lenderPubKey', pubKeyLender);
    form_data.append('borrowerHash', borrowerHash);
    form_data.append('spendingTxHex', spendingTxHex);
    form_data.append('inputTxHex', inputTxHex);
    form_data.append('scriptPathIndex', scriptPathIndex);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/createFundingSighash',form_data);

    console.log("Taproot.createFundingSigHash() : "+JSON.stringify(response.data));

    let sigHash = response.data['Sighash'];

    return sigHash;

};

module.exports.createRawTransaction = async function (txId, vout, toAddress, amt, timeLockBlocks) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('txId', txId);
    form_data.append('vout', vout);
    form_data.append('address', toAddress);
    form_data.append('amt', amt);
    console.log("Taproot.createRawTransaction - timeLockBlocks : "+timeLockBlocks);
    if (timeLockBlocks >= FUNDING_TX_LOCKTIME) {
  
       console.log("Taproot.createRawTransaction - setting timeLockBlocks value : "+timeLockBlocks);
       form_data.append('timeLockBlocks', timeLockBlocks);
    }

    console.log("Taproot.createRawTransaction() amt : "+amt);
    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/createRawTransaction',form_data);

    console.log("Taproot.createRawTransaction() : "+JSON.stringify(response.data));

    let rawTxHex = response.data['TxHex'];

    return rawTxHex;

};

module.exports.getRawTransaction = async function (txId, tapAddress) {

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapAddress', tapAddress);
    form_data.append('txId', txId);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/getRawTransaction',form_data);

    console.log("Taproot.getRawTransaction() : "+JSON.stringify(response.data));
    let rawTxHex = response.data['RawTxHex'];
    let voutIndex = response.data['TxVout'];
    let confirmations = response.data['Confirmations'];

    var txResult = {
       "rawTxHex": rawTxHex,
       "voutIndex": voutIndex,
       "confirmations": confirmations
    }

    var txJson = JSON.stringify(txResult);

    return txJson;

};

module.exports.createFundingTxAddress = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, borrowerHash, walletID) {


    let taprootFundingAddress;

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('borrowerHash', borrowerHash);
    form_data.append('lenderPubKey', pubKeyLender);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/createFundingTxAddress',form_data);

    console.log(response.data);
    taprootFundingAddress = response.data['FundingTxAddress'];


    var fundingTx = {
       "taprootFundingPubKey": taprootPubKey,
       "lenderFundingPubKey": pubKeyLender,
       "borrowerFundingPubKey": pubKeyBorrower,
       "borrowerHash": borrowerHash,
       "vaultAddress": '',
       "walletID": walletID
    }

    var fundingTxJson = JSON.stringify(fundingTx);

    //
    // for cleaning up storage only and setting one mainnet taproot address!
    //
    //taprootFundingAddress = 'bc1peetkcz7ztg9trjeys5zscm0w09jxmlsd94mywr7knulz23ywmxpq49ljqm';
    //const keys = await AsyncStorage.getAllKeys();
    //for (let i = 0; i < keys.length; i++) {
    //   console.log("Key : "+keys[i].toString());
    //   if (keys[i].indexOf(FUNDING_ADDRESS) == 0) {
    //      console.log("Removing key : "+keys[i]);
    //      await AsyncStorage.removeItem(keys[i]);
    //   }
    //   if (keys[i].indexOf(USED_PUB_KEYS) == 0) {
    //      console.log("Removing key : "+keys[i]);
    //      await AsyncStorage.removeItem(keys[i]);
    //   }
    //}
    // end for cleaning up storage only!
    
    AsyncStorage.setItem(FUNDING_ADDRESS+taprootFundingAddress, fundingTxJson);
 
    // now save the taproot funding address as part of an array for the given wallet Id so that it can be
    // retrieved later in order to verify if a specific BTC tx includes a taproot funding address

    var fundingTxAddresses = [];

    var savedFundingTxAddresses = await AsyncStorage.getItem(FUNDING_ADDRESS+walletID);

    if (savedFundingTxAddresses !== null) {
       fundingTxAddresses = JSON.parse(savedFundingTxAddresses);
    }

    fundingTxAddresses.push(taprootFundingAddress);

    AsyncStorage.setItem(FUNDING_ADDRESS+walletID, JSON.stringify(fundingTxAddresses));

    // now we save the borrower and lender pub keys separately so we can easily retrieve later when
    // attempting to make use of a new pub key and ensure the key hasn't been used in a previous Taproot tx

    var usedPubKeys = [];

    var savedUsedPubKeys = await AsyncStorage.getItem(USED_PUB_KEYS+walletID);

    if (savedUsedPubKeys !== null) {
       usedPubKeys = JSON.parse(savedUsedPubKeys);
    }

    usedPubKeys.push(pubKeyLender);
    if (pubKeyLender !== pubKeyBorrower) {
       usedPubKeys.push(pubKeyBorrower);
    }

    AsyncStorage.setItem(USED_PUB_KEYS+walletID, JSON.stringify(usedPubKeys));

    return taprootFundingAddress;

};

module.exports.createVaultTxAddress = async function (fundingTxAddress, taprootPubKey, pubKeyBorrower, pubKeyLender, lenderHash, numBlocks, walletID) {


    let taprootVaultAddress;

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('lenderPubKey', pubKeyLender);
    form_data.append('lenderHash', lenderHash);
    form_data.append('numBlocks', numBlocks);

    const response = await axios.post(API_SERVER+'/btc_vault_api-0.0.1-SNAPSHOT/btc/createVaultTxAddress',form_data);

    console.log(response.data);
    taprootVaultAddress = response.data['VaultTxAddress'];
 

    var vaultTx = {
       "taprootVaultPubKey": taprootPubKey,
       "lenderVaultPubKey": pubKeyLender,
       "borrowerVaultPubKey": pubKeyBorrower,
       "lenderHash": lenderHash,
       "numBlocks": numBlocks,
       "fundingAddress": fundingTxAddress,
       "walletID": walletID
    }

    var vaultTxJson = JSON.stringify(vaultTx);


    // store this vault address
    AsyncStorage.setItem(VAULT_ADDRESS+taprootVaultAddress, vaultTxJson);
 
    // now save the taproot vault address as part of an array for the given wallet Id so that it can be
    // retrieved later in order to verify if a specific BTC tx includes a taproot vault address

    var vaultTxAddresses = [];

    var savedVaultTxAddresses = await AsyncStorage.getItem(VAULT_ADDRESS+walletID);

    if (savedVaultTxAddresses !== null) {
       vaultTxAddresses = JSON.parse(savedVaultTxAddresses);
    }

    vaultTxAddresses.push(taprootVaultAddress);

    AsyncStorage.setItem(VAULT_ADDRESS+walletID, JSON.stringify(vaultTxAddresses));

    // now we save the borrower and lender pub keys separately so we can easily retrieve later when
    // attempting to make use of a new pub key and ensure the key hasn't been used in a previous Taproot tx

    var usedPubKeys = [];

    var savedUsedPubKeys = await AsyncStorage.getItem(USED_PUB_KEYS+walletID);

    if (savedUsedPubKeys !== null) {
       usedPubKeys = JSON.parse(savedUsedPubKeys);
    }

    usedPubKeys.push(pubKeyLender);
    if (pubKeyLender !== pubKeyBorrower) {
       usedPubKeys.push(pubKeyBorrower);
    }

    AsyncStorage.setItem(USED_PUB_KEYS+walletID, JSON.stringify(usedPubKeys));

    // finally, we'll update the existing Funding tx struct to include this Vault tx address

    let fundingTxInfo = await this.getFundingTxInfo(fundingTxAddress);
    fundingTxInfo.vaultAddress = taprootVaultAddress;
    await AsyncStorage.setItem(FUNDING_ADDRESS+fundingTxAddress, JSON.stringify(fundingTxInfo));

    console.log("Updated funding tx info struct : "+ JSON.stringify(fundingTxInfo));

    return taprootVaultAddress;

};


module.exports.getVaultTxInfo = async function (address) {

    var taprootInfo = await AsyncStorage.getItem(VAULT_ADDRESS+address);

    if (taprootInfo !== null) {
       taprootInfo = JSON.parse(taprootInfo);
    }

    console.log("getVaultTxInfo : "+taprootInfo.toString());
 
    return taprootInfo;

};

module.exports.getFundingTxInfo = async function (address) {

    var taprootInfo = await AsyncStorage.getItem(FUNDING_ADDRESS+address);

    if (taprootInfo !== null) {
       taprootInfo = JSON.parse(taprootInfo);
    }

    console.log("getFundingTxInfo : "+taprootInfo.toString());
 
    return taprootInfo;

};

module.exports.getVaultAddresses = async function (walletID) {

    var vaultTxAddresses = [];

    var savedVaultTxAddresses = await AsyncStorage.getItem(VAULT_ADDRESS+walletID);

    if (savedVaultTxAddresses !== null) {
       vaultTxAddresses = JSON.parse(savedVaultTxAddresses);
    }

    console.log("getVaultAddresses - Vault tx addresses for wallet Id : "+walletID+" "+vaultTxAddresses.toString());
 
    return vaultTxAddresses;

};

module.exports.getFundingAddresses = async function (walletID) {

    var fundingTxAddresses = [];

    var savedFundingTxAddresses = await AsyncStorage.getItem(FUNDING_ADDRESS+walletID);

    if (savedFundingTxAddresses !== null) {
       fundingTxAddresses = JSON.parse(savedFundingTxAddresses);
    }

    console.log("getFundingAddresses - Funding tx addresses for wallet Id : "+walletID+" "+fundingTxAddresses.toString());
 
    return fundingTxAddresses;

};

module.exports.findUsedPubKeys = async function (walletID) {

    var usedPubKeys = await AsyncStorage.getItem(USED_PUB_KEYS+walletID);


    if (usedPubKeys !== null) {
       usedPubKeys = JSON.parse(usedPubKeys);
       console.log("findUsedPubKeys : "+usedPubKeys.toString());
    }
    else {
       usedPubKeys = [];
       console.log("findUsedPubKeys : no used pub keys found for wallet Id : "+walletID);
    } 
 
    return usedPubKeys;
};
