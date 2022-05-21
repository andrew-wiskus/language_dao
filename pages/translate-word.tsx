import React, { useEffect, useState } from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from 'firebase/database';
import { Contribute, TextDescriptions } from '../web3/Contribute';
import { ALL_LANGUAGES, Language } from '../languageDex';
import { FixedNav } from '../components/FixedNav';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export interface LearnItemMetaData {
    contributor: string;
    date: number;
    earnedtokens: number;
    hash: string;
    imageUrl: string;
    languageCode: string;
    textData: TextDescriptions;
    translations: { [languageCode: string]: TextDescriptions }
}

export interface Translation {
    key: string;
    string: string;
    languageCode: string;
    class: WordClass,
    translation: { [languageCode: string]: string[] },
    hashOccurances: string[],
    notes: { [languageCode: string]: string },
    hidden: boolean,
    parentKey: string | undefined,
}

export interface MappedTranslation {
    key: string;
    string: string;
    languageCode: string;
    class: WordClass,
    translation: string,
    hashOccurances: string[],
    notes: string,
    hidden: boolean,
    parentKey: string | undefined,
}

export type WordClass = 'noun' | 'verb' | 'adjetive' | 'glue' | 'null'

const LanguagePicker = (onChooseFirst: (str: string) => void, onChooseSecond: (str: string) => void) => {
    return <></>
}

export type UpdateableTranslationData = { notes: any, translation: any, class: any }

const TranslateWordsPage = () => {

    const [allTranslationInputs, setAllTranslationInputs] = useState<any>({});
    const [allNotesInputs, setAllNotesInputs] = useState<any>({});
    const [hasBeenUpdatedList, setHasBeenUpdatedList] = useState<UpdateableTranslationData>({ notes: {}, translation: {}, class: {} });
    const [translateFromLanguage, setTranslateFromLanguage] = useState('en');
    const [translateToLanguage, setTranslateToLanguage] = useState('es');
    const [allWords, setAllWords] = useState<MappedTranslation[]>([])
    const [shouldHideTranslated, setShouldHideTranslated] = useState(true);
    const [isSettingLanguagePref, setIsSettingLanguagePref] = useState<any>(true);
    const [currentTypeSetting, setCurrentTypeSetting] = useState('');

    async function getAllContent() {
        const db = getDatabase();
        const r = ref(db, 'content/' + translateFromLanguage);
        const snapshot = await get(r) as any;
        if (snapshot == null || snapshot.val() == null) {
            console.log("SNAP IS NULL");
            setAllWords([])
            setAllTranslationInputs({})
            setAllNotesInputs({})

            return;
        }
        const imageAndText = Object.entries(snapshot.val()).map(x => x[1]) as LearnItemMetaData[];

        const wordList = imageAndText.reduce((base: any, item) => {
            const allWords = Object.values(item.textData).reduce((str, x) => {
                return str + " " + x;
            }, "").split(' ').filter((y: string) => y.trim() != '')

            let out = { ...base[item.languageCode] }
            allWords.forEach((w: string) => {
                const word = w.toLowerCase().replace(/[.,/#!$%^&*;:{}=-_`~()]/g, "").trim(); // xx move to func
                if (out[word] == undefined) {
                    out[word] = {}
                }

                out[word] =
                {
                    count: out[word].count ? out[word].count + 1 : 1,
                    hashes: out[word].hashes ? { ...out[word].hashes, [item.hash]: 1 } : { [item.hash]: 1 }
                }
            })

            return {
                ...base,
                [item.languageCode]: base[item.languageCode] ? { ...base[item.languageCode], ...out } : { ...out }
            };
        }, {})

        // xx build word list by checking other translations! 

        const translateFromList = wordList[translateFromLanguage];

        let wordKeyList = Object.keys(translateFromList).map(key => {
            return {
                key: key,
                count: translateFromList[key].count,
                languageCode: translateFromLanguage,
                hashes: translateFromList[key].hashes
            }
        }).sort((a, b) => {
            return b.count - a.count
        })

        const translationRef = ref(db, 'translation');
        const translationSnap = await get(translationRef) as any;
        const translationDB = translationSnap.val();

        const translations = translationDB != null ? translationDB[Language.TranslateCode(translateFromLanguage, translateToLanguage)] : {}

        const translationsForDisplay = wordKeyList.map(word => {
            const update: UpdateableTranslationData = translations[word.key] || {};
            const translation: MappedTranslation = {
                key: word.key,
                string: word.key, // xx compare
                languageCode: word.key,
                class: update.class || 'null', // xx compare
                translation: update.translation || '', // xx compare
                hashOccurances: word.hashes,
                notes: update.notes || '', // xx compare
                hidden: false, // xx compare
                parentKey: '', // xx compare
            }

            return translation;
        })

        setAllWords(translationsForDisplay)

        setAllTranslationInputs(translationsForDisplay.reduce((a, b) => {
            return {
                ...a,
                [b.key]: b.translation
            }
        }, {}))

        setAllNotesInputs(translationsForDisplay.reduce((a, b) => {
            return {
                ...a,
                [b.key]: b.notes
            }
        }, {}))
    }

    useEffect(() => {
        getAllContent();
    }, [isSettingLanguagePref])

    const updateDatabase = () => {
        const translateCode = Language.TranslateCode(translateFromLanguage, translateToLanguage);

        // xx DRY pls
        Object.entries(hasBeenUpdatedList.notes).forEach(entry => {
            const wordKey = entry[0] as string;
            const value = entry[1] as string;
            Contribute.updateTranslation(wordKey, 'notes', translateCode, value);

            const out = [...allWords]
            const index = out.findIndex(x => x.key == wordKey)
            out[index].notes = value;
            setAllWords([...out]);
        })

        Object.entries(hasBeenUpdatedList.translation).forEach(entry => {
            const wordKey = entry[0] as string;
            const value = entry[1] as string;
            Contribute.updateTranslation(wordKey, 'translation', translateCode, value);

            const out = [...allWords]
            const index = out.findIndex(x => x.key == wordKey)
            out[index].translation = value;
            setAllWords([...out]);
        })

        Object.entries(hasBeenUpdatedList.class).forEach(entry => {
            const wordKey = entry[0] as string;
            const value = entry[1] as string;
            Contribute.updateTranslation(wordKey, 'class', translateCode, value);

            const out = [...allWords]
            const index = out.findIndex(x => x.key == wordKey)
            out[index].class = value as WordClass;
            setAllWords([...out]);
        })

        setHasBeenUpdatedList({ notes: {}, translation: {}, class: {} });
    }

    const updateTranslationPref = () => {
        // xx -- update big green button to do things
        // xx -- update content
    }

    const updateTranslationInput = (key: any, val: string) => {
        const inputs = { ...allTranslationInputs }
        inputs[key] = val;
        setAllTranslationInputs({ ...inputs });

        const updateList = { ...hasBeenUpdatedList }
        if (updateList.translation == undefined) { updateList.translation = {} }
        updateList.translation[key] = val;
        setHasBeenUpdatedList({ ...updateList })
    }

    const updateNotesInput = (key: any, val: string) => {
        const inputs = { ...allNotesInputs }
        inputs[key] = val;
        setAllNotesInputs({ ...inputs });

        const updateList = { ...hasBeenUpdatedList }
        if (updateList.notes == undefined) { updateList.notes = {} }
        updateList.notes[key] = val;
        setHasBeenUpdatedList({ ...updateList })
    }

    const onClickWordClass = (key: string, wordClass: WordClass) => {

        const translations = [...allWords];
        const index = translations.findIndex(x => x.key == key)
        translations[index].class = wordClass;
        setAllWords([...translations]);

        const updateList = { ...hasBeenUpdatedList }
        if (updateList.class == undefined) { updateList.class = {} }
        updateList.class[key] = wordClass;
        setHasBeenUpdatedList({ ...updateList })
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
            <div className='w-max-[1200px] w-full flex flex-col px-[5vw] pb-[100px] pt-[280px]'>
                <FixedNav />

                {isSettingLanguagePref ?
                    <div className='flex flex-center flex-col'>
                        <button onClick={() => setIsSettingLanguagePref(false)} className='fixed top-[60px] left-0 right-0 h-[60px] bg-[#7FDBFF] m-0 p-0 flex-center border-0' style={{ zIndex: 9999 }} >
                            {`Go Back`}
                        </button>

                        <div className=' flex flex-center flex-col w-full px-4 fixed top-[120px] h-[240px] bg-[white] py-4'>
                            <p className='text-[12px] font-bold mt-[50px]'>current:</p>

                            <h1 className='text-center font-bold text-[14px] mb-4'>{`Translate (${Language.PrettyPrint(translateFromLanguage)}) To (${Language.PrettyPrint(translateToLanguage)})`}</h1>

                            <button style={{ opacity: currentTypeSetting != 'FROM' ? 0.5 : 1, backgroundColor: currentTypeSetting == 'FROM' ? '#FFDC00' : '#DDD' }} onClick={() => setCurrentTypeSetting('FROM')} className='text-sm w-full'>{`Set "Translate From" Language`}</button>
                            <button style={{ opacity: currentTypeSetting != 'TO' ? 0.5 : 1, backgroundColor: currentTypeSetting == 'TO' ? '#FFDC00' : '#DDD' }} onClick={() => setCurrentTypeSetting('TO')} className='text-sm w-full'>{`Set "Translate To" Language`} </button>

                        </div>
                        <div className='mt-[120px]'>
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
                                return prev + Object.keys(hasBeenUpdatedList[key as keyof UpdateableTranslationData]).length;
                            }, 0)}
                     ITEMS`}
                        </button>
                        <button onClick={setLanguagePref} className='fixed top-[120px] left-0 right-0 h-[60px] bg-[#3D9970] m-0 p-0 flex-center border-0'>
                            {`Translating ${Language.PrettyPrint(translateFromLanguage)} to ${Language.PrettyPrint(translateToLanguage)}`}
                        </button>
                        <button onClick={() => setShouldHideTranslated(!shouldHideTranslated)} className='fixed top-[180px] left-0 right-0 h-[60px] bg-[#39CCCC] m-0 p-0 flex-center border-0'>
                            {`${shouldHideTranslated ? 'Show' : 'Hide'} Translated`}
                        </button>

                        {allWords.length == 0 &&
                            <>
                                <p className='text-[12px] font-bold text-center mt-20'>no content found :[</p>
                                <button className='rounded bg-[#7FDBFF]'>contribute</button>
                            </>
                        }

                        {allWords.map(word => {
                            const BUTTON = 'w-[50px] mx-2 text-[12px] text-[#333] border rounded'
                            const isWordClass = (key: string) => {
                                let color = '';
                                switch (key) {
                                    case 'noun':
                                        color = '#001f3f';
                                        break;
                                    case 'adjetive':
                                        color = '#85144b';
                                        break;
                                    case 'verb':
                                        color = '#3D9970';
                                        break;
                                    case 'glue':
                                        color = '#39CCCC';
                                        break;
                                }

                                if (word.class == key) {
                                    return { backgroundColor: color, color: 'white' }
                                }
                            }

                            if (shouldHideTranslated == true && word.translation != '') {
                                return null;
                            }

                            return <div className='w-full p-4 border rounded my-2' key={word.key}>
                                <p className='text-center text-2xl'>{word.string}</p>
                                <input value={allTranslationInputs[word.key] || ''} onChange={e => updateTranslationInput(word.key, e.target.value)} className='w-full text-center px-2' placeholder='??' />
                                <textarea value={allNotesInputs[word.key] || ''} onChange={e => updateNotesInput(word.key, e.target.value)} placeholder='notes?' rows={3} className='border w-full px-2 text-[12px]' />
                                <div className='flex flex-row w-full flex-center'>
                                    <button onClick={() => onClickWordClass(word.key, `noun`)} style={isWordClass('noun')} className={BUTTON}>noun</button>
                                    <button onClick={() => onClickWordClass(word.key, `verb`)} style={isWordClass('verb')} className={BUTTON}>verb</button>
                                    <button onClick={() => onClickWordClass(word.key, `adjetive`)} style={isWordClass('adjetive')} className={BUTTON}>adj</button>
                                    <button onClick={() => onClickWordClass(word.key, `glue`)} style={isWordClass('glue')} className={BUTTON}>glue</button>
                                </div>
                            </div>
                        })}
                    </>
                }
            </div>
        </div>
    )
}



export default TranslateWordsPage



