import React, { useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useRoute, useTheme, useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Icon } from 'react-native-elements';
import Share from 'react-native-share';

import AOPP from '../../class/aopp';
import { BlueCard, BlueText, BlueCopyToClipboardButton, BlueDoneAndDismissKeyboardInputAccessory, BlueFormLabel, BlueSpacing10, BlueSpacing20, SafeBlueArea, BlueCopyTextToClipboard } from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import { FContainer, FButton } from '../../components/FloatButtons';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import loc from '../../loc';
import confirm from '../../helpers/confirm';

const Taproot = require('../../blue_modules/Taproot');


const GenerateBorrowerSig = () => {

  const { navigate, setOptions, goBack } = useNavigation();
  const { colors } = useTheme();

  const { wallets, sleep } = useContext(BlueStorageContext);
  const { params } = useRoute();
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const wallet = wallets.find(w => w.getID() === params.walletID);

  const [address, setAddress] = useState(params.address ?? '');
  const [txID, setTxID] = useState(params.txID ?? '');
  const [txAmount, setTxAmount] = useState(params.txAmount ?? '');
  const [borrowerSig, setBorrowerSig] = useState('');

  console.log("GenerateBorrowerSig - tx amount : "+txAmount);

  const [myPubKey, setMyPubKey] = useState('');

  const [borrowerPubKey, setBorrowerPubKey] = useState('');
  const [lenderPubKey, setLenderPubKey] = useState('');
  const [taprootPubKey, setTaprootPubKey] = useState('');
  const [message, setMessage] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [readyToBroadcastTx, setReadyToBroadcastTx] = useState(false);
  const [messageHasFocus, setMessageHasFocus] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const isToolbarVisibleForAndroid = Platform.OS === 'android' && messageHasFocus && isKeyboardVisible;
  const [borrowerHash, setBorrowerHash] = useState(''); 
  const [borrowerHashPreImage, setBorrowerHashPreImage] = useState('');

  const [rawInputTxHex, setRawInputTxHex] = useState(''); 
  const [confirmations, setConfirmations] = useState(''); 
  const [voutIndex, setVoutIndex] = useState(''); 

  useEffect(() => {
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setIsKeyboardVisible(true));
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      Keyboard.removeListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide');
      Keyboard.removeListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow');
    };
  }, []);

  useEffect(() => {

    let fundingTxInfo;

    (async () => {
        // retrieve funding tx info from storage
        fundingTxInfo = await Taproot.getFundingTxInfo(address);
        
        console.log("Funding tx info for address : "+address+" - "+JSON.stringify(fundingTxInfo));

        setBorrowerHash(fundingTxInfo.borrowerHash);
        setLenderPubKey(fundingTxInfo.lenderFundingPubKey);
        setBorrowerPubKey(fundingTxInfo.borrowerFundingPubKey);
        setTaprootPubKey(fundingTxInfo.taprootFundingPubKey);
        setToAddress(fundingTxInfo.vaultAddress);

        // obtain the borrower secret for the given pub key
        setBorrowerHashPreImage(wallet.generateSecretHashPreImage(fundingTxInfo.borrowerFundingPubKey,0));

        let rawTxResult = await Taproot.getRawTransaction(txID, address);
        rawTxResult = JSON.parse(rawTxResult);
        console.log("Tx Hex : "+rawTxResult.rawTxHex);
        console.log("Confirmations : "+rawTxResult.confirmations);
        console.log("Vout Index : "+rawTxResult.voutIndex);

        setRawInputTxHex(rawTxResult.rawTxHex);
        setConfirmations(rawTxResult.confirmations);
        setVoutIndex(rawTxResult.voutIndex);
        
        if (!fundingTxInfo.vaultAddress || fundingTxInfo.vaultAddress.length === 0) {
           Alert.alert(loc.taproot.missing_vault_address,'');
        }
    })();

     
  }, []);

  const stylesHooks = StyleSheet.create({
    root: {
      backgroundColor: colors.elevated,
    },
    text: {
      borderColor: colors.formBorder,
      borderBottomColor: colors.formBorder,
      backgroundColor: colors.inputBackgroundColor,
      color: colors.foregroundColor,
    },
    cardText: {
      color: colors.foregroundColor,
    },
  });


  const handleGenerateBorrowerSig = async () => {
    setLoading(true);
    await sleep(10); // wait for loading indicator to appear
    try {

      // need to create the "to" tx, obtain the sig hash and sign it with our private key

      // TODO - check if toAddress is a proper address ...
      
      // TODO, need to compute fee, for now, will hard code to 1k sats!

      console.log("handleGenerateBorrowerSig - toAddress : "+toAddress);

      let rawToTxHex = await Taproot.createRawTransaction(txID, voutIndex, toAddress, (txAmount - 1000), false);

      let sighash = await Taproot.createFundingSigHash(taprootPubKey, borrowerPubKey, lenderPubKey, borrowerHash, rawToTxHex, rawInputTxHex, 1);

      let borrowerSignature = wallet.signSigHashSchnorr(sighash, borrowerPubKey);

      console.log("Borrower signature : "+borrowerSignature);
      setBorrowerSig(borrowerSignature);

    } catch (e) {
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
      Alert.alert(loc.errors.error, e.message);
    }
    setLoading(false);
  };


  const handleFocus = value => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessageHasFocus(value);
  };

  if (loading)
    return (
      <View style={[stylesHooks.root, styles.loading]}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeBlueArea style={[styles.root, stylesHooks.root]}>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={[styles.root, stylesHooks.root]}>
          {!isKeyboardVisible && (
            <>
              <BlueSpacing20 />
            </>
          )}

          <BlueFormLabel>{loc.addresses.add_pubs_placeholder_address}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.addresses.add_pubs_placeholder_address}
            placeholderTextColor="#81868e"
            value={borrowerPubKey}
            onChangeText={t => setBorrowerPubKey(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />

          <BlueFormLabel>{loc.taproot.borrower_secret_hash}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.borrower_secret_hash}
            placeholderTextColor="#81868e"
            value={borrowerHash}
            onChangeText={t => setBorrowerHash(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />

          <BlueFormLabel>{loc.addresses.add_pubs_placeholder_lender_pub_key}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.addresses.add_pubs_placeholder_lender_pub_key}
            placeholderTextColor="#81868e"
            value={lenderPubKey}
            onChangeText={t => setLenderPubKey(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />
          <BlueFormLabel>{loc.taproot.taproot_pub_key}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.taproot_pub_key}
            placeholderTextColor="#81868e"
            value={taprootPubKey}
            onChangeText={t => setTaprootPubKey(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />

          <BlueFormLabel>{loc.taproot.vault_deposit_address}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.deposit_address}
            placeholderTextColor="#81868e"
            value={toAddress}
            onChangeText={t => setToAddress(t.replace('\n', ''))}
            testID="Message"
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />
          <BlueSpacing10 />
          <BlueFormLabel>{loc.taproot.borrower_sig}</BlueFormLabel>
          <BlueSpacing10 />
          <BlueCopyTextToClipboard text={borrowerSig} />

          <BlueSpacing10 />
          <BlueSpacing10 />


          {isShareVisible && !isKeyboardVisible && (
            <>
              <FContainer inline>
                <FButton
                  onPress={handleShare}
                  text={loc.multisig.share}
                  icon={
                    <View style={styles.buttonsIcon}>
                      <Icon name="external-link" size={16} type="font-awesome" color={colors.buttonAlternativeTextColor} />
                    </View>
                  }
                />
              </FContainer>
              <BlueSpacing10 />
            </>
          )}

          {!isKeyboardVisible && (
            <>
              <FContainer inline>
                <FButton onPress={handleGenerateBorrowerSig} text={loc.taproot.sign_tx} disabled={loading} />
              </FContainer>
              <BlueSpacing10 />
            </>
          )}

          {readyToBroadcastTx && !isKeyboardVisible && (
            <>
              <FContainer inline>
                <FButton onPress={handleBroadcastTx} text={loc.taproot.broadcast_tx} disabled={loading} />
              </FContainer>
              <BlueSpacing10 />
              <FContainer inline>
                <FButton onPress={handleViewTaprootHex} text={loc.taproot.view_taproot_raw_tx_hex} disabled={loading} />
              </FContainer>
              <BlueSpacing10 />
            </>
          )}


          {Platform.select({
            ios: (
              <BlueDoneAndDismissKeyboardInputAccessory
                onClearTapped={() => setMessage('')}
                onPasteTapped={text => {
                  setMessage(text);
                  Keyboard.dismiss();
                }}
              />
            ),
            android: isToolbarVisibleForAndroid && (
              <BlueDoneAndDismissKeyboardInputAccessory
                onClearTapped={() => {
                  setMessage('');
                  Keyboard.dismiss();
                }}
                onPasteTapped={text => {
                  setMessage(text);
                  Keyboard.dismiss();
                }}
              />
            ),
          })}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeBlueArea>
  );
};

GenerateBorrowerSig.navigationOptions = navigationStyle({ closeButton: true, headerHideBackButton: true }, opts => ({
  ...opts,
  title: loc.taproot.generate_borrower_sig_for_lender_funding_spend,
}));

export default GenerateBorrowerSig;

const styles = StyleSheet.create({
  
  root: {
    flex: 1,
  },
  text: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderRadius: 4,
    textAlignVertical: 'top',
  },
  textMessage: {
    minHeight: 50,
  },
  flex: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  rowValue: {
    marginBottom: 26,
    color: 'grey',
  },
  txId: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardText: {
    fontWeight: '500',
  },
});
