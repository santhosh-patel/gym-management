import { useState, useEffect } from 'react';
import api from '../api';
import { Plus } from 'lucide-react';

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', duration_days: '' });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/plans');
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plans', formData);
            setFormData({ name: '', price: '', duration_days: '' });
            setShowForm(false);
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.detail || 'Error creating plan');
        }
    };

    return (
        <div>
            <div className="header">
                <h2>Membership Plans</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Add Plan
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>New Plan</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid">
                            <div className="form-group">
                                <label className="form-label">Plan Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Duration (Days)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.duration_days}
                                    onChange={e => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Plan</button>
                    </form>
                </div>
            )}

            <div className="grid">
                {plans.map(plan => (
                    <div key={plan.id} className="card">
                        <h3>{plan.name}</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '1rem 0' }}>
                            ₹{plan.price}
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Duration: {plan.duration_days} days</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
