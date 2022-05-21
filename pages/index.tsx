import React from 'react'
import { FixedNav } from '../components/FixedNav';
import { useWalletContext } from '../web3/useWalletContext';

const shortenAddress = (address?: string) => { return address == undefined ? 'no-wallet' : `${address.slice(0, 2)}...${address.slice(address.length - 4, address.length)}` }

const LandingPage = () => {
	const { connect, account } = useWalletContext()

	return (
		<div>
			<FixedNav />
			<div className='w-full flex justify-center items-center pt-[70px] px-4'>
				<div className='w-max-[1200px] flex flex-center h-[70vh] flex-col'>
					<p className='text-[10px] text-center'>gm {shortenAddress(account)}</p>
				</div>
			</div>
		</div>
	)
}

export default LandingPage

