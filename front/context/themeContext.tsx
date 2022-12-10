import { useState, createContext, FC, useEffect } from "react"

type ThemeContextType = {
    theme: string;
    setTheme: (value: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

type Props = { children: React.ReactNode }

const ThemeProvider = ({ children }: Props) => {
    const [theme, setTheme] = useState("light")

    useEffect(() => {
        if(localStorage.getItem('theme'))
            setTheme(localStorage.getItem('theme'));
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeProvider, ThemeContext }

