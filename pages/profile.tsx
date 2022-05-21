import React from 'react'
import { FixedNav } from '../components/FixedNav';

class CommunityPage extends React.Component<{}, {}> {

    public render() {
        return (
            <div>
                <FixedNav />
                <div className='w-full flex justify-center items-center pt-[70px] px-4'>
                    <div className='w-max-[1200px] flex flex-center h-[70vh] flex-col'>
                        <p className='text-[10px] text-center'>wallet string input</p>
                        <p className='text-[10px] text-center'>{`display name`}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default CommunityPage

