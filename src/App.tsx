import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataStart } from './store/dataSlice';
import { RootState } from './store/store';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { combinedData, loading, error } = useSelector((state: RootState) => state.data);

    useEffect(() => {
        dispatch(fetchDataStart());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Data Table</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Additional Info</th>
                    </tr>
                </thead>
                <tbody>
                    {combinedData.map((data) => (
                        <tr key={data.id}>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{JSON.stringify(data.additionalInfo)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;

