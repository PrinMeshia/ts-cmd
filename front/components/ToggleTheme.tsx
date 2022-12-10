import { useContext } from 'react'
import { ThemeContext } from '../context/themeContext';
import Head from 'next/head';

const ToggleTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext)!
    return (<>
    <Head>
        <link rel="stylesheet" href={`/css/${theme}.css`}/>
    </Head>
        {theme === "light" ? (
            <span
                onClick={() => {
                    setTheme("dark")
                    localStorage.setItem('theme','dark')
                }}
                style={({ fontSize: "24px" })}>🌞</span>
        ) : (
            <span
                onClick={() => {
                    setTheme("light")
                    localStorage.setItem('theme','light')
                }}
                style={({ fontSize: "24px" })}>🌓</span>
        )}
    </>)
}

export default ToggleTheme;