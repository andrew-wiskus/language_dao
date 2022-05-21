import React, { useEffect, useState } from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from 'firebase/database';
import { Contribute, TextDescriptions } from '../web3/Contribute';
import { ALL_LANGUAGES, Language } from '../languageDex';
import { FixedNav } from '../components/FixedNav';
import { LearnItemMetaData, MappedTranslation, Translation } from './translate-word';
import { useWalletContext } from '../web3/useWalletContext';

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
    const [translateToLanguage, setTranslateToLanguage] = useState('pt');
    const [hasBeenUpdatedList, setHasBeenUpdatedList] = useState<any>({});
    const [isSettingLanguagePref, setIsSettingLanguagePref] = useState<any>(false);
    const [currentTypeSetting, setCurrentTypeSetting] = useState('');
    const [inputs, setInputs] = useState<any>({});
    const { connect, account } = useWalletContext()

    async function getAllContent() {
        const db = getDatabase();
        const translationRef = ref(db, 'content/' + translateFromLanguage);
        const snap = await get(translationRef)
        if (snap != null && snap.val() != null) {
            setAllContent(Object.values(snap.val()))

            const out: any = {};

            Object.values(snap.val()).forEach((x) => {
                const item = x as LearnItemMetaData;

                if (out[item.hash] == undefined) {
                    out[item.hash] = {}
                }

                Object.keys(item.textData).forEach(key => {
                    out[item.hash][key] = item.translations ? item.translations[key] : '';
                })
            })

            console.log({ out })
            setInputs({ ...out });
        }
    }

    useEffect(() => {
        getAllContent();
    }, [isSettingLanguagePref])

    const updateDatabase = () => {
        // xx -- do thing
        console.log({ hasBeenUpdatedList })
        Contribute.TranslateFull(account!, translateFromLanguage, translateToLanguage, hasBeenUpdatedList);
    }

    const updateInput = (hash: string, key: string, val: string) => {
        console.log("updating ", hash, key, "to: ", val)
        // xx -- do the thing w/ hasBeenUpdatedList
        const out = { ...hasBeenUpdatedList }
        if (out[hash] == undefined) {
            out[hash] = {}
        }
        out[hash][key] = val;
        setHasBeenUpdatedList(out);

        const out2 = { ...inputs }
        if (out2[hash] == undefined) {
            out2[hash] = {}
        }
        out2[hash][key] = val;

        setInputs({ ...out2 });
    }


    const setLanguagePref = () => {
        setIsSettingLanguagePref(true);
    }

    const setTranslate = (languageCode: string) => {
        window.scrollTo(0, 0);
        if (currentTypeSetting == 'FROM') {
            setTranslateFromLanguage(languageCode)
            setCurrentTypeSetting('TO')
        } else {
            setTranslateToLanguage(languageCode)
            setCurrentTypeSetting('FROM')
        }
    }

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-max-[1200px] w-full flex flex-col px-[5vw] pb-[100px] pt-[140px]'>
                <FixedNav />


                {isSettingLanguagePref ?
                    <div className='flex flex-center flex-col'>
                        <button onClick={() => setIsSettingLanguagePref(false)} className='fixed top-[60px] left-0 right-0 h-[60px] bg-[#7FDBFF] m-0 p-0 flex-center border-0' style={{ zIndex: 9999 }} >
                            {`Go Back`}
                        </button>

                        <div className=' flex flex-center flex-col w-full px-4 fixed top-[120px] h-[240px] bg-[white] py-4'>
                            <p onClick={() => { setTranslateFromLanguage(translateToLanguage); setTranslateToLanguage(translateFromLanguage) }} className='text-[12px] font-bold mt-[50px] underline text-[blue]'>flip</p>

                            <h1 className='text-center font-bold text-[14px] mb-4'>{`Translate (${Language.PrettyPrint(translateFromLanguage)}) To (${Language.PrettyPrint(translateToLanguage)})`}</h1>

                            <button style={{ opacity: currentTypeSetting != 'FROM' ? 0.5 : 1, backgroundColor: currentTypeSetting == 'FROM' ? '#FFDC00' : '#DDD' }} onClick={() => setCurrentTypeSetting('FROM')} className='text-sm w-full'>{`Set "Translate From" Language`}</button>
                            <button style={{ opacity: currentTypeSetting != 'TO' ? 0.5 : 1, backgroundColor: currentTypeSetting == 'TO' ? '#FFDC00' : '#DDD' }} onClick={() => setCurrentTypeSetting('TO')} className='text-sm w-full'>{`Set "Translate To" Language`} </button>

                        </div>
                        <div className='mt-[220px]'>
                            {ALL_LANGUAGES.map(x => {
                                return (
                                    <div onClick={() => setTranslate(x.id)} className='w-full border p-2 rounded my-2 text-left'>
                                        <span className='text-[10px]'>{currentTypeSetting == 'FROM' ? 'Transate From: ' : `Translate (${Language.PrettyPrint(translateFromLanguage)}) To: `}</span>
                                        <br />
                                        <span>{x.name}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :
                    <>
                        <button onClick={updateDatabase} className='fixed top-[60px] left-0 right-0 h-[60px] bg-[#0074D9] m-0 p-0 flex-center border-0'>
                            {`SAVE UPDATES TO 
                    ${Object.keys(hasBeenUpdatedList).reduce((prev: any, key: unknown) => {
                                return prev + Object.keys(hasBeenUpdatedList[key as keyof any]).length;
                            }, 0)}
                     ITEMS`}
                        </button>
                        <button onClick={setLanguagePref} className='fixed top-[120px] left-0 right-0 h-[60px] bg-[#3D9970] m-0 p-0 flex-center border-0'>
                            {`Translating ${Language.PrettyPrint(translateFromLanguage)} to ${Language.PrettyPrint(translateToLanguage)}`}
                        </button>
                        {/* <button onClick={() => setShouldHideTranslated(!shouldHideTranslated)} className='fixed top-[180px] left-0 right-0 h-[60px] bg-[#39CCCC] m-0 p-0 flex-center border-0'>
                    {`${shouldHideTranslated ? 'Show' : 'Hide'} Translated`}
                </button> */}

                        <div className='h-[60px]' />
                        {allContent.map(item => {
                            return (
                                <div className='border rounded my-2 flex flex-col p-4 flex-center'>
                                    <div className='flex flex-col items-center w-full'>
                                        <img src={item.imageUrl} className='w-[250px] h-[250px] object-contain border rounded' />
                                        {['simple', 'descriptive', 'verbose', 'overlyVerbose'].map(key => {
                                            if (item.textData[key as keyof typeof item.textData] == '' || inputs[item.hash] == undefined) {
                                                return null;
                                            }

                                            return (
                                                <div className='mt-4 w-full'>
                                                    <p className='text-[12px] mb-2 px-4 text-center'>{item.textData[key as keyof typeof item.textData]}</p>
                                                    <textarea value={inputs[item.hash][key]} onChange={e => updateInput(item.hash, key, e.target.value)} className='text-[12px] w-full border p-4 mb-4' rows={4} placeholder="translation needed" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </>
                }

            </div>
        </div>
    )
}



export default TranslateWordsPage



