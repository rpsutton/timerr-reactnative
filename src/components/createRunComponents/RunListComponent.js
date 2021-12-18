import React from 'react';
import { Text, Card, Input } from '@ui-kitten/components';
import { View } from 'react-native';

export const RunListComponent = (props) => {
  const lap = props.item;
  const lapArray = props.lapArray;
  const distanceUnits = props.distanceUnits;
  const index = props.index;
  const setLapArray = props.setLapArray;
  const lapNumber = index + 1;

  const updateDownfieldDistanceQuantity = e => {
    let newArr = [...lapArray];
    newArr[index].downfield.distance.quantity = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateDownfieldTargetTimeMinutes = e => {
    let newArr = [...lapArray];
    newArr[index].downfield.targetTime.minutes = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateDownfieldTargetTimeSeconds = e => {
    let newArr = [...lapArray];
    newArr[index].downfield.targetTime.seconds = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateDownfieldRestTimeMinutes = e => {
    let newArr = [...lapArray];
    newArr[index].downfield.restTime.minutes = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateDownfieldRestTimeSeconds = e => {
    let newArr = [...lapArray];
    newArr[index].downfield.restTime.seconds = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateUpfieldDistanceQuantity = e => {
    let newArr = [...lapArray];
    newArr[index].upfield.distance.quantity = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateUpfieldTargetTimeMinutes = e => {
    let newArr = [...lapArray];
    newArr[index].upfield.targetTime.minutes = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateUpfieldTargetTimeSeconds = e => {
    let newArr = [...lapArray];
    newArr[index].upfield.targetTime.seconds = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateUpfieldRestTimeMinutes = e => {
    let newArr = [...lapArray];
    newArr[index].upfield.restTime.minutes = e;
    setLapArray(newArr);
    console.log(newArr);
  };

  const updateUpfieldRestTimeSeconds = e => {
    let newArr = [...lapArray];
    newArr[index].upfield.restTime.seconds = e;
    setLapArray(newArr);
    console.log(newArr);
  };
  return (
    <Card disabled={true} style={{ marginTop: '1%' }}>
      <Text category="h4">Lap/Run {lapNumber}</Text>
      <Text category="h6" style={{ marginVertical: '2%' }}>
        Downfield
      </Text>
      <Input
        style={{ padding: 0, margin: 0 }}
        keyboardType="numeric"
        label={`Distance Downfield - ${distanceUnits}`}
        placeholder="Enter Distance Ran Downfield"
        value={lap.downfield.distance.quantity.toString()}
        onChangeText={nextValue => updateDownfieldDistanceQuantity(nextValue)}
      />
      <Text style={{ marginVertical: '2%' }} category="s1">
        Target Run Time
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Input
          placeholder="0"
          keyboardType="numeric"
          label="Target Minutes"
          value={lap.downfield.targetTime.minutes.toString()}
          onChangeText={nextValue =>
            updateDownfieldTargetTimeMinutes(nextValue)
          }
        />
        <Input
          placeholder="0"
          keyboardType="numeric"
          style={{ marginLeft: '5%' }}
          label="Target Seconds"
          value={lap.downfield.targetTime.seconds.toString()}
          onChangeText={nextValue =>
            updateDownfieldTargetTimeSeconds(nextValue)
          }
        />
      </View>
      <Text style={{ marginVertical: '2%' }} category="s1">
        Rest Time
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Input
          placeholder="0"
          keyboardType="numeric"
          label="Rest Minutes"
          value={lap.downfield.restTime.minutes.toString()}
          onChangeText={nextValue => updateDownfieldRestTimeMinutes(nextValue)}
        />
        <Input
          placeholder="0"
          keyboardType="numeric"
          style={{ marginLeft: '5%' }}
          label="Rest Seconds"
          value={lap.downfield.restTime.seconds.toString()}
          onChangeText={nextValue => updateDownfieldRestTimeSeconds(nextValue)}
        />
      </View>
      <Text category="h6" style={{ marginVertical: '2%' }}>
        Upfield
      </Text>
      <Input
        placeholder="Enter Distance Ran Upfield"
        keyboardType="numeric"
        label={`Distance Upfield - ${distanceUnits}`}
        value={lap.upfield.distance.quantity.toString()}
        onChangeText={nextValue => updateUpfieldDistanceQuantity(nextValue)}
      />
      <Text style={{ marginVertical: '2%' }} category="s1">
        Target Run Time
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Input
          placeholder="0"
          keyboardType="numeric"
          label="Target Minutes"
          value={lap.upfield.targetTime.minutes.toString()}
          onChangeText={nextValue => updateUpfieldTargetTimeMinutes(nextValue)}
        />
        <Input
          placeholder="0"
          keyboardType="numeric"
          style={{ marginLeft: '5%' }}
          label="Target Seconds"
          value={lap.upfield.targetTime.seconds.toString()}
          onChangeText={nextValue => updateUpfieldTargetTimeSeconds(nextValue)}
        />
      </View>
      <Text style={{ marginVertical: '2%' }} category="s1">
        Rest Time
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Input
          placeholder="0"
          keyboardType="numeric"
          label="Rest Minutes"
          value={lap.upfield.restTime.minutes.toString()}
          onChangeText={nextValue => updateUpfieldRestTimeMinutes(nextValue)}
        />
        <Input
          placeholder="0"
          keyboardType="numeric"
          style={{ marginLeft: '5%' }}
          label="Rest Seconds"
          value={lap.upfield.restTime.seconds.toString()}
          onChangeText={nextValue => updateUpfieldRestTimeSeconds(nextValue)}
        />
      </View>
    </Card>
  );
};
