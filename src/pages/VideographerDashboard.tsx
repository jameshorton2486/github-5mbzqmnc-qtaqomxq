import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video,
  Camera,
  Mic,
  HardDrive,
  Battery,
  Wifi,
  Calendar,
  Clock,
  BarChart,
  Plus,
  Settings,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Cog,
  Share2,
  Maximize2,
  Play,
  Pause,
  Square,
  RefreshCw,
  Signal,
  MonitorSpeaker,
  Sun,
  Volume2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transcription = Database['public']['Tables']['transcriptions']['Row'];

export function VideographerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentRecordings, setRecentRecordings] = useState<Transcription[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stats, setStats] = useState({
    totalRecordings: 0,
    storageUsed: 0,
    upcomingRecordings: 0,
    hoursRecorded: 0
  });

  // Equipment status simulation
  const equipmentStatus = {
    mainCamera: { 
      status: 'good', 
      battery: 85,
      model: 'Sony FX6',
      settings: {
        resolution: '4K',
        frameRate: '60fps',
        codec: 'ProRes 422'
      }
    },
    backupCamera: { 
      status: 'good', 
      battery: 95,
      model: 'Sony FX3',
      settings: {
        resolution: '4K',
        frameRate: '30fps',
        codec: 'H.264'
      }
    },
    microphones: { 
      status: 'good', 
      battery: 90,
      levels: [-18, -20, -15, -22], // dB levels
      devices: [
        { name: 'Lavalier 1', status: 'active' },
        { name: 'Lavalier 2', status: 'active' },
        { name: 'Room Mic', status: 'active' }
      ]
    },
    storage: { 
      used: 1.2, 
      total: 4,
      devices: [
        { name: 'SSD 1', space: '1.2/2TB', health: 'good' },
        { name: 'SSD 2', space: '0.8/2TB', health: 'good' }
      ]
    },
    network: { 
      status: 'good', 
      speed: '150 Mbps',
      latency: '15ms',
      backup: 'Available'
    },
    lighting: {
      main: { status: 'on', brightness: 80 },
      fill: { status: 'on', brightness: 60 },
      back: { status: 'on', brightness: 40 }
    }
  };

  const upcomingRecordings = [
    {
      id: 1,
      case: "Johnson vs. Smith Corp",
      date: "2025-03-15T10:00:00",
      location: "Remote",
      duration: "3 hours",
      status: "Confirmed",
      requirements: {
        multiCamera: true,
        backup: true,
        streaming: true
      }
    },
    {
      id: 2,
      case: "Williams Estate Hearing",
      date: "2025-03-16T14:30:00",
      location: "Courtroom 3B",
      duration: "4 hours",
      status: "Pending",
      requirements: {
        multiCamera: false,
        backup: true,
        streaming: false
      }
    },
    {
      id: 3,
      case: "Tech Solutions LLC Dispute",
      date: "2025-03-18T09:00:00",
      location: "Conference Room A",
      duration: "6 hours",
      status: "Confirmed",
      requirements: {
        multiCamera: true,
        backup: true,
        streaming: true
      }
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  async function fetchDashboardData() {
    try {
      const { data: recordings, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentRecordings(recordings || []);

      setStats({
        totalRecordings: 248,
        storageUsed: 1.2,
        upcomingRecordings: 12,
        hoursRecorded: 756
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
            <h1 className="text-3xl font-bold text-white">Videographer Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {isRecording ? (
                <>
                  <Square className="h-5 w-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Recording
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-red-400 font-medium">Recording in Progress</span>
              </div>
              <div className="text-red-400 font-mono">{formatTime(recordingTime)}</div>
            </div>
          </div>
        )}

        {/* Equipment Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Equipment Status</h2>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Sliders className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Camera */}
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Camera className="h-5 w-5 text-purple-500 mr-2" />
                  <div>
                    <span className="text-white block">Main Camera</span>
                    <span className="text-sm text-gray-400">{equipmentStatus.mainCamera.model}</span>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resolution</span>
                  <span className="text-white">{equipmentStatus.mainCamera.settings.resolution}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frame Rate</span>
                  <span className="text-white">{equipmentStatus.mainCamera.settings.frameRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Codec</span>
                  <span className="text-white">{equipmentStatus.mainCamera.settings.codec}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Battery</span>
                    <span className="text-white">{equipmentStatus.mainCamera.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${equipmentStatus.mainCamera.battery}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio System */}
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MonitorSpeaker className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-white">Audio System</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-3">
                {equipmentStatus.microphones.devices.map((device, index) => (
                  <div key={device.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{device.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-4 rounded-sm ${
                              i <= Math.abs(equipmentStatus.microphones.levels[index] / 10)
                                ? 'bg-green-500'
                                : 'bg-gray-700'
                            }`}
                            style={{
                              height: `${(i + 1) * 4}px`
                            }}
                          ></div>
                        ))}
                      </div>
                      <Volume2 className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage System */}
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <HardDrive className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-white">Storage System</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-3">
                {equipmentStatus.storage.devices.map((device) => (
                  <div key={device.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{device.name}</span>
                      <span className="text-white">{device.space}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(parseInt(device.space) / 2) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Signal className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-white">Network Status</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Speed</span>
                  <span className="text-white">{equipmentStatus.network.speed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Latency</span>
                  <span className="text-white">{equipmentStatus.network.latency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Backup</span>
                  <span className="text-green-400">{equipmentStatus.network.backup}</span>
                </div>
              </div>
            </div>

            {/* Lighting Control */}
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Sun className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-white">Lighting Control</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-3">
                {Object.entries(equipmentStatus.lighting).map(([key, light]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="text-white">{light.brightness}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${light.brightness}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Cog className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-white">System Health</span>
                </div>
                <RefreshCw className="h-5 w-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400 block">CPU</span>
                  <span className="text-lg text-white">32%</span>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400 block">Memory</span>
                  <span className="text-lg text-white">45%</span>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400 block">Temp</span>
                  <span className="text-lg text-white">42°C</span>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400 block">Fan</span>
                  <span className="text-lg text-white">1200</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Recordings</p>
                <p className="text-2xl font-bold text-white">{stats.totalRecordings}</p>
              </div>
              <Video className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">{stats.storageUsed}TB</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-white">{stats.upcomingRecordings}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Hours Recorded</p>
                <p className="text-2xl font-bold text-white">{stats.hoursRecorded}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Recordings */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Upcoming Recordings</h2>
              <div className="space-y-4">
                {upcomingRecordings.map((recording) => (
                  <div key={recording.id} className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{recording.case}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(recording.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Clock className="h-4 w-4" />
                          {recording.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Share2 className="h-4 w-4" />
                          {recording.location}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          recording.status === 'Confirmed' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {recording.status}
                        </span>
                        <div className="flex gap-2">
                          {recording.requirements.multiCamera && (
                            <span className="px-2 py-1 bg-purple-900/50 text-purple-400 text-xs rounded">
                              Multi-Cam
                            </span>
                          )}
                          {recording.requirements.streaming && (
                            <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded">
                              Streaming
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Recordings */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Recordings</h2>
              <div className="space-y-4">
                {recentRecordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="p-2 bg-purple-900/50 rounded-lg">
                      <Video className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {recording.file_name || 'Untitled Recording'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(recording.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-gray-400 hover:text-purple-500 transition-colors">
                        <Upload className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-500 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-500 transition-colors">
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
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