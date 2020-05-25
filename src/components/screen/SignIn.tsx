import AsyncStorage from '@react-native-community/async-storage';
import Button from '../shared/Button';
import React from 'react';
import { RootStackNavigationProps } from '../navigation/RootStackNavigator';
import type { SignInEmailMutationResponse } from './__generated__/SignInEmailMutation.graphql';
import graphql from 'babel-plugin-relay/macro';
import styled from 'styled-components/native';
import { useAppContext } from '../../providers/AppProvider';
import { useMutation } from 'react-relay/hooks';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }): string => theme.background};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.Image`
  border-radius: 15px;
  align-self: center;
  margin: 25px;
`;

const StyledTextInput = styled.TextInput`
  width: 320px;
  height: 40px;
  align-self: center;
  border-width: 1.3px;
  border-color: lightgray;
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 5px;
  color: ${({ theme }): string => theme.fontColor};
`;

const ErrorMessage = styled.Text`
  color: #f57b51;
  width: 320px;
  height: 20px;
  text-align: center;
  margin-bottom: 10px;
`;

interface Props {
  navigation: RootStackNavigationProps<'Auth'>;
}

// Define a mutation query
const SignInEmailMutation = graphql`
  mutation SignInEmailMutation($email: String!, $password: String!) {
    signInEmail(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        photoURL
      }
    }
  }
`;

function SignIn(props: Props): React.ReactElement {
  const { setUser } = useAppContext();
  const [email, setEmail] = React.useState<string>('ethan1@test.com');
  const [password, setPassword] = React.useState<string>('test');
  const [error, setError] = React.useState<string>('');

  const [commit, isInFlight] = useMutation(SignInEmailMutation);

  const mutationConfig = {
    variables: {
      email,
      password,
    },
    onCompleted: (response: SignInEmailMutationResponse): void => {
      console.log('Mutatiion successed!', response);
      const { token, user } = response.signInEmail;
      AsyncStorage.setItem('@UserStorage:login_token', token)
        .then((res) => {
          setUser({
            ...user,
          });
        })
        .catch((e) => console.error(e));
    },
    onError: (error): void => {
      console.error(error);
      setError('Check your email and password');
    },
  };

  const handleClick = (): void => {
    setError('');
    commit(mutationConfig);
  };
  return (
    <Container>
      <StyledImage
        style={{ width: 150, height: 150 }}
        source={{
          uri: 'https://avatars2.githubusercontent.com/u/45788556?s=200&v=4',
        }}
      />
      <StyledTextInput
        value={email}
        onChangeText={(value: string): void => setEmail(value)}
        textContentType="emailAddress"
        placeholder="email"
      />
      <StyledTextInput
        value={password}
        onChangeText={(value: string): void => setPassword(value)}
        textContentType="password"
        secureTextEntry={true}
        placeholder="Password"
      />
      <ErrorMessage numberOfLines={1}>{error}</ErrorMessage>
      <Button
        testID="btn-back"
        onClick={handleClick}
        text={'SignIn'}
        isLoading={isInFlight}
      />
    </Container>
  );
}

export default SignIn;