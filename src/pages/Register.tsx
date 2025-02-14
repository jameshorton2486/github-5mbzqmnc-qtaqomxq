import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const professionalRoles = [
  'Attorney',
  'Court Reporter',
  'Videographer',
  'Scopist',
  'Legal Assistant',
  'Paralegal',
  'Other'
];

export function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(formData.email, formData.password);
      // After successful signup, you can store additional user data in Supabase
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-2">Join Depo-Pro and transform your deposition workflow</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Professional Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Professional Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select your role</option>
                  {professionalRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-500 hover:text-purple-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}