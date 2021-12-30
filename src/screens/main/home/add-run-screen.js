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
import {checkValidTeamId} from '../../../util/db';
import {KeypadIcon} from '../../../components/icons';
import {useAuth} from '../../../util/auth';

export const AddRunScreen = ({route, navigation}) => {
  const auth = useAuth();
  const [teamCode, setTeamCode] = useState('');
  const [loading, setLoading] = useState('');

  function onSubmit(teamId) {
    setLoading(true);
    checkValidTeamId(teamId).then(res => {
      if (res) {
        auth
          .updateProfile({
            teamId: teamId,
          })
          .then(() => setLoading(false))
          .catch(e => Alert.alert(e));
      } else {
        Alert.alert('Invalid team id');
      }
    });
    setLoading(false);
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
    <Button
      size="small"
      onPress={() => onSubmit(teamCode)}
      appearance="ghost"
      status="primary">
      Add
    </Button>
  );

  const GoBackButton = () => <TopNavigationAction icon={CancelButton} />;

  return (
    <>
      <TopNavigation
        title="Add Run By Code"
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
              accessoryRight={KeypadIcon}
              size="large"
              placeholder={teamCode}
              label="Enter a run code"
              onChangeText={nextValue => setTeamCode(nextValue)}
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
