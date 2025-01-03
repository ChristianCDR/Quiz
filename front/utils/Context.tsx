import React, { useState, createContext } from "react";
import { Children, ContextType, Score, Question } from '@/utils/Types';

export const Context = createContext<ContextType | null>(null);

export function ContextProvider ({children}: Children) {
    const [quizNumber, setQuizNumber] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [username, setUsername] = useState<string|null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [scores, setScores] = useState<Score[]>([]);
    const [quizzes, setQuizzes] = useState<Question[][]>([]);  
    const [categoryId, setCategoryId] = useState<number>(0);
    const [categoryName, setCategoryName] = useState<string|null>(null);
    const [email, setEmail] = useState<string|null>(null);
    const [updateScores, setUpdateScores] = useState<boolean>(false);
    const [screenToReach, setScreenToReach] = useState<string|null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string|null>('default.png');

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);
    
    return (
        <Context.Provider value={{ 
            isModalVisible, 
            showModal, 
            hideModal,
            quizNumber, 
            setQuizNumber, 
            userId, 
            setUserId,
            username, 
            setUsername,
            scores, 
            setScores,
            quizzes, 
            setQuizzes,
            categoryId,
            setCategoryId, 
            categoryName,
            setCategoryName,
            email, 
            setEmail,
            updateScores, 
            setUpdateScores,
            screenToReach, 
            setScreenToReach,
            profilePhoto,
            setProfilePhoto
        }}>
        
            {children}
        </Context.Provider>
    )
}