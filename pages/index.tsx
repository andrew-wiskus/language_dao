import { initializeApp } from '@firebase/app';
import React from 'react'

const firebaseConfig = {
	apiKey: "AIzaSyBBU1qqGmTxepvmSVygUYtjZ2CJacqH2vo",
	authDomain: "battle-card-game.firebaseapp.com",
	databaseURL: "https://battle-card-game-default-rtdb.firebaseio.com",
	projectId: "battle-card-game",
	storageBucket: "battle-card-game.appspot.com",
	messagingSenderId: "1097133427688",
	appId: "1:1097133427688:web:7887f1b671c371fcfb725d",
	measurementId: "G-ZWB0FBZ825"
};

initializeApp(firebaseConfig);

class Home extends React.Component<{}, {}> {

	public render() {
		return (
			<div className='bg-[red]'>Hello World</div>
		)
	}
}


export default Home

