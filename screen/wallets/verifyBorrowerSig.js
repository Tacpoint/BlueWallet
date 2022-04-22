import React, { useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRoute, useTheme, useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Icon } from 'react-native-elements';
import Share from 'react-native-share';

import AOPP from '../../class/aopp';
import { BlueDoneAndDismissKeyboardInputAccessory, BlueFormLabel, BlueSpacing10, BlueSpacing20, SafeBlueArea } from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import { FContainer, FButton } from '../../components/FloatButtons';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import loc from '../../loc';
import confirm from '../../helpers/confirm';


const VerifyBorrowerSig = () => {

  const Taproot = require('../../blue_modules/Taproot');
  const { colors } = useTheme();
  const { wallets, sleep } = useContext(BlueStorageContext);
  const { params } = useRoute();
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [address, setAddress] = useState(params.address ?? '');
  const [borrowerPubKey, setBorrowerPubKey] = useState('');
  const [message, setMessage] = useState(params.message ?? '');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageHasFocus, setMessageHasFocus] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);

  const [txID, setTxID] = useState(params.txID ?? '');
  const [txAmount, setTxAmount] = useState(params.txAmount ?? '');
  const [sigHash, setSigHash] = useState('');

  const wallet = wallets.find(w => w.getID() === params.walletID);
  const isToolbarVisibleForAndroid = Platform.OS === 'android' && messageHasFocus && isKeyboardVisible;

  
  useEffect(() => {

    let fundingTxInfo;

    (async () => {
        // retrieve funding tx info from storage
        fundingTxInfo = await Taproot.getFundingTxInfo(address);

        if (!fundingTxInfo.vaultAddress || fundingTxInfo.vaultAddress.length === 0) {
           Alert.alert(loc.taproot.missing_vault_address,'');
           return;
        }

        setBorrowerPubKey(fundingTxInfo.borrowerFundingPubKey);

        console.log("Funding tx info for address : "+address+" - "+JSON.stringify(fundingTxInfo));

        let rawTxResult = await Taproot.getRawTransaction(txID, address);
        rawTxResult = JSON.parse(rawTxResult);

        let rawToTxHex = await Taproot.createRawTransaction(txID, rawTxResult.voutIndex, fundingTxInfo.vaultAddress, (txAmount - 1000), 0);

        let signaturehash = await Taproot.createFundingSigHash(fundingTxInfo.taprootFundingPubKey, 
                                                         fundingTxInfo.borrowerFundingPubKey, 
                                                         fundingTxInfo.lenderFundingPubKey, 
                                                         fundingTxInfo.borrowerHash, 
                                                         rawToTxHex, 
                                                         rawTxResult.rawTxHex, 1); 
        setSigHash(signaturehash);
        
    })();


  }, []);



  useEffect(() => {
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setIsKeyboardVisible(true));
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      Keyboard.removeListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide');
      Keyboard.removeListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow');
    };
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
  });

  const handleShare = () => {
    const baseUri = 'https://bluewallet.github.io/VerifySignature';
    const uri = `${baseUri}?a=${address}&m=${encodeURIComponent(message)}&s=${encodeURIComponent(signature)}`;
    Share.open({ message: uri }).catch(error => console.log(error));
  };

  const handleSign = async () => {
    setLoading(true);
    await sleep(10); // wait for loading indicator to appear
    let newSignature;
    const useSegwit = Boolean(params.aoppURI);
    try {
      newSignature = wallet.signRawMessageSchnorr(message, address);
      setSignature(newSignature);
      setIsShareVisible(true);
    } catch (e) {
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
      Alert.alert(loc.errors.error, e.message);
    }

    if (!params.aoppURI) return setLoading(false);

    let aopp;
    try {
      aopp = new AOPP(params.aoppURI);
    } catch (e) {
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
      Alert.alert(loc.errors.error, e.message);
    }

    if (
      !(await confirm(
        loc.addresses.sign_aopp_title,
        loc.formatString(loc.addresses.sign_aopp_confirm, { hostname: aopp.callbackHostname }),
      ))
    )
      return setLoading(false);

    try {
      await aopp.send({ address, signature: newSignature });
      Alert.alert(loc._.success, loc.aopp.send_success);
      navigation.dangerouslyGetParent().pop();
    } catch (e) {
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
      Alert.alert(loc.errors.error, loc.aopp.send_error);
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    await sleep(10); // wait for loading indicator to appear
    try {
      const res = wallet.verifyBorrowerSig(sigHash, borrowerPubKey, signature);
      Alert.alert(
        res ? loc._.success : loc.errors.error,
        res ? loc.addresses.sign_signature_correct : loc.addresses.sign_signature_incorrect,
      );
      if (res) {
        ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
      }
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
            </>
          )}

          <BlueSpacing10 />
          <BlueSpacing10 />
          <BlueFormLabel>{loc.addresses.add_pubs_placeholder_address}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.borrower_pub_key}
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

          <BlueFormLabel>{loc.taproot.tx_hash}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.tx_hash}
            placeholderTextColor="#81868e"
            value={sigHash}
            onChangeText={t => setSigHash(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />

          <BlueFormLabel>{loc.addresses.sign_placeholder_signature}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.addresses.sign_placeholder_signature}
            placeholderTextColor="#81868e"
            value={signature}
            onChangeText={t => setSignature(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
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
              <BlueSpacing10 />
              <BlueSpacing10 />
              <BlueSpacing10 />
              <FContainer inline>
                <FButton onPress={handleVerify} text={loc.addresses.sign_verify} disabled={loading} />
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

VerifyBorrowerSig.navigationOptions = navigationStyle({ closeButton: true, headerHideBackButton: true }, opts => ({
  ...opts,
  title: loc.taproot.verify_borrower_sig,
}));

export default VerifyBorrowerSig;

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
});
