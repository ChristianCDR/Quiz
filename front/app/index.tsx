import React, { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import QuizzesByCategoryScreen from './QuizzesByCategoryScreen';
import { RootStackParamList } from "@/utils/Types";
import { ModalProvider } from '@/utils/ModalContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function index () {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFF');
  }, []);

    return ( 
        <ModalProvider>
            <>
                <Stack.Navigator initialRouteName='Home'>
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
        </ModalProvider>
    );
};