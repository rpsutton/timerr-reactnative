import React, {useEffect, useState} from 'react';
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Button,
  IndexPath,
  Select,
  SelectItem,
  Spinner,
  List,
  ListItem,
  Divider,
} from '@ui-kitten/components';
import {View} from 'react-native';
import {TopNavCustom} from '../../../components/universal/topnav';
import {useAuth} from '../../../util/auth';
import firestore from '@react-native-firebase/firestore';

export const SelectRunScreen = ({navigation}) => {
  const date = new Date();
  const [savedRunsLoading, setSavedRunsLoading] = useState(true);
  const [completedRunsLoading, setCompletedRunsLoading] = useState(true);
  const [savedRuns, setSavedRuns] = useState([]);
  const [completedRuns, setCompletedRuns] = useState([]);
  const auth = useAuth();
  const user = auth.user;
  const styles = useStyleSheet(themedStyle);
  const [runIndex, setRunIndex] = useState(new IndexPath(0));
  const [countdownIndex, setCountdownIndex] = useState(new IndexPath(0));
  const [announceIntervalIndex, setAnnounceIntervalIndex] = useState(
    new IndexPath(4),
  );

  useEffect(() => {
    if (user !== null && user !== undefined) {
      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('savedRuns')
        .onSnapshot(querySnapshot => {
          const savedRunsArr = [];
          querySnapshot.forEach(documentSnapshot => {
            savedRunsArr.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setSavedRuns(savedRunsArr);
          setSavedRunsLoading(false);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }
  }, [user]);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('completedRuns')
        .limit(4)
        .orderBy('completedRunDate', 'desc')
        .onSnapshot(querySnapshot => {
          const completedRunsArr = [];
          querySnapshot.forEach(documentSnapshot => {
            completedRunsArr.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          console.log(completedRunsArr);
          setCompletedRuns(completedRunsArr);
          setCompletedRunsLoading(false);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }
  }, [user]);

  const renderRunOption = run => (
    <SelectItem title={run.runName} key={runIndex} />
  );

  const countdown = [
    {display: '5 seconds', time: 5},
    {display: '10 seconds', time: 10},
    {display: '15 seconds', time: 15},
    {display: '20 seconds', time: 20},
    {display: '25 seconds', time: 25},
    {display: '30 seconds', time: 30},
  ];
  const countdownDisplayValue = countdown[countdownIndex.row].display;
  const renderCountdownOption = val => (
    <SelectItem title={val.display} key={countdownIndex} />
  );

  const announceInterval = [
    {display: '1 seconds', time: 1},
    {display: '2 seconds', time: 2},
    {display: '3 seconds', time: 3},
    {display: '4 seconds', time: 4},
    {display: '5 seconds', time: 5},
    {display: '6 seconds', time: 6},
    {display: '7 seconds', time: 7},
    {display: '8 seconds', time: 8},
    {display: '9 seconds', time: 9},
    {display: '10 seconds', time: 10},
    {display: '11 seconds', time: 11},
    {display: '12 seconds', time: 12},
    {display: '13 seconds', time: 13},
    {display: '14 seconds', time: 14},
    {display: '15 seconds', time: 15},
  ];
  const announceIntervalDisplayValue =
    announceInterval[announceIntervalIndex.row].display;
  const renderAnnounceIntervalOption = val => (
    <SelectItem title={val.display} key={announceIntervalIndex} />
  );

  function renderItem({item, index}) {
    let d = new Date(item.completedRunDate.seconds * 1000).toDateString();
    return (
      <ListItem
        disabled={true}
        key={index}
        title={`${index + 1}. ${item.completedRunName}`}
        description={d}
      />
    );
  }

  function Header() {
    return (
      <View style={{marginVertical: '4%', width: '100%'}}>
        <Text category="s1" style={{fontWeight: '900'}}>
          {date.toDateString()}
        </Text>
        <Text
          status="basic"
          category="h2"
          style={{fontSize: 32, fontWeight: '900', marginBottom: '4%'}}>
          Practice Your Runs?
        </Text>
        <Select
          label="Pick A Run To Practice"
          size="large"
          style={styles.select}
          placeholder="Default"
          value={savedRuns[runIndex.row].runName}
          selectedIndex={runIndex}
          onSelect={index => setRunIndex(index)}>
          {savedRuns.map(renderRunOption)}
        </Select>
        <View style={styles.bottomSelections}>
          <Select
            label="Countdown"
            size="large"
            style={styles.bottomSelect}
            placeholder="Default"
            value={countdownDisplayValue}
            selectedIndex={countdownIndex}
            onSelect={index => setCountdownIndex(index)}>
            {countdown.map(renderCountdownOption)}
          </Select>
          <Select
            label="Announcement Interval"
            size="large"
            style={styles.bottomSelect}
            placeholder="Default"
            value={announceIntervalDisplayValue}
            selectedIndex={announceIntervalIndex}
            onSelect={index => setAnnounceIntervalIndex(index)}>
            {announceInterval.map(renderAnnounceIntervalOption)}
          </Select>
        </View>
        <Button
          style={styles.startButton}
          size="giant"
          onPress={() =>
            navigation.navigate('Confirm Run Screen', {
              initialCountdown: countdown[countdownIndex.row].time,
              announceInterval:
                announceInterval[announceIntervalIndex.row].time,
              runId: savedRuns[runIndex.row].runId,
              uid: user.uid,
            })
          }>
          Select Run
        </Button>
        <Text category="h2" style={{fontWeight: '900', marginTop: '4%'}}>
          Your Recent Runs
        </Text>
      </View>
    );
  }

  function Footer() {
    if (completedRuns.length > 0) {
      return null;
    } else {
      return (
        <Text category="s1">No recent runs yet. Complete a run to see it appear here.</Text>
      );
    }
  }

  if (savedRunsLoading || completedRunsLoading) {
    return (
      <Layout style={styles.loadingContainer} level="2">
        <Spinner size="giant" status="primary" />
      </Layout>
    );
  } else {
    return (
      <>
        <TopNavCustom title={`Hello, ${auth.user.firstName}.`} />
        <Layout style={styles.container} level="2">
          {savedRuns.length == 0 ? (
            <Text
              status="basic"
              category="h2"
              style={{fontSize: 32, fontWeight: '900'}}>
              You have not saved any runs yet.
            </Text>
          ) : (
            <List
              data={completedRuns}
              renderItem={renderItem}
              ListHeaderComponent={Header}
              ItemSeparatorComponent={Divider}
              style={{height: '100%', width: '95%', alignSelf: 'center'}}
              ListFooterComponent={Footer}
            />
          )}
        </Layout>
      </>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainerStyle: {
    alignSelf: 'center',
    width: '95%',
  },
  viewWorkoutContainer: {
    marginTop: '2%',
    width: '100%',
    marginBottom: '2%',
  },
  select: {
    width: '100%',
    marginBottom: '2%',
  },
  bottomSelect: {
    width: '49%',
  },
  selectRunText: {
    padding: '2%',
    fontSize: 45,
    alignSelf: 'center',
  },
  bottomSelections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    width: '100%',
    marginTop: '3%',
  },
});
