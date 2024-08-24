import { all, AllEffect, call, CallEffect, put, PutEffect, takeLatest } from 'redux-saga/effects';
import { fetchDataSuccess, fetchDataFailure, Operator, OperatorAddone } from './dataSlice';

// Should be in .env file
const API_TOKEN = '66a7f07b53c13f22a3d17fb1';
const BASE_API = `https://${API_TOKEN}.mockapi.io/api`;

async function fetchOperators(): Promise<Operator[]> {
    const response = await fetch(`${BASE_API}/operator`);
    if (!response.ok) {
        throw new Error('Failed to fetch operators');
    }
    return response.json();
}

async function fetchOperatorAddones(): Promise<OperatorAddone[]> {
    const response = await fetch(`${BASE_API}/operatorAddon`);
    if (!response.ok) {
        throw new Error('Failed to fetch operator addones');
    }
    return response.json();
}

function* fetchDataSaga(): Generator<
    AllEffect<CallEffect<Operator[]> | CallEffect<OperatorAddone[]>> | PutEffect,
    void,
    [Operator[], OperatorAddone[]]
> {
    try {
        // Fetch both operators and operator add-ons in parallel
        const [operators, operatorAddones] = yield all([
            call(fetchOperators),
            call(fetchOperatorAddones)
        ]);
        yield put(fetchDataSuccess({ operators, operatorAddones }));
    } catch (error: any) {
        yield put(fetchDataFailure(error.message));
    }
}

// Watcher saga that triggers the fetchDataSaga on the fetchData action
function* watchFetchData() {
    yield takeLatest('data/fetchDataStart', fetchDataSaga);
}

export default watchFetchData;

