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
  List,
  Icon,
  Calendar,
  Spinner,
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {LargeDrawerIcon} from '../../../components/icons';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../../../util/auth';
import firestore from '@react-native-firebase/firestore';
//import {getAssignedRuns} from '../../../util/db';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState('...');
  const styles = useStyleSheet(themedStyle);
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const [runs, setRuns] = useState(undefined);

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
              console.log(documentSnapshot.data().start.toDate());
              data.push(documentSnapshot.data());
            }
          });
          setRuns(data);
        })
        .then(() => setLoading(false))
        .catch(e => console.log(e));
      setLoading(false);
      return () => (mounted = false);
    }
  }, [auth.user]);

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  const renderItem = ({item, index}) => {
    if (item === null || item === undefined) {
      <Text category="s1">No runs assigned today</Text>;
    }
    if (index === 0) {
      return (
        <Layout style={styles.renderFirstItemContainer} level="1">
          <Text category="s1">{item.title}</Text>
          <Divider />
        </Layout>
      );
    } else if (index === runs.length - 1 && index % 2 === 0) {
      return (
        <Layout style={styles.renderLastItemContainer} level="1">
          <Text category="s1">{item.title}</Text>
          <Divider />
        </Layout>
      );
    } else {
      return (
        <Layout style={styles.renderItemContainer} level="1">
          <Text category="s1">{item.title}</Text>
          <Divider />
        </Layout>
      );
    }
  };

  const GreetingCard = () => {
    return (
      <Layout style={styles.viewWorkoutContainer}>
        <Text category="h4">Hello, {firstName}.</Text>
        <Text category="h6" appearance="hint">
          Welcome back, go and get it! 🏃
        </Text>
      </Layout>
    );
  };

  const TeamRunsCardHeader = () => (
    <>
      <GreetingCard />
      <Text style={styles.myRunsText} category="h6">
        Today's Assigned Runs
      </Text>
    </>
  );

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
      <View>
        <Button
          style={styles.footerButton}
          size="giant"
          onPress={() =>
            navigation.navigate('Select Run Screen', {
              teamId: auth.user.teamId,
            })
          }>
          Practice My Runs
        </Button>
        <Calendar
          renderDay={DayCell}
          style={styles.calendar}
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          renderFooter={CalendarFooter}
        />
        <Button style={styles.calendarButton} appearance="ghost" size="small">
          View Practice History on the Selected Data
        </Button>
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
          You practiced 32 runs on 9 days this month 💪
        </Text>
      </LinearGradient>
    );
  };

  if (loading || runs === undefined) {
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
        <Divider />
        <Layout style={styles.container} level="2">
          <List
            data={runs}
            renderItem={renderItem}
            ListHeaderComponent={TeamRunsCardHeader}
            ListFooterComponent={ListFooter}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </Layout>
      </>
    );
  }
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    marginTop: '3%',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  renderItemContainer: {
    padding: '2%',
  },
  renderFirstItemContainer: {
    padding: '2%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  renderLastItemContainer: {
    padding: '2%',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  teamTextContainer: {
    marginTop: '3%',
  },
  myRunsText: {
    marginTop: '3%',
    padding: '2%',
  },
  list: {
    width: '95%',
    backgroundColor: 'background-basic-color-2',
  },
  icon: {
    width: 15,
    height: 15,
  },
  footerButton: {
    marginTop: '3%',
    marginBottom: '3%',
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
  calendarButton: {
    marginBottom: '15%',
  },
});
