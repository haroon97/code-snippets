import { StyleSheet, Dimensions } from 'react-native';

import { themeColors, themeStyleSheet } from '../../../constants';
import { RFValue } from '../../../utils';

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    backgroundColor: themeColors.whiteColor,
  },
  cont: {
    flex: 1,
  },
  iconStyles: {
    color: themeColors.whiteColor,
    fontSize: RFValue(24),
  },
  titleStyles: {
    fontFamily: themeStyleSheet.gilmerBold,
    fontSize: RFValue(18),
    color: themeColors.whiteColor,
  },
  fabContainer: { zIndex: 2 },
  absolute: {
    zIndex: 1,
  },
  balanceCont: {
    width: '100%',
    paddingHorizontal: RFValue(16),
    marginVertical: RFValue(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTextCont: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    width: '49%',
    borderRadius: 8,
    backgroundColor: themeColors.imagePlaceholderBg,
    paddingVertical: RFValue(11),
  },
  padHorizontal16: { paddingHorizontal: RFValue(16) },
  salesAmountText: {
    fontSize: RFValue(14),
    color: themeColors.inputIconColor,
    fontFamily: themeStyleSheet.gilmerBold,
  },
  balanceTitleText: {
    fontSize: RFValue(12),
    marginTop: 4,
  },
  videoTutorialButton: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 7,
    textAlign: 'center',
    backgroundColor: themeColors.veryLightGreenColor,
  },
  playIcon: {
    color: themeColors.darkAppColor,
    fontSize: RFValue(18),
  },
  playButtonText: {
    color: themeColors.darkAppColor,
    fontSize: RFValue(13),
    marginLeft: 4,
    fontWeight: '500',
  },
  billSearchFilterText: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: themeColors.primaryDarkGreen,
  },
  bottomContainer: {
    zIndex: 1,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: RFValue(16),
  },
  animatedArrowMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createFirstBillSuggestionIcon: {
    marginTop: 2,
    height: height * 0.03,
    width: width * 0.2,
  },
  billButtonContainer: {
    minWidth: RFValue(100),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: themeColors.newGreenColor,
    borderRadius: 50,
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(16),
    elevation: 4,
    zIndex: 2,
    height: 60,
    width: width * 0.35,
  },
  billSearchFilterCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: RFValue(16),
    paddingLeft: RFValue(16),
  },
  billSearch: { flexDirection: 'row' },
  greenText: { color: themeColors.darkNewAppColor },
  grayColor: { color: themeColors.spGrayColor },
  addIcon: {
    color: themeColors.whiteColor,
    fontSize: RFValue(20),
    paddingRight: RFValue(5),
  },
  billButtonText: {
    color: themeColors.whiteColor,
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  filterPill: {
    marginRight: RFValue(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(20),
    borderWidth: 1,
    borderColor: themeColors.primaryDarkGreen,
    borderRadius: 30,
  },
  selectedPill: { backgroundColor: themeColors.veryLightGreenColor },

  dateModalCont: {
    backgroundColor: themeColors.whiteColor,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
    top: '40%',
  },

  dateModalButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(15),
    justifyContent: 'flex-end',
    paddingBottom: RFValue(15),
  },

  dateChangeText: {
    fontSize: RFValue(15),
    letterSpacing: 0.4,
    lineHeight: 23,
    paddingHorizontal: RFValue(15),
    paddingTop: RFValue(15),
  },

  cancelText: {
    color: themeColors.grayColor,
    fontSize: RFValue(15),
  },

  yesText: {
    color: themeColors.lightAppColor,
    fontSize: RFValue(15),
    paddingHorizontal: RFValue(25),
    paddingVertical: RFValue(5),
    fontWeight: '500',
  },
  billIcon: {
    fontSize: RFValue(22),
    color: themeColors.timerBlue,
    marginRight: RFValue(8),
  },
  iconText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: themeColors.highEmphasisBlack,
  },
  cameraIcon: {
    fontSize: RFValue(22),
    color: themeColors.primaryGreen,
    marginRight: RFValue(8),
  },
  iconCont: { flexDirection: 'row', alignItems: 'center' },
});

export default styles;
