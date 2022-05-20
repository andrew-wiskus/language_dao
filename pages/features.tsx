import { initializeApp } from '@firebase/app';
import React from 'react'

const features = [
    { feature: `Figure out name for app`, isCompleted: false, tokenVotes: 0 },
    { feature: `Web repo & vercel deployment`, isCompleted: true, tokenVotes: 0 },
    { feature: `Feature list w/ checkmarks`, isCompleted: true, tokenVotes: 0 },
    { feature: `Contribution class for db integration & hash creation`, isCompleted: true, tokenVotes: 0 },
    { feature: `/add-content contribution page, upload image w/ multiple sentences`, isCompleted: true, tokenVotes: 0 },
    { feature: `/update-content to update images already uploaded`, isCompleted: true, tokenVotes: 0 },
    { feature: `/translate to upload translations for WORDS and SENTANCES`, isCompleted: false, tokenVotes: 0 },
    { feature: `popover on /learn w/ word translations`, isCompleted: false, tokenVotes: 0 },
    { feature: `nav bar lol >.>`, isCompleted: false, tokenVotes: 0 },
    { feature: `"view translation" for full sentance on /learn`, isCompleted: false, tokenVotes: 0 },
    { feature: `rating system to pre-rate your confidence after viewing (slider?)`, isCompleted: false, tokenVotes: 0 },
    { feature: `-- profile with contribution listings`, isCompleted: false, tokenVotes: 0 },
    { feature: `landing page`, isCompleted: false, tokenVotes: 0 },
    { feature: `legit auth`, isCompleted: false, tokenVotes: 0 },
    { feature: `input to add to feature list page`, isCompleted: false, tokenVotes: 0 },
    { feature: `upload smaller images than sorce if > (x)MB lol`, isCompleted: false, tokenVotes: 0 },
    { feature: `able to 'choose random photo' instead of uploading`, isCompleted: false, tokenVotes: 0 },
    { feature: `add ability to tag images so we can sort/categorize them`, isCompleted: false, tokenVotes: 0 },
]

const CHECKBOX = `border-[3px] border-[black] rounded h-[25px] w-[25px]`

class FeaturePage extends React.Component<{}, {}> {

    public render() {
        return (
            <div className='w-full flex justify-center items-center'>
                <div className='w-max-[1200px] flex flex-col px-4'>
                    <h1 className='text-2xl mb-8'>feature requests</h1>
                    {features.map(item => {
                        return (
                            <div className='flex flex-row'>
                                {item.isCompleted ? <img src={'/checkmark.svg'} className={CHECKBOX} /> : <div className={CHECKBOX} />}
                                <p className='ml-4 mb-4'>{item.feature}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default FeaturePage

