import { getDatabase, ref, remove, push } from "firebase/database"
import { WordList, WordKey } from "../pages/tools/generator"
import { WordSortTabs, WordTypeTabs, NewWordInput, ScrollableGeneratedWordList } from "./_components"
import React from 'react';
import { s } from "./styles";

interface WordListState {
  sortTab: string,
  wordList: WordList,
  copy: WordList,
  wordTab: WordKey,
  inputValue: string,
}

export class WordListDisplay extends React.Component<{ words: WordList, onClickWord: (word: string, tab: WordKey) => void, wordTab: WordKey, onClickTab: (str: WordKey) => void }, WordListState> {

  public state: WordListState = {
    sortTab: 'alpha',
    wordList: { ...this.props.words },
    copy: { ...this.props.words },
    wordTab: 'animal',
    inputValue: ''
  }

  private setBySort = (words: WordList) => {

    let { animal, flair, element } = { ...words }

    if (this.state.sortTab == 'alpha') {
      return {
        animal: [...animal].sort((a, b) => a.word < b.word ? -1 : 1),
        flair: [...flair].sort((a, b) => a.word < b.word ? -1 : 1),
        element: [...element].sort((a, b) => a.word < b.word ? -1 : 1),
      }
    }

    if (this.state.sortTab == 'alpha-reverse') {
      return {
        animal: [...animal].sort((a, b) => a.word > b.word ? -1 : 1),
        flair: [...flair].sort((a, b) => a.word > b.word ? -1 : 1),
        element: [...element].sort((a, b) => a.word > b.word ? -1 : 1),
      }
    }

    if (this.state.sortTab == 'date') {
      return words;
    }

    if (this.state.sortTab == 'date-reverse') {
      return {
        animal: [...animal].reverse(),
        flair: [...flair].reverse(),
        element: [...element].reverse(),
      }
    }


    return words;
  }

  private removeFromList = (word: { id: string, word: string }) => {
    let db = getDatabase();
    let r = ref(db, 'data/monsterGenWords/' + this.state.wordTab + '/' + word.id);
    remove(r);
  }

  private addToListFromInput = (e: any) => {
    e.preventDefault();

    let db = getDatabase();
    let r = ref(db, 'data/monsterGenWords/' + this.state.wordTab);
    push(r, this.state.inputValue);
    this.setState({ inputValue: '' })
  }

  render() {

    let { onClickWord } = this.props;

    let wordList = this.setBySort(this.props.words)

    return (
      <div style={s.wordListContainer}>

        <WordSortTabs sortTab={this.state.sortTab} setSort={(v) => this.setState({ sortTab: v })} />
        <WordTypeTabs wordTab={this.state.wordTab} setTab={(v) => this.setState({ wordTab: v })} />
        <NewWordInput inputValue={this.state.inputValue} wordTab={this.state.wordTab} onUpdateInput={(x) => this.setState({ inputValue: x })} addToListFromInput={this.addToListFromInput} />
        <ScrollableGeneratedWordList wordList={wordList} wordTab={this.state.wordTab} onClickWord={onClickWord} removeFromList={this.removeFromList} />

      </div>
    )
  }
}


