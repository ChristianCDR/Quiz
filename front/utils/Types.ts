import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Option {
    text: string;
    is_correct: boolean; 
}

export interface Question {
    questionText: string;
    options: Option[];
}

export interface Category {
    id: number;
    categoryName: string;
    categoryImage: string;
}

export interface Score {
    id: number;
    player_id: number; 
    quiz_id: number;
    category_id: number;
    category_name: string;
    score_rate: number;
}

export type RootStackParamList = {
    Register: undefined;
    Login: { message: string | null};
    Quiz: { quizData: Question[], categoryName: string };
    Result: { score: number, quizLength: number };
    QuizzesByCategory: undefined;
    Account: undefined;
    Legal: undefined;
    Tabs: { screen: keyof TabParamList }; 
    ForgotPassword: undefined;
}

export type TabParamList = {
    Home: undefined;
    Score: undefined;
    Settings: undefined;
    Lessons: undefined;
}

export type Children = {
    children: React.ReactNode;
}

export type ContextType = {    
    showModal: () => void;
    hideModal: () => void;
    isModalVisible: boolean;
    quizNumber: number;
    setQuizNumber: (value: number) => void;
    userId:number; 
    setUserId: (value: number) => void;
    username: string | null;
    setUsername: (value: string) => void;
    scores: Score[];
    setScores: (value: Score[]) => void;
    quizzes: Question[][];
    setQuizzes: (value: Question[][]) => void;
    categoryId: number;
    setCategoryId: (value: number) => void
    categoryName: string | null;
    setCategoryName: (value: string) => void;
    email: string | null;
    setEmail: (value: string) => void;
    updateScores: boolean;
    setUpdateScores: (value: boolean) => void;
    screenToReach: string | null;
    setScreenToReach: (value: string | null ) => void;
    profilePhoto: string | null;
    setProfilePhoto: (value: string | null ) => void;
}

export type ErrorType = string | null;

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export type TabStackNavigationProp = NativeStackNavigationProp<TabParamList>

// Route Props

export type QuizzesByCategoryScreenRouteProp = RouteProp<RootStackParamList, 'QuizzesByCategory'>

export type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>

export type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

export type HomeScreenRouteProp = RouteProp<TabParamList, 'Home'>

export type ScoreScreenRouteProp = RouteProp<TabParamList, 'Score'>
