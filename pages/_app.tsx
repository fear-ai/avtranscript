import type { AppProps } from 'next/app'
import ErrorBoundary from '../components/ErrorBoundary'
import { ComplexityProvider } from '../providers/ComplexityProvider'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ComplexityProvider>
        <Component {...pageProps} />
      </ComplexityProvider>
    </ErrorBoundary>
  )
}
