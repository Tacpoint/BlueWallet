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
import BigNumber from 'bignumber.js';

import AOPP from '../../class/aopp';
import { BlueCard, BlueText, BlueCopyToClipboardButton, BlueDoneAndDismissKeyboardInputAccessory, BlueFormLabel, BlueSpacing10, BlueSpacing20, SafeBlueArea, BlueCopyTextToClipboard } from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import { FContainer, FButton } from '../../components/FloatButtons';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import loc from '../../loc';
import confirm from '../../helpers/confirm';

const Taproot = require('../../blue_modules/Taproot');


const GenerateVaultAddress = () => {
  const { colors } = useTheme();

  const { wallets, sleep } = useContext(BlueStorageContext);
  const { params } = useRoute();
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const wallet = wallets.find(w => w.getID() === params.walletID);

  const [address, setAddress] = useState(params.address ?? '');

  const [myPubKey, setMyPubKey] = useState('');

  const [borrowerPubKey, setBorrowerPubKey] = useState('');
  const [lenderSecretHash, setLenderSecretHash] = useState('');
  const [lenderPubKey, setLenderPubKey] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [message, setMessage] = useState('');
  const [vaultAddress, setVaultAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageHasFocus, setMessageHasFocus] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const isToolbarVisibleForAndroid = Platform.OS === 'android' && messageHasFocus && isKeyboardVisible;
  const [mySecretHash, setMySecretHash] = useState(''); 
  const [mySecretHashPreImage, setMySecretHashPreImage] = useState('');

  useEffect(() => {
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setIsKeyboardVisible(true));
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      Keyboard.removeListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide');
      Keyboard.removeListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow');
    };
  }, []);

  useEffect(() => {

    let vaultPubKey;
    let secHash;
    let secHashPreImage;

    (async () => {
        vaultPubKey = await wallet.findVaultSchnorrPubKey(address);
        setMyPubKey(vaultPubKey);
        secHash =  wallet.generateSecretHash(vaultPubKey, 1);
        setMySecretHash(secHash);
        secHashPreImage = wallet.generateSecretHashPreImage(vaultPubKey, 1);
        setMySecretHashPreImage(secHashPreImage);
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
  });


  const handleGenerateVaultTxAddress = async () => {
    setLoading(true);
    await sleep(10); // wait for loading indicator to appear
    try {

      // 144 Bitcoin blocks per day ...

      var nb = Number(loanTerm);

      //TODO, provide valid range for loan duration
      if (nb < 3 || nb > 1000) {
         Alert.alert("Loan term must be an integer and >= 3 days");
         setLoading(false);
         return;
      }

      let numBlocks = new BigNumber(nb).multipliedBy(Taproot.BTC_BLOCKS_PER_DAY).toNumber();
      let taprootKey = wallet.combinePubKeysForTaproot(borrowerPubKey, lenderPubKey);
      let data = await Taproot.createVaultTxAddress(address, taprootKey, borrowerPubKey, lenderPubKey, lenderSecretHash, numBlocks, wallet.getID());   

      setVaultAddress(data);
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

          <BlueFormLabel>{loc.taproot.my_vault_pub_key}</BlueFormLabel>
          <BlueCopyTextToClipboard text={myPubKey} />

          <BlueFormLabel>{loc.taproot.my_vault_hashed_secret}</BlueFormLabel>
          <BlueCopyTextToClipboard text={mySecretHash} />

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

          <BlueFormLabel>{loc.taproot.lender_secret_hash}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.lender_secret_hash}
            placeholderTextColor="#81868e"
            value={lenderSecretHash}
            onChangeText={t => setLenderSecretHash(t.replace('\n', ''))}
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
          <BlueFormLabel>{loc.taproot.loan_term}</BlueFormLabel>
          <TextInput
            multiline
            textAlignVertical="top"
            blurOnSubmit
            placeholder={loc.taproot.loan_term}
            placeholderTextColor="#81868e"
            value={loanTerm}
            onChangeText={t => setLoanTerm(t.replace('\n', ''))}
            style={[styles.text, stylesHooks.text]}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            editable={!loading}
          />
          <BlueSpacing10 />

          <BlueFormLabel>{loc.taproot.vault_deposit_address}</BlueFormLabel>
          <BlueCopyTextToClipboard text={vaultAddress} />
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
                <FButton onPress={handleGenerateVaultTxAddress} text={loc.addresses.add_pubs_combine} disabled={loading} />
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

GenerateVaultAddress.navigationOptions = navigationStyle({ closeButton: true, headerHideBackButton: true }, opts => ({
  ...opts,
  title: loc.taproot.create_vault_address_title,
}));

export default GenerateVaultAddress;

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
});