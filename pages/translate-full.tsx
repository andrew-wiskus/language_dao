import React, { useEffect, useState } from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from 'firebase/database';
import { Contribute, TextDescriptions } from '../web3/Contribute';
import { ALL_LANGUAGES, Language } from '../languageDex';
import { FixedNav } from '../components/FixedNav';
import { LearnItemMetaData, MappedTranslation, Translation } from './translate-word';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const LanguagePicker = (onChooseFirst: (str: string) => void, onChooseSecond: (str: string) => void) => {
    return <></>
}


const TranslateWordsPage = () => {

    const [allContent, setAllContent] = useState<LearnItemMetaData[]>([])
    const [shouldHideTranslated, setShouldHideTranslated] = useState(true);
    const [translateFromLanguage, setTranslateFromLanguage] = useState('en');
    const [translateToLanguage, setTranslateToLanguage] = useState('es');
    const [hasBeenUpdatedList, setHasBeenUpdatedList] = useState<any>({ translations: {} });

    async function getAllContent() {
        const db = getDatabase();
        const translationRef = ref(db, 'content/' + translateFromLanguage);
        const snap = await get(translationRef)
        if (snap != null && snap.val() != null) {
            setAllContent(Object.values(snap.val()))
        }
    }

    useEffect(() => {
        getAllContent();
    }, [])

    const updateDatabase = () => {
        // xx -- do thing
    }

    const updateInput = () => {
        // xx -- do the thing w/ hasBeenUpdatedList
    }

    const updateLanguageSettings = () => {
        // xx -- update big green button to do things
        // xx -- update content
    }

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-max-[1200px] w-full flex flex-col px-[5vw] pb-[100px] pt-[280px]'>
                <FixedNav />

                <button onClick={updateDatabase} className='fixed top-[60px] left-0 right-0 h-[60px] bg-[#0074D9] m-0 p-0 flex-center border-0'>
                    {`SAVE UPDATES TO 
                    ${Object.keys(hasBeenUpdatedList).reduce((prev: any, key: unknown) => {
                        return prev + Object.keys(hasBeenUpdatedList[key as keyof any]).length;
                    }, 0)}
                     ITEMS`}
                </button>
                <button onClick={updateDatabase} className='fixed top-[120px] left-0 right-0 h-[60px] bg-[#3D9970] m-0 p-0 flex-center border-0'>
                    {`Translating ${Language.PrettyPrint(translateFromLanguage)} to ${Language.PrettyPrint(translateToLanguage)}`}
                </button>
                <button onClick={() => setShouldHideTranslated(!shouldHideTranslated)} className='fixed top-[180px] left-0 right-0 h-[60px] bg-[#39CCCC] m-0 p-0 flex-center border-0'>
                    {`${shouldHideTranslated ? 'Show' : 'Hide'} Translated`}
                </button>


                {allContent.map(item => {
                    return (
                        <div className='border rounded my-2 flex flex-col p-4 flex-center'>
                            <div className='flex flex-col items-center w-full'>
                                <img src={item.imageUrl} className='w-[250px] h-[250px] object-contain border rounded' />
                                {['simple', 'descriptive', 'verbose', 'overlyVerbose'].map(key => {
                                    return (
                                        <div className='mt-4 w-full'>
                                            <p className='text-[12px] mb-2 px-4 text-center'>{item.textData[key as keyof typeof item.textData]}</p>
                                            <textarea className='w-full border p-4 mb-4' rows={4} placeholder="??" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    )
                })}
            </div>
        </div>
    )
}



export default TranslateWordsPage



