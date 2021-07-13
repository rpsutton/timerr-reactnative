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
import { getRunsByTeam } from '../../../util/db';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [teamRuns, setTeamRuns] = useState(undefined);
  const [eventsComplete, setEventsComplete] = useState(0);
  const auth = useAuth();
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState('...');
  const styles = useStyleSheet(themedStyle);
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const [events, setevents] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    if (auth.user !== undefined) {
      setFirstName(auth.user.firstName);
      var currentTime = new Date();
      let data = [];
      firestore()
        .collection('events')
        .where('resource.teamId', '==', auth.user.teamId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            // must include end boundry condition here
            if (
              documentSnapshot.data().start.toDate() <= currentTime &&
              documentSnapshot.data().end.toDate() >= currentTime
            ) {
              let doc = documentSnapshot.data();
              if (doc.eventCompletedPlayers.includes(auth.user.uid)) {
                setEventsComplete(prevNum => {
                  const nextNum = prevNum + 1;
                  return nextNum;
                });
              }
              data.push(documentSnapshot.data());
            }
          });
          setevents(data);
        })
        .then(() => {
          setTeamRuns(getRunsByTeam(auth.user.teamId));
        })
        .catch(e => console.log(e));
      setLoading(false);
      return () => (mounted = false);
    }
  }, [auth.user]);

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
    if (eventsComplete <= 0) {
      return (
        <View {...props}>
          <Text category="s1" status="danger">
            {eventsComplete}/{events.length} Assigned events Complete
          </Text>
        </View>
      );
    } else if (eventsComplete > 0 && eventsComplete < events.length) {
      return (
        <View {...props}>
          <Text category="s1" status="warning">
            {eventsComplete}/{events.length} Assigned events Complete
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

  const GreetingCard = () => {
    if (events.length === 0) {
      return (
        <Card
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
          style={styles.viewWorkoutContainer}
          status="primary"
          header={Header}
          footer={Footer}>
          <Text category="h4" style={{marginBottom: '2%'}}>
            Todays Assigned Runs
          </Text>
          {events.map((item, index) => {
            if (item.eventCompletedPlayers.includes(auth.user.uid)) {
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
                <Text category="s1">- {item.title}</Text>
                {item.eventCompletedPlayers.includes(auth.user.uid) ? (
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

  let month = date.getMonth();
  let day = date.getDate();
  const DayCell = ({date}, style) => {
    let currentDate = date.getDate();
    let currentMonth = date.getMonth();
    if (
      (currentDate % 2 === 0 || currentDate % 3 === 0) &&
      currentDate < 15 &&
      currentMonth === month
    ) {
      return (
        <View style={[styles.dayContainer, style.container]}>
          <Text category="s1" style={style.text}>
            {date.getDate()}
          </Text>
          <Icon style={styles.icon} fill="#00E096" name="checkmark" />
        </View>
      );
    } else if (currentDate < day && currentMonth === month) {
      return (
        <View style={[styles.dayContainer, style.container]}>
          <Text category="s1" style={style.text}>
            {date.getDate()}
          </Text>
          <Icon style={styles.icon} fill="#FF3D71" name="close" />
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
              eventsComplete: eventsComplete,
              teamRuns: teamRuns,
            })
          }>
          Go To My Runs
        </Button>
        <Calendar
          renderDay={DayCell}
          style={styles.calendar}
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          renderFooter={CalendarFooter}
        />
      </View>
    );
  };

  const CalendarFooter = () => {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#3366FF', '#0095FF']}>
        <Text category="c1" style={styles.calendarFooterText} status="control">
          You completed 86% of assigned runs this month 💪
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
