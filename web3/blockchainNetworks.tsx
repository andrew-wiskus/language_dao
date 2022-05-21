interface BlockchainNetwork {
    name: string
    id: number
    idHex: string
    symbol: string
    etherscanUrl: string
}

export const mainNetwork: BlockchainNetwork = {
    name: 'Ethereum Mainnet',
    id: 1,
    idHex: '0x1',
    symbol: 'ETH',
    etherscanUrl: 'https://etherscan.io'
}

export const testnetNetwork: BlockchainNetwork = {
    name: 'Rinkeby Testnet',
    id: 4,
    idHex: '0x4',
    symbol: 'ETH',
    etherscanUrl: 'https://rinkeby.etherscan.io'
}

export const network: BlockchainNetwork = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? testnetNetwork : mainNetwork

export const isMainNetwork = network.id === mainNetwork.id
