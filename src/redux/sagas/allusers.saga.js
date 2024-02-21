import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* allUsersSaga() {
    yield takeEvery('FETCH_ALL_USERS', fetchAllUsersSaga)
}

function* fetchAllUsersSaga(action) {
    const response = yield axios.get('/api/user/all').catch((error)=>console.log(error));
    yield put({type:'SET_ALL_USERS', payload:response.data});
}

export default allUsersSaga;
