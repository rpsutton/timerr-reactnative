import React, {useState} from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  StyleService,
  useStyleSheet,
  Button,
  IndexPath,
  Select,
  SelectItem,
  Card,
  Divider,
  Toggle,
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {
  LargeBackIcon,
  FailureIcon,
  SuccessIcon,
} from '../../../components/icons';

export const SelectRunScreen = ({navigation, route}) => {
  const events = route.params.todaysEvents;
  const teamRuns = route.params.teamRuns;
  const eventsComplete = route.params.eventsComplete;
  const uid = route.params.uid;
  const styles = useStyleSheet(themedStyle);
  const [checked, setChecked] = useState(true);
  const [eventIndex, seteventIndex] = useState(new IndexPath(0));
  const [runIndex, setRunIndex] = useState(new IndexPath(0));
  const [countdownIndex, setCountdownIndex] = useState(new IndexPath(0));
  const [announceIntervalIndex, setAnnounceIntervalIndex] = useState(
    new IndexPath(4),
  );

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeBackIcon} onPress={goBack} />
  );

  const onCheckedChange = isChecked => {
    setChecked(isChecked);
  };

  const rendereventOption = ev => (
    <SelectItem title={ev.event.title} key={eventIndex} />
  );

  const runDisplayValue = teamRuns[runIndex.row].runName;
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

  const Footer = props => {
    if (eventsComplete <= 0) {
      return (
        <View {...props}>
          <Text category="s1" status="danger">
            {eventsComplete}/{events.length} Assigned Runs Complete
          </Text>
        </View>
      );
    } else if (eventsComplete > 0 && eventsComplete < events.length) {
      return (
        <View {...props}>
          <Text category="s1" status="warning">
            {eventsComplete}/{events.length} Assigned Runs Complete
          </Text>
        </View>
      );
    } else {
      <View {...props}>
        <Text category="s1" status="success">
          {eventsComplete}/{events.length} Assigned Runs Complete
        </Text>
      </View>;
    }
  };

  const EventsSection = () => {
    if (events.length === 0) {
      return (
        <Card style={styles.viewWorkoutContainer} status="primary" disabled={true}>
          <Text category="h6" status="primary">
            No Runs Assigned Today
          </Text>
        </Card>
      );
    } else {
      return (
        <Card
        disabled={true}
          style={styles.viewWorkoutContainer}
          status="primary"
          footer={Footer}>
          <Text category="h4" style={{marginBottom: '2%'}}>
            Todays Assigned Runs
          </Text>
          {events.map((item, index) => {
            if (item.event.eventCompletedPlayers.includes(uid)) {
            }
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginBottom: '1%',
                }}>
                <Text category="s1">- {item.event.title}</Text>
                {item.event.eventCompletedPlayers.includes(uid) ? (
                  <SuccessIcon />
                ) : (
                  <FailureIcon />
                )}
                <Divider />
              </View>
            );
          })}
        </Card>
      );
    }
  };

  if (events.length > 0) {
    return (
      <>
        <TopNavigation
          title="Select Run"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Layout style={styles.container} level="3">
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <EventsSection />
            <Toggle
              checked={checked}
              onChange={onCheckedChange}
              style={{marginBottom: '2%'}}>
              Assigned Runs
            </Toggle>
            {checked ? (
              <Select
                label="Pick Assigned Run"
                size="large"
                style={styles.select}
                placeholder="Default"
                value={events[eventIndex.row].event.title}
                selectedIndex={eventIndex}
                onSelect={index => seteventIndex(index)}>
                {events.map(rendereventOption)}
              </Select>
            ) : (
              <Select
                caption="Practice Runs Only. These Don't Count Towards Assignments"
                label="Pick Any Run"
                size="large"
                style={styles.select}
                placeholder="Default"
                value={runDisplayValue}
                selectedIndex={runIndex}
                onSelect={index => setRunIndex(index)}>
                {teamRuns.map(renderRunOption)}
              </Select>
            )}

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
            {checked ? (
              <Button
                style={styles.startButton}
                size="giant"
                onPress={() =>
                  navigation.navigate('Confirm Event Screen', {
                    initialCountdown: countdown[countdownIndex.row].time,
                    announceInterval:
                      announceInterval[announceIntervalIndex.row].time,
                    eventItem: events[eventIndex.row],
                    uid: uid,
                  })
                }>
                Select Run
              </Button>
            ) : (
              <Button
                style={styles.startButton}
                size="giant"
                onPress={() =>
                  navigation.navigate('Confirm Run Screen', {
                    initialCountdown: countdown[countdownIndex.row].time,
                    announceInterval:
                      announceInterval[announceIntervalIndex.row].time,
                    run: teamRuns[runIndex.row],
                  })
                }>
                Select Run
              </Button>
            )}
          </ScrollView>
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <TopNavigation
          title="Select Run"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Layout style={styles.container} level="3">
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <EventsSection />
            {teamRuns.length <= 0 ? (
              <Text>Your Coach has not created any runs yet</Text>
            ) : (
              <Select
                label="Pick Any Run to Practice"
                size="large"
                style={styles.select}
                placeholder="Default"
                value={runDisplayValue}
                selectedIndex={runIndex}
                onSelect={index => setRunIndex(index)}>
                {teamRuns.map(renderRunOption)}
              </Select>
            )}
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
                navigation.navigate('Confirm Run Screen', {
                  initialCountdown: countdown[countdownIndex.row].time,
                  announceInterval:
                    announceInterval[announceIntervalIndex.row].time,
                  run: teamRuns[runIndex.row],
                })
              }>
              Select Run
            </Button>
          </ScrollView>
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
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
