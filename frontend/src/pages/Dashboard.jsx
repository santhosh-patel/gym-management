import { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleCheckIn = async (e) => {
        e.preventDefault();
        if (!selectedMember) return;

        setLoading(true);
        setMessage(null);
        try {
            await api.post('/attendance/check-in', { member_id: parseInt(selectedMember) });
            setMessage({ type: 'success', text: 'Check-in successful!' });
            // Refresh members to update check-in count if we were displaying it
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Check-in failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2>Quick Check-In</h2>
                <form onSubmit={handleCheckIn}>
                    <div className="form-group">
                        <label className="form-label">Select Member</label>
                        <select
                            className="input"
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            required
                        >
                            <option value="">-- Select Member --</option>
                            {members.map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Check In'}
                    </button>
                </form>

                {message && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        borderRadius: '8px',
                        background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
