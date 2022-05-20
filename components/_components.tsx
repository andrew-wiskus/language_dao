import { s } from "./styles";
import React, { useState } from 'react';
import { WordKey, WordList, MonsterEntry } from "../pages/tools/generator";

export const WordSortTabs = (props: { sortTab: string, setSort: (v: string) => void }) => {

	let { sortTab, setSort } = props;

	let tabStyle = (isTab: boolean) => {
		return { ...s.transparentButton, width: `10vw`, minWidth: '100px', fontSize: 20, mborderWidth: 3, borderColor: isTab ? 'unset' : '#abb2bf', opacity: isTab ? 1 : 0.5 }
	}


	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'unset', marginBottom: 20, }}>
			<span style={{ color: 'white', marginRight: 15 }}>sort: </span>
			<button style={{ ...tabStyle(sortTab.includes('alpha')), width: 100, marginRight: 10, fontWeight: 'lighter' }} onClick={() => setSort(sortTab == 'alpha' ? 'alpha-reverse' : 'alpha')}>alpha</button>
			<button style={{ ...tabStyle(sortTab.includes('date')), width: 100, marginRight: 10, fontWeight: 'lighter' }} onClick={() => setSort(sortTab == 'date' ? 'date-reverse' : 'date')}>date</button>
		</div>
	)
}

export const WordTypeTabs = (props: { wordTab: WordKey, setTab: (val: WordKey) => void }) => {
	let { wordTab, setTab } = props;

	let tabStyle = (isTab: boolean) => {
		return { ...s.transparentButton, width: `10vw`, minWidth: `100px`, fontSize: 15, borderWidth: 3, borderColor: isTab ? 'unset' : '#abb2bf', opacity: isTab ? 1 : 0.5 }
	}

	return (

		<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'unset', marginBottom: 20 }}>
			<button style={tabStyle(wordTab == 'animal')} onClick={() => setTab('animal')}>ANIMALS</button>
			<button style={tabStyle(wordTab == 'flair')} onClick={() => setTab('flair')}>FLAIR</button>
			<button style={tabStyle(wordTab == 'element')} onClick={() => setTab('element')}>ELEMENTS</button>
		</div>
	)
}

export const NewWordInput = (props: { wordTab: WordKey, onUpdateInput: (val: string) => void, inputValue: string, addToListFromInput: (val: any) => void }) => {
	let { addToListFromInput, inputValue, onUpdateInput, wordTab } = props;

	return (
		<form onSubmit={e => addToListFromInput(e)} style={{ marginBottom: 20 }}>
			<input style={{ ...s.inputStyle(wordTab), }} onChange={(e) => onUpdateInput(e.target.value)} value={inputValue} />
			<button style={{ height: 50, outline: 'none', border: 'none', marginLeft: 15, color: 'white', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: 'lighter', fontFamily: 'courier' }}>SUBMIT</button>
		</form>
	)
}

export const ScrollableGeneratedWordList = (props: { wordList: WordList, wordTab: WordKey, onClickWord: (w: string, t: WordKey) => void, removeFromList: (x: { id: string, word: string }) => void }) => {
	let { wordList, wordTab, onClickWord, removeFromList } = props;

	return (

		<div style={{ height: `60vh`, overflowY: 'scroll' }}>
			{
				wordList[wordTab].map((x, i) => {
					return (
						<div key={i} onClick={() => onClickWord(x.word, wordTab)} style={s.wordRow(i % 2 == 0)} className="hover_white">
							<span style={s.wordRowText}>{x.word} : {x.word.split('').reverse().map(x => x.toLocaleLowerCase()).map((x, i) => i == 0 ? x.toLocaleUpperCase() : x)}</span>
							<button style={s.wordListDeletebutton} onClick={() => removeFromList(x)}>x</button>
						</div>
					)
				})
			}
		</div>
	)
}

export const DatabaseMonsterNameListItem = (props: { item: MonsterEntry, removeFromList: () => void, userID: string, onClickVote: (val: number) => void }) => {

	const { item, removeFromList, userID, onClickVote } = props;

	let itemVoteValue = 0;
	if (item.votes && item.votes[userID]) {
		itemVoteValue = item.votes[userID];
	}

	let total = 0;
	if (item.votes) {
		Object.values(item.votes).forEach(val => {
			total += val;
		})
	}

	// My name is Pat and I am the hot one
	// This is a hot lady typing and I think Pat is a very desireable man, sexually

	if (item.element == undefined) { item.element = []; }
	if (item.animal == undefined) { item.animal = []; }
	if (item.flair == undefined) { item.flair = []; }

	return (
		<div style={{ ...s.databaseMonsterNameListItem, marginTop: 10, marginBottom: 20, paddingBottom: 20, borderBottom: '2px solid white', position: 'relative' }}>
			<button style={{ ...s.plusButtonStyle(false), color: `#282c34`, backgroundColor: '#10b1fe', position: 'absolute', right: 0, }}>{total}</button>
			<MonsterNameLabel item={item} />
			<div style={{ marginLeft: 6 }}>
				<VoteButtonRow onClickVote={onClickVote} itemVoteValue={itemVoteValue} />
			</div>
			<div style={{ position: 'absolute', right: 10, bottom: 10, }}>
				<RemoveFromListDbButton removeFromList={removeFromList} userID={userID} item={item} />
			</div>
		</div>
	)
}

export const MonsterNameLabel = (props: { item: MonsterEntry }) => {
	const { item } = props;

	return (
		<div style={{ display: 'flex', flexDirection: 'row', width: 400, marginLeft: 10 }}>
			<MonsterNameTextLabel type='element' item={item} />
			<MonsterNameTextLabel type='animal' item={item} />
			<MonsterNameTextLabel type='flair' item={item} />
		</div>
	)
}

export const MonsterNameTextLabel = (props: { type: WordKey, item: MonsterEntry }) => {
	let { type, item } = props;
	let color = type == 'flair' ? '#f9c859' : type == 'animal' ? '#ce9887' : '#9f7efe';

	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

			{(type == 'flair' && item.flair.length != 0) && <span style={{ color: `#abb2bf` }}> {` + `} </span>}
			{(type == 'animal' && (item.element.length != 0 && item.animal.length) != 0) && <span style={{ color: `#abb2bf` }}>{`-`}</span>}

			{item[type].map((x, i) => {
				return <span key={i} style={{ color: color }} >{x + `${i == item[type].length - 1 ? '' : '-'}`}</span>
			})}
		</div>
	)
}

export const VoteButtonRow = (props: { onClickVote: (val: number) => void, itemVoteValue: number }) => {
	const { onClickVote, itemVoteValue: voteValue } = props;
	return (
		<div>
			<button onClick={() => onClickVote(1)} style={s.plusButtonStyle(voteValue == 1)}>+1</button>
			<button onClick={() => onClickVote(2)} style={s.plusButtonStyle(voteValue == 2)}>+2</button>
			<button onClick={() => onClickVote(3)} style={s.plusButtonStyle(voteValue == 3)}>+3</button>
			<button onClick={() => onClickVote(5)} style={s.plusButtonStyle(voteValue == 5)}>+5</button>
		</div>
	)
}

export const RemoveFromListDbButton = (props: { userID: string, item: MonsterEntry, removeFromList: () => void }) => {
	let { userID, item, removeFromList } = props;

	console.log(item);

	return (
		<div style={{ height: `100%`, display: 'flex', marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
			{userID == item.fromUser ?
				<button style={s.removeFromDbListButton} onClick={() => removeFromList()}>DEL</button>
				:
				<div style={{ width: 50 }} />
			}
		</div>
	)
}

export const DatabaseMonsterList = (props: { databaseMonsters: MonsterEntry[], removeFromDb: any, onClickVote: any, userID: string }) => {
	let { userID, removeFromDb, onClickVote } = props;

	let getVoteTotal = (obj: any) => {
		let total = 0;
		Object.values(obj).forEach(x => total += x as any);
		return total;
	}

	let databaseMonsters = props.databaseMonsters.sort((a, b) => {
		let x = getVoteTotal(a.votes);
		let y = getVoteTotal(b.votes);
		return y - x;
	});

	const [showAll, setShowAll] = useState(true);

	return (
		<>
			<button onClick={() => setShowAll(!showAll)} style={{ ...s.transparentButton, width: 300, height: 50, backgroundColor: showAll ? 'transparent' : '#FFFFFF22' }}>Show{showAll ? '' : 'ing'} only ones you havent voted on</button>

			{databaseMonsters.filter(x => (x.votes == undefined || x.votes[userID] == undefined) || showAll == true).map(monster => {
				return <DatabaseMonsterNameListItem
					key={monster.id}
					item={monster}
					removeFromList={() => removeFromDb(monster)}
					userID={userID} onClickVote={(val) =>
						onClickVote(monster, val)} />
			})}
		</>
	)
}


export const TabController = (props: { onClickTab: any, tab: string }) => {
	let { tab, onClickTab } = props;

	return (
		<div style={{ display: 'flex', flexDirection: 'row', marginBottom: 25 }}>
			<h1 style={{ fontFamily: 'courier', color: '#f9c859', fontWeight: 100, fontSize: 25 }}>Tab: </h1>
			<button style={{ ...s.transparentButton, width: 200, margin: 20, borderWidth: 3, borderColor: tab == 'generator' ? 'unset' : '#abb2bf', opacity: tab == 'generator' ? 1 : 0.5 }} onClick={() => onClickTab('generator')}>GENERATOR</button>
			<button style={{ ...s.transparentButton, width: 200, margin: 20, borderWidth: 3, borderColor: tab == 'custom' ? 'unset' : '#abb2bf', opacity: tab == 'custom' ? 1 : 0.5 }} onClick={() => onClickTab('custom')}>CUSTOM</button>
		</div>
	)
}

export const FullResetButton = (props: { generateState: any }) => {
	return (
		<button
			style={s.transparentButton}
			onClick={() => {
				props.generateState('element')
				props.generateState('animal')
				props.generateState('flair')
			}}
			className="hover_white"
		>
			full reset
		</button>
	)
}
export const MonsterLabelForWord = (props: { listKey: string, list: string[], generateState: any, generateString: any, onAddWord: () => void, removeFromSubList: any }) => {
	let { listKey, list, onAddWord, removeFromSubList, generateState } = props;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: 120, justifyContent: 'space-between', alignItems: 'space-between', minWidth: 60 }}>
			<GenRandForTypeButton genState={() => generateState(listKey)} />
			<GeneratedWordForMonsterText removeFromSubList={removeFromSubList} list={list} listKey={listKey} />
			<AddGenForTypeButton add={onAddWord} />
		</div>
	)
}

export const MonsterWordSeporator = (props: { shouldShow: boolean, text: string }) => {
	let { shouldShow, text } = props;

	return (
		<>
			{shouldShow ?
				<div style={{ height: `100%`, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5, paddingTop: 7 }}>
					<span style={{ color: `#abb2bf` }}>{text}</span>
				</div>
				:
				<div style={{ width: 15 }} />
			}
		</>
	)
}

export const GeneratedWordForMonsterText = (props: { list: string[], listKey: string, removeFromSubList: (i: number, a: string) => void }) => {
	let { list, listKey, removeFromSubList } = props;

	let color = listKey == 'animal' ? '#ce9887' : listKey == 'flair' ? '#f9c859' : '#9f7efe';

	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			{list.map((x, i) => {
				return <span
					key={i}
					className="hover_red"
					onClick={() => props.removeFromSubList(i, listKey)}
					style={{ cursor: 'pointer', color: color, fontSize: 20 }} >
					{x + `${i == list.length - 1 ? '' : '/'}`}
				</span>
			})}
		</div>
	)
}

export const AddGenForTypeButton = (props: { add: () => void }) => {
	return (
		<button className="hover_white" style={s.addGenForTypeButton} onClick={props.add} >
			+
		</button>
	)
}

export const GenRandForTypeButton = (props: { genState: () => void }) => {
	return (
		<button
			style={s.transparentButton}
			onClick={() => props.genState()}
			className="hover_white"
		>
			rand
		</button>
	)
}

export const AddToDatabaseButton = (props: { tab: string, addCustom: () => void, addGenerated: () => void }) => {
	const { tab, addCustom, addGenerated } = props;
	return (
		<div style={{ marginTop: 50, marginBottom: 100, display: 'flex', flexDirection: 'row' }}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<button
					className="hover_opacity"
					style={{ width: 200, fontSize: 22, fontWeight: '700', marginRight: 10, height: 50, border: 'none', outline: 'none', backgroundColor: '#f9c859', color: '#282c34' }}
					onClick={() => tab == 'custom' ? addCustom() : addGenerated()}
				>
					Add
				</button>
			</div>
		</div>
	)
}
