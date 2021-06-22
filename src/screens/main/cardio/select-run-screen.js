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
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {LargeCloseIcon} from '../../../components/icons';

export const SelectRunScreen = ({navigation}, route) => {
  const styles = useStyleSheet(themedStyle);
  const [categoryIndex, setCategoryIndex] = useState(new IndexPath(0));
  const [runIndex, setRunIndex] = useState(new IndexPath(0));
  const [countdownIndex, setCountdownIndex] = useState(new IndexPath(0));
  const [announceIncrementIndex, setAnnounceIncrementIndex] = useState(
    new IndexPath(4),
  );

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeCloseIcon} onPress={goBack} />
  );

  const data = ['120s', 'Man U', 'Fartlek'];
  const runDisplayValue = data[runIndex.row].runName;
  const renderRunOption = (runTest) => <SelectItem title={runTest} />;

  const categories = ['My Team runs', 'My Custom Runs', 'My Saved Runs'];
  const categoryDisplayValue = categories[categoryIndex.row];
  const renderCategoryOption = (category) => <SelectItem title={category} />;

  const countdown = [
    {display: '5 seconds', time: 5},
    {display: '10 seconds', time: 10},
    {display: '15 seconds', time: 15},
    {display: '20 seconds', time: 20},
    {display: '25 seconds', time: 25},
    {display: '30 seconds', time: 30},
  ];
  const countdownDisplayValue = countdown[countdownIndex.row].display;
  const renderCountdownOption = (val) => <SelectItem title={val.display} />;

  const announceIncrement = [
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
  ];
  const announceIncrementDisplayValue =
    announceIncrement[announceIncrementIndex.row].display;
  const renderAnnounceIncrementOption = (val) => (
    <SelectItem title={val.display} />
  );

  return (
    <>
      <TopNavigation
        title="Select Run"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Layout style={styles.container} level="2">
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <Text category="h1" style={styles.selectRunText}>
            Select Run Test
          </Text>
          <Select
            label="Select Run From"
            size="large"
            style={styles.select}
            placeholder="Default"
            value={categoryDisplayValue}
            selectedIndex={categoryIndex}
            onSelect={(index) => setCategoryIndex(index)}>
            {categories.map(renderCategoryOption)}
          </Select>
          <Select
            label="Pick Run"
            size="large"
            style={styles.select}
            placeholder="Default"
            value={runDisplayValue}
            selectedIndex={runIndex}
            onSelect={(index) => setRunIndex(index)}>
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
              onSelect={(index) => setCountdownIndex(index)}>
              {countdown.map(renderCountdownOption)}
            </Select>
            <Select
              label="Announce Time Every"
              size="large"
              style={styles.bottomSelect}
              placeholder="Default"
              value={announceIncrementDisplayValue}
              selectedIndex={announceIncrementIndex}
              onSelect={(index) => setAnnounceIncrementIndex(index)}>
              {announceIncrement.map(renderAnnounceIncrementOption)}
            </Select>
          </View>
          <Button
            style={styles.startButton}
            size="giant"
            onPress={() =>
              navigation.navigate('Run Test Screen', {
                initialCountdown: countdown[countdownIndex.row].time,
                announceIncrement:
                  announceIncrement[announceIncrementIndex.row].time,
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
    flex: 1,
    justifyContent: 'center',
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
