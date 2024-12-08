import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/utils/Types";
import QuizScreen from '@/app/QuizScreen';
import ResultScreen from '@/app/ResultScreen';
import RegisterScreen from '@/app/RegisterScreen';
import LoginScreen from '@/app/LoginScreen';
import QuizzesByCategoryScreen from '@/app/QuizzesByCategoryScreen';
import TabNavigator from '@/navigation/Tabs';
import AccountScreen from '@/app/AccountScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="Login" 
                component={LoginScreen}   
                initialParams={{ message: ''}}                                                                                                                   
            />
            <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
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
                name="Account"
                component={AccountScreen}
            />
            <Stack.Screen 
                name="Tabs"
                component={TabNavigator}
            />
        </Stack.Navigator>
    );
}

export default AppNavigator;