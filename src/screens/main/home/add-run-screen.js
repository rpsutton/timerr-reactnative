/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Layout,
  Input,
  TopNavigation,
  TopNavigationAction,
  Button,
  Modal,
  Spinner,
} from '@ui-kitten/components';
import {getValidRun, saveRun, checkDuplicateSavedRun} from '../../../util/db';
import {KeypadIcon} from '../../../components/icons';
import {useAuth} from '../../../util/auth';

export const AddRunScreen = ({route, navigation}) => {
  const auth = useAuth();
  const [runCode, setRunCode] = useState('');
  const [loading, setLoading] = useState('');
  // check if the runId is valid
  // check if the run already exists in the user's savedRuns collection
  // add the run to the user's savedRuns collection
  function onSubmit(runId) {
    setLoading(true);
    getValidRun(runId).then(res => {
      if (res) {
        console.log(res);
        console.log(res.id);
        checkDuplicateSavedRun(auth.user.uid, res.id).then(bool => {
          if (bool) {
            saveRun(auth.user.uid, res)
              .then(() => {
                setTimeout(() => {
                  setLoading(false);
                  navigation.goBack();
                }, 500);
              })
              .catch(e => {
                console.log(e);
                Alert.alert(e);
              });
          } else {
            Alert.alert('You already saved this run');
            setLoading(false);
          }
        });
      } else {
        Alert.alert('Invalid run id');
        setLoading(false);
      }
    });
  }

  const goBack = () => {
    navigation.goBack();
  };

  const CancelButton = () => (
    <Button size="small" onPress={goBack} appearance="ghost" status="danger">
      Cancel
    </Button>
  );

  const GoBackButton = () => <TopNavigationAction icon={CancelButton} />;

  return (
    <>
      <TopNavigation
        title="Add Run By Code"
        alignment="center"
        accessoryLeft={GoBackButton}
      />
      <Layout style={{flex: 1}} level="2">
        <ScrollView contentContainerStyle={styles.layout}>
          <Modal visible={loading} backdropStyle={styles.backdrop}>
            <Spinner size="giant" status="basic" />
          </Modal>
          <Layout style={styles.container} level="2">
            <Input
              accessoryRight={KeypadIcon}
              size="large"
              placeholder="Enter code"
              label="Enter a run code"
              onChangeText={nextValue => setRunCode(nextValue)}
            />
            <Button
              size="large"
              style={styles.submitButton}
              onPress={() => onSubmit(runCode)}>
              Add Run
            </Button>
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
  container: {
    flex: 1,
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 5
  },
  submitButton: {
    marginTop: '3%',
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
