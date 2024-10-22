// src/components/AdminGigs.js
import React, { useState, useEffect } from 'react';

const AdminGigs = () => {
    const [newGig, setNewGig] = useState({
        client: '',
        event_type: '',
        date: '',
        time: '',
        duration: '',
        location: '',
        position: '',
        gender: '',
        pay: '',
        confirmed: '',
        staff_needed: '',
        claimed_by: '',
        backup_needed: '',
        backup_claimed_by: ''
    });

    const [users, setUsers] = useState([]); // State to store users
    const [gigs, setGigs] = useState([]); // State to store gigs

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://ready-bartending-gigs-portal.onrender.com'); // Adjust the URL as needed
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchGigs = async () => {
            try {
                const response = await fetch('http://localhost:3001/gigs'); // Adjust the URL as needed
                if (response.ok) {
                    const data = await response.json();
                    setGigs(data);
                } else {
                    console.error('Failed to fetch gigs');
                }
            } catch (error) {
                console.error('Error fetching gigs:', error);
            }
        };

        fetchUsers();
        fetchGigs(); // Fetch gigs on component mount
    }, []); // Empty dependency array means this runs once when the component mounts

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewGig((prevGig) => ({
            ...prevGig,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        console.log('Time Value:', newGig.time); // Log the time value being sent
    
        // Construct the gig data object from the current state
        const gigData = {
            client: newGig.client,
            event_type: newGig.event_type,
            date: newGig.date,
            time: newGig.time,
            duration: newGig.duration,
            location: newGig.location,
            position: newGig.position,
            gender: newGig.gender,
            pay: newGig.pay,
            confirmed: newGig.confirmed ? 'yes' : 'no',
            staff_needed: newGig.staff_needed,
            claimed_by: newGig.claimed_by ? [newGig.claimed_by] : [],
            backup_needed: newGig.backup_needed,
            backup_claimed_by: newGig.backup_claimed_by ? [newGig.backup_claimed_by] : []
        };
    
        console.log('Gig Data:', gigData); // Log the gig data being sent
    
        try {
            const response = await fetch('http://localhost:3001/gigs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gigData),
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Get the error message from the response
                throw new Error(`Failed to add gig. Status: ${response.status}, Message: ${errorText}`);
            }
    
            const newGigResponse = await response.json();
            // Update the gigs state with the new gig
            setGigs((prevGigs) => [...prevGigs, newGigResponse]);
            console.log('New gig added:', newGigResponse);
        } catch (error) {
            console.error('Error adding gig:', error);
        }
    };
    

    return (
        <div>
            <h1>Admin Gigs Page</h1>
            <form onSubmit={handleSubmit}>
                {/* Form fields go here, unchanged */}
                <label>
                    Client:
                    <input type="text" name="client" value={newGig.client} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Event Type:
                    <input type="text" name="event_type" value={newGig.event_type} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Date:
                    <input type="date" name="date" value={newGig.date} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Time:
                    <input type="time" name="time" value={newGig.time} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Duration:
                    <input type="number" name="duration" value={newGig.duration} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Location:
                    <input type="text" name="location" value={newGig.location} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Position:
                    <input type="text" name="position" value={newGig.position} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Gender:
                    <input type="text" name="gender" value={newGig.gender} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Pay:
                    <input type="number" name="pay" value={newGig.pay} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Confirmed: 
                    <select name="confirmed" value={newGig.confirmed} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>                
                </label>
                <br />
                <label>
                    Staff Needed: 
                    <input type="number" name="staff_needed" value={newGig.staff_needed} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Backup Needed: 
                    <input type="number" name="backup_needed" value={newGig.backup_needed} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Claimed By:
                    <select name="claimed_by" value={newGig.claimed_by} onChange={handleChange}>
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.username}>{user.username}</option> // Use appropriate user identifier
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Backup Claimed By:
                    <select name="backup_claimed_by" value={newGig.backup_claimed_by} onChange={handleChange}>
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.username}>{user.username}</option> // Use appropriate user identifier
                        ))}
                    </select>
                </label>
                <br />
                <label></label>
                <button type="submit">Add New Gig</button>
            </form>

            <h2>Current Gigs</h2>
            <ul>
                {gigs.map((gig) => (
                    <li key={gig.id}>
                        {gig.client} - {gig.event_type} on {gig.date} at {gig.time} (Staff Needed: {gig.staff_needed}) 
                        {gig.claimed_by && gig.claimed_by.length > 0 ? ` | Claimed By: ${gig.claimed_by.join(', ')}` : ' | Not Claimed'}
                        {gig.backup_claimed_by && gig.backup_claimed_by.length > 0 ? ` | Backup Claimed By: ${gig.backup_claimed_by.join(', ')}` : ''} {/* Add this line */}
                    </li>
                ))}
            </ul>


            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username} ({user.email})</li> // Adjust based on your user data structure
                ))}
            </ul>
        </div>
    );
};

export default AdminGigs;
