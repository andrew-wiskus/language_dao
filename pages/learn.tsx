import { initializeApp } from '@firebase/app';
import { get, getDatabase, ref } from 'firebase/database';
import React, { DragEventHandler, useEffect, useState } from 'react'
import { FixedNav } from '../components/FixedNav';
import { LearnItemMetaData } from './translate-word';
import { useDrag } from 'react-dnd' // PS i fucking hate this, fix your damn API react.
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import { TextDescriptions } from '../web3/Contribute';
import { ALL_LANGUAGES, Language } from '../languageDex';
import Link from 'next/link';

const LearnPage = () => {

    const [translateFromLanguage, setTranslateFromLanguage] = useState('en');
    const [translateToLanguage, setTranslateToLanguage] = useState('pt');
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
    const [learnItems, setLearnItems] = useState<LearnItemMetaData[]>([]);
    const [openTranslationWindows, setOpenTranslationWindows] = useState<any>({ simple: false, descriptive: false, verbose: false, overlyVerbose: false })
    const [sliderPercent, setSliderPercent] = useState<any>({});
    const [isSettingLanguagePref, setIsSettingLanguagePref] = useState<any>(false);
    const [currentLanguageCode, setCurrentLanguageCode] = useState('en:es')
    const [currentTypeSetting, setCurrentTypeSetting] = useState('');
    const [currentItem, setCurrentItem] = useState<LearnItemMetaData>(null as any);

    async function getAllContent() {
        const db = getDatabase();
        const r = ref(db, 'content/' + translateFromLanguage);
        const snapshot = await get(r) as any;
        const imageAndText = Object.entries(snapshot.val()).map(x => x[1]) as LearnItemMetaData[];
        const items = imageAndText.filter(x => x.translations != undefined && x.translations[translateToLanguage] as any != {})

        setLearnItems(items);
        let indy = Math.floor(Math.random() * items.length);
        setCurrentItemIndex(indy);
        setCurrentItem(items[indy])
    }

    useEffect(() => {
        getAllContent();
    }, [translateToLanguage, translateFromLanguage, isSettingLanguagePref])

    if (currentItemIndex == -1) {
        return <div><FixedNav /><p className='mt-20 text-center'>{`:]`}</p></div>;
    }

    const isOpen = (key: keyof TextDescriptions) => {
        return openTranslationWindows[key] == true;
    }

    const setOpen = (key: keyof TextDescriptions) => {
        const out = { ...openTranslationWindows }
        if (out[key] != undefined) {
            setOpenTranslationWindows({ ...{ [key]: !out[key] } })
        } else {
            setOpenTranslationWindows({ ...{ [key]: true } })
        }

    }

    const updateSliderPercent = (key: keyof TextDescriptions, value: number) => {
        const out = { ...sliderPercent }
        out[key] = value;
        setSliderPercent(out);
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
        <div className='overflow-x-hidden pb-[100px]'>
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
                <div className='w-full flex justify-center items-center pt-[70px] px-4 flex-col'>
                    <button onClick={() => setIsSettingLanguagePref(true)} className='mt-[20px] w-full '>{`${Language.PrettyPrint(translateFromLanguage)} to ${Language.PrettyPrint(translateToLanguage)}`}<br /><span className='underline text-[blue] text-[14px]'>{`Update Language`}</span></button>

                    {currentItem == undefined ?
                        <>
                            <h1 className='mt-20'>no content :[</h1>
                            <button>contribute :)</button>
                        </>
                        :
                        <>
                            <img src={currentItem.imageUrl} />

                            {['simple', 'descriptive', 'verbose', 'overlyVerbose'].map((key, index) => {
                                const fuckTypescript = key as keyof TextDescriptions
                                const sliderForKey = sliderPercent[fuckTypescript] || 0
                                const translation = currentItem.translations[translateToLanguage][fuckTypescript];
                                if (translation == undefined) {
                                    return null;
                                }

                                return (
                                    <div className='w-full' style={{ transition: 'all 0.22s ease-in' }}>
                                        <p className='text-[10px] w-full text-left mt-4'>level {index + 1}</p>
                                        <div className='w-full border rounded p-4 flex flex-center flex-col'>
                                            <div onClick={() => setOpen(fuckTypescript)} style={{ marginBottom: isOpen(fuckTypescript) ? 10 : 0, transition: 'all 0.12s ease-in' }} className='w-full flex flex-row justify-between'>
                                                <p className='w-full mr-2 text-[12px]'>{currentItem.textData[fuckTypescript]}</p>
                                                {/* <img onClick={() => setOpen(fuckTypescript)} src={getActionButton(fuckTypescript)} className='h-[30px]' style={{ zIndex: 999 }} /> */}
                                            </div>

                                            <div style={{ pointerEvents: isOpen(fuckTypescript) ? 'auto' : 'none', height: isOpen(fuckTypescript) ? `100%` : 0, opacity: !isOpen(fuckTypescript) ? 0 : 1, position: 'relative', width: '100%', transition: 'all 0.12s ease-in' }}>

                                                <div className='w-[100%] relative h-[30px]'>
                                                    <Slider value={sliderForKey} setSlider={e => updateSliderPercent(fuckTypescript, e)} />
                                                    <div className='absolute top-[10px] bottom-[10px] left-[15px] bg-[#0074D9]' style={{ width: sliderForKey + "%" }} />
                                                    <div className='absolute top-[10px] bottom-[10px] right-[15px] bg-[#7FDBFF]' style={{ width: `calc(${100 - sliderForKey + "%"} - 20px)` }} />
                                                </div>

                                                <p className='text-[10px] w-full text-left mt-8'>translation</p>
                                                {/* <TranslationTextLine text={currentItem.translations[currentLanguageCode]}/> */}
                                                <TranslationTextLine currentLanguage={currentLanguageCode} text={translation} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    }

                </div>
            }
        </div >
    )
}

export const TranslationTextLine = (props: { text: string, currentLanguage: string }) => {

    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);
    const [activeTranslation, setActiveTranslation] = useState('');
    const [activeWord, setActiveWord] = useState('');

    const onClickSpan = async (word: string) => {
        const code = props.currentLanguage;
        const db = getDatabase();
        const wordKey = Language.GetWordKey(word); // xx move to func
        const r = ref(db, `translation/${Language.FlipCode(code)}/${wordKey}`)
        const translation = await get(r);

        if (translation == null || translation.val() == null) {
            setActiveTranslation('NULL')
        } else {
            setActiveTranslation(translation.val().translation)
        }

        if (activeWord == wordKey) {
            setActiveWord('')
            setActiveTranslation('')
        } else {
            setActiveWord(wordKey)
        }
    }

    return (
        <div>
            <p className='w-full h-fit'>
                {props.text.split(' ').map(str => {
                    const isBold = () => {
                        return Language.GetWordKey(str) == activeWord ? { fontWeight: 'bold' } : {}
                    }

                    return <span style={isBold()} onClick={e => onClickSpan(str)} className='mr-[8px]'>{str}</span>
                })}
            </p>

            <div style={{ overflow: 'hidden', marginTop: 0, transition: 'all 0.14s ease-in', height: activeTranslation == 'NULL' ? 65 : activeTranslation == '' || activeWord == '' ? 0 : 35, }}>
                {activeTranslation == 'NULL' && activeWord != '' ?
                    <Link href='/translate-word'>
                        <button className='border rounded pr-3 text-sm' style={{ fontStyle: 'italic', marginTop: activeTranslation != 'NULL' ? -10 : 10, opacity: activeTranslation != 'NULL' ? 0 : 1, transition: 'all 0.2s ease-out' }}>
                            {`add translation for "${activeWord}"`}
                        </button>
                    </Link>
                    :
                    <p style={{ fontStyle: 'italic', marginTop: activeWord == '' ? -10 : 10, opacity: activeWord == '' ? 0 : 1, transition: 'all 0.2s ease-out' }}>
                        {`"${activeTranslation}"`}
                    </p>
                }
            </div>
        </div>
    )
}

export const Slider = (props: { value: number, setSlider: (num: number) => void }) => {

    const className = 'absolute h-[30px] w-[30px] top-[-10px] rounded-[15px] bg-[#01FF70] border-2 border-[#0CEF70] shadow-xl'
    const [slider, setSlider] = useState(0);
    const [width, setWidth] = useState(0);

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        if (width == 0) {
            setWidth(data.node.parentElement!.clientWidth)
        }
        const w = data.node.parentElement!.clientWidth;

        let percent = data.x / w || 0;
        percent = Math.max(0, percent)
        percent = Math.min(1, percent);

        props.setSlider(Math.floor(percent * 100))
        setSlider(Math.floor(percent * w))
    }

    return (
        <>
            <Draggable bounds={'parent'} onDrag={handleDrag} position={{ x: slider, y: 0 }}>
                <div className={className} style={{ top: 0, zIndex: 90, opacity: 1.0, marginLeft: -15 }}>
                    <div className='h-[45px] w-[45px] absolute'></div>
                </div>
            </Draggable>
        </>

    )

}

export default LearnPage



