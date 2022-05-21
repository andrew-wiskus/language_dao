import React from 'react'
import { FixedNav } from '../components/FixedNav';

class ProgressPage extends React.Component<{}, {}> {

    public render() {
        return (
            <div>
                <FixedNav />
                <div className='w-full flex justify-center items-center pt-[70px] px-4'>
                    <div className='w-max-[1200px] flex flex-center h-[70vh] flex-col'>
                        <p className='text-[10px] text-center'>needed to make nav pretty :]</p>
                        <p className='text-[10px] text-center'>~~ see your progress, pretty charts, confetti ~~</p>
                    </div>
                </div>
            </div>
        )
    }
}


export default ProgressPage

