import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ExampleHeader from '../components/header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <ExampleHeader />
    <Component {...pageProps} />
    </>
  )
}

export default MyApp
