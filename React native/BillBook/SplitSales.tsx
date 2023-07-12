// import libraries
import React from 'react';
import { View, Text } from 'react-native';
// import custom
import styles from './styles';
import { formatNum } from '../../../utils';

interface SplitSalesProps {
  firstValue: number;
  secondValue: number;
  firstText: string | undefined;
  secondText: string;
  isStock?: boolean;
}

const SplitSales: React.FC<SplitSalesProps> = ({
  firstValue,
  secondValue,
  firstText,
  secondText,
  isStock,
}) => {
  return (
    <View
      style={styles.balanceCont}
      testID="stockDataCards"
      accessibilityLabel="stockDataCards">
      <View
        style={styles.balanceTextCont}
        testID="firstCard"
        accessibilityLabel="firstCard">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.salesAmountText,
            firstValue > 0 ? styles.greenText : {},
            isStock ? styles.grayColor : {},
          ]}>
          {(isStock ? '' : 'Rs. ') + formatNum(firstValue)}
        </Text>
        <Text style={styles.balanceTitleText}>{firstText}</Text>
      </View>
      <View
        style={styles.balanceTextCont}
        testID="secondCard"
        accessibilityLabel="secondCard">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.salesAmountText,
            secondValue > 0 ? styles.greenText : {},
          ]}>
          Rs. {formatNum(secondValue)}
        </Text>
        <Text style={styles.balanceTitleText}>{secondText}</Text>
      </View>
    </View>
  );
};

export default SplitSales;
