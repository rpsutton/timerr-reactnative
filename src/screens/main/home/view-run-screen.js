import React, {useEffect, useState} from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  StyleService,
  useStyleSheet,
  Button,
  Card,
  Spinner,
} from '@ui-kitten/components';
import {View, ScrollView} from 'react-native';
import {LargeBackIcon} from '../../../components/icons';

export const ViewRunScreen = ({navigation, route}) => {
  const runObj = route.params.runObj;
  const uid = route.params.uid;
  const styles = useStyleSheet(themedStyle);

  const goBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={LargeBackIcon} onPress={goBack} />
  );

  function Header(props) {
    return (
      <View {...props}>
        <Text category="h3" style={{fontStyle: 'italic'}}>
          {runObj.run.runName}
        </Text>
        <Text category="h6" status="primary">
          {runObj.run.runSequence.length} Lap Run
        </Text>
      </View>
    );
  }

  return (
    <>
      <TopNavigation
        title="View Run"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Layout style={styles.container} level="2">
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <Card
            disabled={true}
            status="primary"
            header={Header}
            style={{marginTop: '2%', width: '100%'}}>
            <Text category="s1" appearance="hint" style={{fontWeight: '800'}}>
              Run Description
            </Text>
            <Text category="s1">{runObj.run.runDescription}</Text>
          </Card>
          <Button
            status="primary"
            style={styles.confirmButton}
            size="giant"
            >
            View Run Sequence
          </Button>
          {runObj.run.creatorId == uid && (
            <Button
              status="primary"
              appearance="outline"
              style={styles.backButton}
              size="giant"
              onPress={() => navigation.goBack()}>
              Edit Run
            </Button>
          )}
          <Button
            status="danger"
            appearance="outline"
            style={styles.backButton}
            size="giant"
            onPress={() => navigation.goBack()}>
            Remove From Saved Runs
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '95%',
  },
  confirmButton: {
    marginTop: '3%',
    width: '100%',
  },
  backButton: {
    marginTop: '3%',
    width: '100%',
  },
});
