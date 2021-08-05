/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Divider,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  StyleService,
  useStyleSheet,
  Button,
  Card,
  Icon,
  Calendar,
  Spinner,
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {
  LargeDrawerIcon,
  FailureIcon,
  SuccessIcon,
} from '../../../components/icons';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../../../util/auth';
import firestore from '@react-native-firebase/firestore';
import {getRunsByTeam} from '../../../util/db';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [teamRuns, setTeamRuns] = useState(undefined);
  const [eventsCompleteNumber, setEventsCompleteNumber] = useState(0);
  const auth = useAuth();
  const [dateObj, setDateObj] = useState(new Date());
  const [firstName, setFirstName] = useState('...');
  const styles = useStyleSheet(themedStyle);
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [querySize, setQuerySize] = useState(undefined);
  const [completedEvents, setCompletedEvents] = useState([]);

  useEffect(() => {
    if (auth.user !== undefined) {
      setEventsCompleteNumber(0);
      setEvents([]);
      setAllEvents([]);
      setCompletedEvents([]);
      setFirstName(auth.user.firstName);
      firestore()
        .collection('events')
        .where('resource.teamId', '==', auth.user.teamId)
        .onSnapshot(
          querySnapshot => {
            setQuerySize(querySnapshot.size);
            let data = [];
            let all = [];
            let completed = [];
            querySnapshot.forEach(documentSnapshot => {
              // must include end boundry condition here
              let doc = documentSnapshot.data();
              let allDate = doc.start.toDate();
              all.push(allDate.toString());
              if (doc.eventCompletedPlayers.includes(auth.user.uid)) {
                let compDate = doc.start.toDate();
                completed.push(compDate.toString());
              }
              if (
                doc.start.toDate() <= dateObj &&
                doc.end.toDate() >= dateObj
              ) {
                const newEvent = {
                  event: documentSnapshot.data(),
                  id: documentSnapshot.id,
                };

                //update events away properly here

                data.push(newEvent);
              }
            });
            setEvents(data);
            setAllEvents(all);
            setCompletedEvents(completed);
          },
          error => {
            console.log(error);
          },
        );

      setTeamRuns(getRunsByTeam(auth.user.teamId));
    }
  }, [auth.user]);

  useEffect(() => {
    if (querySize !== undefined) {
      if (allEvents.length === querySize) {
        setLoading(false);
      } else {
        if (!loading) {
          setLoading(true);
        }
      }
    }
  }, [querySize, allEvents.length, loading]);

  useEffect(() => {
    let count = 0;
    if (allEvents.length === querySize) {
      for (const ev of events) {
        if (ev.event.eventCompletedPlayers.includes(auth.user.uid)) {
          count++;
        }
      }
      setEventsCompleteNumber(count);
    }
  }, [allEvents.length, querySize, events]);

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  const Header = props => (
    <View {...props}>
      <Text category="h4">Hello, {firstName}.</Text>
      <Text category="h6" appearance="hint">
        Welcome back, go and get it! 🏃
      </Text>
    </View>
  );

  const Footer = props => {
    if (eventsCompleteNumber <= 0) {
      return (
        <View {...props}>
          <Text category="s1" status="danger">
            {eventsCompleteNumber}/{events.length} Assigned events complete
          </Text>
        </View>
      );
    } else if (
      eventsCompleteNumber > 0 &&
      eventsCompleteNumber < events.length
    ) {
      return (
        <View {...props}>
          <Text category="s1" status="warning">
            {eventsCompleteNumber}/{events.length} Assigned events complete
          </Text>
        </View>
      );
    } else {
      <View {...props}>
        <Text category="s1" status="success">
          {eventsCompleteNumber}/{events.length} Assigned runs complete
        </Text>
      </View>;
    }
  };

  const GreetingCard = () => {
    if (events.length === 0) {
      return (
        <Card
          disabled={true}
          style={styles.viewWorkoutContainer}
          status="primary"
          header={Header}>
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
          header={Header}
          footer={Footer}>
          <Text category="h4" style={{marginBottom: '2%'}}>
            Todays Assigned Runs
          </Text>
          {events.map((item, index) => {
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
                {item.event.eventCompletedPlayers.includes(auth.user.uid) ? (
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

  const DayCell = ({date}, style) => {
    if (date < new Date()) {
      if (completedEvents.includes(date.toString())) {
        return (
          <View style={[styles.dayContainer, style.container]}>
            <Text category="s1" style={style.text}>
              {date.getDate()}
            </Text>
            <Icon style={styles.icon} fill="#87C946" name="checkmark" />
          </View>
        );
      } else if (
        allEvents.includes(date.toString()) &&
        !completedEvents.includes(date.toString())
      ) {
        return (
          <View style={[styles.dayContainer, style.container]}>
            <Text category="s1" style={style.text}>
              {date.getDate()}
            </Text>
            <Icon style={styles.icon} fill="#f1100b" name="close" />
          </View>
        );
      } else {
        return (
          <View style={[styles.dayContainer, style.container]}>
            <Text category="s1" style={style.text}>
              {date.getDate()}
            </Text>
          </View>
        );
      }
    } else {
      if (allEvents.includes(date.toString())) {
        return (
          <View style={[styles.dayContainer, style.container]}>
            <Text category="s1" style={style.text}>
              {date.getDate()}
            </Text>
            <Icon
              style={styles.icon}
              fill="#C5CEE0"
              name="radio-button-off-outline"
            />
          </View>
        );
      } else {
        return (
          <View style={[styles.dayContainer, style.container]}>
            <Text category="s1" style={style.text}>
              {date.getDate()}
            </Text>
          </View>
        );
      }
    }
  };
  const ListFooter = () => {
    return (
      <View style={{width: '100%'}}>
        <Button
          style={styles.footerButton}
          size="giant"
          onPress={() =>
            navigation.navigate('Select Run Screen', {
              teamId: auth.user.teamId,
              uid: auth.user.id,
              todaysEvents: events,
              // completed events arr, not int
              eventsComplete: completedEvents,
              eventsCompleteNumber: eventsCompleteNumber,
              teamRuns: teamRuns,
            })
          }>
          Go To My Runs
        </Button>
        <Calendar
          //boundingMonth={true}
          renderDay={DayCell}
          style={styles.calendar}
          date={dateObj}
          onSelect={nextDate => setDateObj(nextDate)}
          renderFooter={CalendarFooter}
        />
      </View>
    );
  };

  const CalendarFooter = () => {
    let date = new Date();
    const previousEvents = allEvents.filter(ev => ev < date.toString());
    let runsPercentage = Math.round(
      (completedEvents.length / previousEvents.length) * 100,
    );
    //console.log(runsPercentage);
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#3366FF', '#0095FF']}>
        <Text category="c1" style={styles.calendarFooterText} status="control">
          You completed {runsPercentage}% of assigned runs 💪
        </Text>
      </LinearGradient>
    );
  };

  if (loading || events === undefined) {
    return (
      <Layout style={styles.loadingContainer} level="2">
        <Spinner size="giant" status="primary" />
      </Layout>
    );
  } else {
    return (
      <>
        <TopNavigation
          title="Home"
          alignment="center"
          accessoryLeft={DrawerAction}
        />
        <Layout style={styles.container} level="3">
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <GreetingCard />
            <ListFooter />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  viewWorkoutContainer: {
    marginTop: '2%',
    width: '100%',
  },
  teamTextContainer: {
    marginTop: '2%',
  },
  icon: {
    width: 15,
    height: 15,
  },
  footerButton: {
    marginTop: '2%',
    marginBottom: '2%',
  },
  dayText: {
    marginBottom: '2%',
  },
  calendar: {
    backgroundColor: 'background-basic-color-1',
    width: '100%',
    borderRadius: 5,
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  calendarFooterText: {
    padding: '2%',
  },
});
