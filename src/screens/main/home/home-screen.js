/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Button,
  Spinner,
  Card,
} from '@ui-kitten/components';
import {View, ScrollView, Dimensions} from 'react-native';
import {TopNavCustom} from '../../../components/universal/topnav';
import {useAuth} from '../../../util/auth';
import firestore from '@react-native-firebase/firestore';
import {LineChart} from 'react-native-chart-kit';

const testData = {
  labels: ['9/25', '9/27', '10/01', '10/03', '10/04', '10/05'],
  datasets: [
    {
      data: [6.7, 6.9, 6.8, 7.1, 7.0, 7.1],
    },
  ],
};

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const styles = useStyleSheet(themedStyle);

  useEffect(() => {
    if (auth.user !== undefined && auth.user !== null) {
      setLoading(false);
    }
  }, [auth.user]);

  const CTACard = () => {
    return (
      <View style={styles.ctaContainer}>
        <Text
          status="basic"
          category="h2"
          style={{fontSize: 40, fontWeight: '900'}}>
          Let's Practice Your Runs?
        </Text>
        <Button style={{width: '50%', marginTop: '4%'}} size="giant">
          Go Practice
        </Button>
      </View>
    );
  };

  if (loading) {
    return (
      <Layout style={styles.loadingContainer} level="2">
        <Spinner size="giant" status="primary" />
      </Layout>
    );
  } else {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
      <>
        <TopNavCustom title={`Hello, ${auth.user.firstName}.`} />
        <Layout style={styles.container} level="1">
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <CTACard />
            <Text
              style={{marginTop: '8%', alignSelf: 'flex-start'}}
              category="s1">
              Your Average Speed
            </Text>
            <LineChart
              data={testData}
              width={width * 0.95}
              height={height * 0.3}
              chartConfig={{
                backgroundGradientFrom: '#F7F9FC',
                backgroundGradientFromOpacity: 1,
                backgroundGradientTo: '#F7F9FC',
                backgroundGradientToOpacity: 1,
                color: (opacity = 1) => `rgba(51, 102, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 3, // optional, default 3
              }}
              bezier
              style={{borderRadius: 10, marginTop: '8%'}}
            />

          </ScrollView>
        </Layout>
      </>
    );
  }
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '95%',
    padding: '2%',
  },
  paddedContainer: {
    width: '100%',
    marginTop: '10%',
  },
  ctaContainer: {
    width: '100%',
    minHeight: '20%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: '4%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
