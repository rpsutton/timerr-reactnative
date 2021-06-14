import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, StyleSheet, View, Alert} from 'react-native';
import {
  Layout,
  Text,
  Input,
  Button,
  Icon,
  Spinner,
} from '@ui-kitten/components';
import {AlertIcon, EmailIcon, PersonIcon} from '../../components/icons';
import {useAuth} from '../../util/auth';

export function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const auth = useAuth();
  console.log(auth);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const RenderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    let mounted = true;
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      password !== ''
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    return () => (mounted = false);
  }, [email, firstName, lastName, password]);

  function onSignup() {
    let mounted = true;
    setLoading(true);
    auth
      .signup(email, password, firstName, lastName)
      .then(() => {
        console.log('User signed in!');
        setLoading(false);
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Incorrect password');
        } else if (error.code === 'auth/user-not-found') {
          Alert.alert('User not found');
        } else {
          Alert.alert('Error signing in');
        }
        setLoading(false);
        console.error(error);
      });
    return () => (mounted = false);
  }

  const LoadingIndicator = (props) => {
    if (loading) {
      return (
        <View style={[props.style, styles.indicator]}>
          <Spinner size="small" status="control" />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout style={styles.motherContainer} level="1">
      <Text category="h1">Sign Up</Text>
      <View style={styles.inputContainer}>
        <Input
          value={firstName}
          label="First Name"
          placeholder="Enter First Name"
          accessoryRight={PersonIcon}
          secureTextEntry={false}
          onChangeText={(nextValue) => setFirstName(nextValue)}
          autoCapitalize="words"
        />
        <Input
          value={lastName}
          label="Last Name"
          placeholder="Enter Last Name"
          accessoryRight={PersonIcon}
          secureTextEntry={false}
          onChangeText={(nextValue) => setLastName(nextValue)}
          autoCapitalize="words"
        />
        <Input
          value={email}
          label="Email"
          placeholder="Enter Email"
          accessoryRight={EmailIcon}
          secureTextEntry={false}
          onChangeText={(nextValue) => setEmail(nextValue)}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <Input
          value={password}
          label="Password"
          placeholder="Enter Password"
          caption="Should contain at least 8 symbols"
          accessoryRight={RenderIcon}
          captionIcon={AlertIcon}
          secureTextEntry={secureTextEntry}
          onChangeText={(nextValue) => setPassword(nextValue)}
          keyboardType="default"
          autoCapitalize="none"
          textContentType="password"
        />
        <Button
          appearance="filled"
          accessoryLeft={LoadingIndicator}
          disabled={disabled}
          style={styles.signUpButton}
          onPress={() => onSignup(email, password)}>
          Sign Up
        </Button>
        <Button
          style={styles.footerButton}
          size="small"
          appearance="ghost"
          onPress={() => navigation.navigate('Sign In')}>
          Sign In
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  motherContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    width: '85%',
    marginTop: '3%',
  },
  signUpButton: {
    marginTop: '3%',
  },
  orText: {
    alignSelf: 'center',
  },
  footerButton: {
    marginTop: '2%',
    marginBottom: '2%',
  },
});
