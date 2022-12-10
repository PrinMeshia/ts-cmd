import { AppProps } from 'next/app';
import TopNav from '../components/TopNav';
import  { ThemeProvider } from '../context/themeContext';



export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <TopNav/>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
