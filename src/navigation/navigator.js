/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { InitializingScreen } from './initializing-screen';
import { HomeScreen } from '../screens/main/home/home-screen';
import { SelectRunScreen } from '../screens/main/cardio/select-run-screen';
import { ConfirmRunScreen } from '../screens/main/cardio/confirm-run-screen';
import { ConfirmEventScreen } from '../screens/main/cardio/confirm-event-screen';
import { RunTestScreen } from '../screens/main/cardio/runTest-screen';
import { SettingsScreen } from '../screens/main/settings/settings-screen';
import { ProfileScreen } from '../screens/main/profile/profile-screen';
import { EditTeamMembershipScreen } from '../screens/main/profile/editTeamMembership-screen';
import { EditNameScreen } from '../screens/main/profile/editName-screen';
import { SignInScreen } from '../screens/auth/signIn-screen';
import { SignUpScreen } from '../screens/auth/signUp-screen';
import { JoinTeamScreen } from '../screens/auth/joinTeam-screen';
import { ForgotPasswordScreen } from '../screens/auth/forgotPassword-screen';
import auth from '@react-native-firebase/auth';
import { Drawer, DrawerItem, IndexPath } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeIcon, SettingsIcon, PersonIcon } from '../components/icons';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();
const DrawerObj = createDrawerNavigator();

const HomeScreenStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Home Screen">
      <Stack.Screen name="Home Screen" component={HomeScreen} />
      <Stack.Screen name="Select Run Screen" component={SelectRunScreen} />
      <Stack.Screen name="Confirm Run Screen" component={ConfirmRunScreen} />
      <Stack.Screen
        name="Confirm Event Screen"
        component={ConfirmEventScreen}
      />
      <Stack.Screen
        name="Run Test Screen"
        component={RunTestScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="Edit Team Membership"
        component={EditTeamMembershipScreen}
      />
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

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={index => navigation.navigate(state.routeNames[index.row])}>
    <DrawerItem title="Home" accessoryLeft={HomeIcon} />
    <DrawerItem title="Profile" accessoryLeft={PersonIcon} />
    <DrawerItem title="Settings" accessoryLeft={SettingsIcon} />
  </Drawer>
);

const DrawerNavigator = () => (
  <DrawerObj.Navigator drawerContent={props => <DrawerContent {...props} />}>
    <DrawerObj.Screen
      name="Home"
      component={HomeScreenStack}
      options={{ swipeEnabled: false }}
    />
    <DrawerObj.Screen name="Profile" component={ProfileStack} />
    <DrawerObj.Screen name="Settings" component={SettingsScreen} />
  </DrawerObj.Navigator>
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
          <Stack.Screen name="Main" component={DrawerNavigator} />
        </Stack.Navigator>
      </SafeAreaView>
    );
  } else if (initializing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="dark-content" />
        <InitializingScreen />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="dark-content" />
        <AuthScreenStack />
      </SafeAreaView>
    );
  }
}

export { MainTabNavigator };
