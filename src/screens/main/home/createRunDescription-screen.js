import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
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
  const [distanceUnits, setDistanceUnits] = useState('meters');

  const [distanceUnitsOptionsIndex, setDistanceUnitsOptionsIndex] = useState(
    new IndexPath(0),
  );
  const distanceUnitsOptions = [
    {display: 'meters', distanceUnits: 'meters'},
    {display: 'yards', distanceUnits: 'yards'},
    {display: 'feet', distanceUnits: 'feet'},
  ];

  const distanceUnitsOptionsDisplayValue =
    distanceUnitsOptions[distanceUnitsOptionsIndex.row].display;

  const renderDistanceUnitsOption = val => (
    <SelectItem title={val.display} key={distanceUnitsOptionsIndex} />
  );

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeBackIcon} onPress={goBack} />
  );

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
              value={distanceUnitsOptionsDisplayValue}
              selectedIndex={distanceUnitsOptionsIndex}
              onSelect={index => {
                setDistanceUnitsOptionsIndex(index);
                setDistanceUnits(
                  distanceUnitsOptions[distanceUnitsOptionsIndex.row]
                    .distanceUnits,
                );
              }}>
              {distanceUnitsOptions.map(renderDistanceUnitsOption)}
            </Select>
            <Button
              size="giant"
              style={{marginTop: '4%'}}
              onPress={() =>
                navigation.navigate('Create Run Screen', {
                  runName: runName,
                  runDescription: runDescription,
                  distanceUnits: distanceUnits,
                })
              }>
              Next
            </Button>
          </View>
        </ScrollView>
      </Layout>
    </>
  );
}
