import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchGamesSaga(action) {
    const response = yield axios.get('/api/games/user').catch((error) => console.log(error));
    yield put({ type: 'SET_GAME', payload: response.data });
}

function* adjustDiceSaga(action) {
    yield put({ type: 'SET_LOCKED_DICE', payload: action.payload })
    yield axios.post(`/api/games/lock/`, action.payload);

}

function* rollDiceSaga(action) {
    yield axios.post(`/api/games/roll/${action.payload.gameId}`, action.payload.gameState);
    yield put({ type: 'FETCH_GAMES' });
}

function* joinGameSaga(action) {
    yield axios.post(`/api/lobby/`, action.payload);
}

function* gamesSaga() {
    yield takeEvery('FETCH_GAMES', fetchGamesSaga)
    yield takeEvery('ADJUST_DICE', adjustDiceSaga)
    yield takeEvery('ROLL_DICE', rollDiceSaga)
    yield takeEvery('JOIN_GAME', joinGameSaga)
}

export default gamesSaga;
