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
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {LargeBackIcon, FailureIcon} from '../../../components/icons';

export const SelectRunScreen = ({navigation, route}) => {
  const todaysRuns = route.params.todaysRuns;
  const uid = route.params.uid;
  const styles = useStyleSheet(themedStyle);
  const [categoryIndex, setCategoryIndex] = useState(new IndexPath(0));
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

  const data = ['120s', 'Man U', 'Fartlek'];
  const runDisplayValue = data[runIndex.row].runName;
  const renderRunOption = runTest => <SelectItem title={runTest} />;

  const categories = ['My Team runs', 'My Custom Runs', 'My Saved Runs'];
  const categoryDisplayValue = categories[categoryIndex.row];
  const renderCategoryOption = category => <SelectItem title={category} />;

  const countdown = [
    {display: '5 seconds', time: 5},
    {display: '10 seconds', time: 10},
    {display: '15 seconds', time: 15},
    {display: '20 seconds', time: 20},
    {display: '25 seconds', time: 25},
    {display: '30 seconds', time: 30},
  ];
  const countdownDisplayValue = countdown[countdownIndex.row].display;
  const renderCountdownOption = val => <SelectItem title={val.display} />;

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
    <SelectItem title={val.display} />
  );

  const Header = props => (
    <View {...props}>
      <Text category="h6">Today's Assigned Runs</Text>
    </View>
  );

  const Footer = props => (
    <View {...props}>
      <Text category="s1" status="danger">
        Runs Incomplete
      </Text>
    </View>
  );

  return (
    <>
      <TopNavigation
        title="Select Run"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Layout style={styles.container} level="3">
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <Card
            style={{width: '100%', marginBottom: '2%', marginTop: '3%'}}
            status="danger"
            header={Header}
            footer={Footer}>
            {todaysRuns.map((item, arr) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Text category="s1">{item.title}</Text>
                  <FailureIcon />
                  <Divider />
                </View>
              );
            })}
          </Card>
          <Select
            label="Select Run From"
            size="large"
            style={styles.select}
            placeholder="Default"
            value={categoryDisplayValue}
            selectedIndex={categoryIndex}
            onSelect={index => setCategoryIndex(index)}>
            {categories.map(renderCategoryOption)}
          </Select>
          <Select
            label="Pick Run"
            size="large"
            style={styles.select}
            placeholder="Default"
            value={runDisplayValue}
            selectedIndex={runIndex}
            onSelect={index => setRunIndex(index)}>
            {data.map(renderRunOption)}
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
              navigation.navigate('Run Test Screen', {
                uid: uid,
                initialCountdown: countdown[countdownIndex.row].time,
                announceInterval:
                  announceInterval[announceIntervalIndex.row].time,
              })
            }>
            Start Run Test
          </Button>
        </ScrollView>
      </Layout>
    </>
  );
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
  select: {
    width: '100%',
    marginBottom: '3%',
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
    marginTop: '5%',
  },
});
