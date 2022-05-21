import React, { useEffect, useState } from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from 'firebase/database';
import { Contribute, TextDescriptions } from '../web3/Contribute';
import { ImageWithDescriptions } from './translate';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const AddContentPage = () => {

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

    const updateInput = (str: string, key: any, hash: string) => {
        const out = { ...input };
        out[hash][key] = str;
        setInput({ ...out })

        const updated = { ...hasBeenUpdatedList }
        updated[hash] = updated[hash] == undefined ? {} : updated[hash];
        updated[hash][key] = str;
        setHasBeenUpdatedList({ ...updated })
    }

    const updateDatabase = () => {
        Contribute.updateImageData({ ...hasBeenUpdatedList });
        setHasBeenUpdatedList({})
    }

    useEffect(() => {
        getAllContent();
    }, [])

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
                {imagesWithDescriptions.map(item => {

                    const hash = item.hash;

                    const isUpdated = (key: string) => {
                        return hasBeenUpdatedList[hash] != undefined && hasBeenUpdatedList[hash][key] != undefined;
                    }
                    const isUpdatedTextArea = (key: string) => {
                        if (isUpdated(key)) {
                            return { border: '2px solid #B10DC9' }
                        }
                    }

                    const isUpdatedLabel = (key: string) => {
                        if (isUpdated(key)) {
                            return { fontWeight: 'bold', color: `#B10DC9` }
                        }
                    }
                    return (
                        <div key={item.hash} className='w-full border my-2 flex flex-col p-4'>
                            <div className='w-[100%] border rounded mr-5 flex-center'>
                                <img src={item.imageUrl} className='w-full h-full object-cover' />
                            </div>
                            <div className='w-full flex flex-col justify-center'>
                                <p style={isUpdatedLabel(`simple`)} className='text-[10px] mt-2'>{`simple ${isUpdated(`simple`) ? `(updated)` : ``}`}</p>
                                <textarea style={isUpdatedTextArea(`simple`)} className='text-[12px] border p-2' rows={2} value={input[item.hash].simple} onChange={e => updateInput(e.target.value, `simple`, item.hash)} />
                                <p style={isUpdatedLabel(`descriptive`)} className='text-[10px] mt-2'>{`descriptive ${isUpdated(`descriptive`) ? `(updated)` : ``}`}</p>
                                <textarea style={isUpdatedTextArea(`descriptive`)} className='text-[12px] border p-2' rows={3} value={input[item.hash].descriptive} onChange={e => updateInput(e.target.value, `descriptive`, item.hash)} />
                                <p style={isUpdatedLabel(`verbose`)} className='text-[10px] mt-2'>{`verbose ${isUpdated(`verbose`) ? `(updated)` : ``}`}</p>
                                <textarea style={isUpdatedTextArea(`verbose`)} className='text-[12px] border p-2' rows={5} value={input[item.hash].verbose} onChange={e => updateInput(e.target.value, `verbose`, item.hash)} />
                                <p style={isUpdatedLabel(`overlyVerbose`)} className='text-[10px] mt-2'>{`overly verbose ${isUpdated(`overlyVerbose`) ? `(updated)` : ``}`}</p>
                                <textarea style={isUpdatedTextArea(`overlyVerbose`)} className='text-[12px] border p-2' rows={5} value={input[item.hash].overlyVerbose} onChange={e => updateInput(e.target.value, `overlyVerbose`, item.hash)} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default AddContentPage



