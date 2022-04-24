import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import QRCodeComponent from '../../components/QRCodeComponent';
import { useNavigation, useRoute, useTheme, useFocusEffect } from '@react-navigation/native';
import Share from 'react-native-share';

import {
  BlueLoading,
  BlueFormLabel,
  BlueCopyTextToClipboard,
  BlueButton,
  BlueButtonLink,
  BlueText,
  BlueSpacing20,
  BlueAlertWalletExportReminder,
  BlueCard,
  BlueSpacing40,
} from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import BottomModal from '../../components/BottomModal';
import { Chain, BitcoinUnit } from '../../models/bitcoinUnits';
import HandoffComponent from '../../components/handoff';
import AmountInput from '../../components/AmountInput';
import DeeplinkSchemaMatch from '../../class/deeplink-schema-match';
import loc, { formatBalance } from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import Notifications from '../../blue_modules/notifications';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { TransactionPendingIconBig } from '../../components/TransactionPendingIconBig';
import * as BlueElectrum from '../../blue_modules/BlueElectrum';
const currency = require('../../blue_modules/currency');

const ReceiveDetails = () => {

  const Taproot = require('../../blue_modules/Taproot');
  const { walletID, address, index, isInternal } = useRoute().params;

  //alert("wallet Id : "+walletID);
  //alert("address : "+address);
  //alert("idx : "+index);

  const { wallets, saveToDisk, sleep, isElectrumDisabled, fetchAndSaveWalletTransactions } = useContext(BlueStorageContext);
  const wallet = wallets.find(w => w.getID() === walletID);
  const [customLabel, setCustomLabel] = useState();
  const [customAmount, setCustomAmount] = useState();
  const [customUnit, setCustomUnit] = useState(BitcoinUnit.BTC);
  const [bip21encoded, setBip21encoded] = useState();
  const [isCustom, setIsCustom] = useState(false);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [showPendingBalance, setShowPendingBalance] = useState(false);
  const [showConfirmedBalance, setShowConfirmedBalance] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const { navigate, goBack, setParams } = useNavigation();


  const { colors } = useTheme();
  const [intervalMs, setIntervalMs] = useState(5000);
  const [eta, setEta] = useState('');

  const [fundingHash, setFundingHash] = useState('');
  const [fundingHashPreImage, setFundingHashPreImage] = useState('');

  const [vaultHash, setVaultHash] = useState('');
  const [vaultHashPreImage, setVaultHashPreImage] = useState('');

  const [fundingPubKey, setFundingPubKey] = useState('');
  const [vaultPubKey, setVaultPubKey] = useState('');

  const [fundingAddress, setFundingAddress] = useState('');
  const [vaultAddress, setVaultAddress] = useState('');

  const [initialConfirmed, setInitialConfirmed] = useState(0);
  const [initialUnconfirmed, setInitialUnconfirmed] = useState(0);
  const [displayBalance, setDisplayBalance] = useState('');
  const fetchAddressInterval = useRef();

  const navigateToSignVerify = () =>
    navigate('SignVerifyRoot', {
      screen: 'SignVerify',
      params: {
        walletID: wallet.getID(),
        address: address,
        //address: wallet.getAllExternalAddresses()[0], // works for both single address and HD wallets
      },
    });

  const stylesHook = StyleSheet.create({
    modalContent: {
      backgroundColor: colors.modal,
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderTopColor: colors.foregroundColor,
      borderWidth: colors.borderWidth,
      minHeight: 350,
      height: 350,
    },
    customAmount: {
      flexDirection: 'row',
      borderColor: colors.formBorder,
      borderBottomColor: colors.formBorder,
      borderWidth: 1.0,
      borderBottomWidth: 0.5,
      backgroundColor: colors.inputBackgroundColor,
      minHeight: 44,
      height: 44,
      marginHorizontal: 20,
      alignItems: 'center',
      marginVertical: 8,
      borderRadius: 4,
    },
    customAmountText: {
      flex: 1,
      marginHorizontal: 8,
      color: colors.foregroundColor,
      minHeight: 33,
    },
    root: {
      flexGrow: 1,
      backgroundColor: colors.elevated,
      justifyContent: 'space-between',
    },
    rootBackgroundColor: {
      backgroundColor: colors.elevated,
    },
    scrollBody: {
      marginTop: 32,
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    share: {
      justifyContent: 'flex-end',
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 8,
    },
    link: {
      marginVertical: 16,
      paddingHorizontal: 32,
    },
    amount: {
      color: colors.foregroundColor,
      fontWeight: '600',
      fontSize: 36,
      textAlign: 'center',
    },
    label: {
      color: colors.foregroundColor,
      fontWeight: '600',
      paddingBottom: 24,
      
    },
    loading: {
      alignItems: 'center',
      width: 300,
      height: 300,
      backgroundColor: colors.elevated,
    },
    modalButton: {
      backgroundColor: colors.modalButton,
      paddingVertical: 14,
      paddingHorizontal: 70,
      maxWidth: '80%',
      borderRadius: 50,
      fontWeight: '700',
    },
  });

 useEffect(() => {

    let fundingTxInfo;
    let vaultTxInfo;

    (async () => {

        // compute pre-image and hash to display for the user ...
        let siblingPubKey;
      
        if (isInternal) {

           siblingPubKey = wallet.findSiblingPubKey(address, true);
           setFundingPubKey(siblingPubKey);
           setFundingHash(wallet.generateSecretHash(siblingPubKey, 0));
           setFundingHashPreImage(wallet.generateSecretHashPreImage(siblingPubKey, 0)); 
           
           setVaultPubKey(address);
           setVaultHash(wallet.generateSecretHash(address, 1));
           setVaultHashPreImage(wallet.generateSecretHashPreImage(address, 1)); 
        } else {
           siblingPubKey = wallet.findSiblingPubKey(address, false);
           setVaultPubKey(siblingPubKey);
           setVaultHash(wallet.generateSecretHash(siblingPubKey, 1));
           setVaultHashPreImage(wallet.generateSecretHashPreImage(siblingPubKey, 1)); 
           
           setFundingPubKey(address);
           setFundingHash(wallet.generateSecretHash(address, 0));
           setFundingHashPreImage(wallet.generateSecretHashPreImage(address, 0)); 
        }

        
        // check if this pub key is involved in any funding or vault transactions
        let usedPubKeys = await Taproot.findUsedPubKeys(wallet.getID()) ;

        let fundingAddressExists = false;
        if (usedPubKeys.includes(address)) {
           console.log("This pub key was involved in a funding / vault address : "+address);

           // get funding addresses and find which address uses this pub key
           let fundingAddresses = await Taproot.getFundingAddresses(wallet.getID());
           for (let i = 0; i < fundingAddresses.length; i++) {
              fundingTxInfo = await Taproot.getFundingTxInfo(fundingAddresses[i]);
              if (fundingTxInfo.lenderFundingPubKey === address ||
                 fundingTxInfo.borrowerFundingPubKey === address) {
                 fundingAddressExists = true;

                 // we found an existing funding address, collect info for display
                 setFundingAddress(fundingAddresses[i]);
                 break; 
              }
           }
        }
              
    })();
  }, []);

  useEffect(() => {
    if (showConfirmedBalance) {
      ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
    }
  }, [showConfirmedBalance]);

  // re-fetching address balance periodically
  useEffect(() => {
    console.log('receive/defails - useEffect');

    if (fetchAddressInterval.current) {
      // interval already exists, lets cleanup it and recreate, so theres no duplicate intervals
      clearInterval(fetchAddressInterval.current);
      fetchAddressInterval.current = undefined;
    }

    fetchAddressInterval.current = setInterval(async () => {
      try {
        const decoded = DeeplinkSchemaMatch.bip21decode(bip21encoded);
        const address2use = address || decoded.address;
        if (!address2use) return;

        let balance = 0;
    
        // doesn't make sense to check balance for a schnorr pub key.
        // TODO, could lookup to see if we have any funding or vault addresses associatd with this key 
        // and use that instead!
        //console.log('checking address', address2use, 'for balance...');
        //const balance = await BlueElectrum.getBalanceByAddress(address2use);
        //console.log('...got', balance);

        if (balance.unconfirmed > 0) {
          if (initialConfirmed === 0 && initialUnconfirmed === 0) {
            // saving initial values for later (when tx gets confirmed)
            setInitialConfirmed(balance.confirmed);
            setInitialUnconfirmed(balance.unconfirmed);
            setIntervalMs(25000);
            ReactNativeHapticFeedback.trigger('impactHeavy', { ignoreAndroidSystemSettings: false });
          }

          const txs = await BlueElectrum.getMempoolTransactionsByAddress(address2use);
          const tx = txs.pop();
          if (tx) {
            const rez = await BlueElectrum.multiGetTransactionByTxid([tx.tx_hash], 10, true);
            if (rez && rez[tx.tx_hash] && rez[tx.tx_hash].vsize) {
              const satPerVbyte = Math.round(tx.fee / rez[tx.tx_hash].vsize);
              const fees = await BlueElectrum.estimateFees();
              if (satPerVbyte >= fees.fast) {
                setEta(loc.formatString(loc.transactions.eta_10m));
              }
              if (satPerVbyte >= fees.medium && satPerVbyte < fees.fast) {
                setEta(loc.formatString(loc.transactions.eta_3h));
              }
              if (satPerVbyte < fees.medium) {
                setEta(loc.formatString(loc.transactions.eta_1d));
              }
            }
          }

          setDisplayBalance(
            loc.formatString(loc.transactions.pending_with_amount, {
              amt1: formatBalance(balance.unconfirmed, BitcoinUnit.LOCAL_CURRENCY, true).toString(),
              amt2: formatBalance(balance.unconfirmed, BitcoinUnit.BTC, true).toString(),
            }),
          );
          setShowPendingBalance(true);
          setShowAddress(false);
        } else if (balance.unconfirmed === 0 && initialUnconfirmed !== 0) {
          // now, handling a case when unconfirmed == 0, but in past it wasnt (i.e. it changed while user was
          // staring at the screen)

          const balanceToShow = balance.confirmed - initialConfirmed;

          if (balanceToShow > 0) {
            // address has actually more coins then initially, so we definately gained something
            setShowConfirmedBalance(true);
            setShowPendingBalance(false);
            setShowAddress(false);

            clearInterval(fetchAddressInterval.current);
            fetchAddressInterval.current = undefined;

            setDisplayBalance(
              loc.formatString(loc.transactions.received_with_amount, {
                amt1: formatBalance(balanceToShow, BitcoinUnit.LOCAL_CURRENCY, true).toString(),
                amt2: formatBalance(balanceToShow, BitcoinUnit.BTC, true).toString(),
              }),
            );

            fetchAndSaveWalletTransactions(walletID);
          } else {
            // rare case, but probable. transaction evicted from mempool (maybe cancelled by the sender)
            setShowConfirmedBalance(false);
            setShowPendingBalance(false);
            setShowAddress(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, intervalMs);
  }, [bip21encoded, address, initialConfirmed, initialUnconfirmed, intervalMs, fetchAndSaveWalletTransactions, walletID]);

  const renderConfirmedBalance = () => {
    return (
      <ScrollView style={stylesHook.rootBackgroundColors} centerContent keyboardShouldPersistTaps="always">
        <View style={stylesHook.scrollBody}>
          {isCustom && (
            <>
              <BlueText style={stylesHook.label} numberOfLines={1}>
                {customLabel}
              </BlueText>
            </>
          )}
          <LottieView style={styles.icon} source={require('../../img/bluenice.json')} autoPlay loop={false} />
          <BlueText style={stylesHook.label} numberOfLines={1}>
            {displayBalance}
          </BlueText>
        </View>
      </ScrollView>
    );
  };

  const renderPendingBalance = () => {
    return (
      <ScrollView contentContainerStyle={stylesHook.rootBackgroundColor} centerContent keyboardShouldPersistTaps="always">
        <View style={stylesHook.scrollBody}>
          {isCustom && (
            <>
              <BlueText style={stylesHook.label} numberOfLines={1}>
                {customLabel}
              </BlueText>
            </>
          )}
          <TransactionPendingIconBig />
          <BlueSpacing40 />
          <BlueText style={stylesHook.label} numberOfLines={1}>
            {displayBalance}
          </BlueText>
          <BlueText style={stylesHook.label} numberOfLines={1}>
            {eta}
          </BlueText>
        </View>
      </ScrollView>
    );
  };

  const handleBackButton = () => {
    goBack(null);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      clearInterval(fetchAddressInterval.current);
      fetchAddressInterval.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderReceiveDetails = () => {
    return (
      <ScrollView contentContainerStyle={stylesHook.root} keyboardShouldPersistTaps="always">
        <View style={stylesHook.scrollBody}>
          {isCustom && (
            <>
              {getDisplayAmount() && (
                <BlueText testID="CustomAmountText" style={stylesHook.amount} numberOfLines={1}>
                  {getDisplayAmount()}
                </BlueText>
              )}
              {customLabel?.length > 0 && (
                <BlueText testID="CustomAmountDescriptionText" style={stylesHook.label} numberOfLines={1}>
                  {customLabel}
                </BlueText>
              )}
            </>
          )}

          <BlueText style={styles.rowCaption}>{loc.taproot.my_funding_pub_key}</BlueText>
          <BlueCopyTextToClipboard text={isCustom ? bip21encoded : fundingPubKey} />
          <BlueText style={styles.rowCaption}>{loc.taproot.my_funding_hashed_secret}</BlueText>
          <BlueCopyTextToClipboard text={fundingHash} />
          <BlueText style={styles.rowCaption}>{loc.taproot.my_funding_secret}</BlueText>
          <BlueCopyTextToClipboard text={fundingHashPreImage} />

          <BlueText style={styles.rowCaption}>{loc.taproot.funding_deposit_address}</BlueText>
          <BlueCopyTextToClipboard text={fundingAddress} />

          <BlueText style={styles.rowCaption}>{loc.taproot.my_vault_pub_key}</BlueText>
          <BlueCopyTextToClipboard text={isCustom ? bip21encoded : vaultPubKey} />
          <BlueText style={styles.rowCaption}>{loc.taproot.my_vault_hashed_secret}</BlueText>
          <BlueCopyTextToClipboard text={vaultHash} />
          <BlueText style={styles.rowCaption}>{loc.taproot.my_vault_secret}</BlueText>
          <BlueCopyTextToClipboard text={vaultHashPreImage} />

          <BlueText style={styles.rowCaption}>{loc.taproot.vault_deposit_address}</BlueText>
          <BlueCopyTextToClipboard text={vaultAddress} />
          <BlueSpacing20 />

        </View>
        {renderCustomAmountModal()}
      </ScrollView>
    );
  };

  const obtainWalletAddress = useCallback(async () => {
    console.log('receive/details - componentDidMount');
    wallet.setUserHasSavedExport(true);
    await saveToDisk();
    let newAddress;
    if (address) {
      setAddressBIP21Encoded(address);
      await Notifications.tryToObtainPermissions();
      Notifications.majorTomToGroundControl([address], [], []);
    } else {
      if (wallet.chain === Chain.ONCHAIN) {
        try {
          if (!isElectrumDisabled) newAddress = await Promise.race([wallet.getAddressAsync(), sleep(1000)]);
        } catch (_) {}
        if (newAddress === undefined) {
          // either sleep expired or getAddressAsync threw an exception
          console.warn('either sleep expired or getAddressAsync threw an exception');
          newAddress = wallet._getExternalAddressByIndex(wallet.getNextFreeAddressIndex());
        } else {
          saveToDisk(); // caching whatever getAddressAsync() generated internally
        }
      } else if (wallet.chain === Chain.OFFCHAIN) {
        try {
          await Promise.race([wallet.getAddressAsync(), sleep(1000)]);
          newAddress = wallet.getAddress();
        } catch (_) {}
        if (newAddress === undefined) {
          // either sleep expired or getAddressAsync threw an exception
          console.warn('either sleep expired or getAddressAsync threw an exception');
          newAddress = wallet.getAddress();
        } else {
          saveToDisk(); // caching whatever getAddressAsync() generated internally
        }
      }
      setAddressBIP21Encoded(newAddress);
      await Notifications.tryToObtainPermissions();
      Notifications.majorTomToGroundControl([newAddress], [], []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAddressBIP21Encoded = address => {
    const bip21encoded = DeeplinkSchemaMatch.bip21encode(address);
    setParams({ address });
    setBip21encoded(bip21encoded);
    setShowAddress(true);
  };

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        if (wallet) {
          if (!wallet.getUserHasSavedExport()) {
            BlueAlertWalletExportReminder({
              onSuccess: obtainWalletAddress,
              onFailure: () => {
                goBack();
                navigate('WalletExportRoot', {
                  screen: 'WalletExport',
                  params: {
                    walletID: wallet.getID(),
                  },
                });
              },
            });
          } else {
            obtainWalletAddress();
          }
        } else if (!wallet && address) {
          setAddressBIP21Encoded(address);
        }
      });
      return () => {
        task.cancel();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet]),
  );

  const dismissCustomAmountModal = () => {
    Keyboard.dismiss();
    setIsCustomModalVisible(false);
  };

  const showCustomAmountModal = () => {
    setIsCustomModalVisible(true);
  };

  const createCustomAmountAddress = () => {
    setIsCustom(true);
    setIsCustomModalVisible(false);
    let amount = customAmount;
    switch (customUnit) {
      case BitcoinUnit.BTC:
        // nop
        break;
      case BitcoinUnit.SATS:
        amount = currency.satoshiToBTC(customAmount);
        break;
      case BitcoinUnit.LOCAL_CURRENCY:
        if (AmountInput.conversionCache[amount + BitcoinUnit.LOCAL_CURRENCY]) {
          // cache hit! we reuse old value that supposedly doesnt have rounding errors
          amount = currency.satoshiToBTC(AmountInput.conversionCache[amount + BitcoinUnit.LOCAL_CURRENCY]);
        } else {
          amount = currency.fiatToBTC(customAmount);
        }
        break;
    }
    setBip21encoded(DeeplinkSchemaMatch.bip21encode(address, { amount, label: customLabel }));
    setShowAddress(true);
  };

  const renderCustomAmountModal = () => {
    return (
      <BottomModal isVisible={isCustomModalVisible} onClose={dismissCustomAmountModal}>
        <KeyboardAvoidingView enabled={!Platform.isPad} behavior={Platform.OS === 'ios' ? 'position' : null}>
          <View style={stylesHook.modalContent}>
            <AmountInput unit={customUnit} amount={customAmount || ''} onChangeText={setCustomAmount} onAmountUnitChange={setCustomUnit} />
            <View style={stylesHook.customAmount}>
              <TextInput
                onChangeText={setCustomLabel}
                placeholderTextColor="#81868e"
                placeholder={loc.receive.details_label}
                value={customLabel || ''}
                numberOfLines={1}
                style={stylesHook.customAmountText}
                testID="CustomAmountDescription"
              />
            </View>
            <BlueSpacing20 />
            <View>
              <BlueButton
                testID="CustomAmountSaveButton"
                style={stylesHook.modalButton}
                title={loc.receive.details_create}
                onPress={createCustomAmountAddress}
              />
              <BlueSpacing20 />
            </View>
            <BlueSpacing20 />
          </View>
        </KeyboardAvoidingView>
      </BottomModal>
    );
  };

  const handleShareButtonPressed = () => {
    Share.open({ message: bip21encoded }).catch(error => console.log(error));
  };

  /**
   * @returns {string} BTC amount, accounting for current `customUnit` and `customUnit`
   */
  const getDisplayAmount = () => {
    if (Number(customAmount) > 0) {
      switch (customUnit) {
        case BitcoinUnit.BTC:
          return customAmount + ' BTC';
        case BitcoinUnit.SATS:
          return currency.satoshiToBTC(customAmount) + ' BTC';
        case BitcoinUnit.LOCAL_CURRENCY:
          return currency.fiatToBTC(customAmount) + ' BTC';
      }
      return customAmount + ' ' + customUnit;
    } else {
      return null;
    }
  };

  return (
    <View style={stylesHook.root}>
      <StatusBar barStyle="light-content" />
      {address !== undefined && showAddress && (
        <HandoffComponent
          title={loc.send.details_address}
          type={HandoffComponent.activityTypes.ReceiveOnchain}
          userInfo={{ address: address }}
        />
      )}
      {showConfirmedBalance ? renderConfirmedBalance() : null}
      {showPendingBalance ? renderPendingBalance() : null}
      {showAddress ? renderReceiveDetails() : null}
      {!showAddress && !showPendingBalance && !showConfirmedBalance ? <BlueLoading /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  rowCaption: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  icon: {
    width: 400,
    height: 400,
  },
});

ReceiveDetails.navigationOptions = navigationStyle(
  {
    closeButton: true,
    headerHideBackButton: true,
  },
  opts => ({ ...opts, title: loc.receive.header }),
);

export default ReceiveDetails;
