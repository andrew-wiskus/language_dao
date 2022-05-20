export const s = {
  removeFromDbListButton: {
    height: 20,
    outline: 'none',
    border: 'none',
    width: 50,
    fontWeight: '700',
    fontFamily: 'courier',
    cursor: "pointer",
    backgroundColor: '#ff6480',
    color: `#282c34`
  },
  plusButtonStyle: (isVotedOn: boolean) => {
    return {
      marginRight: 10,
      height: 40,
      width: 40,
      fontWeight: '700',
      marginTop: 4,
      outline: 'none',
      border: isVotedOn ? `3px solid #f9c859BB` : '2px solid #abb2bf',
      color: `#f9c859BB`,
      borderRadius: 50,
      backgroundColor: isVotedOn ? '#FFFFFF1C' : 'transparent',
      fontFamily: 'courier'
    }
  },

  transparentButton: {
    background: 'transparent',
    width: `100%`,
    color: '#f9c859',
    fontWeight: '700',
    outline: 'none',
    fontSize: 14,
    marginBottom: 10,
    border: '1px solid #FFFFFF22',
    marginTop: 4
  },

  inputStyle: (type: string) => {
    let element = '#9f7efe'
    let animal = '#ce9887'
    let flair = '#f9c859'

    let color = type == 'element' ? element : type == 'animal' ? animal : flair

    return {
      color,
      height: 45,
      backgroundColor: 'transparent',
      fontWeight: `700`,
      fontFamily: 'courier',
      border: '1px solid #abb2bf',
      marginBottom: 10,
      width: 400,
      paddingLeft: 10
    }
  },

  databaseMonsterNameListItem: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    paddingRight: `5vw`
  } as any,
  wordListDeletebutton: {
    border: 'none',
    width: 20,
    height: 20,
    outline: 'none',
    borderRadius: 3,
    fontWeight: 'bolder',
    fontFamily: 'courier',
    backgroundColor: '#ff6480',
    color: 'white'
  } as any,

  wordRow: (highlite: boolean) => {
    return {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: highlite ? '#abb2bf11' : '#636d8311',
      padding: 10
    } as any;
  },
  wordRowText: {
    color: `#abb2bf`,
    fontWeight: 700
  },
  wordListContainer: {
    width: `100%`,
    maxWidth: 500,
    paddingLeft: 20,
    right: `5vw`,
    maxHeight: `80vh`,
  },
  addGenForTypeButton: {
    background: 'transparent',
    width: `100%`,
    color: '#f9c859',
    fontWeight: '700',
    outline: 'none',
    fontSize: 22,
    border: '1px solid #FFFFFF22',
    marginTop: 4
  }
}