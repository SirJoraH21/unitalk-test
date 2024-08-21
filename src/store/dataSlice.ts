import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Operator {
    createdAt: string;
    name: string;
    avatar: string;
    isWorking: boolean;
    id: string
}

export interface OperatorAddone {
    fieldName: AddonFieldName;
    text: string;
    isChecked: boolean;
    id: string;
}

export enum AddonFieldName {
    IP = "IP", SMTP = "SMTP"
}

interface CombinedData extends Operator {
    additionalInfo: { [key in AddonFieldName]?: string };
}

interface DataState {
    operators: Operator[];
    operatorAddones: OperatorAddone[];
    combinedData: CombinedData[];
    loading: boolean;
    error: string | null;
}

const initialState: DataState = {
    operators: [],
    operatorAddones: [],
    combinedData: [],
    loading: false,
    error: null,
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        fetchDataStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchDataSuccess(state, action: PayloadAction<{ operators: Operator[]; operatorAddones: OperatorAddone[] }>) {
            const { operators, operatorAddones } = action.payload;
            state.operators = operators;

            // Transform add-ons into the desired structure using reduce
            state.combinedData = operators.map((operator) => {
                const additionalInfo = operatorAddones.reduce<{ [key in AddonFieldName]?: string }>((acc, addone) => {
                    if (addone.id === operator.id) {
                        acc[addone.fieldName] = addone.text;
                    }
                    return acc;
                }, {});

                return {
                    ...operator,
                    additionalInfo,
                };
            });

            state.loading = false;
        },
        fetchDataFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;

export default dataSlice.reducer;

