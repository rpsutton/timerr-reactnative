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
import {KeypadIcon} from '../../components/icons';
import {useAuth} from '../../util/auth';
import {checkValidTeamId} from '../../util/db';

export function JoinTeamScreen({navigation}) {
  const [teamCode, setTeamCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (teamCode !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [teamCode]);

  function joinTeam(teamId) {
    setLoading(true);
    checkValidTeamId(teamId, setValid)
      .then((res) => {
        if (res) {
          auth
            .updateProfile({
              teamId: teamId,
            })
            .then(() => setLoading(false))
            .catch((e) => Alert.alert(e));
        } else {
          Alert.alert('Invalid team id');
        }
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 1000),
      );
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
      <Text category="h1">Join Team</Text>
      <View style={styles.inputContainer}>
        <Input
          value={teamCode}
          label="Team Code"
          placeholder="Enter Team Code"
          accessoryRight={KeypadIcon}
          secureTextEntry={false}
          onChangeText={(nextValue) => setTeamCode(nextValue)}
          autoCapitalize="none"
          autoFocus={true}
        />
        <Button
          appearance="filled"
          accessoryLeft={LoadingIndicator}
          disabled={disabled}
          style={styles.signUpButton}
          onPress={() => joinTeam(teamCode)}>
          Join Team
        </Button>
        <Button
          style={styles.footerButton}
          size="small"
          appearance="ghost"
          onPress={() => navigation.navigate('Sign Up')}>
          I don't have a team code
        </Button>
        <Button
          style={styles.footerButton}
          size="small"
          appearance="outline"
          status="info"
          onPress={() => auth.signout()}>
          Sign Out
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
