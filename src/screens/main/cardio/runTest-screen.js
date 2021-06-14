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
import {View, LogBox, Animated} from 'react-native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import * as Animatable from 'react-native-animatable';
import Tts from 'react-native-tts';
import {useRun} from '../../../util/db';

export const RunTestScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [runSequence, setRunSequence] = useState([]);
  const [key, setKey] = useState(0);
  const RestTextAnimationRef = useRef(null);
  const GoTextAnimationRef = useRef(null);
  const styles = useStyleSheet(themedStyle);
  // initialize audio
  Tts.addEventListener('tts-start', (event) => null);
  Tts.addEventListener('tts-finish', (event) => null);
  Tts.addEventListener('tts-cancel', (event) => null);

  const [isPlaying, setIsPlaying] = useState(false);

  const {data: items, status} = useRun('bywXlnulWOfiwolwEWfv');

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

        formattedRun.push(parseInt(targetTimeDownfield, 10));
        formattedRun.push(parseInt(restTimeDownfield, 10));
        formattedRun.push(parseInt(targetTimeUpfield, 10));
        formattedRun.push(parseInt(restTimeUpfield, 10));
      }
      setRunSequence(formattedRun);
      setLoading(false);
    }
  }, [status, items]);

  const normalColors = [
    ['#00B383', 0.2],
    ['#00E096', 0.2],
    ['#51F0B0', 0.2],
    ['#FFE59E', 0.1],
    ['#FFC94D', 0.1],
    ['#FF708D', 0.1],
    ['#FF3D71', 0.05],
    ['#DB2C66', 0.05],
  ];

  const restColor = '#3366FF';

  const _fadeInRestTextUp = () => {
    if (RestTextAnimationRef) {
      RestTextAnimationRef.current?.fadeInUp();
    }
  };

  const _fadeOutRestText = () => {
    if (RestTextAnimationRef) {
      RestTextAnimationRef.current?.fadeOutDown();
    }
  };

  const _fadeInGoTextUp = () => {
    if (GoTextAnimationRef) {
      GoTextAnimationRef.current?.fadeInUp();
    }
  };

  const _fadeOutGoText = () => {
    if (GoTextAnimationRef) {
      GoTextAnimationRef.current?.fadeOutDown();
    }
  };

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
          <CountdownCircleTimer
            onComplete={() => {
              setKey(key + 1);
            }}
            isPlaying={isPlaying}
            key={key}
            duration={runSequence[key]}
            size={300}
            colors={key % 2 === 0 ? normalColors : restColor}>
            {({remainingTime, animatedColor}) => (
              <Animated.Text style={{color: animatedColor}}>
                {remainingTime}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
          {isPlaying ? (
            <Button onPress={() => setIsPlaying(false)}>stop</Button>
          ) : (
            <Button onPress={() => setIsPlaying(true)}>start</Button>
          )}
        </Layout>
      </>
    );
  }
};
const themedStyle = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
