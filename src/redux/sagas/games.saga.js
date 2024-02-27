import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchGamesSaga(action) {
    const response = yield axios.get('/api/games/user').catch((error) => console.log(error));
    yield put({ type: 'SET_GAME', payload: response.data });
}

function* adjustDiceSaga(action) {
    const response = yield axios.post(`/api/games/lock/`, action.payload.updateDiceState);
    yield put({ type: 'SET_LOCKED_DICE', payload: { response, currentGame: action.payload.currentGame } })
}

function* rollDiceSaga(action) {
    yield axios.post(`/api/games/roll/`, action.payload);
    yield put({ type: 'FETCH_GAMES' });
}

function* saveScoreSaga(action) {
    yield axios.post(`/api/games/save/${action.payload.gameId}`, action.payload.gameState);
    yield put({ type: 'FETCH_GAMES' });
}

function* startGameSaga(action) {
    yield axios.put(`/api/games/start/${action.payload}`);
    yield put({ type: 'FETCH_GAMES' });
}

function* joinGameSaga(action) {
    yield axios.post(`/api/lobby/join`, action.payload);
    yield put({ type: 'FETCH_GAMES' });
}

function* createGameSaga(action) {
    yield axios.post(`/api/lobby/create`, action.payload);
    yield put({ type: 'FETCH_GAMES' });
}

function* gamesSaga() {
    yield takeEvery('FETCH_GAMES', fetchGamesSaga)
    yield takeEvery('ADJUST_DICE', adjustDiceSaga)
    yield takeEvery('ROLL_DICE', rollDiceSaga)
    yield takeEvery('JOIN_GAME', joinGameSaga)
    yield takeEvery('CREATE_GAME', createGameSaga)
    yield takeEvery('SAVE_SCORE', saveScoreSaga)
    yield takeEvery('START_GAME', startGameSaga)
}

export default gamesSaga;
