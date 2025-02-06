import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '@/app/HomeScreen';
import ScoreScreen from '@/app/ScoreScreen';
import LessonScreen from '@/app/LessonScreen';
import SettingsModal from '@/components/SettingsModal';
import { TabParamList } from '@/utils/Types';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { useContext } from 'react';
import { Context } from '../utils/Context';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const context = useContext(Context);

  if(!context) throw new Error ('Context returned null. Context must be used within a ModalProvider');

  const { showModal } = context;

  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions = {({route}) => ({ 
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: '#1E3C58',
        tabBarStyle: { height: 60, paddingTop: 10 },
        tabBarIcon: ({focused, color}) => {
          const size = focused ? 25 : 22; 

          switch (route.name) {
            case 'Home': 
              return <AntDesign name="home" size={size} color={color} />;
              break;
            case 'Score': 
              return <Ionicons name="stats-chart-outline"  size={size} color={color} />;
              break;
            case 'Lessons': 
              return <FontAwesome name="book"  size={size} color={color} />;
              break;
            case 'Settings': 
              return <Entypo name="dots-three-vertical"  size={size} color={color} />
              break;
          }
        },
        tabBarLabel: ({focused}) => {
          const textColor = focused ? 'tomato' : '#1E3C58';

          switch (route.name) {
            case 'Home':
              return <Text style={{ color: textColor }}>Accueil</Text>;
              break;
            case 'Score':
              return <Text style={{ color: textColor }}>Scores</Text>;
              break;
            case 'Lessons':
              return <Text style={{ color: textColor }}>Cours</Text>;
              break;
            case 'Settings':
              return <Text style={{ color: textColor }}>Plus</Text>;
              break;
          }
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Score" component={ScoreScreen} />
      <Tab.Screen name="Lessons" component={LessonScreen} />
      <Tab.Screen 
        name="Settings" 
        component={SettingsModal} 
        listeners={({ navigation }) => ({
          // Navigation de la modal
          tabPress: (e) => {
            e.preventDefault();  // Empêcher l'activation du tab et ouvrir la modal
            showModal();
          },
        })}
        />
    </Tab.Navigator>
  );
}

export default TabNavigator;