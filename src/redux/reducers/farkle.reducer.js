const farkleReducer = (state = false, action) => {
    switch (action.type) {
      case 'SET_FARKLE':
        return action.payload.hasFarkled;
        case '':
      default:
        return state;
    }
  };

  
  export default farkleReducer;