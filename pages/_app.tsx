import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap') 

        * {
          font-family: 'DM Mono', monospace;
        }

        h1, h2,h3,h4,h5,p,span,button,a{ color: #282c34 }
      `}

    </style>
    <Component {...pageProps} />
  </>)
}

export default MyApp
