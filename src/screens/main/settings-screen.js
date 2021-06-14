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
import {ThemeContext} from '../../util/themeContext';
import {LargeDrawerIcon} from '../../components/icons';
import {useAuth} from '../../util/auth';

export const DetailsScreen = ({navigation}) => {
  const themeContext = React.useContext(ThemeContext);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  const auth = useAuth();

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
        <Text category="h1">DETAILS</Text>
        <Button style={{marginVertical: 4}} onPress={themeContext.toggleTheme}>
          TOGGLE THEME
        </Button>
        <Button onPress={() => auth.signout()}>sign out</Button>
      </Layout>
    </>
  );
};
