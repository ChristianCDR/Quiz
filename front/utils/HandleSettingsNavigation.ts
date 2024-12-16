import { RootStackNavigationProp } from "@/utils/Types";

const settingsNavigation = (screenToReach: string, navigation: RootStackNavigationProp) => {

    switch (screenToReach) {
        case 'Account': navigation.navigate('Account');
            break;
        case 'Login': 
            navigation.navigate('Login', {message: null});
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Redirige vers l'écran de connexion après la déconnexion
            });
            break;
        case 'Legal': navigation.navigate('Legal');
            break;
    }
}

export default settingsNavigation;
