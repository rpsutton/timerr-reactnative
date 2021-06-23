import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {MainTabNavigator} from './navigation/navigator';
import {ThemeContext} from './util/themeContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ProvideAuth} from './util/auth';
import {default as masterTheme} from './util/custom-theme.json';

function App() {
  return (
    <ProvideAuth>
      <SafeAreaProvider>
        <NavigationContainer>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={{...eva.light, ...masterTheme}}>
            <MainTabNavigator />
          </ApplicationProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ProvideAuth>
  );
}

export {App};
