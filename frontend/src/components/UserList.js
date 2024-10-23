import React, { useEffect, useState } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);

    // Fetch the list of users from the backend
    useEffect(() => {
        fetch('https:ready-bartending-gigs-portal.onrender.com') // Change this to 3001
            .then(response => response.json())
            .then(data => {
                console.log('Fetched users:', data); // Debugging log
                setUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);
     // Empty array means this runs once after the component mounts

    return (
        <div>
            <h2>Registered Users</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            {user.name} - {user.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default UserList;
