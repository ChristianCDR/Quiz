import React, { useState, createContext } from "react";

type Props = {
    children: React.ReactNode;
}

type ModalContextType = {    
    showModal: () => void;
    hideModal: () => void;
    isModalVisible: boolean;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider ({children}: Props) {

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    return (
        <ModalContext.Provider value={{ isModalVisible, showModal, hideModal }}>
            {children}
        </ModalContext.Provider>
    )
}