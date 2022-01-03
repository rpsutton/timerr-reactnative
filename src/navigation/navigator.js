/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {InitializingScreen} from './initializing-screen';
import {HomeScreen} from '../screens/main/home/home-screen';
import {AddRunScreen} from '../screens/main/home/add-run-screen';
import {SelectRunScreen} from '../screens/main/cardio/select-run-screen';
import {ConfirmRunScreen} from '../screens/main/cardio/confirm-run-screen';
import {RunTestScreen} from '../screens/main/cardio/runTest-screen';
import {CreateRunDescriptionScreen} from '../screens/main/home/createRunDescription-screen';
import {CreateRunScreen} from '../screens/main/home/create-run-screen';
import {ProfileScreen} from '../screens/main/profile/profile-screen';
import {EditNameScreen} from '../screens/main/profile/editName-screen';
import {SignInScreen} from '../screens/auth/signIn-screen';
import {SignUpScreen} from '../screens/auth/signUp-screen';
import {JoinTeamScreen} from '../screens/auth/joinTeam-screen';
import {ForgotPasswordScreen} from '../screens/auth/forgotPassword-screen';
import auth from '@react-native-firebase/auth';
import {BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ClockIcon, OptionsIcon, PlusIcon} from '../components/icons';
import {StatusBar} from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeScreenStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Home Screen">
      <Stack.Screen name="Home Screen" component={HomeScreen} />
      <Stack.Screen name="Add Run Screen" component={AddRunScreen} />
      <Stack.Screen name="Create Run Screen" component={CreateRunScreen} />
      <Stack.Screen
        name="Create Run Description Screen"
        component={CreateRunDescriptionScreen}
      />
    </Stack.Navigator>
  );
};

const RunStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="SelectRunScreen">
      <Stack.Screen name="Select Run Screen" component={SelectRunScreen} />
      <Stack.Screen name="Confirm Run Screen" component={ConfirmRunScreen} />
      <Stack.Screen
        name="Run Test Screen"
        component={RunTestScreen}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Edit Name" component={EditNameScreen} />
    </Stack.Navigator>
  );
};

const AuthScreenStack = () => (
  <Stack.Navigator headerMode="none" initialRouteName="Sign In">
    <Stack.Screen name="Sign In" component={SignInScreen} />
    <Stack.Screen name="Sign Up" component={SignUpScreen} />
    <Stack.Screen name="Join Team" component={JoinTeamScreen} />
    <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    appearance="noIndicator"
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab icon={PlusIcon} />
    <BottomNavigationTab icon={ClockIcon} />
    <BottomNavigationTab icon={OptionsIcon} />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <BottomTabBar {...props} />}
    screenOptions={{headerShown: false}}
    initialRouteName="Run">
    <Tab.Screen name="Home" component={HomeScreenStack} />
    <Tab.Screen name="Run" component={RunStack} />
    <Tab.Screen name="Settings" component={ProfileStack} />
  </Tab.Navigator>
);

function MainTabNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  if (currentUser) {
    return (
      <SafeAreaView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Main Stack" component={TabNavigator} />
          <Stack.Screen name="Run Stack" component={RunStack} />
        </Stack.Navigator>
      </SafeAreaView>
    );
  } else if (initializing) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="dark-content" />
        <InitializingScreen />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="dark-content" />
        <AuthScreenStack />
      </SafeAreaView>
    );
  }
}

export {MainTabNavigator};
