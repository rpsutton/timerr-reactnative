/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Divider,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {LargeDrawerIcon} from '../../../components/icons';

export const ProfileScreen = ({navigation}) => {
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  return (
    <>
      <TopNavigation
        title="MyApp"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <Layout
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        level="2">
        <Text category="h1">Profile Screen</Text>
      </Layout>
    </>
  );
};
