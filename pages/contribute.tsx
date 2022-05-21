import React, { useState } from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Contribute, TextDescriptions } from '../web3/Contribute';
import { storage } from './_app';
import { FixedNav } from '../components/FixedNav';
import { Language, ALL_LANGUAGES } from '../languageDex';
import { useWalletContext } from '../web3/useWalletContext';

enum UploadState {
    NULL = 'NULL',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
}

const AddContentPage = () => {

    const [imageAsFile, setImageAsFile] = useState<any>('')
    const [imageSrc, setImageSrc] = useState<any>(null)
    const [uploadState, setUploadState] = useState<UploadState>(UploadState.NULL)
    const [isSettingLanguagePref, setIsSettingLanguagePref] = useState<any>(false);
    const [currentTypeSetting, setCurrentTypeSetting] = useState('');
    const [languageCode, setLanguageCode] = useState('en');
    const { connect, account } = useWalletContext()

    // sorry mom, we're hacking
    const [textLevel1, setTextLevel1] = useState('');
    const [textLevel2, setTextLevel2] = useState('');
    const [textLevel3, setTextLevel3] = useState('');
    const [textLevel4, setTextLevel4] = useState('');

    const resetPage = () => {
        setImageAsFile('')
        setImageSrc(null)
        setUploadState(UploadState.NULL)

        setTextLevel1('');
        setTextLevel2('');
        setTextLevel3('');
        setTextLevel4('');
    }

    const handleImageAsFile = (e: any) => {
        console.log(e);
        const image = e.target.files[0]
        setImageAsFile(() => (image))

        addImageToDom(image, e);
    }

    const addImageToDom = (file: any, event: any) => {
        var selectedFile = file;
        var reader = new FileReader();
        console.log(imageSrc);
        reader.onload = function (event: any) {
            setImageSrc(event.target.result);
        };

        reader.readAsDataURL(selectedFile);
    }

    const handleFireBaseUpload = (wallet: string, e: any) => {
        e.preventDefault()
        console.log('start of upload')

        if (imageAsFile === '') {
            console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
        }

        setUploadState(UploadState.IN_PROGRESS);
        const startTimeStamp = Date.now();

        const onUploadFinished = () => {
            const finishTimestamp = Date.now();
            const delta = finishTimestamp - startTimeStamp;

            // force min upload of 1.5sec to not get flashy flashies
            const MIN_WAIT_TIME = 1500;

            if (delta < MIN_WAIT_TIME) {
                setTimeout(() => {
                    setUploadState(UploadState.FINISHED)
                }, MIN_WAIT_TIME - delta)
            } else {
                setUploadState(UploadState.FINISHED)
            }
        }

        const textData: TextDescriptions = {
            simple: textLevel1,
            descriptive: textLevel2,
            verbose: textLevel3,
            overlyVerbose: textLevel4,
        }


        Contribute.uploadImage(wallet, languageCode, storage, imageAsFile, textData, onUploadFinished);
    }


    const TEXT_AREA = `border-2 border-[black] rounded p-4`
    const forceNoScrollWithOverlay = uploadState != UploadState.NULL ? { overflow: `hidden`, height: '100vh' } : {}

    const uploadImages = () => {

    }


    const setTranslate = (languageCode: string) => {
        window.scrollTo(0, 0);
        setIsSettingLanguagePref(false);
        setLanguageCode(languageCode);
    }

    return (
        <div className='w-full flex flex-col justify-center items-center pt-[70px]'>
            <FixedNav />


            {isSettingLanguagePref ?
                <div className='flex flex-center flex-col'>
                    <button onClick={() => setIsSettingLanguagePref(false)} className='fixed top-[60px] left-0 right-0 h-[60px] bg-[#7FDBFF] m-0 p-0 flex-center border-0' style={{ zIndex: 9999 }} >
                        {`Go Back`}
                    </button>

                    <div className=' flex flex-center flex-col w-full px-4 fixed top-[120px] h-[200px] bg-[white] py-4'>
                        <p className='text-[12px] font-bold mt-[50px]'>current:</p>

                        <h1 className='text-center font-bold text-[14px] mb-4'>{`Adding Content in [${Language.PrettyPrint(languageCode)}]`}</h1>
                    </div>
                    <div className='mt-[280px] px-4'>
                        {ALL_LANGUAGES.map(x => {
                            return (
                                <div onClick={() => setTranslate(x.id)} className='w-full border p-2 rounded my-2 text-left'>
                                    <span className='text-[10px]'>{`[${x.id}]`}</span>
                                    <br />
                                    <span>{x.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                :
                <>
                    <div className='w-max-[1200px] w-full flex flex-col px-4 pb-[100px] pt-4' style={forceNoScrollWithOverlay}>
                        <button onClick={uploadImages} className='mb-4 w-full h-[60px] mt-[60px] border-[2px] rounded border-[#0074D9] m-0 p-0 flex-center'>
                            {`multi-upload`}
                        </button>
                        <button onClick={() => setIsSettingLanguagePref(true)} className='text-[12px] font-bold fixed top-[60px] left-0 right-0 h-[60px] bg-[#7FDBFF] m-0 p-0 flex-center border-0' style={{ zIndex: 9999 }} >
                            {`Update Content Entry Language`}
                            <br />
                            [{Language.PrettyPrint(languageCode)}]
                        </button>

                        <form onSubmit={(e) => handleFireBaseUpload(account, e)} className='flex flex-col'>


                            <label className="mb-10 w-full border-2 border-black rounded h-[90vw] flex-center cursor-pointer hover:border-[4px] shadow-none hover:shadow-xl text-base" style={{ transition: 'all 0.15s ease-in', ...(imageSrc == null ? { height: 60 } : {}) }}>
                                <input
                                    className='hidden'
                                    type="file"
                                    onChange={handleImageAsFile}
                                />
                                {imageSrc == null ?
                                    <div>
                                        single image w/ content
                                    </div>
                                    :
                                    <img src={imageSrc} className='h-full w-full object-cover' />
                                }
                            </label>

                            {imageSrc &&
                                <>
                                    <p className='mt-4'>{`Simple`}</p>
                                    <textarea className='text-[12px]' value={textLevel1} onChange={(e) => setTextLevel1(e.target.value)} className={TEXT_AREA} cols={2} rows={1} placeholder={`A small house`} />
                                    <p className='mt-4'>{'Descriptive'}</p>
                                    <textarea className='text-[12px]' value={textLevel2} onChange={(e) => setTextLevel2(e.target.value)} className={TEXT_AREA} cols={2} rows={2} placeholder={`This is a wooden, small, big windowed home'`} />
                                    <p className='mt-4'>{'Verbose'}</p>
                                    <textarea className='text-[12px]' value={textLevel3} onChange={(e) => setTextLevel3(e.target.value)} className={TEXT_AREA} cols={2} rows={3} placeholder={`An artsy yet tasteful example of a minimalist's retreat`} />
                                    <p className='mt-4'>{`Overly Verbose`}</p>
                                    <textarea className='text-[12px]' value={textLevel4} onChange={(e) => setTextLevel4(e.target.value)} className={TEXT_AREA} cols={2} rows={4} placeholder={`To the frugal yet fortuitous, this pequiliar building seems like an oasis for the nonchalant `} />
                                    <button className='mt-8'>upload contribution</button>
                                </>
                            }

                        </form>
                    </div>

                    {uploadState != UploadState.NULL &&
                        <div className='fixed-full backdrop-blur flex-center'>
                            {uploadState == UploadState.FINISHED &&
                                <div className='flex flex-col pointer-event-none'>
                                    ty for contribution :)
                                    <br />
                                    <br />
                                    image: +1 LU
                                    <br />
                                    simple text: +1 LU
                                    <br />
                                    descriptive text: +1 LU
                                    <br />
                                    verbose text: +1 LU
                                    <br />
                                    overly verbose text: +1 LU
                                    <br />
                                    <br />

                                    <button onClick={() => resetPage()}>Contribute More</button>
                                </div>
                            }
                            {uploadState == UploadState.IN_PROGRESS &&
                                <>
                                    uploading...
                                </>
                            }
                        </div>
                    }
                </>
            }
        </div >
    )
}

export default AddContentPage
