import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import SettingsModal from '@/components/SettingsModal';
import { ContextProvider } from '@/utils/Context';
import AppStack from '@/navigation/Stack';
import * as MediaLibrary from 'expo-media-library';

export default function index () {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFF');
  }, []);

  useEffect(() => {
    StatusBar.setBackgroundColor("#1E3C58");
    StatusBar.setBarStyle("light-content");
  }, []);

  // if (status === null) {
  //   requestPermission();
  // }

  return (  
      <ContextProvider>
          <>
              <AppStack/>
          </>
          <SettingsModal/>
      </ContextProvider>  
  );
};