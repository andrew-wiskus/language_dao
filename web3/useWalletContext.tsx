import React, { createContext, ReactNode, useContext } from 'react'
import Web3 from 'web3'
import { network } from './blockchainNetworks'
import useMetaMask from './useMetaMask'

interface WalletContextData {
    web3?: Web3
    account?: string
    balance?: string
    refetchBalance: () => void
    connect: () => void
    signMessage: (account: string, message: string) => Promise<string>
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData)

interface WalletProviderProps {
    children?: ReactNode | undefined
    forceConnection?: boolean | undefined
}

const WalletProvider = ({ children, forceConnection }: WalletProviderProps) => {
    const { account, balance, chainId, addNetwork, signMessage, connect, web3, refetchBalance } = useMetaMask()

    let Content

    if (!account && forceConnection) {
        Content = (
            <div className='flex flex-col items-center justify-center fixed-full backdrop-blur'>
                <h1 className='text-lg'>Ops! It seems you may not be connected to MetaMask</h1>
                <button
                    onClick={() => connect()}
                    className='w-[300px] h-[55px] cursor-pointer border-solid border-2 border-blue-600  mt-5 flex justify-center items-center'>
                    Connect to MetaMask Wallet
                </button>
            </div>
        )
    } else if (chainId !== network.id && forceConnection) {
        Content = (
            <div className='flex flex-col items-center justify-center fixed-full backdrop-blur'>
                <h1 className='text-lg'>Ops! It seems you may be connected to another network</h1>
                <button
                    onClick={() => addNetwork()}
                    className='w-[300px] h-[55px] cursor-pointer border-solid border-2 border-blue-600  mt-5 flex justify-center items-center'>
                    Connect to {network.name}
                </button>
            </div>
        )
    }

    const context = {
        account,
        balance,
        web3,
        connect,
        refetchBalance,
        signMessage
    }

    return (
        <WalletContext.Provider value={context}>
            {children}
            {Content && (
                <div className='fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-full gap-4 font-bold text-center text-white bg-gray-30 bg-opacity-95'>
                    {Content}
                </div>
            )}
        </WalletContext.Provider>
    )
}

export const useWalletContext = () => useContext(WalletContext)

export default WalletProvider
