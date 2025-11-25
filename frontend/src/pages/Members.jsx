import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Search } from 'lucide-react';

export default function Members() {
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/members');
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/members', formData);
            setFormData({ name: '', phone: '' });
            setShowForm(false);
            fetchMembers();
        } catch (err) {
            alert(err.response?.data?.detail || 'Error creating member');
        }
    };

    return (
        <div>
            <div className="header">
                <h2>Members</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Add Member
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>New Member</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid">
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Member</button>
                    </form>
                </div>
            )}

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Total Check-ins</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.name}</td>
                                <td>{member.phone}</td>
                                <td>
                                    <span className={`badge badge-${member.status}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td>{member.total_check_ins}</td>
                                <td>{new Date(member.join_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
