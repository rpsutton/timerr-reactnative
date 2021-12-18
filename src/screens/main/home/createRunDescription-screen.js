import React, {useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {
  Input,
  Select,
  Button,
  IndexPath,
  SelectItem,
  TopNavigation,
  TopNavigationAction,
  Layout,
} from '@ui-kitten/components';
import {LargeBackIcon} from '../../../components/icons';

export function CreateRunDescriptionScreen({navigation}) {
  const [runName, setRunName] = useState('');
  const [runDescription, setRunDescription] = useState('');
  const [unitsIndex, setUnitsIndex] = useState(new IndexPath(0));

  const units = [
    {display: 'meters', distanceUnits: 'meters'},
    {display: 'yards', distanceUnits: 'yards'},
    {display: 'feet', distanceUnits: 'feet'},
  ];

  const renderUnitOption = run => (
    <SelectItem title={run.display} key={unitsIndex} />
  );

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeBackIcon} onPress={goBack} />
  );

  function onPress() {
    if (runName !== '' && runDescription !== '') {
      navigation.navigate('Create Run Screen', {
        runName: runName,
        runDescription: runDescription,
        distanceUnits: units[unitsIndex.row].distanceUnits,
      });
    } else {
      Alert.alert(
        'Please make sure name and description fields are filled in.',
      );
    }
  }

  return (
    <>
      <TopNavigation
        title="Create Run"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Layout level="2" style={{flex: 1, width: '100%'}}>
        <ScrollView>
          <View style={{width: '95%', alignSelf: 'center'}}>
            <Input
              label="Run Name"
              placeholder="Enter Run Name"
              value={runName}
              onChangeText={nextValue => setRunName(nextValue)}
            />
            <Input
              multiline={true}
              label="Run Description"
              placeholder="Enter Run Description"
              value={runDescription}
              onChangeText={nextValue => setRunDescription(nextValue)}
            />
            <Select
              label="Distance Units"
              size="large"
              placeholder="Default"
              value={units[unitsIndex.row].distanceUnits}
              selectedIndex={unitsIndex}
              onSelect={index => setUnitsIndex(index)}>
              {units.map(renderUnitOption)}
            </Select>
            <Button
              size="giant"
              style={{marginTop: '4%'}}
              onPress={() => onPress()}>
              Next
            </Button>
          </View>
        </ScrollView>
      </Layout>
    </>
  );
}
