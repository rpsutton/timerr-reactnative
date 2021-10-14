import React, {useEffect, useState} from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  StyleService,
  useStyleSheet,
  Button,
  Card,
  Spinner,
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {LargeBackIcon} from '../../../components/icons';
import firestore from '@react-native-firebase/firestore';

export const ConfirmRunScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(null);
  const runId = route.params.runId;
  const initialCountdown = route.params.initialCountdown;
  const announceInterval = route.params.announceInterval;
  const uid = route.params.uid;
  const styles = useStyleSheet(themedStyle);

  useEffect(() => {
    firestore()
      .collection('runs')
      .doc(runId)
      .get()
      .then(doc => {
        setRun(doc.data());
        setLoading(false);
      });
  }, [runId]);

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeBackIcon} onPress={goBack} />
  );

  function Header(props) {
    return (
      <View {...props}>
        <Text category="h3" style={{fontStyle: 'italic'}}>
          {run.runName}
        </Text>
        <Text category="h6" status="primary">
          {run.runSequence.length} Lap Run
        </Text>
      </View>
    );
  }

  const Footer = (props) => {
    return (
      <View {...props}>
        <Text category="s1" appearance="hint" style={{fontWeight: '800'}}>
          Configuration
        </Text>
        <Text category="s1">
          - Countdown for{' '}
          <Text status="primary" category="s1" style={{fontWeight: '800'}}>
            {initialCountdown}
          </Text>{' '}
          seconds before run begins
        </Text>
        <Text category="s1">
          - Announce time every{' '}
          <Text status="primary" category="s1" style={{fontWeight: '800'}}>
            {announceInterval}
          </Text>{' '}
          seconds
        </Text>
      </View>
    );
  };

  if (!loading && run !== undefined) {
    return (
      <>
        <TopNavigation
          title="Confirm Run"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Layout style={styles.container} level="2">
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <Card
              disabled={true}
              status="primary"
              header={Header}
              footer={Footer}
              style={{marginTop: '2%', width: '100%'}}>
              <Text category="s1" appearance="hint" style={{fontWeight: '800'}}>
                Run Description
              </Text>
              <Text category="s1">{run.runDescription}</Text>
            </Card>
            <View style={styles.buttonContainer}>
              <Button
                status="danger"
                style={styles.backButton}
                size="giant"
                onPress={() => navigation.goBack()}>
                Go Back
              </Button>
              <Button
                status="primary"
                style={styles.confirmButton}
                size="giant"
                onPress={() =>
                  navigation.navigate('Run Test Screen', {
                    initialCountdown: initialCountdown,
                    announceInterval: announceInterval,
                    run: run,
                    uid: uid,
                  })
                }>
                Confirm
              </Button>
            </View>
          </ScrollView>
        </Layout>
      </>
    );
  } else {
    return (
      <Layout style={styles.loadingContainer} level="2">
        <Spinner size="giant" />
      </Layout>
    );
  }
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '95%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '2%',
  },
  confirmButton: {
    width: '49%',
  },
  backButton: {
    width: '49%',
  },
});
