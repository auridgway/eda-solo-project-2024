import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchGamesSaga(action) {
    const response = yield axios.get('/api/games/user').catch((error)=>console.log(error));
    yield put({type:'SET_GAME', payload:response.data});
}

function* adjustDiceSaga(action) {

}

function* gamesSaga() {
    yield takeEvery('FETCH_GAMES', fetchGamesSaga)
    yield takeEvery('ADJUST_DICE', adjustDiceSaga)
}

export default gamesSaga;
