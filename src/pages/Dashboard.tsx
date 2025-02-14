import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Video, 
  Users, 
  Clock, 
  BarChart, 
  Folder,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transcription = Database['public']['Tables']['transcriptions']['Row'];

export function Dashboard() {
  const { user } = useAuth();
  const [recentTranscriptions, setRecentTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDepositions: 0,
    upcomingDepositions: 0,
    pendingReviews: 0,
    hoursThisMonth: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch recent transcriptions
      const { data: transcriptions, error: transcriptionsError } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (transcriptionsError) throw transcriptionsError;
      setRecentTranscriptions(transcriptions || []);

      // In a real app, these would be actual API calls
      setStats({
        totalDepositions: 156,
        upcomingDepositions: 8,
        pendingReviews: 3,
        hoursThisMonth: 42
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const upcomingDepositions = [
    {
      id: 1,
      case: "Johnson vs. Smith Corp",
      date: "2025-03-15T10:00:00",
      type: "Remote",
      participants: 5
    },
    {
      id: 2,
      case: "Williams Estate Hearing",
      date: "2025-03-16T14:30:00",
      type: "In-Person",
      participants: 3
    },
    {
      id: 3,
      case: "Tech Solutions LLC Dispute",
      date: "2025-03-18T09:00:00",
      type: "Hybrid",
      participants: 7
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Attorney Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              New Deposition
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Depositions</p>
                <p className="text-2xl font-bold text-white">{stats.totalDepositions}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Depositions</p>
                <p className="text-2xl font-bold text-white">{stats.upcomingDepositions}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold text-white">{stats.pendingReviews}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Hours This Month</p>
                <p className="text-2xl font-bold text-white">{stats.hoursThisMonth}</p>
              </div>
              <BarChart className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Depositions */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Upcoming Depositions</h2>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {upcomingDepositions.map((depo) => (
                  <div key={depo.id} className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-white">{depo.case}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(depo.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-purple-500 mr-2" />
                          <span className="text-gray-400">{depo.participants}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          depo.type === 'Remote' ? 'bg-green-900/50 text-green-400' :
                          depo.type === 'In-Person' ? 'bg-blue-900/50 text-blue-400' :
                          'bg-purple-900/50 text-purple-400'
                        }`}>
                          {depo.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/calendar"
                  className="text-purple-500 hover:text-purple-400 text-sm font-medium"
                >
                  View Full Calendar
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentTranscriptions.map((transcription) => (
                  <div
                    key={transcription.id}
                    className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="p-2 bg-purple-900/50 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {transcription.file_name || 'Untitled Transcription'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(transcription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/history"
                  className="text-purple-500 hover:text-purple-400 text-sm font-medium"
                >
                  View All Activity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}