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
    Quiz: {quizData: Question[], categoryName: string}
    Result: { score: number, quizLength: number };
    QuizzesByCategory: {categoryId: number, categoryName: string};
}



export type ErrorType = string | null;

export type QuizzesByCategoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizzesByCategory'>;

export type QuizzesByCategoryScreenRouteProp = RouteProp<RootStackParamList, 'QuizzesByCategory'>

export type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;

export type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>

export type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

export type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;