import { initializeApp } from '@firebase/app';
import React from 'react'
import { FixedNav } from '../components/FixedNav';

const features = [
    { feature: `app name`, finished: true, tokenVotes: 0 },
    { feature: `web repo & vercel deployment`, finished: true, tokenVotes: 0 },
    { feature: `/vote list with features`, finished: true, tokenVotes: 0 },
    { feature: `web3 contribution class, db integration & hash creation`, finished: true, tokenVotes: 0 },
    { feature: `/contribute upload image w/ multiple sentences`, finished: true, tokenVotes: 0 },
    { feature: `/admin to edit content`, finished: true, tokenVotes: 0 },
    { feature: `Navigation menu`, finished: true, tokenVotes: 0 },
    { feature: `Rate confidence slider on /learn`, finished: true, tokenVotes: 0 },
    { feature: `Contribution listings page`, finished: false, tokenVotes: 0 },
    { feature: `<Translation/> component for words on /learn`, finished: true, tokenVotes: 0 },
    { feature: `Auth & set screename & wallet address`, finished: false, tokenVotes: 0 },
    { feature: `App localization`, finished: false, tokenVotes: 0 },
    { feature: `DNS config, www.nativeterms.com`, finished: false, tokenVotes: 0 },
    { feature: `choose language when submitting content`, finished: false, tokenVotes: 0 },
    { feature: `choose language when translating`, finished: false, tokenVotes: 0 },
    { feature: `/contribute - random photo option`, finished: false, tokenVotes: 0 },
    { feature: `connect token amount to acc`, finished: false, tokenVotes: 0 },
    { feature: `acc ranking query`, finished: false, tokenVotes: 0 },
    { feature: `/learn`, finished: true, tokenVotes: 0 },
    { feature: `/progress`, finished: false, tokenVotes: 0 },
    { feature: `/community`, finished: false, tokenVotes: 0 },
    { feature: `/profile`, finished: false, tokenVotes: 0 },
    { feature: `/translate-words`, finished: true, tokenVotes: 0 },
    { feature: `/translate-full`, finished: true, tokenVotes: 0 },
    { feature: `www.nativeterms.com landing page`, finished: false, tokenVotes: 0 },
    { feature: `tutorial quests on profile page`, finished: false, tokenVotes: 0 },

].sort(function (a, b) {
    const [x, y] = [a.finished, b.finished]
    // true values first
    return (x === y) ? 0 : x ? 1 : -1;
    // false values first
    // return (x === y)? 0 : x? 1 : -1;
});


// CHORES (WANT)
// - resize image weight when uploading to firebase
// - tag images so we can sort in /learn
// - submit feature request


const CHECKBOX = `border-[3px] border-[black] rounded h-[25px] w-[25px]`

class FeaturePage extends React.Component<{}, {}> {

    public render() {
        return (
            <div>
                <FixedNav />
                <div className='w-full flex justify-center items-center pt-[70px] px-4'>
                    <div className='w-max-[1200px] flex flex-col px-4'>
                        {features.map((item, i) => {
                            return (
                                <div className='flex flex-col w-full' key={i}>
                                    <p style={{ textDecoration: item.finished ? 'line-through' : '' }} className='text-[12px]' >{item.feature}</p>
                                    <div className='h-[1px] bg-[#333] w-full' />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


export default FeaturePage

