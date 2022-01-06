/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from '@ui-kitten/components';

const HomeIcon = (props) => <Icon name="home-outline" {...props} />;
const ClockIcon = (props) => <Icon name="clock-outline" {...props} />;
const OptionsIcon = (props) => <Icon name="options-2-outline" {...props} />;
const PlusIcon = (props) => <Icon name="plus-square-outline" {...props} />;
const LargePlusIcon = (props) => (<Icon {...props} name="plus-outline" style={[props.style, {width: 35, height: 35}]} />);
const LargeCopyIcon = (props) => (<Icon {...props} name="copy-outline" style={[props.style, {width: 35, height: 35}]} />);
const LargeMinusIcon = (props) => (<Icon {...props} name="minus-outline" style={[props.style, {width: 35, height: 35}]} />);
const LargeCheckIcon = (props) => (<Icon {...props} name="checkmark-outline" style={[props.style, {width: 35, height: 35}]} />);
const SettingsIcon = (props) => <Icon name="settings-outline" {...props} />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const EmailIcon = (props) => <Icon {...props} name="email-outline" />;
const PhoneIcon = (props) => <Icon {...props} name="phone-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const KeypadIcon = (props) => <Icon {...props} name="keypad-outline" />;
const LargeCloseIcon = (props) => <Icon {...props} name="close-outline" style={[props.style, {width: 35, height: 35}]}/>;
const LargeBackIcon = (props) => <Icon {...props} name="chevron-left-outline" style={[props.style, {width: 35, height: 35}]}/>;
const InfoIcon = (props) => <Icon {...props} name="info-outline" {...props}/>;
const ChevronRightIcon = (props) => <Icon {...props} name="chevron-right-outline" {...props}/>;

export {
  LargeCopyIcon,
  HomeIcon,
  ClockIcon,
  OptionsIcon,
  PlusIcon,
  LargePlusIcon,
  LargeMinusIcon,
  LargeCheckIcon,
  SettingsIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  KeypadIcon,
  CloseIcon,
  LargeCloseIcon,
  LargeBackIcon,
  InfoIcon,
  ChevronRightIcon,
};
