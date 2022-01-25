const schnorr = require('bip-schnorr');
const Buffer = require('safe-buffer').Buffer;

module.exports.createFundingTxAddress = async function (taprootPubKey, pubKeyBorrower, pubKeyLender, borrowerHash) {


    let taprootFundingAddress;

    const axios = require('axios').default;
    const FormData = require('form-data');

    const form_data = new FormData();

    form_data.append('tapPubKey', taprootPubKey);
    form_data.append('borrowerPubKey', pubKeyBorrower);
    form_data.append('borrowerHash', borrowerHash);
    form_data.append('lenderPubKey', pubKeyLender);

    const response = await axios.post('http://localhost:8080/btc_vault_api-0.0.1-SNAPSHOT/btc/createFundingTxAddress',form_data);

    console.log(response.data);
    taprootFundingAddress = response.data['FundingTxAddress'];

    return taprootFundingAddress;

};
