import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchGamesSaga(action) {
    const response = yield axios.get('/api/games/user').catch((error)=>console.log(error));
    yield put({type:'SET_GAME', payload:response.data});
}

function* adjustDiceSaga(action) {
    yield axios.post(`/api/games/lock/`, action.payload);
 
}
function* rollDiceSaga(action) {
    yield axios.post(`/api/games/roll/${action.payload.gameId}`, action.payload.gameState);
    yield put({type: 'FETCH_GAMES'});
}

function* gamesSaga() {
    yield takeEvery('FETCH_GAMES', fetchGamesSaga)
    yield takeEvery('ADJUST_DICE', adjustDiceSaga)
    yield takeEvery('ROLL_DICE', rollDiceSaga)
}

export default gamesSaga;
