/* eslint-disable react-native/no-inline-styles */

import React, {useState, useRef, useEffect} from 'react';
import {
  Divider,
  Layout,
  Text,
  TopNavigation,
  StyleService,
  useStyleSheet,
  Button,
  Spinner,
} from '@ui-kitten/components';
import {View, useWindowDimensions} from 'react-native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Tts from 'react-native-tts';
import {useRun} from '../../../util/db';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const RunTestScreen = ({navigation, route}) => {
  // read in countdown to start, countdown to 0, announcement interval
  const interval = 5;
  const countdown = 5;
  // get widow dimensions for timer
  const windowWidth = useWindowDimensions().width;
  // initialize states and refs
  const [loading, setLoading] = useState(true);
  const [runSequence, setRunSequence] = useState([]);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const previousTime = useRef();
  // initialize style sheet
  const styles = useStyleSheet(themedStyle);
  // initialize audio
  Tts.addEventListener('tts-start', event => null);
  Tts.addEventListener('tts-finish', event => null);
  Tts.addEventListener('tts-cancel', event => null);

  // get run data
  const {data: items, status} = useRun('bywXlnulWOfiwolwEWfv');

  // this is not great because the timer resets only when key is altered
  // resetting means moving the key to 0, but if the key is already at 0 nothing will happen unil onComplete
  // the quick incrementing of the key enables reset to 0 whem index is already 0, but is poor UX
  function reset() {
    if (key === 0) {
      setKey(prevKey => prevKey + 1);
      setTimeout(() => {
        setKey(0);
      }, 200);
    } else {
      setKey(0);
    }
  }

  // format the run data into a flat array
  useEffect(() => {
    if (status === 'success') {
      let formattedRun = [];
      for (let i = 0; i < items.runSequence.length; i++) {
        let restTimeDownfield =
          items.runSequence[i].downfield.restTime.minutes * 60 +
          items.runSequence[i].downfield.restTime.seconds;
        let targetTimeDownfield =
          items.runSequence[i].downfield.targetTime.minutes * 60 +
          items.runSequence[i].downfield.targetTime.seconds;
        let restTimeUpfield =
          items.runSequence[i].upfield.restTime.minutes * 60 +
          items.runSequence[i].upfield.restTime.seconds;
        let targetTimeUpfield =
          items.runSequence[i].upfield.targetTime.minutes * 60 +
          items.runSequence[i].upfield.targetTime.seconds;

        formattedRun.push(targetTimeDownfield);
        if (restTimeDownfield > 0) {
          formattedRun.push(restTimeDownfield);
        }
        formattedRun.push(targetTimeUpfield);
        if (restTimeUpfield > 0) {
          formattedRun.push(restTimeUpfield);
        }
      }
      setRunSequence(formattedRun);
      previousTime.current = formattedRun[0];
      setLoading(false);
    }
  }, [status, items]);

  const normalColors = [
    ['#439B12', 0.1],
    ['#5CB91A', 0.1],
    ['#78D824', 0.1],
    ['#A2E756', 0.1],
    ['#DBC80C', 0.1],
    ['#FFEB11', 0.1],
    ['#FFF14C', 0.1],
    ['#FA866B', 0.1],
    ['#F65946', 0.1],
    ['#f1100b', 0.05],
    ['#CF0814', 0.05],
  ];

  const restColor = '#118df0';

  const goBack = () => {
    navigation.goBack();
  };

  const CancelButton = () => {
    return (
      <Button
        status="danger"
        size="small"
        appearance="ghost"
        onPress={() => goBack()}>
        Cancel
      </Button>
    );
  };

  if (loading) {
    return (
      <>
        <TopNavigation
          title="Farlick Run"
          alignment="center"
          accessoryLeft={CancelButton}
        />
        <Divider />
        <Layout style={styles.container} level="2">
          <Text>loading...</Text>
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <TopNavigation
          title="Farlick Run"
          alignment="center"
          accessoryLeft={CancelButton}
        />
        <Divider />
        <Layout style={styles.container} level="2">
          <View style={{marginBottom: '50%'}}>
            <CountdownCircleTimer
              onComplete={() => {
                setKey(prevKey => {
                  const nextKey = prevKey + 1;
                  previousTime.current = runSequence[nextKey];
                  return nextKey;
                });
              }}
              isPlaying={isPlaying}
              key={key}
              duration={runSequence[key]}
              size={windowWidth * 0.9}
              strokeWidth={18}
              colors={key % 2 === 0 ? normalColors : restColor}>
              {({remainingTime}) => {
                if (remainingTime < previousTime.current) {
                  if (remainingTime % interval === 0 && remainingTime > 0) {
                    Tts.speak(remainingTime.toString());
                  }
                  if (remainingTime <= countdown - 1 && remainingTime > 0) {
                    Tts.speak(remainingTime.toString());
                  }
                  // set previous time to current time
                  previousTime.current = remainingTime;
                }
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                return (
                  <Text category="h4" style={{fontSize: 84}}>
                    {minutes} : {seconds}
                  </Text>
                );
              }}
            </CountdownCircleTimer>
          </View>
          {isPlaying ? (
            <Button
              size="medium"
              status="danger"
              style={styles.pauseButton}
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactMedium');
                setIsPlaying(false);
              }}>
              Pause
            </Button>
          ) : (
            <View style={styles.buttonGroup}>
              <Button
                status="danger"
                size="medium"
                style={styles.resetButton}
                onPress={() => reset()}>
                Reset
              </Button>
              <Button
                status="success"
                size="medium"
                style={styles.startButton}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactMedium');
                  setIsPlaying(true);
                }}>
                Start
              </Button>
            </View>
          )}
        </Layout>
      </>
    );
  }
};
const themedStyle = StyleService.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%',
  },
  startButton: {
    width: '65%',
  },
  pauseButton: {
    width: '60%',
  },
  resetButton: {
    width: '30%',
  },
});
