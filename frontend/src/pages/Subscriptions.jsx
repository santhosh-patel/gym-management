import { useState, useEffect } from 'react';
import api from '../api';
import { Plus } from 'lucide-react';

export default function Subscriptions() {
    const [members, setMembers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [formData, setFormData] = useState({ member_id: '', plan_id: '', start_date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [membersRes, plansRes, subsRes] = await Promise.all([
                api.get('/members'),
                api.get('/plans'),
                api.get('/subscriptions')
            ]);
            setMembers(membersRes.data);
            setPlans(plansRes.data);
            setSubscriptions(subsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/subscriptions', {
                ...formData,
                member_id: parseInt(formData.member_id),
                plan_id: parseInt(formData.plan_id)
            });
            alert('Subscription created successfully!');
            setFormData({ member_id: '', plan_id: '', start_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || 'Error creating subscription');
        }
    };

    const getMemberName = (id) => members.find(m => m.id === id)?.name || id;
    const getPlanName = (id) => plans.find(p => p.id === id)?.name || id;

    return (
        <div>
            <div className="header">
                <h2>Subscriptions</h2>
            </div>

            <div className="grid">
                <div className="card">
                    <h3>Assign New Subscription</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Member</label>
                            <select
                                className="input"
                                value={formData.member_id}
                                onChange={e => setFormData({ ...formData, member_id: e.target.value })}
                                required
                            >
                                <option value="">-- Select Member --</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Plan</label>
                            <select
                                className="input"
                                value={formData.plan_id}
                                onChange={e => setFormData({ ...formData, plan_id: e.target.value })}
                                required
                            >
                                <option value="">-- Select Plan --</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - ${p.price} ({p.duration_days} days)</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.start_date}
                                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Assign Plan</button>
                    </form>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>Active Subscriptions</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Member</th>
                                <th>Plan</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map(sub => {
                                const isActive = new Date(sub.end_date) >= new Date();
                                return (
                                    <tr key={sub.id}>
                                        <td>{sub.id}</td>
                                        <td>{getMemberName(sub.member_id)}</td>
                                        <td>{getPlanName(sub.plan_id)}</td>
                                        <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                                        <td>{new Date(sub.end_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                                                {isActive ? 'Active' : 'Expired'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
