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

function App() {
  const [theme, setTheme] = useState('light');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      setBackgroundColor('#FFFFFF');
    } else {
      setBackgroundColor('#222B45');
    }
  };
  return (
    <ProvideAuth>
      <SafeAreaProvider>
        <NavigationContainer>
          <IconRegistry icons={EvaIconsPack} />
          <ThemeContext.Provider value={{theme, toggleTheme, backgroundColor}}>
            <ApplicationProvider {...eva} theme={eva[theme]}>
              <MainTabNavigator />
            </ApplicationProvider>
          </ThemeContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ProvideAuth>
  );
}

export {App};
