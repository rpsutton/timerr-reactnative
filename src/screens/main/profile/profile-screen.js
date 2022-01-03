/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Button,
  Divider,
  Card,
} from '@ui-kitten/components';
import {
  PasswordHeader,
  SignOutHeader,
} from '../../../components/profile/headers';
import {useAuth} from '../../../util/auth';
import {resetPassword} from '../../../util/auth';

export const ProfileScreen = ({route, navigation}) => {
  const auth = useAuth();

  const NameLabel = props => <Text category="s1">{props.label}: </Text>;

  const PersonalHeader = props => (
    <View {...props}>
      <Text category="h6">Personal Details</Text>
    </View>
  );

  return (
    <>
      <TopNavigation title="Settings" alignment="center" />
      <Divider />
      <Layout style={styles.layoutContainer} level="2">
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Card
            disabled={true}
            style={{width: '100%', marginTop: '2%'}}
            header={PersonalHeader}>
            <Layout style={styles.rowContainer}>
              <Text appearance="hint" category="s1">
                <NameLabel label="Name" /> {auth.user.firstName}{' '}
                {auth.user.lastName}
              </Text>
              <Button
                size="tiny"
                onPress={() =>
                  navigation.navigate('Edit Name', {user: auth.user})
                }>
                Edit
              </Button>
            </Layout>
          </Card>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2%',
    width: '100%',
  },
});
