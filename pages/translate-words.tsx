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

export interface ImageWithDescriptions {
    contributor: string;
    date: number;
    earnedtokens: number;
    hash: string;
    imageUrl: string;
    languageCode: string;
    textData: TextDescriptions
}

export interface Translation {
    key: string;
    string: string;
    languageCode: string;
    class: WordClass,
    translation: { [languageCode: string]: string },
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

    async function getAllContent() {
        const db = getDatabase();
        const r = ref(db, 'content/imageAndText');
        const snapshot = await get(r) as any;
        const imageAndText = Object.entries(snapshot.val()).map(x => x[1]) as ImageWithDescriptions[];

        const wordList = imageAndText.reduce((base: any, item) => {
            const allWords = Object.values(item.textData).reduce((str, x) => {
                return str + " " + x;
            }, "").split(' ').filter((y: string) => y.trim() != '')

            let out = { ...base[item.languageCode] }
            allWords.forEach((w: string) => {
                const word = w.toLowerCase().replace(/[.,/#!$%^&*;:{}=-_`~()]/g, "").trim();
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
        const translations = translationDB[Language.TranslateCode(translateFromLanguage, translateToLanguage)]


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
    }, [])

    const updateDatabase = () => {
        const translateCode = Language.TranslateCode(translateFromLanguage, translateToLanguage);

        Object.entries(hasBeenUpdatedList.notes).forEach(entry => {
            const wordKey = entry[0] as string;
            const value = entry[1] as string;
            Contribute.updateTranslation(wordKey, 'notes', translateCode, value);
        })
        Object.entries(hasBeenUpdatedList.translation).forEach(entry => {
            const wordKey = entry[0] as string;
            const value = entry[1] as string;
            Contribute.updateTranslation(wordKey, 'translation', translateCode, value);
        })
        Object.entries(hasBeenUpdatedList.class).forEach(entry => {
            const wordKey = entry[0] as string;
            const value = entry[1] as string;
            Contribute.updateTranslation(wordKey, 'class', translateCode, value);
        })
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

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-max-[1200px] w-full flex flex-col px-[5vw] pb-[100px] pt-[280px]'>
                <FixedNav />

                <button onClick={updateDatabase} className='fixed top-[60px] left-0 right-0 h-[60px] bg-[#0074D9] m-0 p-0 flex-center border-0'>
                    {`SAVE UPDATES TO 
                    ${Object.keys(hasBeenUpdatedList).reduce((prev: any, key: unknown) => {
                        return prev + Object.keys(hasBeenUpdatedList[key as keyof UpdateableTranslationData]).length;
                    }, 0)}
                     ITEMS`}
                </button>
                <button onClick={updateDatabase} className='fixed top-[120px] left-0 right-0 h-[60px] bg-[#3D9970] m-0 p-0 flex-center border-0'>
                    {`Translating ${Language.PrettyPrint(translateFromLanguage)} to ${Language.PrettyPrint(translateToLanguage)}`}
                </button>
                <button onClick={() => setShouldHideTranslated(!shouldHideTranslated)} className='fixed top-[180px] left-0 right-0 h-[60px] bg-[#39CCCC] m-0 p-0 flex-center border-0'>
                    {`${shouldHideTranslated ? 'Show' : 'Hide'} Translated`}
                </button>


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
            </div>
        </div>
    )
}



export default TranslateWordsPage



