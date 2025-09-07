"use client";

import React, { createContext, useContext, useState } from "react";

interface TransitionContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    scale: number;
    duration: number;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
    undefined
);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const scale = 0.2;
    const duration = 1000;

    return (
        <TransitionContext.Provider
            value={{ isOpen, setIsOpen, scale, duration }}
        >
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (!context)
        throw new Error("useTransition must be used within TransitionProvider");
    return context;
};
