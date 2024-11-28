import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ContextProvider } from '@/utils/Context';
import SettingsModal from '@/components/SettingsModal';
import AppStack from '@/navigation/Stack';

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
                <AppStack/>
            </>
            <SettingsModal/>
        </ContextProvider>  
    );
};