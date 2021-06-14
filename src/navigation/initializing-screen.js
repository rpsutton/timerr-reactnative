/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Layout, Spinner} from '@ui-kitten/components';

export const InitializingScreen = () => {
  return (
    <Layout
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      level="2">
      <Spinner size="giant" />
    </Layout>
  );
};
