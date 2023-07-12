import * as React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { Touchable } from '../../common/Touchable';
import { strings } from '../../../i18n';
import { _IInvoice } from '../../../store/realmMiddlewares/RealmInvoiceMiddlewear';

interface BillSearchFilerProps {
  bills: _IInvoice[];
  filteredBill: string;
  filterBill: (type: string) => void;
}

interface PillContainerProps {
  pillTitle: string;
  isSelected: boolean;
  handleFilterBill: () => void;
}

const PillComponent: React.FC<PillContainerProps> = ({
  pillTitle,
  isSelected,
  handleFilterBill,
}) => {
  return (
    <Touchable onPress={handleFilterBill}>
      <View style={[styles.filterPill, isSelected ? styles.selectedPill : {}]}>
        <Text style={styles.billSearchFilterText}>{pillTitle}</Text>
      </View>
    </Touchable>
  );
};

const BillSearchFilter: React.FC<BillSearchFilerProps> = ({
  bills,
  filterBill,
  filteredBill,
}) => {
  return bills.length ? (
    <View style={styles.billSearchFilterCont}>
      <PillComponent
        pillTitle={strings('BILL_NUMBER')}
        isSelected={filteredBill === 'billNumber'}
        handleFilterBill={() => filterBill('billNumber')}
      />
      <PillComponent
        pillTitle={strings('DATE')}
        isSelected={filteredBill === 'date'}
        handleFilterBill={() => filterBill('date')}
      />
      <PillComponent
        pillTitle={strings('bill_total')}
        isSelected={filteredBill === 'billTotal'}
        handleFilterBill={() => filterBill('billTotal')}
      />
    </View>
  ) : null;
};

export default BillSearchFilter;
