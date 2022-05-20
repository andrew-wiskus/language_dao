import React, { useEffect, useState } from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from 'firebase/database';
import { Contribute, TextDescriptions } from '../web3/Contribute';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export interface ImageWithDescriptions {
    contributor: string;
    date: number;
    earnedtokens: number;
    hash: string;
    imageUrl: string;
    textData: TextDescriptions
}

const TranslatePage = () => {

    const [imagesWithDescriptions, setImagesWithDescriptions] = useState<ImageWithDescriptions[]>([])
    const [input, setInput] = useState<any>(null);
    const [hasBeenUpdatedList, setHasBeenUpdatedList] = useState<any>({});

    async function getAllContent() {
        const db = getDatabase();
        const r = ref(db, 'content');
        const snapshot = await get(r) as any;
        const data = snapshot.val();

        const dataArray = Object.keys(data.imageAndText).map(key => {
            return {
                ...data.imageAndText[key]
            }
        }) as ImageWithDescriptions[];

        setImagesWithDescriptions(dataArray)
        const out: any = {};
        dataArray.forEach(item => {
            out[item.hash] = { ...item.textData }
        })
        setInput(out);
    }

    useEffect(() => {
        getAllContent();
    }, [])

    const updateDatabase = () => {
        // do thing
    }

    if (input == null) { return null }

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-max-[1200px] w-full flex flex-col px-[5vw] pb-[100px] pt-[120px]'>
                <button onClick={updateDatabase} className='fixed top-0 left-0 right-0 h-[100px] bg-[#0074D9] m-0 p-0 flex-center border-0'>
                    {`SAVE UPDATES TO 
                    ${Object.keys(hasBeenUpdatedList).reduce((prev: any, key: any) => {
                        return prev + Object.keys(hasBeenUpdatedList[key]).length;
                    }, 0)}
                     ITEMS`}
                </button>
            </div>
        </div >
    )
}

export default TranslatePage



