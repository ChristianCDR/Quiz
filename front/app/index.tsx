import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';
import QuizzesByCategoryScreen from './QuizzesByCategoryScreen';
import { RootStackParamList } from "../constants/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function index () {
  return ( 
    <>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{headerShown: false}}                                                                                                                           
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{headerShown: false}}
          // initialParams={{ score: 9, quizLength: 10 }}
        />
        <Stack.Screen 
          name="QuizzesByCategory"
          component={QuizzesByCategoryScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator> 
    </>
  );
};