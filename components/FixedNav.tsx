import { DataSnapshot, get, getDatabase, onValue, ref, set } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWalletContext } from "../web3/useWalletContext";

export const FixedNav = () => {
    const [menuShowing, setMenuShowing] = useState(false);
    const { connect, account } = useWalletContext()
    const [tokenCount, setTokenCount] = useState(0);

    const colors = [`#`]
    const isHidden = menuShowing ? {} : { transform: `translateX(100vw)`, opacity: 0 }

    useEffect(() => {
        if (account == undefined) {
            return;
        }
        const db = getDatabase();
        const accountRef = ref(db, `account/${account}`)

        const incrementUselessAccountProp = async () => {
            const acc = await get(accountRef)
            if (acc == null || acc.val() == null) {
                set(accountRef, { NGU: 0 })
            } else {
                set(accountRef, { ...acc.val(), NGU: acc.val().NGU + 1 })
            }
        }

        incrementUselessAccountProp();

        onValue(accountRef, (snapshot: DataSnapshot) => {
            if (snapshot == null || snapshot.val() == null) {
                return;
            }

            const tokenCount = snapshot.val().tokenCount || 0;
            setTokenCount(tokenCount);
        })
    }, [account])

    return (
        <>

            <div className='fixed top-0 left-0 right-0 h-[60px] bg-[#FFDC00] flex items-center p-4 justify-between' style={{ zIndex: 9999 }}>
                <h1 className='text-[#111111]'>nativeterms</h1>
                <button className='h-full p-0 border-none' onClick={() => setMenuShowing(true)}>
                    <img src='/menu.svg' className='h-full' />
                </button>
            </div>


            <div onClick={() => setMenuShowing(false)} className='p-0 fixed-full backdrop-blur' style={{ transition: '0.15s all ease-in', zIndex: 99999999, ...isHidden }}>
                <div className='fixed top-0 left-[10vw] right-0 bottom-0 bg-[#001f3f] flex justify-end flex-col' >
                    <div className='bg-[#7FDBFF] w-full p-4 flex flex-row items-center' style={{ height: `calc((100vh - 180vw )/ 2)` }}>
                        <img src='/ranking.svg' className='h-full' />
                        <h1 className='ml-4 text-[#111]'>#1947/20493</h1>
                    </div>
                    <div className='bg-[#0074D9] w-full p-4 flex flex-row items-center' style={{ height: `calc((100vh - 180vw )/ 2)` }}>
                        <img src='/token.svg' className='h-full' />
                        <h1 className='ml-4 text-[#111]'>{`${tokenCount} NTV`}</h1>
                    </div>
                    <div>
                        <div className='grid grid-cols-2 w-full gap-0'>
                            <LinkButton link='/learn' text='learn' icon={'/brain.svg'} index={0} />
                            <LinkButton link='/progress' text='progress' icon={'/growth.svg'} index={1} />
                            <LinkButton link='/contribute' text='contribute' icon={'/puzzle.svg'} index={2} imageClass='p-2' />
                            <LinkButton link='/vote' text='vote' icon={'/vote.svg'} index={3} imageClass='p-2' />
                            <LinkButton link='/translate-word' text='translate (words)' icon={'/translate.svg'} index={4} imageClass='p-2' />
                            <LinkButton link='/translate-full' text='translate (full)' icon={'/languages.svg'} index={5} imageClass='p-2' />
                            <LinkButton link='/community' text='community' icon={'/list.svg'} index={6} imageClass='p-2' />
                            <LinkButton link='/profile' text='profile' icon={'/resume.svg'} index={7} imageClass='p-2' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const LinkButton = (props: { text: string, icon: string, index: number, link: string, imageClass?: string }) => {
    const { text, icon, index, imageClass, link } = props;

    const colors = [`#FF851B`, `#01FF70`, `#FFDC00`, `#FF4136`, `#2ECC40`, `#39CCCC`, `#7FDBFF`, `#F012BE`]
    return (
        <Link href={link}>

            <div className={`w-full h-[45vw] flex-center flex-col`} style={{ backgroundColor: colors[index] }} >
                <img src={icon} className={'h-1/2 ' + imageClass} />
                <h1 className='text-[14px]'>{text}</h1>
            </div>
        </Link>
    )
}