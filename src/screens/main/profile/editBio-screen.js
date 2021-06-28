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

export const EditBioScreen = ({route, navigation}) => {
  const user = route.params.userData;
  const [bio, setBio] = useState(user.bio);
  const [loading, setLoading] = useState('');

  function onSubmit() {
    if (bio !== '') {
      setLoading(true);
      updateUser(user.uid, {
        bio: bio,
      })
        .then(() => Keyboard.dismiss())
        .then(() => navigation.navigate('Profile'))
        .catch((error) => {
          Alert.alert('Error updating bio');
          console.log(error);
        })
        .finally(() => setLoading(false));
    } else {
      Alert.alert('Make sure bio is not empty');
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
        title="Edit Bio"
        alignment="center"
        accessoryLeft={GoBackButton}
        accessoryRight={SaveButton}
      />
      <Layout style={{flex: 1}} level="3">
        <ScrollView contentContainerStyle={styles.layout}>
          <Modal visible={loading} backdropStyle={styles.backdrop}>
            <Spinner size="giant" status="basic" />
          </Modal>
          <Layout style={styles.bioContainer} level="3">
            <Input
              placeholder={bio}
              label="Bio"
              autoFocus={false}
              multiline={true}
              textStyle={{minHeight: 150}}
              maxLength={200}
              onChangeText={(nextValue) => setBio(nextValue)}
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
