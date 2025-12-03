import React, {useState} from 'react';
import { useAuth } from '../context/AuthContext';
import {Eye, EyeOff, Mail, Lock, User, Phone} from 'lucide-react';

const RegisterForm = ({onToggleMode}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {register} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(formData);

        if (!result.success) {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border-white/20">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl font-bold text-primary">₿</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/80">Join us today</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5"/>
                            <input 
                                type="text" 
                                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                                />
                        </div>
                        <div className="relative">
                            <input 
                                type="text"
                                className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required 
                                />
                        </div>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5"/>
                        <input 
                            type="text"
                            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                            placeholder="Enter your email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input 
                            type="tel"
                            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-5 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all" 
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            required
                            />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5"/>
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                             />
                             <button 
                                type="button"
                                className="absolute right-4 top-1/2 transoform -translate-y-1/2 text-white/60 hobver:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                             </button>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-primary py-4 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transofrm hover:-translate-y-0.5"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/80">
                        Already have an account?{' '}
                        <button 
                            onClick={onToggleMode}
                            className="text-white font-semibold hover:underline focus:outline-none">
                                Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;