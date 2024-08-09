import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: { score: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function index () {
  return ( 
    <>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{title: 'Home'}}
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{title: 'Quiz'}}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{title: 'Result'}}
        />
      </Stack.Navigator> 
    </>
  );
};