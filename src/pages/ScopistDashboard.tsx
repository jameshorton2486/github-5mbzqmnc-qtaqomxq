import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText,
  Edit3,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  History,
  BookOpen,
  MessageSquare,
  BarChart,
  Calendar,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transcription = Database['public']['Tables']['transcriptions']['Row'];

export function ScopistDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [stats, setStats] = useState({
    assignedTranscripts: 0,
    completedToday: 0,
    inProgress: 0,
    averageAccuracy: 0
  });

  // Simulated data for active projects
  const activeProjects = [
    {
      id: 1,
      case: "Johnson vs. Smith Corp",
      status: "In Progress",
      deadline: "2025-03-15T16:00:00",
      progress: 65,
      priority: "High",
      pages: 120,
      assignedBy: "Sarah Wilson"
    },
    {
      id: 2,
      case: "Williams Estate Hearing",
      status: "Review",
      deadline: "2025-03-16T14:00:00",
      progress: 90,
      priority: "Medium",
      pages: 85,
      assignedBy: "Michael Chen"
    },
    {
      id: 3,
      case: "Tech Solutions LLC Dispute",
      status: "QA Check",
      deadline: "2025-03-18T17:00:00",
      progress: 95,
      priority: "Low",
      pages: 150,
      assignedBy: "Jessica Brown"
    }
  ];

  // Simulated reference materials
  const referenceMaterials = [
    {
      id: 1,
      title: "Medical Terminology Guide",
      category: "Reference",
      lastAccessed: "2025-03-10T09:00:00"
    },
    {
      id: 2,
      title: "Legal Dictionary",
      category: "Dictionary",
      lastAccessed: "2025-03-11T14:30:00"
    },
    {
      id: 3,
      title: "Style Guide v2.1",
      category: "Guidelines",
      lastAccessed: "2025-03-12T11:15:00"
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const { data: transcriptionData, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTranscriptions(transcriptionData || []);

      // Simulated statistics
      setStats({
        assignedTranscripts: 15,
        completedToday: 3,
        inProgress: 4,
        averageAccuracy: 98.5
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

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
            <h1 className="text-3xl font-bold text-white">Scopist Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Assigned Transcripts</p>
                <p className="text-2xl font-bold text-white">{stats.assignedTranscripts}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Today</p>
                <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Accuracy</p>
                <p className="text-2xl font-bold text-white">{stats.averageAccuracy}%</p>
              </div>
              <BarChart className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Active Projects</h2>
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
                {activeProjects.map((project) => (
                  <div key={project.id} className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{project.case}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Clock className="h-4 w-4" />
                          Due: {new Date(project.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Users className="h-4 w-4" />
                          Assigned by: {project.assignedBy}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          project.priority === 'High' ? 'bg-red-900/50 text-red-400' :
                          project.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-green-900/50 text-green-400'
                        }`}>
                          {project.priority}
                        </span>
                        <span className="text-sm text-gray-400">{project.pages} pages</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">{project.progress}% Complete</span>
                        <span className="text-sm text-purple-400">{project.status}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reference Materials & Resources */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Access Tools */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Access</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <Edit3 className="h-6 w-6 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-300">Editor</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <History className="h-6 w-6 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-300">History</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <BookOpen className="h-6 w-6 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-300">References</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <MessageSquare className="h-6 w-6 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-300">Chat</span>
                </button>
              </div>
            </div>

            {/* Reference Materials */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Reference Materials</h2>
              <div className="space-y-4">
                {referenceMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{material.title}</p>
                      <p className="text-sm text-gray-400">{material.category}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}