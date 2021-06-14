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
import runData from '../../../util/runData';
import {useAuth} from '../../../util/auth';
import {getTeam, useRunsByTeamAndDay} from '../../../util/db';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState('...');
  const [team, setTeam] = useState();
  const styles = useStyleSheet(themedStyle);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    let mounted = true;
    if (auth.user !== undefined && auth.user !== null) {
      setFirstName(auth.user.firstName);
      getTeam(auth.user.teamId)
        .then((doc) => setTeam(doc.data()))
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    }
    return () => (mounted = false);
  }, [auth.user]);

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  const renderItem = ({item, index}) => {
    if (index === 0) {
      return (
        <Layout style={styles.renderFirstItemContainer} level="1">
          <Text category="s1">{item.runName}</Text>
          <Divider />
        </Layout>
      );
    } else if (index === runData.teamRuns.length - 1 && index % 2 === 1) {
      return (
        <Layout style={styles.renderLastItemContainer} level="1">
          <Text category="s1">{item.runName}</Text>
          <Divider />
        </Layout>
      );
    } else if (index === runData.teamRuns.length - 1 && index % 2 === 0) {
      return (
        <Layout style={styles.renderLastItemContainer} level="1">
          <Text category="s1">{item.runName}</Text>
          <Divider />
        </Layout>
      );
    } else if (index % 2 === 0) {
      return (
        <Layout style={styles.renderItemContainer} level="1">
          <Text category="s1">{item.runName}</Text>
        </Layout>
      );
    } else {
      return (
        <Layout style={styles.renderItemContainer} level="1">
          <Text category="s1">{item.runName}</Text>
          <Divider />
        </Layout>
      );
    }
  };

  const GreetingCard = () => {
    return (
      <Layout style={styles.viewWorkoutContainer}>
        <Text category="h4">Hello, {firstName}.</Text>
        <Text category="s1" appearance="hint">
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
          onPress={() => navigation.navigate('Run Test Stack')}>
          Practice My Runs
        </Button>
        <Calendar
          renderDay={DayCell}
          style={styles.calendar}
          date={date}
          onSelect={(nextDate) => setDate(nextDate)}
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

  return (
    <>
      <TopNavigation
        title="Home"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <Layout style={styles.container} level="2">
        {loading ? (
          <Spinner size="large" status="primary" />
        ) : (
          <List
            data={runData.teamRuns}
            renderItem={renderItem}
            ListHeaderComponent={TeamRunsCardHeader}
            ListFooterComponent={ListFooter}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Layout>
    </>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
