import React, { useState, useEffect } from 'react';

const UserGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username'); // Fetch the username from localStorage

    // Fetch gigs on component mount
    useEffect(() => {
        fetchGigs();
    }, []);

    // Fetch gigs from the server
    const fetchGigs = async () => {
        try {
            const response = await fetch('https://ready-bartending-gigs-portal.onrender.com/gigs');
            if (!response.ok) {
                throw new Error('Failed to fetch gigs');
            }
            const data = await response.json();
            setGigs(data);
        } catch (error) {
            console.error('Error fetching gigs:', error);
            setError('Failed to fetch gigs.');
        }
    };

    // Claim or unclaim a regular gig
    const toggleClaimGig = async (gigId, isClaimed) => {
        const action = isClaimed ? 'unclaim' : 'claim'; // Determine action based on current state

        try {
            const response = await fetch(`https://ready-bartending-gigs-portal.onrender.com/gigs/${gigId}/${action}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }), // Correctly send username
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const updatedGig = await response.json();
            console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}ed gig successfully:`, updatedGig);
            fetchGigs(); // Refresh gigs list after claiming or unclaiming
        } catch (error) {
            console.error(`Error ${action}ing gig:`, error.message);
            setError(`Failed to ${action} gig.`);
        }
    };

    // Claim or unclaim a backup gig
    const toggleClaimBackup = async (gigId, isBackupClaimed) => {
        const action = isBackupClaimed ? 'unclaim-backup' : 'claim-backup'; // Correctly use action

        try {
            const response = await fetch(`https://ready-bartending-gigs-portal.onrender.com/gigs/${gigId}/${action}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }), // Correctly send username
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const updatedGig = await response.json();
            console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}ed backup gig successfully:`, updatedGig);
            fetchGigs(); // Refresh gigs list after claiming or unclaiming
        } catch (error) {
            console.error(`Error ${action}ing backup gig:`, error.message);
            setError(`Failed to ${action} backup gig.`);
        }
    };

    // Render the gig list
    return (
        <div className="user-gigs-container">
            <h2>Available Gigs</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {gigs.map((gig) => {
                    console.log('Gig Date:', gig.date); // Log the date to check its format
                    
                    // Format the date using string parsing with 'T00:00:00' appended
                    const formattedDate = new Date(gig.date + 'T00:00:00').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', // Full month name
                        day: 'numeric', // Day of the month
                    });

                    return (
                        <li key={gig.id} className="gig-card">
                            <h3 className="gig-title">{gig.client}</h3>
                            <p className="gig-info">Position: {gig.position}</p>
                            <p className="gig-info">Event Type: {gig.event_type}</p>
                            <p className="gig-info">Date: {formattedDate}</p> {/* Use formatted date */}
                            <p className="gig-info">Time: {gig.time}</p>
                            <p className="gig-info">Location: {gig.location}</p>
                            <p className="gig-info">Need Certificate: {gig.needs_cert ? 'Yes' : 'No'}</p>
                            <p className="gig-info">Staff Needed: {gig.staff_needed}</p>
                            <p className="gig-info">Claimed Users: {gig.claimed_usernames?.join(', ') || 'None'}</p>
                            <p className="gig-info">Backup Staff Needed: {gig.backup_needed}</p>
                            <p className="gig-info">Backup Claimed: {gig.backup_claimed_by?.join(', ') || 'None'}</p>
                            
                            <button
                                className="claim-button"
                                onClick={() => toggleClaimGig(gig.id, isClaimed)}
                            >
                                {isClaimed ? 'Unclaim Gig' : 'Claim Gig'}
                            </button>
                            
                            <button
                                className="backup-button"
                                onClick={() => toggleClaimBackup(gig.id, isBackupClaimed)}
                            >
                                {isBackupClaimed ? 'Unclaim Backup Gig' : 'Claim Backup Gig'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserGigs;
