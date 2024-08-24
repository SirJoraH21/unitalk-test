import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddonFieldName, CombinedData, fetchDataStart } from './store/dataSlice';
import { RootState } from './store/store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar, Checkbox, Stack, Typography } from '@mui/material';
import { pink } from '@mui/material/colors';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { combinedData, loading, error } = useSelector((state: RootState) => state.data);

    useEffect(() => {
        dispatch(fetchDataStart());
    }, [dispatch]);

    const addonColumns: GridColDef<CombinedData>[] = Object.values(AddonFieldName).map(fieldName => ({
        field: fieldName,
        headerName: fieldName,
        width: 200,
        valueGetter: (_, row) => `${row.additionalInfo?.[fieldName] ?? '-'}`
    }))


    const columns: GridColDef<CombinedData>[] = useMemo(() => [
        { field: 'id', headerName: '#', width: 70 },
        {
            field: 'operator', headerName: 'Користувач', width: 180,
            // There is no image loaded in avatar due to cloudflare access denied
            renderCell: (params) =>
                <Stack direction="row" alignItems="center" gap="4px">
                    <Avatar src={params.row.avatar} alt={params.row.name} />
                    <Typography>{params.row.name}</Typography>
                </Stack>,
        },
        {
            field: 'isWorking', type: 'boolean', headerName: 'Працює', width: 130,
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
        { field: 'createdAt', type: 'string', headerName: 'Дата / Час створення', width: 130 },
        // Add dynamic fields
        ...addonColumns
    ], [addonColumns]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Stack sx={{ height: "100vh" }}>
            <Typography fontSize="34px">Оператори</Typography>
            <DataGrid
                columns={columns}
                rows={combinedData}
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

