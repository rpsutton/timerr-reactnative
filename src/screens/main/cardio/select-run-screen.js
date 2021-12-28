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
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState([]);
  const auth = useAuth();
  const user = auth.user;
  const styles = useStyleSheet(themedStyle);
  const [runIndex, setRunIndex] = useState(new IndexPath(0));
  const [countdownIndex, setCountdownIndex] = useState(new IndexPath(0));
  const [announceIntervalIndex, setAnnounceIntervalIndex] = useState(
    new IndexPath(4),
  );

  const data = [
    {runName: '120s', date: 'Mon Oct 11 2021'},
    {runName: 'Man U', date: 'Sat Oct 9 2021'},
    {runName: 'Fartlek', date: 'Fri Oct 8 2021'},
  ];

  useEffect(() => {
    if (user !== null && user !== undefined) {
      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('savedRuns')
        .onSnapshot(querySnapshot => {
          const savedRuns = [];
          querySnapshot.forEach(documentSnapshot => {
            savedRuns.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setRuns(savedRuns);
          setLoading(false);
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
    return (
      <ListItem
        disabled={true}
        key={index}
        title={`${index + 1}. ${item.runName}`}
        description={item.date}
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
          value={runs[runIndex.row].runName}
          selectedIndex={runIndex}
          onSelect={index => setRunIndex(index)}>
          {runs.map(renderRunOption)}
        </Select>
        <View style={styles.bottomSelections}>
          <Select
            label="Countdown Before Run"
            size="large"
            style={styles.bottomSelect}
            placeholder="Default"
            value={countdownDisplayValue}
            selectedIndex={countdownIndex}
            onSelect={index => setCountdownIndex(index)}>
            {countdown.map(renderCountdownOption)}
          </Select>
          <Select
            label="Announce Time Every"
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
            navigation.navigate('Run Stack', {
              screen: 'Confirm Run Screen',
              params: {
                initialCountdown: countdown[countdownIndex.row].time,
                announceInterval:
                  announceInterval[announceIntervalIndex.row].time,
                runId: runs[runIndex.row].runId,
                uid: user.uid,
              },
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

  if (loading) {
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
          {runs.length == 0 ? (
            <Text
              status="basic"
              category="h2"
              style={{fontSize: 32, fontWeight: '900'}}>
              You have not saved any runs yet.
            </Text>
          ) : (
            <List
              data={data}
              renderItem={renderItem}
              ListHeaderComponent={Header}
              ItemSeparatorComponent={Divider}
              style={{height: '100%', width: '95%', alignSelf: 'center'}}
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
