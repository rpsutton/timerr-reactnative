import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Layout, Text, Input, Button, Spinner} from '@ui-kitten/components';
import {EmailIcon} from '../../components/icons';
import {useAuth} from '../../util/auth';

export function ForgotPasswordScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    if (email !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email]);

  function resetPassword() {
    setLoading(true);
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset, check your email for instructions');
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.code);
        Alert.alert('Something went wrong resetting your password');
        setLoading(false);
        console.error(error);
      });
  }

  const LoadingIndicator = (props) => {
    if (loading) {
      return (
        <View style={[props.style, styles.indicator]}>
          <Spinner size="small" status="primary" />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout style={styles.motherContainer} level="1">
      <Text category="h1">Reset Password</Text>
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
        />
        <Button
          appearance="filled"
          accessoryLeft={LoadingIndicator}
          disabled={disabled}
          style={styles.signUpButton}
          onPress={() => resetPassword(email)}>
          Reset Password
        </Button>
        <Button
          style={styles.footerButton}
          size="small"
          appearance="ghost"
          onPress={() => navigation.navigate('Sign In')}>
          Back to Sign In Screen
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
  footerButton: {
    marginTop: '5%',
  },
});
