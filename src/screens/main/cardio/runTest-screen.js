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
import {Alert, View, useWindowDimensions} from 'react-native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Tts from 'react-native-tts';
import {setEventComplete} from '../../../util/db';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
//import Geolocation from 'react-native-geolocation-service';
//import {hasLocationPermission} from '../../../components/runs/permissionsFunctions';

export const RunTestScreen = ({navigation, route}) => {
  const run = route.params.run;
  const uid = route.params.uid;
  // read in countdown to start, countdown to 0, announcement interval
  const interval = route.params.announceInterval;
  const countdown = route.params.initialCountdown;
  // get widow dimensions for timer
  const windowWidth = useWindowDimensions().width;
  // initialize states and refs
  const [loading, setLoading] = useState(true);
  // run data
  const [runSequence, setRunSequence] = useState([]);
  // key to track runsequence index in timer
  const [key, setKey] = useState(0);
  // timer is playing or not
  const [isPlaying, setIsPlaying] = useState(false);
  // run is complete
  const [isComplete, setIsComplete] = useState(false);
  // tts is ready
  const [voiceReady, setVoiceReady] = useState(false);
  // first time pressing start
  const [isFirstStart, setIsFirstStart] = useState(true);
  const previousTime = useRef();
  // initialize style sheet
  const styles = useStyleSheet(themedStyle);
  // initialize tts

  useEffect(() => {
    Tts.addEventListener('tts-start', event => null);
    Tts.addEventListener('tts-finish', event => null);
    Tts.addEventListener('tts-cancel', event => null);
    Tts.setDefaultRate(0.55);
    Tts.setIgnoreSilentSwitch('ignore');
    Tts.setDucking(true);
    Tts.getInitStatus().then(status => {
      Tts.speak('run selected');
      setVoiceReady(true);
    });
  }, []);

  /*
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);

  const watchId = useRef(null);

  */

  /*
  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 0,
        interval: 1000,
        fastestInterval: 500,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };

  const removeLocationUpdates = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
    }
  };

  */

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
    setIsFirstStart(true);
    previousTime.current = runSequence[0].time;
  }

  // format the run data into a flat array, convert minutes to seconds, remove zero value times
  // basic logic: after flattening, only even laps can be rests, so we can assign isRest: true to even laps
  // do not include the rest lap if it has a time value of zero
  // push the countdown to the beginning of the array
  // push a zero value lap to the end of the array, which is used to flag the end of run
  useEffect(() => {
    if (run !== null) {
      let formattedRun = [];
      formattedRun.push({time: countdown, isRest: false, distance: null});
      for (let i = 0; i < run.runSequence.length; i++) {
        let restTimeDownfield =
          run.runSequence[i].downfield.restTime.minutes * 60 +
          run.runSequence[i].downfield.restTime.seconds;
        let targetTimeDownfield =
          run.runSequence[i].downfield.targetTime.minutes * 60 +
          run.runSequence[i].downfield.targetTime.seconds;
        let restTimeUpfield =
          run.runSequence[i].upfield.restTime.minutes * 60 +
          run.runSequence[i].upfield.restTime.seconds;
        let targetTimeUpfield =
          run.runSequence[i].upfield.targetTime.minutes * 60 +
          run.runSequence[i].upfield.targetTime.seconds;

        formattedRun.push({
          time: targetTimeDownfield,
          isRest: false,
          distance: run.runSequence[i].downfield.distance.quantity,
        });

        if (restTimeDownfield > 0) {
          formattedRun.push({
            time: restTimeDownfield,
            isRest: true,
            distance: 0,
          });
        }

        formattedRun.push({
          time: targetTimeUpfield,
          isRest: false,
          distance: run.runSequence[i].upfield.distance.quantity,
        });

        if (restTimeUpfield) {
          formattedRun.push({time: restTimeUpfield, isRest: true, distance: 0});
        }
      }
      formattedRun.push({time: 0, isRest: false});
      setRunSequence(formattedRun);
      // assign previous ref value
      previousTime.current = formattedRun[0].time;
      setLoading(false);
    }
  }, [countdown, run]);

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

  const showAlert = () =>
    Alert.alert('Cancel Run', 'Are you sure you want to cancel this run?', [
      {
        text: 'Cancel Run',
        onPress: () => {
          //removeLocationUpdates();
          navigation.goBack();
        },
        style: 'destructive',
      },
      {
        text: 'Dismiss',
        style: 'cancel',
      },
    ]);

  const CancelButton = () => {
    return (
      <Button
        status="danger"
        size="small"
        appearance="ghost"
        onPress={() => showAlert()}>
        Cancel
      </Button>
    );
  };

  if (loading || !voiceReady || run === null) {
    return (
      <Layout
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        level="2">
        <Spinner size="giant" />
      </Layout>
    );
  } else {
    return (
      <>
        <TopNavigation
          title={run.runName}
          alignment="center"
          accessoryLeft={CancelButton}
        />
        <Divider />
        <Layout style={styles.container} level="1">
          <View style={{marginBottom: '50%'}}>
            <CountdownCircleTimer
              onComplete={() => {
                if (runSequence[key + 1].time === 0) {
                  setIsPlaying(false);
                }
                setKey(prevKey => {
                  const nextKey = prevKey + 1;
                  previousTime.current = runSequence[nextKey].time;
                  return nextKey;
                });
                if (runSequence[key + 1].time > 0) {
                  if (runSequence[key + 1].isRest) {
                    Tts.speak('rest');
                  } else {
                    Tts.speak('go');
                  }
                } else {
                  setIsComplete(true);
                  Tts.speak('complete');
                  // make sure to get the eventId from prev screen
                  // conditionally execute this, only if event id exists
                  /*
                  if (event !== undefined && event !== null) {
                    console.log(event.id);
                    setEventComplete(event.id, uid);

                  }
                  */
                  navigation.navigate('Home Screen');
                }
              }}
              isPlaying={isPlaying}
              key={key}
              duration={runSequence[key].time}
              size={windowWidth * 0.9}
              strokeWidth={18}
              colors={runSequence[key].isRest ? restColor : normalColors}>
              {({remainingTime}) => {
                if (remainingTime < previousTime.current) {
                  // interval speach
                  if (
                    remainingTime % interval === 0 &&
                    remainingTime > 0 &&
                    remainingTime > countdown
                  ) {
                    Tts.speak(remainingTime.toString());
                  }
                  // countdown speach
                  if (remainingTime <= countdown && remainingTime > 0) {
                    Tts.speak(remainingTime.toString());
                  }
                  // set previous time to current time
                  previousTime.current = remainingTime;
                }
                // format time text
                var minutes = Math.floor(remainingTime / 60);
                var seconds = remainingTime % 60;
                seconds < 10 ? (seconds = `${'0' + seconds}`) : null;
                minutes < 10 ? (minutes = `${'0' + minutes}`) : null;
                if (runSequence[key].time > 0) {
                  return (
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      {!runSequence[key].isRest && key > 0 && (
                        <Text category="h1">
                          {runSequence[key].distance} {run.distanceUnits}
                        </Text>
                      )}
                      {runSequence[key].isRest && (
                        <Text category="h1">rest</Text>
                      )}
                      <Text category="h5" style={{fontSize: 70}}>
                        {minutes} : {seconds}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <Text category="h4" style={{fontSize: 48}}>
                      Complete
                    </Text>
                  );
                }
              }}
            </CountdownCircleTimer>
          </View>
          {isFirstStart ? (
            <Button
              size="medium"
              status="success"
              style={styles.beginButton}
              onPress={() => {
                //getLocationUpdates();
                Tts.speak(countdown.toString());
                ReactNativeHapticFeedback.trigger('impactHeavy');
                setIsPlaying(true);
                setIsFirstStart(false);
              }}>
              Begin Run
            </Button>
          ) : isPlaying ? (
            <Button
              size="medium"
              status="danger"
              style={styles.pauseButton}
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactHeavy');
                setIsPlaying(false);
              }}>
              Pause
            </Button>
          ) : (
            <View style={styles.buttonGroup}>
              <Button
                disabled={isComplete}
                status="danger"
                size="medium"
                style={styles.resetButton}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactHeavy');
                  reset();
                }}>
                Reset
              </Button>
              <Button
                disabled={isComplete}
                status="success"
                size="medium"
                style={styles.startButton}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactHeavy');
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
  beginButton: {
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
