// src/components/AdminGigs.js
import React, { useState, useEffect } from 'react';

const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hoursIn12 = hours % 12 || 12; // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    return `${hoursIn12}:${minutes} ${ampm}`; // Format as "HH:MM AM/PM"
};

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
        needs_cert: '',
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
                const response = await fetch('https://ready-bartending-gigs-portal.onrender.com/users'); // Adjust the URL as needed
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
                const response = await fetch('https://ready-bartending-gigs-portal.onrender.com/gigs'); // Adjust the URL as needed
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
            needs_cert: newGig.needs_cert ? 'yes' : 'no',
            confirmed: newGig.confirmed ? 'yes' : 'no',
            staff_needed: newGig.staff_needed,
            claimed_by: newGig.claimed_by ? [newGig.claimed_by] : [],
            backup_needed: newGig.backup_needed,
            backup_claimed_by: newGig.backup_claimed_by ? [newGig.backup_claimed_by] : []
        };
    
        console.log('Gig Data:', gigData); // Log the gig data being sent
    
        try {
            const response = await fetch('https://ready-bartending-gigs-portal.onrender.com/gigs', {
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
                Need Certification: 
                    <select name="needs_cert" value={newGig.needs_cert} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>                
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
                <button type="submit">Add New Gig</button>
            </form>

            <h2>Current Gigs</h2>
            <ul>
                {gigs.map((gig) => {
                    // Format the date to remove the time portion
                    const formattedDate = new Date(gig.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', // Full month name
                        day: 'numeric', // Day of the month
                    });

                    const formattedTime = formatTime(gig.time);

                    return (
                        <li key={gig.id} className="gig-card">
                            <h3 className="gig-title">{gig.client}</h3>
                            <p className="gig-info">Position: {gig.position}</p>
                            <p className="gig-info">Event Type: {gig.event_type}</p>
                            <p className="gig-info">Date: {formattedDate}</p> {/* Use the formatted date */}
                            <p className="gig-info">Time: {formattedTime}</p>
                            <p className="gig-info">Duration: {gig.duration}</p>
                            <p className="gig-info">Location: {gig.location}</p>
                            <p className="gig-info">Pay: {gig.pay}</p>
                            <p className="gig-info">Need Certificate: {gig.needs_cert}</p>
                            <p className="gig-info">Staff Needed: {gig.staff_needed}</p>
                            <p className="gig-info">Claimed Users: {gig.claimed_by.join(', ')}</p> {/* Display claimed users */}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AdminGigs;
