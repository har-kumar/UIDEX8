import React, { useEffect, useState } from 'react';
import './CrudComponent.css';

const CrudComponent = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/users');
        const users = await response.json();
        setData(users);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async () => {
        if (name.trim() === '') return;

        if (editingId) {
            // Update existing user
            const response = await fetch(`http://localhost:5000/users/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const updatedUser = await response.json();
            setData(data.map(user => (user._id === updatedUser._id ? updatedUser : user)));
            setEditingId(null);
        } else {
            // Add new user
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const newUser = await response.json();
            setData([...data, newUser]);
        }
        setName('');
    };

    const handleEdit = (user) => {
        setName(user.name);
        setEditingId(user._id);
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' });
        setData(data.filter(user => user._id !== id));
    };

    return (
        <div className="container">
            <h1>CRUD Application</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                />
                <button onClick={handleAdd}>{editingId ? 'Update' : 'Add'}</button>
            </div>

            <ul>
                {data.map((user) => (
                    <li key={user._id}>
                        {user.name}
                        <div className="button-container">
                            <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                            <button onClick={() => handleDelete(user._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CrudComponent;
