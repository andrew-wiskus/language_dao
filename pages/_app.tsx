import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import WalletProvider from '../web3/useWalletContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getDatabase, ref } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBKsBUqPBdpGhNVsbsH6gy51Hmmoubz5qg",
  authDomain: "lingolu-c8ff2.firebaseapp.com",
  projectId: "lingolu-c8ff2",
  storageBucket: "lingolu-c8ff2.appspot.com",
  messagingSenderId: "259463385399",
  appId: "1:259463385399:web:8126fd677289865ea70ab2",
  measurementId: "G-92YP1QGXCJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);



function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter()

  const checkForForcedConnection = () => {
    const noAuthPaths = [``]
    return !noAuthPaths.includes(router.pathname)
  }

  return (<>
    <WalletProvider forceConnection={checkForForcedConnection()}>
      <Component {...pageProps} />
    </WalletProvider>
  </>)
}

export default MyApp


