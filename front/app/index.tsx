import React, { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@/app/HomeScreen';
import QuizScreen from '@/app/QuizScreen';
import ResultScreen from '@/app/ResultScreen';
import RegisterScreen from '@/app/RegisterScreen';
import LoginScreen from '@/app/LoginScreen';
import ScoreScreen from '@/app/ScoreScreen';
import LessonScreen from '@/app/LessonScreen';
import QuizzesByCategoryScreen from '@/app/QuizzesByCategoryScreen';
import { RootStackParamList } from "@/utils/Types";
import { ContextProvider } from '@/utils/Context';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function index () {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFF');
  }, []);

    return (  
        <ContextProvider>
            <>
                <Stack.Navigator initialRouteName='Login'>
                    <Stack.Screen 
                      name="Login" 
                      component={LoginScreen} 
                      options={{headerShown: false}}   
                      initialParams={{ message: '' }}                                                                                                                        
                    />
                    <Stack.Screen 
                      name="Register" 
                      component={RegisterScreen} 
                      options={{headerShown: false}}                                                                                                                           
                    />
                    <Stack.Screen 
                      name="Home" 
                      component={HomeScreen} 
                      options={{headerShown: false}}  
                      initialParams={{username : 'Le Boss'}}                                                                                                                         
                    />
                    <Stack.Screen
                      name="Score"
                      component={ScoreScreen}
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
                    <Stack.Screen 
                      name="Lessons"
                      component={LessonScreen}
                      options={{headerShown: false}}
                    />
                  </Stack.Navigator> 
            </>
        </ContextProvider>  
    );
};