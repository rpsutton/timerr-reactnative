/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, ScrollView, Alert, Keyboard} from 'react-native';
import {
  Layout,
  Input,
  TopNavigation,
  TopNavigationAction,
  Button,
  Modal,
  Spinner,
} from '@ui-kitten/components';
import {updateUser} from '../../../util/db';

export const EditNameScreen = ({route, navigation}) => {
  const user = route.params.user;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [loading, setLoading] = useState('');

  function onSubmit() {
    if (firstName !== '' && lastName !== '') {
      setLoading(true);
      updateUser(user.uid, {
        firstName: firstName,
        lastName: lastName,
      })
        .then(() => Keyboard.dismiss())
        .then(() => navigation.navigate('Profile'))
        .catch((error) => {
          Alert.alert('Error updating name');
          console.log(error);
        })
        .finally(() => setLoading(false));
    } else {
      Alert.alert('Make sure First Name and Last Name are not empty');
    }
  }

  const goBack = () => {
    navigation.goBack();
  };

  const CancelButton = () => (
    <Button size="small" onPress={goBack} appearance="ghost" status="danger">
      Cancel
    </Button>
  );

  const SaveButton = () => (
    <Button size="small" onPress={onSubmit} appearance="ghost" status="primary">
      Save
    </Button>
  );

  const GoBackButton = () => <TopNavigationAction icon={CancelButton} />;

  return (
    <>
      <TopNavigation
        title="Edit Name"
        alignment="center"
        accessoryLeft={GoBackButton}
        accessoryRight={SaveButton}
      />
      <Layout style={{flex: 1}} level="2">
        <ScrollView contentContainerStyle={styles.layout}>
          <Modal visible={loading} backdropStyle={styles.backdrop}>
            <Spinner size="giant" status="basic" />
          </Modal>
          <Layout style={styles.bioContainer} level="2">
            <Input
              size="large"
              placeholder={firstName}
              label="First Name"
              autoFocus={false}
              onChangeText={(nextValue) => setFirstName(nextValue)}
            />
            <Input
              size="large"
              placeholder={lastName}
              label="Last Name"
              onChangeText={(nextValue) => setLastName(nextValue)}
            />
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
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 5,
  },
  rowContainer: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  bioText: {
    width: '100%',
    padding: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
