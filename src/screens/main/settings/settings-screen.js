/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {
  Layout,
  Text,
  Input,
  TopNavigation,
  TopNavigationAction,
  Button,
  Divider,
  Spinner,
  Card,
} from '@ui-kitten/components';
import {useAuth} from '../../../util/auth';
import {DrawerIcon, EmailIcon} from '../../../components/icons';

export const SettingsScreen = ({route, navigation}) => {
  const auth = useAuth();

  function resetPassword() {
    auth
      .sendPasswordResetEmail(auth.user.email)
      .then(() => {
        console.log('Password reset, check your email for instructions');
      })
      .then(() => {
        auth.signout();
      })
      .catch(error => {
        console.log(error.code);
        alert('Something went wrong resetting your password');
        console.error(error);
      });
  }

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const OpenDrawerAction = () => (
    <TopNavigationAction icon={DrawerIcon} onPress={openDrawer} />
  );

  const PasswordHeader = props => (
    <View {...props}>
      <Text category="h6">Change Password</Text>
      <Text category="s1" appearance="hint">
        A reset password email will be sent to you and you will be automatically
        signed out
      </Text>
    </View>
  );

  const SignOutHeader = props => (
    <View {...props}>
      <Text category="h6">Log Out of Account</Text>
    </View>
  );

  return (
    <>
      <TopNavigation
        title="Settings"
        alignment="center"
        accessoryLeft={OpenDrawerAction}
      />
      <Divider />
      <Layout style={styles.layoutContainer} level="2">
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Card
            disabled={true}
            style={{width: '100%', marginTop: '2%'}}
            header={PasswordHeader}>
            <Layout>
              <Button
                status="danger"
                size="small"
                appearance="outline"
                onPress={() => resetPassword(auth.user.email)}>
                Reset Password
              </Button>
            </Layout>
          </Card>
          <Card
            disabled={true}
            style={{width: '100%', marginTop: '2%'}}
            header={SignOutHeader}>
            <Layout>
              <Button
                block
                status="danger"
                appearance="outline"
                size="small"
                onPress={() => auth.signout()}>
                Sign Out
              </Button>
            </Layout>
          </Card>
        </ScrollView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '95%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
    width: '100%',
  },
});
