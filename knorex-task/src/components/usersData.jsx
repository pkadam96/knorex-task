import { useState, useEffect } from 'react';

const UsersData = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSignUpSuccessOpen, setIsSignUpSuccessOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://knorex-task.onrender.com/users'); 
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleDelete = async () => {
        try {
            await fetch(`https://knorex-task.onrender.com/users/${userToDelete}`, {
                method: 'DELETE',
            }); 
            setUsers(users.filter(user => user._id !== userToDelete));
            setIsDeleteConfirmationOpen(false);
            alert("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (newUser.password !== newUser.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await fetch('https://knorex-task.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            }); 

            setIsModalOpen(false);
            setNewUser({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            setIsSignUpSuccessOpen(true);

            const response = await fetch('https://knorex-task.onrender.com/users'); 
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error("Error signing up user:", error);
        }
    };

    const handleExport = () => {
        console.log("Exporting users:", selectedUsers);
    };

    return (
        <div className="container">
            <div className="button-container">
                <button 
                    onClick={handleExport} 
                    disabled={selectedUsers.length === 0}
                >
                    Export
                </button>
                <button onClick={() => setIsModalOpen(true)}>Sign Up</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => handleCheckboxChange(user._id)}
                                />
                            </td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button 
                                    className='deleteBtn'
                                    onClick={() => {
                                        setUserToDelete(user._id);
                                        setIsDeleteConfirmationOpen(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Sign Up</h2>
                        <form onSubmit={handleSignUpSubmit}>
                            <div>
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        value={newUser.first_name}
                                        onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        value={newUser.last_name}
                                        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Confirm Password:
                                    <input
                                        type="password"
                                        value={newUser.confirmPassword}
                                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                        required
                                    />
                                </label>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">Submit</button>
                                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteConfirmationOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Are you sure? You want to delete?</h2>
                        <div className="modal-buttons">
                            <button className="ok" onClick={handleDelete}>Yes</button>
                            <button className="cancel" onClick={() => setIsDeleteConfirmationOpen(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {isSignUpSuccessOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Sign Up Successful</h2>
                        <button className="ok" onClick={() => setIsSignUpSuccessOpen(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { UsersData };
