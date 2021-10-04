import React, {useEffect, useState} from 'react';
import {Text} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';

export const CalendarFooter = props => {
  const [runsPercentComplete, setRunsPercentComplete] = useState();
  const [computingIsFinished, setComputingIsFinished] = useState(false);
  useEffect(() => {
    if (computingIsFinished) {
      setComputingIsFinished(false);
    }
    let completedEvents = 0;
    let incompleteEvents = 0;
    let now = new Date();
    firestore()
      .collection('events')
      .where('resource.teamId', '==', props.teamId)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().start.toDate() < now) {
            if (doc.data().eventCompletedPlayers.includes(props.uid)) {
              completedEvents++;
            } else {
              incompleteEvents++;
            }
          }
        });
        let num = (completedEvents / (completedEvents + incompleteEvents)) * 100;
        let fixedNum = num.toFixed(0);
        setRunsPercentComplete(fixedNum);
        setComputingIsFinished(true);
      });
  }, []);

  if (computingIsFinished) {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#3366FF', '#0095FF']}>
        <Text category="c1" style={{padding: '2%', fontWeight: '800'}} status="control">
          You completed {runsPercentComplete}% of assigned runs 💪
        </Text>
      </LinearGradient>
    );
  } else {
    return <Text>loading...</Text>;
  }
};
