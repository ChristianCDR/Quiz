import instance from "@/api/Interceptors";
import { Question } from "@/utils/Types";

export const fetchQuizzesByCategoryId = async (categoryId: number) => {
    
   try {
        const response = await instance.get(`/api/questions/category/${categoryId}`);

        if (response.data) {
            const result = chunkData(response.data, 10);
            return result;
        }  
   }
   catch (error: unknown) {
        const errMessage = (error as Error).message;
        throw new Error (errMessage);
   }
}

const chunkData = (data: Question [], questionsPerQuiz: number) => {
        
    const result: Question[][] = [];
    const size = Math.ceil(data.length/questionsPerQuiz);
    for (let i = 0; i < size; i++) {
        const startIndex = i * questionsPerQuiz;
        const endIndex = startIndex + questionsPerQuiz;
        result.push(data.slice(startIndex, endIndex));
    }
    return result;
}
