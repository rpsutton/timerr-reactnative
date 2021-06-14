/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Button,
  Modal,
  Spinner,
  Divider,
} from '@ui-kitten/components';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export const EditProfileScreen = ({route, navigation}) => {
  const user = route.params.userData;

  const goBack = () => {
    navigation.goBack();
  };

  const CancelButton = () => (
    <Button size="small" onPress={goBack} appearance="ghost" status="danger">
      Cancel
    </Button>
  );

  const GoBackButton = () => <TopNavigationAction icon={CancelButton} />;

  const BioLabel = () => <Text category="s1">Bio: </Text>;
  const NameLabel = () => <Text category="s1">Name: </Text>;

  return (
    <>
      <TopNavigation
        title="Edit Profile"
        alignment="center"
        accessoryLeft={GoBackButton}
      />
      <Layout style={{flex: 1}} level="4">
        <ScrollView contentContainerStyle={styles.layout}>
          <Modal visible={loading} backdropStyle={styles.backdrop}>
            <Spinner size="giant" status="basic" />
          </Modal>
          <Layout style={styles.bioContainer} level="2">
            <TouchableWithoutFeedback
              style={styles.rowContainer}
              onPress={() =>
                navigation.navigate('Edit Name', {userData: user})
              }>
              <Text appearance="hint" category="p1">
                <NameLabel /> {user.firstName} {user.lastName}
              </Text>
            </TouchableWithoutFeedback>
            <Divider style={{width: '100%'}} />
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Edit Bio', {userData: user})}
              style={styles.bioText}>
              <Text appearance="hint" category="p1">
                <BioLabel />
                {user.bio !== undefined ? user.bio : 'Tap here to write a bio'}
              </Text>
            </TouchableWithoutFeedback>
          </Layout>
        </ScrollView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '3%',
  },
  profileAvatar: {
    borderRadius: 5,
    height: 100,
    width: 100,
  },
  bioContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 5,
  },
  rowContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bioText: {
    width: '100%',
    padding: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
