import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export interface Question  {
    "questionText": string, //à modifier en questionText
    "options": {'text': string, is_correct: boolean} []
}

export interface Category {
    id: number,
    categoryName: string,
    categoryImage: string
}

export type RootStackParamList = {
    Register: undefined
    Login: {message: string}
    Home: {username: string}
    Score: undefined
    Quiz: {quizData: Question[], categoryName: string}
    Result: {score: number, quizLength: number}
    QuizzesByCategory: {categoryId: number, categoryName: string},
    Profile: undefined
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

export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>

export type ScoreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Score'>