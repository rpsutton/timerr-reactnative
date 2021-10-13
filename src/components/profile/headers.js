import React from 'react';
import {Text} from '@ui-kitten/components';
import {View} from 'react-native';

export const PasswordHeader = props => (
  <View {...props}>
    <Text category="h6">Change Password</Text>
    <Text category="s1" appearance="hint">
      A reset password email will be sent to you and you will be automatically
      signed out
    </Text>
  </View>
);

export const SignOutHeader = props => (
  <View {...props}>
    <Text category="h6">Log Out of Account</Text>
  </View>
);
