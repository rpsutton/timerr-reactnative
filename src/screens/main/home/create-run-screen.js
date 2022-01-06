import React, {useState} from 'react';
import {
  TopNavigation,
  TopNavigationAction,
  StyleService,
  useStyleSheet,
  List,
  Button,
  Modal,
  Spinner,
} from '@ui-kitten/components';
import {View, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import {createRun, saveRun} from '../../../util/db';
import {RunListComponent} from '../../../components/createRunComponents/RunListComponent';
import {
  LargeBackIcon,
  LargePlusIcon,
  LargeCopyIcon,
  LargeMinusIcon,
  LargeCheckIcon,
  InfoIcon,
} from '../../../components/icons';

const lapFramework = {
  // One lap
  downfield: {
    distance: {
      quantity: '',
    },
    targetTime: {
      minutes: '',
      seconds: '',
    },
    restTime: {
      minutes: '',
      seconds: '',
    },
  },
  upfield: {
    distance: {
      quantity: '',
    },
    targetTime: {
      minutes: '',
      seconds: '',
    },
    restTime: {
      minutes: '',
      seconds: '',
    },
  },
};

export const CreateRunScreen = ({navigation, route}) => {
  const uid = route.params.uid;
  const runName = route.params.runName;
  const runDescription = route.params.runDescription;
  const distanceUnits = route.params.distanceUnits;
  const styles = useStyleSheet(themedStyle);
  const [upLoading, setUpLoading] = useState();

  // run sequence
  const [lapArray, setLapArray] = useState([lapFramework]);

  function addLap() {
    let emptyLap = {
      // One lap
      downfield: {
        distance: {
          quantity: '',
        },
        targetTime: {
          minutes: '',
          seconds: '',
        },
        restTime: {
          minutes: '',
          seconds: '',
        },
      },
      upfield: {
        distance: {
          quantity: '',
        },
        targetTime: {
          minutes: '',
          seconds: '',
        },
        restTime: {
          minutes: '',
          seconds: '',
        },
      },
    };
    let newArr = [...lapArray];
    newArr.push(emptyLap);
    setLapArray(newArr);
  }

  // duplicate previous lap
  // uses JSON to dereference the array and item
  function duplicateLap() {
    var duplicateArr = JSON.parse(JSON.stringify(lapArray));
    var duplicateItem = JSON.parse(JSON.stringify(lapArray.pop()));
    duplicateArr.push(duplicateItem);
    setLapArray(duplicateArr);
  }

  // delete previous lap
  function deleteLap() {
    let newArr = [...lapArray];
    newArr.pop();
    setLapArray(newArr);
  }

  function onPublish() {
    if (lapArray.length > 0 && runName !== '') {
      let badRows = 0;
      lapArray.forEach(element => {
        if (
          element.downfield.distance.quantity !== '' &&
          element.upfield.distance.quantity !== '' &&
          (element.downfield.targetTime.minutes > 0 ||
            element.downfield.targetTime.seconds > 0) &&
          (element.upfield.targetTime.minutes > 0 ||
            element.upfield.targetTime.seconds > 0)
        ) {
        } else {
          badRows++;
        }
      });
      if (badRows > 0) {
        Alert.alert(
          badRows +
            ' lap(s) have missing information. Please make sure each lap has defined distances and target times.',
        );
        return;
      } else {
        setUpLoading(true);
        createRun({
          timeCreated: new Date(),
          creatorId: uid,
          runName: runName,
          runDescription: runDescription,
          runSequence: lapArray,
          distanceUnits: distanceUnits,
        })
          .then(res => {
            saveRun(uid, res);
          })
          .then(() => {
            setTimeout(() => {
              setUpLoading(false);
              navigation.navigate('Home Screen');
            }, 1500);
          })
          .catch(e => {
            setUpLoading(false);
            Alert.alert(e);
            console.log(e);
          });
      }
    } else {
      Alert.alert(
        'Please make sure that you name the run, provide a description, and create at least one lap.',
      );
    }
  }

  function renderItem({item, index}) {
    return (
      <RunListComponent
        index={index}
        item={item}
        setLapArray={setLapArray}
        lapArray={lapArray}
        distanceUnits={distanceUnits}
      />
    );
  }

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeBackIcon} onPress={goBack} />
  );

  const HelpAction = () => (
    <TopNavigationAction icon={InfoIcon} onPress={goBack} />
  );

  return (
    <>
      <TopNavigation
        title={runName}
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={HelpAction}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Modal visible={upLoading} backdropStyle={styles.backdrop}>
          <Spinner size="giant" status="basic" />
        </Modal>
        <List
          data={lapArray}
          renderItem={renderItem}
          style={{flex: 1, height: '100%', width: '95%', alignSelf: 'center'}}
        />
        <View
          style={{
            backgroundColor: 'black',
            width: '100%',
            position: 'relative',
            bottom: 0,
            alignSelf: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() => onPublish()}
              appearance="ghost"
              status="info"
              size="small"
              style={{marginLeft: '2%'}}
              accessoryRight={LargeCheckIcon}>
              publish
            </Button>
            <Button
              onPress={() => deleteLap()}
              appearance="ghost"
              status="danger"
              size="small"
              style={{marginLeft: '2%'}}
              accessoryRight={LargeMinusIcon}
            />
            <Button
              onPress={() => addLap()}
              appearance="ghost"
              status="success"
              size="small"
              style={{marginLeft: '2%'}}
              accessoryRight={LargePlusIcon}
            />
            <Button
              onPress={() => duplicateLap()}
              appearance="ghost"
              status="success"
              size="small"
              style={{marginLeft: '2%'}}
              accessoryRight={LargeCopyIcon}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F7F9FC',
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '95%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
