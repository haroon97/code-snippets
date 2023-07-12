import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { themeColors } from '../../../../constants';

import {
  CustomIcon,
  formatNum,
  getFormattedDate,
  RFValue,
} from '../../../../utils';
import { Touchable } from '../../../common/Touchable';
import { strings } from '../../../../i18n';
import { _IInvoice } from '../../../../store/realmMiddlewares/RealmInvoiceMiddlewear';

interface BillProps {
  item: _IInvoice;
  isSelected: boolean;
  onPressBill: (bill: _IInvoice) => void;
  selectBill: (bill: _IInvoice) => void;
}

const Bill: React.FC<BillProps> = ({
  item,
  isSelected,
  onPressBill,
  selectBill,
}) => {
  return (
    <Touchable
      onPress={() => onPressBill(item)}
      onLongPress={() => selectBill(item)}>
      <View style={[styles.mainCont, isSelected ? styles.selectedBill : {}]}>
        <View style={styles.secCont}>
          <View style={item.image ? {} : styles.iconCont}>
            {item.image ? (
              <Image style={styles.billImage} source={{ uri: item.image }} />
            ) : (
              <CustomIcon name="bill" style={styles.billIcon} />
            )}
          </View>
          <View style={styles.billDetailsCont}>
            <Text style={styles.billNoText}>
              Bill #
              {item.bill_number < 10
                ? `0${item.bill_number}`
                : item.bill_number}
            </Text>
            {item.customer_name ? (
              <Text numberOfLines={1} style={styles.customerNameText}>
                {item.customer_name}
              </Text>
            ) : null}
            <Text style={styles.dateText}>
              {getFormattedDate(item.created_at, 'D MMM YY')}
            </Text>
          </View>
        </View>
        <View style={styles.billAmountCont}>
          {item.image && !item.final_bill ? (
            <Text style={styles.amountText}>{strings('PHOTO_BILL')}</Text>
          ) : (
            <Text style={styles.amountText}>
              Rs {formatNum(item.final_bill)}
            </Text>
          )}
        </View>
      </View>
    </Touchable>
  );
};

export default React.memo(
  Bill,
  (prevProps: BillProps, nextProps: BillProps) => {
    return (
      prevProps?.isSelected === nextProps?.isSelected &&
      prevProps?.onPressBill === nextProps?.onPressBill
    );
  },
);

const styles = StyleSheet.create({
  /* Single Bill */
  mainCont: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(5),
    paddingTop: RFValue(16),
  },
  selectedBill: {
    backgroundColor: themeColors.veryLightGreenColor,
    borderColor: themeColors.veryLightGreenColor,
  },
  secCont: {
    marginRight: RFValue(15),
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexBasis: 1,
  },
  iconCont: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.backgroundCardImportant,
    borderRadius: 8,
    height: RFValue(40),
    width: RFValue(40),
    marginRight: RFValue(8),
  },
  billIcon: {
    fontSize: RFValue(25),
    color: themeColors.timerBlue,
  },
  billDetailsCont: {
    alignItems: 'flex-start',
    flex: 1,
    flexGrow: 1,
  },
  billNoText: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: themeColors.fallbackTitleColor,
  },
  billImage: {
    height: RFValue(40),
    width: RFValue(40),
    borderRadius: 8,
    marginRight: RFValue(8),
  },
  customerNameText: {
    fontSize: RFValue(12),
    fontWeight: '400',
    color: themeColors.fallbackTitleColor,
  },
  dateText: {
    fontSize: RFValue(12),
    fontWeight: '400',
    color: themeColors.grayColor,
  },
  billAmountCont: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: themeColors.grayColor,
  },
});
