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
import {AlertIcon, EmailIcon} from '../../components/icons';
import {useAuth} from '../../util/auth';

export function SignInScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const auth = useAuth();

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const RenderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    if (email !== '' && password !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  function signIn() {
    let mounted = true;
    setLoading(true);
    auth
      .signin(email, password)
      .then(() => {
        console.log('User signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Incorrect password');
        } else if (error.code === 'auth/user-not-found') {
          Alert.alert('User not found');
        } else {
          Alert.aler('Error signing in');
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
      <Text category="h1">Sign In</Text>
      <View style={styles.inputContainer}>
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
          onPress={() => signIn(email, password)}>
          Sign In
        </Button>
        <Button
          style={styles.footerButton}
          size="small"
          appearance="ghost"
          onPress={() => navigation.navigate('Sign Up')}>
          Sign Up
        </Button>
        <Text style={styles.orText} category="s1">Or</Text>
        <Button
          style={styles.footerButton}
          size="small"
          appearance="ghost"
          onPress={() => navigation.navigate('Forgot Password')}>
          Forgot Password?
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
