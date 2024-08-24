import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddonFieldName, CombinedData, fetchDataStart } from './store/dataSlice';
import { RootState } from './store/store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar, Checkbox, Stack, TextField, Typography } from '@mui/material';
import { pink } from '@mui/material/colors';

function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { combinedData, loading } = useSelector((state: RootState) => state.data);

    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState(combinedData);

    const handleSearch = useCallback(
        debounce((value: string) => {
            const filteredRows = combinedData.filter((row) =>
                row.name.toLowerCase().includes(value.toLowerCase())
            );
            setRows(filteredRows);
        }, 300), [combinedData]
    );

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchText(value);
        handleSearch(value);
    };

    useEffect(() => {
        dispatch(fetchDataStart());
    }, [dispatch]);

    useEffect(() => {
        setRows(combinedData);
    }, [combinedData]);

    const addonColumns: GridColDef<CombinedData>[] = Object.values(AddonFieldName).map(fieldName => ({
        field: fieldName,
        headerName: fieldName,
        width: 200,
        valueGetter: (_, row) => `${row.additionalInfo?.[fieldName] ?? '-'}`
    }))

    const columns: GridColDef<CombinedData>[] = useMemo(() => [
        {
            field: 'id',
            headerName: '#',
            width: 70
        },
        {
            field: 'operator',
            headerName: 'Користувач',
            width: 180,
            // There is no image loaded in avatar due to cloudflare access denied
            renderCell: (params) =>
                <Stack direction="row" alignItems="center" gap="4px">
                    <Avatar src={params.row.avatar} alt={params.row.name} />
                    <Typography>{params.row.name}</Typography>
                </Stack>,
        },
        {
            field: 'isWorking',
            headerName: 'Працює',
            width: 130,
            renderCell: (params) =>
                <Checkbox
                    checked={params.row.isWorking}
                    sx={{
                        '&.Mui-checked': {
                            color: pink[600],
                        },
                        cursor: 'unset'
                    }}
                />
        },
        {
            field: 'createdAt',
            headerName: 'Дата / Час створення',
            width: 130,
            type: 'dateTime',
            valueGetter: (value) => new Date(value)
        },
        ...addonColumns
    ], [addonColumns]);

    return (
        <Stack sx={{ height: "100vh" }} gap="35px">
            <Typography fontSize="34px">Оператори</Typography>
            <TextField
                label="Пошук"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={onSearchChange}
            />
            <DataGrid
                loading={loading}
                columns={columns}
                rows={rows}
                disableColumnMenu
                disableEval
                disableColumnFilter
                disableColumnSorting
                disableColumnSelector
                disableRowSelectionOnClick
                disableMultipleRowSelection
            />
        </Stack>
    );
};

export default App;

