import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
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
import AccountScreen from './AccountScreen';
import SettingsModal from '@/components/SettingsModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function index () {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFF');
  }, []);

  useEffect(() => {
    StatusBar.setBackgroundColor("#1E3C58");
    StatusBar.setBarStyle("light-content");
  }, []);

    return (  
        <ContextProvider>
            <>
                <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
                    <Stack.Screen 
                      name="Login" 
                      component={LoginScreen} 
                      initialParams={{ message: '' }}                                                                                                                        
                    />
                    <Stack.Screen 
                      name="Register" 
                      component={RegisterScreen}
                    />
                    <Stack.Screen 
                      name="Home" 
                      component={HomeScreen}
                    />
                    <Stack.Screen
                      name="Score"
                      component={ScoreScreen}
                    />
                    <Stack.Screen 
                      name="Quiz" 
                      component={QuizScreen} 

                    />
                    <Stack.Screen 
                      name="Result" 
                      component={ResultScreen} 

                      // initialParams={{ score: 9, quizLength: 10 }}
                    />
                    <Stack.Screen 
                      name="QuizzesByCategory"
                      component={QuizzesByCategoryScreen}

                    />
                    <Stack.Screen 
                      name="Lessons"
                      component={LessonScreen}

                    />
                    <Stack.Screen 
                      name="Account"
                      component={AccountScreen}

                    />
                  </Stack.Navigator>
            </>
            <SettingsModal/>
        </ContextProvider>  
    );
};