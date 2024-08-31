import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Question  {
    "questiontext": string, //à modifier en questionText
    "options": {'text': string, is_correct: boolean} []
}

export interface Category {
    id: number,
    categoryName: string,
    categoryImage: string
}

export type RootStackParamList = {
    Home: undefined; 
    Quiz: {quizData: Question[]}
    Result: { score: number };
    QuizzesByCategory: {categoryId: number};
}



export type ErrorType = string | null;

export type QuizzesByCategoryScreenRouteProp = RouteProp<RootStackParamList, 'QuizzesByCategory'>

export type QuizzesByCategoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizzesByCategory'>;

export type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;

export type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>

export type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;