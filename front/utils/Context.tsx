import React, { useState, createContext } from "react";
import { Children, ContextType } from '@/utils/Types';

export const Context = createContext<ContextType | null>(null);

export function ContextProvider ({children}: Children) {
    const [quizNumber, setQuizNumber] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    return (
        <Context.Provider value={{ isModalVisible, showModal, hideModal, quizNumber, setQuizNumber, userId, setUserId }}>
            {children}
        </Context.Provider>
    )
}