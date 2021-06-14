/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Divider,
  Button,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {LargeDrawerIcon} from '../../components/icons';
import auth from '@react-native-firebase/auth';

export const SignOutScreen = ({navigation}) => {
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  return (
    <>
      <TopNavigation
        title="Settings"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <Layout
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        level="2">
        <Text category="h1">Log Out Of App</Text>
        <Button style={{marginVertical: 4}} onPress={signOut}>
          Log Out
        </Button>
      </Layout>
    </>
  );
};
