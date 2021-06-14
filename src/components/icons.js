/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Icon} from '@ui-kitten/components';

const HomeIcon = (props) => <Icon name="home-outline" {...props} />;
const ClockIcon = (props) => <Icon name="clock-outline" {...props} />;
const SearchIcon = (props) => <Icon name="search-outline" {...props} />;
const PlusIcon = (props) => <Icon name="plus-square-outline" {...props} />;
const LargePlusIcon = (props) => (<Icon {...props} name="plus-square-outline" style={[props.style, {width: 30, height: 30}]} />);
const BellIcon = (props) => <Icon name="bell-outline" {...props} />;
const PaperPlaneIcon = (props) => <Icon name="paper-plane-outline" {...props} />;
const DrawerIcon = (props) => <Icon name="menu-outline" {...props} />;
const LargeDrawerIcon = (props) => ( <Icon {...props} name="menu-outline" style={[props.style, {width: 30, height: 30}]} />);
const SettingsIcon = (props) => <Icon name="settings-outline" {...props} />;
const LikeIcon = (props) => <Icon name="heart-outline" {...props} />;
const CommentIcon = (props) => <Icon name="message-square-outline" {...props} />;
const ShareIcon = (props) => <Icon name="share-outline" {...props} />;
const AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const EmailIcon = (props) => <Icon {...props} name="email-outline" />;
const PhoneIcon = (props) => <Icon {...props} name="phone-outline" />;
const CloseIcon = (props) => <Icon {...props} name="close-outline" />;
const KeypadIcon = (props) => <Icon {...props} name="keypad-outline" />;
const LargeCloseIcon = (props) => <Icon {...props} name="close-outline" style={[props.style, {width: 30, height: 30}]}/>;
const LargeBackIcon = (props) => <Icon {...props} name="chevron-left-outline" style={[props.style, {width: 30, height: 30}]}/>;
const LongTextIcon = (props) => <Icon {...props} name="file-text-outline" />;
const ShortTextIcon = (props) => <Icon {...props} name="file-remove-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;
const LinkIcon = (props) => <Icon {...props} name="link-2-outline" />;
const InfoIcon = (props) => <Icon {...props} name="info-outline" />;
const PlayIcon = (props) => <Icon {...props} name="play-circle" style={[props.style, {width: 100, height: 100}]}/>;
const PauseIcon = (props) => <Icon {...props} name="pause-circle" style={[props.style, {width: 100, height: 100}]}/>;
const PinIcon = (props) => <Icon {...props} name="pin-outline" style={[props.style, {width: 15, height: 15}]}/>;

export {
  HomeIcon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  LargePlusIcon,
  BellIcon,
  PaperPlaneIcon,
  DrawerIcon,
  LargeDrawerIcon,
  SettingsIcon,
  LikeIcon,
  CommentIcon,
  ShareIcon,
  AlertIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  KeypadIcon,
  CloseIcon,
  LargeCloseIcon,
  LargeBackIcon,
  LongTextIcon,
  ShortTextIcon,
  ImageIcon,
  LinkIcon,
  InfoIcon,
  PlayIcon,
  PauseIcon,
  PinIcon,
};
