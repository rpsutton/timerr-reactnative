/* eslint-disable react-native/no-inline-styles */
/*
import React, {useState, useRef, useEffect} from 'react';
import {
  Platform,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
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
import Geolocation from 'react-native-geolocation-service';
import {hasLocationPermission} from 'react-native-geolocation-service';

export const RunTestScreen = ({navigation, route}) => {
  const run = route.params.run;
  const uid = route.params.uid;
  const event = route.params.eventItem;
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
      Tts.stop();
      Tts.speak('run selected');
      setVoiceReady(true);
    });
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  });

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
    if (run !== undefined) {
      let formattedRun = [];
      formattedRun.push({time: countdown, isRest: false});
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

        formattedRun.push({time: targetTimeDownfield, isRest: false});

        if (restTimeDownfield > 0) {
          formattedRun.push({time: restTimeDownfield, isRest: true});
        }

        formattedRun.push({time: targetTimeUpfield, isRest: false});

        if (restTimeUpfield) {
          formattedRun.push({time: restTimeUpfield, isRest: true});
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
        onPress: () => navigation.goBack(),
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

  if (loading || !voiceReady) {
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
                console.log(runSequence[key + 1].time);
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
                    Tts.stop();
                    Tts.speak('rest');
                  } else {
                    Tts.stop();
                    Tts.speak('go');
                  }
                } else {
                  setIsComplete(true);
                  Tts.stop();
                  Tts.speak('complete');
                  // make sure to get the eventId from prev screen
                  // conditionally execute this, only if event id exists
                  if (event !== undefined && event !== null) {
                    console.log(event.id);
                    setEventComplete(event.id, uid);
                  }
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
                    Tts.stop();
                    Tts.speak(remainingTime.toString());
                  }
                  // countdown speach
                  if (remainingTime <= countdown && remainingTime > 0) {
                    Tts.stop();
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
                    <Text category="h4" style={{fontSize: 80}}>
                      {minutes} : {seconds}
                    </Text>
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
                Tts.stop();
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
**/

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export function RunTestScreen() {
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  //const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);

  const watchId = useRef(null);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow timerr to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };

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
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <View style={styles.option}>
            <Text>Enable High Accuracy</Text>
            <Switch onValueChange={setHighAccuracy} value={highAccuracy} />
          </View>

          {Platform.OS === 'ios' && (
            <View style={styles.option}>
              <Text>Use Significant Changes</Text>
              <Switch
                onValueChange={setSignificantChanges}
                value={significantChanges}
              />
            </View>
          )}

          {Platform.OS === 'android' && (
            <>
              <View style={styles.option}>
                <Text>Show Location Dialog</Text>
                <Switch
                  onValueChange={setLocationDialog}
                  value={locationDialog}
                />
              </View>
              <View style={styles.option}>
                <Text>Force Location Request</Text>
                <Switch
                  onValueChange={setForceLocation}
                  value={forceLocation}
                />
              </View>
              <View style={styles.option}>
                <Text>Use Location Manager</Text>
                <Switch
                  onValueChange={setUseLocationManager}
                  value={useLocationManager}
                />
              </View>
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Get Location" onPress={getLocation} />
          <View style={styles.buttons}>
            <Button
              title="Start Observing"
              onPress={getLocationUpdates}
              disabled={observing}
            />
          </View>
        </View>
        <View style={styles.result}>
          <Text>Latitude: {location?.coords?.latitude || ''}</Text>
          <Text>Longitude: {location?.coords?.longitude || ''}</Text>
          <Text>Heading: {location?.coords?.heading}</Text>
          <Text>Accuracy: {location?.coords?.accuracy}</Text>
          <Text>Altitude: {location?.coords?.altitude}</Text>
          <Text>Altitude Accuracy: {location?.coords?.altitudeAccuracy}</Text>
          <Text>Speed: {location?.coords?.speed}</Text>
          <Text>Provider: {location?.provider || ''}</Text>
          <Text>
            Timestamp:{' '}
            {location?.timestamp
              ? new Date(location.timestamp).toLocaleString()
              : ''}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
});
