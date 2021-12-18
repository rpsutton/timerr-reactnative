/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Button,
  Spinner,
  List,
  ListItem,
  Divider,
} from '@ui-kitten/components';
import {View} from 'react-native';
import {TopNavCustom} from '../../../components/universal/topnav';
import {useAuth} from '../../../util/auth';
import firestore from '@react-native-firebase/firestore';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState([]);
  const auth = useAuth();
  const user = auth.user;
  const styles = useStyleSheet(themedStyle);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('savedRuns')
        .onSnapshot(querySnapshot => {
          const savedRuns = [];
          querySnapshot.forEach(documentSnapshot => {
            savedRuns.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setRuns(savedRuns);
          setLoading(false);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }
  }, [user]);

  const Header = () => {
    return (
      <View style={styles.ctaContainer}>
        <Text
          status="basic"
          category="h2"
          style={{fontSize: 32, fontWeight: '900'}}>
          Your Saved Runs
        </Text>
      </View>
    );
  };

  const Footer = () => {
    return (
      <Button
        onPress={() =>
          navigation.navigate('Create Run Description Screen', {
            uid: user.uid,
          })
        }
        status="primary"
        size="giant"
        style={{marginTop: '4%'}}>
        Add A Run To My List
      </Button>
    );
  };

  const EditButton = () => (
    <Button size="tiny" status="primary" appearance="outline">
      View
    </Button>
  );

  function renderItem({item, index}) {
    return (
      <ListItem
        title={item.runName}
        key={index}
        accessoryRight={EditButton}
        disabled={true}
      />
    );
  }

  if (loading) {
    return (
      <Layout style={styles.loadingContainer} level="2">
        <Spinner size="giant" status="primary" />
      </Layout>
    );
  } else {
    return (
      <>
        <TopNavCustom title={`Hello, ${auth.user.firstName}.`} />
        <Layout contentContainerStyle={styles.container} level="2">
          <List
            data={runs}
            ListHeaderComponent={Header}
            ListFooterComponent={Footer}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
            style={{height: '100%', width: '95%', alignSelf: 'center'}}
          />
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
  paddedContainer: {
    width: '100%',
    marginTop: '10%',
  },
  ctaContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: '4%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
