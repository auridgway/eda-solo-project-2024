import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* lockDiceSaga(action){
    console.log(action);
}

function* diceInfoSaga() {
    yield takeEvery('LOCK_DICE', lockDiceSaga);
}

export default diceInfoSaga;
