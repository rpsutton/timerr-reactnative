/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Button,
  Spinner,
  Divider,
  Card,
} from '@ui-kitten/components';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useAuth} from '../../../util/auth';
import {useTeam} from '../../../util/db';
import {DrawerIcon} from '../../../components/icons';

export const ProfileScreen = ({route, navigation}) => {
  const auth = useAuth();
  const {data: items, status} = useTeam(auth.user.teamId);

  const NameLabel = props => <Text category="s1">{props.label}: </Text>;
  const openDrawer = () => {
    navigation.openDrawer();
  };
  const OpenDrawerAction = () => (
    <TopNavigationAction icon={DrawerIcon} onPress={openDrawer} />
  );
  const TeamHeader = props => (
    <View {...props}>
      <Text category="h6">Team Details</Text>
    </View>
  );

  const PersonalHeader = props => (
    <View {...props}>
      <Text category="h6">Personal Details</Text>
    </View>
  );

  if (status == 'success') {
    return (
      <>
        <TopNavigation
          title="Profile"
          alignment="center"
          accessoryLeft={OpenDrawerAction}
        />
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
              style={{width: '100%', marginTop: '2%'}}
              header={TeamHeader}
              disabled={true}>
              <Layout style={styles.rowContainer}>
                <Text appearance="hint" category="s1">
                  <NameLabel label="Organization" /> {items.organizationName}
                </Text>
              </Layout>
              <Layout style={styles.rowContainer}>
                <Text appearance="hint" category="s1">
                  <NameLabel label="Team Name" /> {items.teamName}
                </Text>
              </Layout>
              <Layout style={styles.rowContainer}>
                <Text appearance="hint" category="s1">
                  <NameLabel label="Sport" /> {items.sport}
                </Text>
              </Layout>
              <Layout style={styles.rowContainer}>
                <Button
                  size="tiny"
                  appearance="outline"
                  status="danger"
                  onPress={() =>
                    navigation.navigate('Edit Team Membership', {
                      user: auth.user,
                      team: items,
                    })
                  }>
                  Change Team Membership
                </Button>
              </Layout>
            </Card>
          </ScrollView>
        </Layout>
      </>
    );
  } else {
    return (
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Spinner size="giant" />
      </Layout>
    );
  }
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
