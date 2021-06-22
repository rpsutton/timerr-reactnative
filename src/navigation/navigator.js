/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {InitializingScreen} from './initializing-screen';
import {HomeScreen} from '../screens/main/home/home-screen';
import {SelectRunScreen} from '../screens/main/cardio/select-run-screen';
import {RunTestScreen} from '../screens/main/cardio/runTest-screen';
import {DetailsScreen} from '../screens/main/settings-screen';
import {SignOutScreen} from '../screens/main/signOut-screen';
import {ProfileScreen} from '../screens/main/profile/profile-screen';
import {EditProfileScreen} from '../screens/main/profile/editProfile-screen';
import {EditNameScreen} from '../screens/main/profile/editName-screen';
import {EditBioScreen} from '../screens/main/profile/editBio-screen';
import {SignInScreen} from '../screens/auth/signIn-screen';
import {SignUpScreen} from '../screens/auth/signUp-screen';
import {JoinTeamScreen} from '../screens/auth/joinTeam-screen';
import {ForgotPasswordScreen} from '../screens/auth/forgotPassword-screen';
import auth from '@react-native-firebase/auth';
import {Drawer, DrawerItem, IndexPath} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeContext} from '../util/themeContext';
import {useAuth} from '../util/auth';
import {HomeIcon, SettingsIcon, PersonIcon} from '../components/icons';

const Stack = createStackNavigator();
const DrawerObj = createDrawerNavigator();

const HomeScreenStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Home Screen">
      <Stack.Screen name="Home Screen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const RunTestStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Select Run Screen">
      <Stack.Screen name="Select Run Screen" component={SelectRunScreen} />
      <Stack.Screen name="Run Test Screen" component={RunTestScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      <Stack.Screen name="Edit Name" component={EditNameScreen} />
      <Stack.Screen name="Edit Bio" component={EditBioScreen} />
    </Stack.Navigator>
  );
};

const AuthScreenStack = () => (
  <Stack.Navigator headerMode="none" initialRouteName="Sign In">
    <Stack.Screen name="Sign In" component={SignInScreen} />
    <Stack.Screen name="Sign Up" component={SignUpScreen} />
    <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const DrawerContent = ({navigation, state}) => (
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
    <DrawerObj.Screen name="Home" component={HomeScreenStack} />
    <DrawerObj.Screen name="Profile" component={ProfileStack} />
    <DrawerObj.Screen name="Settings" component={DetailsScreen} />
  </DrawerObj.Navigator>
);

function MainTabNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const themeContext = useContext(ThemeContext);

  function onAuthStateChanged(user) {
    setCurrentUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const localAuth = useAuth();

  if (currentUser) {
    if (localAuth.teamId !== null) {
      return (
        <SafeAreaView
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
          }}>
          <Stack.Navigator headerMode="none" mode="modal">
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen name="Run Test Stack" component={RunTestStack} />
          </Stack.Navigator>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{flex: 1}}>
          <JoinTeamScreen />
        </SafeAreaView>
      );
    }
  } else if (initializing) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <InitializingScreen />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <AuthScreenStack />
      </SafeAreaView>
    );
  }
}

export {MainTabNavigator};
