import MetaMaskOnboarding from '@metamask/onboarding'
import { useCallback, useEffect, useRef, useState } from 'react'
import Web3 from 'web3'
import { network } from './blockchainNetworks'

export const useMetaMask = () => {
    const [web3, setWeb3] = useState<Web3>()
    const [loadingAccount, setLoadingAccount] = useState<boolean>(true)
    const [account, setAccount] = useState<string>()
    const [balance, setBalance] = useState<string>()
    const [chainId, setChainId] = useState<number>()
    const [isRefetchingBalance, setIsRefetchingBalance] = useState<boolean>(false)
    const [loadingChain, setLoadingChain] = useState<boolean>(true)
    const onboarding = useRef<MetaMaskOnboarding>()

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding()
        }

        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setWeb3(new Web3(window.ethereum))
        }
    }, [])

    useEffect(() => {
        const onSetAccount = async (newAccount: string) => {
            setAccount(newAccount)
            setLoadingAccount(false)
        }

        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum.request({ method: 'eth_accounts' }).then(([newAccount]: string[]) => onSetAccount(newAccount))
            window.ethereum.on('accountsChanged', ([newAccount]: string[]) => onSetAccount(newAccount))
            window.ethereum.on('chainChanged', () => window.location.reload())
        }
    }, [])

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (account && web3) {
                onboarding?.current?.stopOnboarding()
                web3.eth.getBalance(account).then(balance => {
                    setBalance(web3.utils.fromWei(balance, 'ether'))
                })
                window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
                    setChainId(parseInt(chainId, 16))
                    setLoadingChain(false)
                })
            } else {
                setAccount(undefined)
                setBalance(undefined)
            }
        }
    }, [account, web3])

    const refetchBalance = async () => {
        if (web3 && account) {
            setIsRefetchingBalance(true)
            await web3.eth.getBalance(account).then(balance => {
                setBalance(web3.utils.fromWei(balance, 'ether'))
                setIsRefetchingBalance(false)
            })
        }
    }

    const addNetwork = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: network.idHex
                    }
                ]
            })
        } else {
            onboarding?.current?.startOnboarding()
        }
    }

    const onSetAccount = async (newAccount: string) => {
        setAccount(newAccount)
        setLoadingAccount(false)
    }

    const connect = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(([newAccount]: string[]) => onSetAccount(newAccount))
        } else {
            onboarding?.current?.startOnboarding()
        }
    }

    const signMessage = useCallback(async (account: string, message: string): Promise<string> => {
        return await window.ethereum.request({
            method: 'personal_sign',
            params: [message, account]
        })
    }, [])

    const loading = loadingAccount || loadingChain

    return { connect, addNetwork, signMessage, account, balance, chainId, web3, refetchBalance, isRefetchingBalance, loading }
}

export default useMetaMask
