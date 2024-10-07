import React, { useState, createContext } from "react";

type Props = {
    children: React.ReactNode;
}

type QuizContextType = {
    quizNumber: number
    setQuizNumber: (value: number) => void
}

export const QuizContext = createContext<QuizContextType | null>(null)

export function QuizProvider ({children} : Props) {
    const [quizNumber, setQuizNumber] = useState<number>(0)
    
    return (
        <QuizContext.Provider value={{quizNumber, setQuizNumber}}>
            {children}
        </QuizContext.Provider>
    )
}