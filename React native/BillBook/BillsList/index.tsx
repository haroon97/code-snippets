import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@creditbook/cb-ui';

import { RFValue } from '../../../../utils';
import customerBill from '../../../../assets/bill_banayen.webp';
import Bill from './Bill';
import { strings } from '../../../../i18n';
import { themeColors } from '../../../../constants';
import { _IInvoice } from '../../../../store/realmMiddlewares/RealmInvoiceMiddlewear';
import useTimeOut from '../../../../hooks/useTimeout';

interface BillsListProps {
  bills: _IInvoice[];
  loading: boolean;
  onPressBill: (bill: _IInvoice) => void;
  searchInput: string;
  isSearchBarFocused: boolean;
  selectedBill: _IInvoice[];
  handleOnLongPress: (bill: _IInvoice) => void;
  fireEvent: () => void;
  handleEndReach: () => void;
}

const BillsList: React.FC<BillsListProps> = ({
  bills,
  loading,
  onPressBill,
  searchInput,
  selectedBill,
  handleOnLongPress,
  isSearchBarFocused,
  fireEvent,
  handleEndReach,
}) => {
  const [showBill, setShowBill] = React.useState(false);
  const { setTimeoutCleanOnUnmount } = useTimeOut();

  const renderItem = React.useCallback(
    (props) => (
      <Bill
        {...props}
        onPressBill={onPressBill}
        selectBill={() => {
          fireEvent();
          handleOnLongPress(props.item);
        }}
        isSelected={Boolean(
          !!selectedBill?.length &&
            selectedBill?.some((e) => e?.id === props?.item?.id),
        )}
      />
    ),
    [selectedBill.length],
  );

  const keyExtractor = React.useCallback((item) => item?.id.toString(), []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: 80,
      offset: 80 * index,
      index: index,
    }),
    [],
  );

  React.useEffect(() => {
    setTimeoutCleanOnUnmount(() => {
      setShowBill(true);
    });
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={themeColors.appColor}
        style={styles.loader}
      />
    );
  } else {
    if (!bills.length && searchInput.length === 0 && showBill) {
      return (
        <View style={styles.noListContainer}>
          <Image
            fadeDuration={0}
            source={customerBill}
            style={styles.NoListImageStyles}
          />
          <Text
            center
            value={strings('BILLBOOK_NO_BILL_TEXT')}
            variant={'h7'}
            lineHeight={'s24'}
            color={'highEmphasis'}
          />
        </View>
      );
    } else {
      return (
        <>
          <FlatList
            data={bills}
            renderItem={renderItem}
            maxToRenderPerBatch={10}
            windowSize={12}
            initialNumToRender={10}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            contentContainerStyle={[
              styles.listContainer,
              !isSearchBarFocused ? styles.pd64 : {},
            ]}
            onEndReached={handleEndReach}
            onEndReachedThreshold={0.5}
          />
        </>
      );
    }
  }
};

export default BillsList;

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: RFValue(16),
    paddingHorizontal: RFValue(10),
  },
  NoListImageStyles: {
    width: RFValue(160),
    height: RFValue(160),
  },
  noListContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: RFValue(43),
    alignItems: 'center',
    flex: 1,
  },
  loader: {
    width: '100%',
    height: '100%',
  },
  pd64: {
    paddingBottom: RFValue(64),
  },
});
