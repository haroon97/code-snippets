/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Image, Keyboard, View } from 'react-native';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { FloatingAction } from 'react-native-floating-action';
import Spinner from 'react-native-loading-spinner-overlay';
import ReactMoE from 'react-native-moengage';
import { connect, useDispatch } from 'react-redux';

import { Box, Navbar, Popup, Text } from '@creditbook/cb-ui';

import moment from 'moment';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SegmentAnalytics } from '../../../analytics';
import { MoEScreenContext } from '../../../analytics/destinations';
import arrowRight from '../../../assets/arrowRightGif.gif';
import { themeColors } from '../../../constants';
import Crashlytics from '../../../firebase/crashlytics';
import { STATE } from '../../../firebase/schema/constants';
import { FLOW, Invoice } from '../../../firebase/schema/invoice';
import { Item } from '../../../firebase/schema/item';
import useInvoice, { InvoiceKeys } from '../../../hooks/useInvoice';
import { strings } from '../../../i18n';
import GenericCustomerMiddleware from '../../../realm-migration/GenericMiddlewares/GenericCustomerMiddleware';
import GenericInvoiceMiddleware from '../../../realm-migration/GenericMiddlewares/GenericInvoiceMiddleware';
import { nonConvert } from '../../../realm-migration/normalize-data';
import RealmWrapper from '../../../realm-migration/realmWrapper';
import { RouteParams, Routes, ScreenMap } from '../../../routes/constants';
import { _IBusiness } from '../../../store/realmMiddlewares/RealmBusinessMiddleware';
import RealmInvoiceMiddleware, {
  _IInvoice,
  deleteBillType,
} from '../../../store/realmMiddlewares/RealmInvoiceMiddlewear';
import RealmStockMiddleware, {
  _IStock,
  _IStockEntry,
  UpdateStockBulk,
  UpdateStockEntryBulk,
} from '../../../store/realmMiddlewares/RealmStockMiddleware';
import { _IUser } from '../../../store/realmMiddlewares/RealmUserMiddleware';
import { businessStateType, invoiceStateType } from '../../../store/reducer';
import { CustomIcon, getLocatorProps, goBack } from '../../../utils';
import {
  IWhatsappType,
  verifyWhatsAppInstallation,
  whatsapp,
  whatsappType,
} from '../../../utils/whatsapp';
import CustomBackHandler from '../../common/CustomBackHandler';
import ReceiptView from '../../common/Invoice/Receipt/index';
import SearchHeader from '../../common/SearchHeader';
import WhatsappTypeActionSheet from '../../common/Transaction/modal';
import HelpConfirmationModal from '../../modals/HelpConfirmationModal.tsx';

import BillSearchFilter from './BillSearchFilter';
import BillsList from './BillsList';
import SplitSales from './SplitSales';
import styles from './styles';

interface BillBookProps {
  fromStock: boolean;
  currentLang: string;
  allBills: Invoice[];
  billTotalAmount: {
    monthTotal: number;
    dayTotal: number;
  };
  currentBill: _IInvoice;
  currentBusiness: _IBusiness;
  loggedInUser: _IUser;
  isEnglishOriented: boolean;
  getAccountData: (customerId: string) => Promise<any>;
  getSingleBill: (invoiceId: string) => Promise<void>;
  clearCurrentBill: () => void;
  replaceItems: (data: Item[]) => Promise<void>;

  selectedBillFromHeader: Invoice[];
  bulkDeleteBill: (
    data: deleteBillType[],
    deleteTransaction?: boolean,
  ) => Promise<void>;
}

const BillBook: React.FC<BillBookProps> = ({
  getSingleBill,
  getAccountData,
  currentBusiness,
  currentLang,
  currentBill,
  replaceItems,
  clearCurrentBill,
  bulkDeleteBill,
  selectedBillFromHeader,
  fromStock,
}) => {
  const floatingButtonRef = React.createRef<FloatingAction>();
  const whatsappActionSheet = React.createRef();
  const [isOnboardingTextVisible, setIsOnboardingTextVisible] =
    React.useState(true);
  const [blurBackground, setBlurBackground] = React.useState(false);
  const navigation = useNavigation<StackNavigationProp<RouteParams>>();
  const [receiptViewVisible, setReceiptViewVisible] = React.useState(false);
  const [sortedBills, setSortedBills] = React.useState<_IInvoice[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isSpinner, setIsSpinner] = React.useState(true);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [isSearchBarFocused, setIsSearchBarFocused] = React.useState(false);
  const [isHelpModal, setIsHelpModal] = React.useState(false);
  const [selectedBillFilter, setSelectedBillFilter] =
    React.useState('billNumber');
  const [selectedBill, setSelectedBill] = React.useState<_IInvoice[]>([]);
  const [isBillHasItems, setIsBillHasItems] = React.useState(false);
  const dispatch = useDispatch();

  const [currentCustomerMobileNumber, setCurrentCustomerMobileNumber] =
    React.useState('');

  const getCustomerMobileNumber = async (customer_id?: string) => {
    if (customer_id) {
      const customer = await getAccountData(customer_id);
      return customer;
    }
  };

  const {
    allBills,
    getPaginatedInvoices,
    nextPageInvoices,
    dayTotal,
    monthTotal,
  } = useInvoice({
    pageLimit: 100,
    business_id: currentBusiness?.id || '',
  });

  const actions = [
    {
      ...getLocatorProps('billBook.createNewBill'),
      iconWithText: (
        <View style={styles.iconCont}>
          <CustomIcon name="bill" style={styles.billIcon} />
          <Text style={styles.iconText}>{strings('CREATE_NEW_BILL')}</Text>
        </View>
      ),
      color: themeColors.whiteColor,
      name: 'new_bill',
      position: 1,
    },
    {
      ...getLocatorProps('billBook.addPhotoBill'),
      iconWithText: (
        <View style={styles.iconCont}>
          <CustomIcon name="camera" style={styles.cameraIcon} />
          <Text style={styles.iconText}>{strings('ADD_BILL_PHOTO')}</Text>
        </View>
      ),
      color: themeColors.whiteColor,
      name: 'photo_bill',
      position: 2,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      SegmentAnalytics.screen(ScreenMap[Routes.BILL_BOOK]);
      setLoading(true);
      setReceiptViewVisible(false);
      setBlurBackground(false);
      setSearchInput('');

      getPaginatedInvoices()
        .then(() => {
          setLoading(false);
          setIsSpinner(false);
        })
        .catch((err) => {
          Crashlytics.recordCustomError(
            'Bill Book screen',
            'getBills error',
            err,
          );

          setLoading(false);
        });
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      ReactMoE.setCurrentContext(MoEScreenContext.BillBookScreen);
      ReactMoE.showInApp();

      return () => {
        ReactMoE.resetCurrentContext();
      };
    }, []),
  );
  const getNextPageInvoices = React.useCallback(async () => {
    try {
      await nextPageInvoices();
    } catch (e: any) {
      console.error('err: ', e?.message);
    }
  }, [getPaginatedInvoices]);

  const backListener = (e: { preventDefault: () => void }) => {
    if (selectedBill.length) {
      setSelectedBill([]);
      e.preventDefault();
      return null;
    }
  };

  React.useEffect(() => {
    if (selectedBillFromHeader?.length === 0) {
      disableSelection();
    }
  }, [selectedBillFromHeader]);

  React.useEffect(() => {
    navigation.addListener('beforeRemove', backListener);
    return () => navigation.removeListener('beforeRemove', backListener);
  }, [navigation, backListener]);

  React.useEffect(() => {
    if (allBills !== sortedBills) {
      setSortedBills([...allBills]);
    }
  }, [allBills]);

  React.useEffect(() => {
    sortBills();
  }, [selectedBillFilter, searchInput]);

  const sortBills = () => {
    const useSortedBills = searchInput !== '';
    const billsCopy: _IInvoice[] = JSON.parse(
      JSON.stringify(useSortedBills ? sortedBills : allBills),
    );
    if (selectedBillFilter === 'billNumber') {
      setSortedBills([...billsCopy]);
    } else if (selectedBillFilter === 'date') {
      const sortedByDate = billsCopy.sort(
        (a, b) =>
          new Date(b?.created_at)?.getTime() -
          new Date(a?.created_at)?.getTime(),
      );
      setSortedBills([...sortedByDate]);
    } else if (selectedBillFilter === 'billTotal') {
      const sortedByTotal = billsCopy.sort(
        (a, b) => b?.final_bill - a?.final_bill,
      );
      setSortedBills([...sortedByTotal]);
    }
  };

  const filterBill = (type: string) => {
    setSelectedBillFilter(type);
    SegmentAnalytics.track('success_setBillFilter', {
      filter_type:
        // eslint-disable-next-line no-nested-ternary
        type === 'billTotal'
          ? 'bill_total'
          : type === 'billNumber'
          ? 'bill_number'
          : type,
    });
  };

  const onChangeInput = (value: string) => {
    setSearchInput(value);
    if (!value) {
      setSortedBills([...allBills]);
    } else {
      const str = value.replace(/[^0-9]/g, ''); // REMOVE ANY OTHER CHARACTER EXCEPT DIGITS

      const filteredBills = allBills.filter((bill) => {
        return (
          (str !== '' && `${bill.bill_number}`.includes(str)) ||
          bill.customer_name?.toLowerCase().includes(value.toLowerCase())
        );
      });
      setSortedBills([...filteredBills]);
    }
  };

  const closeBillView = () => {
    setReceiptViewVisible(false);
    replaceItems([]);
    clearCurrentBill();
  };

  const editBill = async () => {
    const bill = currentBill;

    if (bill?.image) {
      SegmentAnalytics.track('click_editPhotoBill');
    }

    const params: RouteParams[Routes.CUSTOMER_BILL] = {
      isEdit: true,
      fromStock: fromStock,
      amount: bill?.final_bill?.toString(),
    };

    if (bill?.image) params.pictureBill = true;
    if (bill?.customer_id) {
      const customer = await getAccountData(bill?.customer_id);
      if (customer) params.customer = customer;
    }
    setReceiptViewVisible(false);

    if (!bill?.image) {
      // NOT PHOTO BILL
      SegmentAnalytics.track(
        bill?.flow === FLOW.BILLBOOK
          ? 'click_editBillBookEntry'
          : 'click_editCustomerBill',
        { screen: 'bill_view' },
      );
    }
    navigation.navigate(Routes.CUSTOMER_BILL, params);
  };

  const viewBill = async (bill: _IInvoice) => {
    setIsSpinner(true);
    await getSingleBill(bill!.id!);
    setIsSpinner(false);
    setReceiptViewVisible(true);

    if (bill?.customer_id) {
      const customer = await getCustomerMobileNumber(bill?.customer_id);
      setCurrentCustomerMobileNumber(customer?.mobile_no);
    }

    SegmentAnalytics.track('click_viewBill', {
      screen: 'billbook',
    });
  };

  const handleOnLongPress = React.useCallback(
    (bill: _IInvoice) => {
      const billExists = selectedBill?.some((e) => e.id === bill?.id);
      if (billExists) {
        return;
      }
      setSelectedBill([...selectedBill, bill]);
    },
    [selectedBill],
  );

  const showDeleteModalDialog = () => {
    setIsBillHasItems(false);
    if (selectedBill?.length) {
      selectedBill?.forEach((bill) => {
        if (bill?.items?.length) {
          setIsBillHasItems(true);
          return;
        }
      });
    }
    setShowDeleteModal(true);
  };

  const getStock = (stockId: string) =>
    dispatch(RealmStockMiddleware.getStock(stockId));
  const getStockEntry = (stockEntryId: string) => {
    return dispatch(RealmStockMiddleware.getStockEntry(stockEntryId));
  };
  const updateStock = (
    stockItems: UpdateStockBulk[],
    stockEntries: UpdateStockEntryBulk[],
  ) => {
    return dispatch(
      RealmStockMiddleware.updateBulkStock(stockItems, stockEntries),
    );
  };

  const restoreStock = (bill: _IInvoice) => {
    //variables for bulk updating stock
    const stockArr: UpdateStockBulk[] = [];
    const stockEntryArr: UpdateStockEntryBulk[] = [];
    //loop over all items in bill.
    bill?.items.forEach((item) => {
      //find stock corresponding to item in bill.
      const stockFound = getStock(item?.stock_id || '') as unknown as _IStock;
      //find stock entry in stock corresponding to item in bill.
      const stockEntryFound = getStockEntry(
        item?.stock_entry_id || '',
      ) as unknown as _IStockEntry;
      if (stockFound) {
        //update stock if not deleted.
        if (stockFound.state === STATE.DEFAULT) {
          //Updating stock value by adding item quantity in bill back to stock.
          const updatedOutQty = stockFound?.out_qty - item.quantity;
          const updateOutAmount =
            stockFound?.out_qty * stockFound?.selling_rate -
            item.quantity * item.rate;
          const updatedStockValue =
            stockFound.stock_value + item.quantity * item.rate;
          //updated data for stock
          const dataForStock = {
            updated_at: new Date(),
            out_qty: updatedOutQty,
            out_amount: updateOutAmount,
            stock_value: updatedStockValue,
          };
          //save stock update in arr.
          stockArr.push({ id: stockFound.id!, updatedData: dataForStock });
          if (stockEntryFound) {
            //updated data for stock entry
            const dataForStockEntry = {
              state: STATE.DELETED,
              deleted_at: new Date(),
              updated_at: new Date(),
            };
            //save stock entry update in arr.
            stockEntryArr.push({
              id: stockEntryFound.id!,
              updatedData: dataForStockEntry,
            });
          }
        }
      }
    });
    // bulk update stock and stock entries
    if (stockArr.length || stockEntryArr.length) {
      updateStock(stockArr, stockEntryArr);
    }
  };

  const handleDeleteClicked = (deleteTransaction = false) => {
    setShowDeleteModal(false);
    setIsSpinner(true);
    setTimeout(async () => {
      if (selectedBill?.length) {
        // we will make an array here for all the selected bills then pass this array to our bulk delete function

        // 1- Store the Invoices in an Array
        const bulkInvoices: deleteBillType[] = [];

        selectedBill?.forEach((bill) => {
          const realmBill = RealmWrapper.getInvoices().filtered(
            `business_id=='${currentBusiness?.id}' && firestore_id=='${bill?.id}'`,
          )[0];

          const convertedBill = nonConvert([realmBill], InvoiceKeys, true)[0];

          const invoiceData = {
            id: bill?.id,
            transaction_id: bill?.transaction_id,
            customer_id: bill?.customer_id,
          };
          bulkInvoices.push(invoiceData);

          if (convertedBill?.items) {
            restoreStock(convertedBill as _IInvoice);
          }
        });

        // 2- Call Bulk Delete Bill
        bulkDeleteBill(bulkInvoices, deleteTransaction);
        selectedBill?.forEach((bill) => {
          if (bill?.image) {
            SegmentAnalytics.track('success_deletePhotoBill', {
              billtype: deleteTransaction
                ? 'billentrywithcustomer'
                : 'billwithcustomer',
              type: 'longPress',
            });
          } else {
            SegmentAnalytics.track('success_deleteBillBookEntry', {
              screen: 'billbook',
            });
          }
        });
      }
      setIsSpinner(false);
      disableSelection();
    }, 400); // Require this time for animation
  };

  const exitDeleteInvoiceModal = () => {
    disableSelection();
    setShowDeleteModal(false);
    SegmentAnalytics.track(
      currentBill?.flow === FLOW.BILLBOOK
        ? 'fail_deleteBillBookEntry'
        : 'fail_deleteCustomerBill',
    );
  };

  const disableSelection = () => {
    setSelectedBill([]);
  };

  const onPressBack = () => {
    if (selectedBill.length) {
      disableSelection();
      return;
    }
    goBack(navigation);
  };

  const handleOnPressBill = (bill: _IInvoice) => {
    if (!selectedBill.length) {
      return;
    }
    const billExists = selectedBill?.some((e) => e.id === bill?.id);
    // taking out the index of already existing bill and then remove it
    if (billExists) {
      const allBills = [...selectedBill];
      const index = allBills?.map((val) => val?.id)?.indexOf(bill?.id);
      allBills.splice(index, 1);
      setSelectedBill([...allBills]);

      if (!allBills.length) {
        disableSelection();
      }
    } else {
      setSelectedBill([...selectedBill, bill]);
    }
  };

  const onPressBill = React.useCallback(
    (bill: _IInvoice) => {
      if (selectedBill?.length) {
        handleOnPressBill(bill);
      } else {
        viewBill(bill);
      }
    },
    [selectedBill],
  );

  const handleBusinessType = () => {
    //@ts-ignore
    whatsappActionSheet?.current?.setModalVisible();
  };

  const handleCloseActionSheet = () => {
    //@ts-ignore
    whatsappActionSheet?.current?.hide();
  };

  const setBusinessType = async (type: IWhatsappType) => {
    handleCloseActionSheet();
    whatsapp(type.name);
  };
  const handleBackPress = () => {
    if (selectedBill.length) {
      onPressBack();
      return true;
    }
    if (isHelpModal) {
      setIsHelpModal(false);
      return true;
    }
    return false;
  };

  const longPress_billbookEntry = () => {
    SegmentAnalytics.track('longPress_billbookEntry');
  };

  const getLangSpecificText = (month: string) => {
    return {
      en: `${month}'s Sale`,
      ur: `کی فروخت ${month}`,
      si: `جي سيل ${month}`,
      pa: `د ${month} خرڅ`,
      pu: `دی سیل ${month}`,
      roman_ur: `${month} ki Sale`,
    }[currentLang];
  };

  const exitModalHandler = () => {
    setIsHelpModal(false);
  };

  const navigateToWhatsappHandler = () => {
    verifyWhatsAppInstallation(handleBusinessType);
  };

  const onFocusInputHandler = () => {
    setIsSearchBarFocused(true);
  };

  const onBlurInputHandler = () => {
    setIsSearchBarFocused(false);
  };

  const resetInputHandler = () => {
    Keyboard.dismiss();
    setIsSearchBarFocused(false);
    onChangeInput('');
  };

  const setMenuRefHandler = () => {
    React.createRef();
  };

  const hideMenuHandler = () => {
    setIsSearchBarFocused(false);
    setSearchInput('');
    sortBills();
  };

  const onPressHandler = () => {
    // @ts-ignore
    if (isOnboardingTextVisible) {
      setIsOnboardingTextVisible(false);
      SegmentAnalytics.track('click_entryBillBook');
    }
  };

  const onOpenHandler = () => {
    setTimeout(() => {
      setBlurBackground(true);
    });
    onPressHandler();
  };
  const onCloseHandler = () => {
    setTimeout(() => {
      setBlurBackground(false);
    });
    if (isOnboardingTextVisible && allBills?.length)
      setIsOnboardingTextVisible(false);
    else if (!isOnboardingTextVisible && !allBills?.length)
      setIsOnboardingTextVisible(true);
  };

  const getDeleteBillPopupTranslation = () => {
    if (isBillHasItems) {
      if (selectedBill?.length > 1) {
        return strings(
          'kya_aap_yeh_bills_delete_karna_chahte_hain?_bills_ke_items_wapis_stock_mein_shamil_ho_jaenge',
        );
      } else {
        return strings(
          'kya_aap_yeh_bill_delete_karna_chahte_hain?_bill_ke_items_wapis_stock_mein_shamil_ho_jaenge',
        );
      }
    } else {
      return strings('DO_YOU_REALLY_WANT_TO_DELETE_THIS_BILL');
    }
  };

  return (
    <View style={styles.mainCont}>
      <CustomBackHandler onBackPress={handleBackPress} />
      {blurBackground && (
        <Box
          onTouchStart={() => {
            // @ts-ignore
            floatingButtonRef?.current?.animateButton();
          }}
          absolute
          absoluteFill
          style={styles.absolute}
          bgColor={'overlayBlack'}
        />
      )}
      <Spinner visible={isSpinner} />
      {!fromStock && (
        <Navbar
          title={{
            value: selectedBill?.length
              ? `${selectedBill?.length}`
              : strings('BILL_BOOK'),
          }}
          subtext={
            !selectedBill?.length
              ? {
                  value: currentBusiness?.business_name,
                }
              : undefined
          }
          backIcon={{
            onPress: onPressBack,
          }}
          rightIcons={
            selectedBill?.length
              ? [
                  {
                    name: 'delete',
                    onPress: showDeleteModalDialog,
                  },
                ]
              : undefined
          }
        />
      )}
      {isHelpModal ? (
        <HelpConfirmationModal
          visible={isHelpModal}
          exitModal={exitModalHandler}
          navigateToWhatsapp={navigateToWhatsappHandler}
        />
      ) : null}
      <View style={styles.cont}>
        {!sortedBills.length && searchInput.length === 0 ? null : (
          <>
            <SplitSales
              firstValue={monthTotal}
              secondValue={dayTotal}
              firstText={getLangSpecificText(
                moment().locale('en').format('MMMM'),
              )}
              secondText={strings('TODAY_SALE')}
            />
            <View style={styles.padHorizontal16}>
              <SearchHeader
                noFilter
                onChangeInput={onChangeInput}
                value={searchInput}
                onFocusInput={onFocusInputHandler}
                onBlurInput={onBlurInputHandler}
                resetInput={resetInputHandler}
                selectedMenu={selectedBillFilter}
                setMenuRef={setMenuRefHandler}
                hideMenu={hideMenuHandler}
                placeholderText={'SEARCH_BILL'}
                editable={allBills.length > 0}
              />
            </View>
            {!selectedBill.length ? (
              <BillSearchFilter
                bills={sortedBills}
                filterBill={filterBill}
                filteredBill={selectedBillFilter}
              />
            ) : null}
          </>
        )}
        <View style={styles.cont}>
          <BillsList
            loading={loading}
            bills={sortedBills}
            searchInput={searchInput}
            onPressBill={onPressBill}
            isSearchBarFocused={isSearchBarFocused}
            handleOnLongPress={handleOnLongPress}
            selectedBill={selectedBill}
            fireEvent={longPress_billbookEntry}
            handleEndReach={getNextPageInvoices}
          />
        </View>
        {receiptViewVisible && (
          <ReceiptView
            onExit={closeBillView}
            handleEditButton={editBill}
            billImage={currentBill?.image ?? undefined}
            customerName={currentBill?.customer_name ?? ''}
            currentBill={currentBill!}
            customerMobile={currentCustomerMobileNumber}
            crossIcon
          />
        )}
        {isOnboardingTextVisible && !allBills?.length && !loading ? (
          <Box
            absolute
            absoluteSpacing={{
              bottom: 's40',
              left: 's25',
            }}>
            <Box style={styles.animatedArrowMessageContainer}>
              <Text
                value={strings('MAKE_BILL')}
                variant={'h5'}
                color={'primary'}
              />
              <Image
                source={arrowRight}
                resizeMode="center"
                style={styles.createFirstBillSuggestionIcon}
              />
            </Box>
          </Box>
        ) : null}
        {!loading ? (
          <View style={styles.fabContainer}>
            <FloatingAction
              testID="makeBillFAB"
              accessibilityLabel="makeBillFAB"
              wide
              iconHeight={14}
              iconWidth={14}
              mainButtonText={strings('MAKE_BILL')}
              mainButtonTextColor={themeColors.whiteColor}
              ref={floatingButtonRef}
              visible={!isSearchBarFocused && !selectedBill?.length}
              actions={actions}
              buttonSize={57}
              color={
                !blurBackground
                  ? themeColors.newGreenColor
                  : themeColors.primaryExtraLight
              }
              overlayColor={themeColors.darkGrayColorWithOpacity}
              onOpen={onOpenHandler}
              onClose={onCloseHandler}
              onPressItem={(name) => {
                SegmentAnalytics.track(
                  name === 'photo_bill'
                    ? 'start_photoBillEntry'
                    : 'start_BillBookEntry',
                  { is_firstbill: !allBills?.length ? true : false },
                );

                AppEventsLogger.logEvent('fb_mobile_add_to_wishlist', {
                  fb_currency: 'PKR',
                });

                navigation.navigate(Routes.CUSTOMER_BILL, {
                  pictureBill: name === 'photo_bill',
                  fromStock: fromStock,
                });
              }}
            />
          </View>
        ) : null}

        {showDeleteModal && (
          <Popup
            title={{
              value:
                selectedBill?.length === 1
                  ? strings('DELETE_BILL')
                  : strings('delete_bills'),
            }}
            description={{
              value: getDeleteBillPopupTranslation(),
              lineHeight: 's24',
              size: 's14',
              variant: 'bodyMedium',
              color: 'mediumEmphasis',
            }}
            leftButton={{
              title: { value: strings('CANCEL') },
              onPress: () => exitDeleteInvoiceModal(),
            }}
            rightButton={{
              title: { value: strings('DELETE') },
              color: 'danger',
              variant: 'outlined',
              onPress: () => handleDeleteClicked(),
            }}
          />
        )}

        <WhatsappTypeActionSheet
          actionSheet={whatsappActionSheet}
          businessTypes={whatsappType}
          handleClose={handleCloseActionSheet}
          setBusinessType={setBusinessType}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: {
  invoice: invoiceStateType;
  businesses: businessStateType;
  user: _IUser;
  miscellaneous: {
    currentLang: string;
    isEnglishOriented: boolean;
  };
}) => {
  return {
    loggedInUser: state.user,
    currentBill: state.invoice.currentBill,
    allBills: state.invoice.allBills,
    billTotalAmount: state.invoice.billTotalAmount,
    currentBusiness: state.businesses.currentBusiness,
    currentLang: state.miscellaneous.currentLang,
    isEnglishOriented: state.miscellaneous.isEnglishOriented,
  };
};

const mapDispatchToProps = (
  dispatch: React.Dispatch<RealmInvoiceMiddleware | GenericCustomerMiddleware>,
) => ({
  getSingleBill: async (invoiceId: string) =>
    dispatch(await GenericInvoiceMiddleware.getSingleBill(invoiceId)),
  getAccountData: (customerId: string) =>
    dispatch(GenericCustomerMiddleware.getAccount(customerId)),
  clearCurrentBill: async () =>
    dispatch(await GenericInvoiceMiddleware.clearCurrentBill()),
  replaceItems: async (data: Item[]) => {
    return dispatch(GenericInvoiceMiddleware.replaceItems(data));
  },
  bulkDeleteBill: async (
    data: deleteBillType[],
    deleteTransaction?: boolean,
  ) => {
    return dispatch(
      await RealmInvoiceMiddleware.bulkDeleteBill(data, deleteTransaction),
    );
  },
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(BillBook);
