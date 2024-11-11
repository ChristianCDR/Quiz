import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export interface Question  {
    "questionText": string,
    "options": {'text': string, is_correct: boolean} []
}

export interface Category {
    id: number,
    categoryName: string,
    categoryImage: string
}

export interface Score {
    id: number, 
    player_id: number, 
    quiz_id: number, 
    category_id: number,
    category_name: string,
    score_rate: number
}

export type RootStackParamList = {
    Register: undefined
    Login: {message: string}
    Home: undefined
    Score: undefined
    Quiz: {quizData: Question[], categoryName: string | undefined}
    Result: {score: number, quizLength: number}
    QuizzesByCategory: undefined
    Settings: undefined,
    Lessons: undefined,
    Account: undefined
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
    username: string, 
    setUsername: (value: string) => void;
    scores: Score[];
    setScores: (value: Score[]) => void;
    quizzes: Question[][];
    setQuizzes: (value: Question[][]) => void;
    categoryId: number;
    setCategoryId: (value: number) => void
    categoryName: string;
    setCategoryName: (value: string) => void
    email: string; 
    setEmail: (value: string) => void
}

export type ErrorType = string | null

export type QuizzesByCategoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizzesByCategory'>

export type QuizzesByCategoryScreenRouteProp = RouteProp<RootStackParamList, 'QuizzesByCategory'>

export type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>

export type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>

export type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>

export type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>

export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>

export type ScoreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Score'>

export type ScoreScreenRouteProp = RouteProp<RootStackParamList, 'Score'>

export type LessonScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lessons'>

export type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account'>