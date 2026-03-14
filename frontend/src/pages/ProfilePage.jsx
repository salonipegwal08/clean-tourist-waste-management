import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Trash2, MapPin, Calendar, LogOut, ShieldCheck, Leaf, Globe, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const { data } = await api.get('/reports/my');
        setMyReports(data);
      } catch (error) {
        console.error("Error fetching my reports", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyReports();
  }, [user]);

  const badges = [
    { name: 'Eco Warrior', icon: <Leaf size={24} className="text-green-600" />, points: 100 },
    { name: 'Clean Reporter', icon: <Trash2 size={24} className="text-primary-600" />, points: 50 },
    { name: 'Green Tourist', icon: <Globe size={24} className="text-blue-600" />, points: 200 },
    { name: 'Verified Helper', icon: <ShieldCheck size={24} className="text-yellow-600" />, points: 300 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Profile Section */}
        <div className="glass dark:bg-gray-900/80 p-10 rounded-[3rem] border border-white/20 dark:border-gray-800 shadow-xl mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 dark:bg-primary-900/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100/30 dark:bg-secondary-900/20 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-600 p-1 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-5xl font-bold font-poppins gradient-text">
                  {user.name[0]}
                </div>
              </div>
              <div className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer">
                <Settings size={20} className="text-gray-500" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-2">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center md:justify-start">
                  <Globe size={16} className="mr-2" /> Eco-Conscious Traveler since 2026
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1">Eco Points</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{user.points}</p>
                </div>
                <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-2xl border border-secondary-100 dark:border-secondary-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-600 mb-1">Badges Earned</p>
                  <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">{user.badges.length}</p>
                </div>
                <div className="p-4 bg-earth-50 dark:bg-earth-900/20 rounded-2xl border border-earth-100 dark:border-earth-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-earth-600 mb-1">Reports Filed</p>
                  <p className="text-2xl font-bold text-earth-700 dark:text-earth-300">{myReports.length}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Events Joined</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">4</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={logout}
                className="px-8 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center space-x-2 border border-red-100 dark:border-red-900/40"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Badges Section */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h2 className="text-2xl font-bold font-poppins mb-8 flex items-center space-x-2">
                <Award className="text-primary-600" size={24} />
                <span>Achievements</span>
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {badges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center text-center space-y-4 ${
                      user.badges.includes(badge.name)
                        ? 'bg-white dark:bg-gray-800 border-primary-500 shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-40 grayscale'
                    }`}
                  >
                    <div className={`p-4 rounded-full ${user.badges.includes(badge.name) ? 'bg-primary-50 dark:bg-primary-900/30' : 'bg-gray-200 dark:bg-gray-800'}`}>
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {user.badges.includes(badge.name) ? 'Unlocked' : `${badge.points} Points Needed`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/20 dark:bg-gray-900/80">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <TrendingUp className="text-primary-600" size={20} />
                <span>Next Milestone</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-500">Eco Expert</span>
                  <span className="text-primary-600">{user.points}/500</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.points / 500) * 100}%` }}
                    className="h-full bg-primary-600"
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium">Earn 150 more points to unlock the "Eco Expert" badge!</p>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-poppins mb-8 flex items-center space-x-2">
              <Trash2 className="text-primary-600" size={24} />
              <span>My Reports</span>
            </h2>
            
            <div className="space-y-6">
              {myReports.length === 0 ? (
                <div className="py-20 text-center glass rounded-[3rem] border border-white/20 dark:bg-gray-900/80">
                  <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <Trash2 size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No reports yet</h3>
                  <p className="text-gray-500">Your contributions will appear here.</p>
                </div>
              ) : (
                myReports.map((report, idx) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass dark:bg-gray-900/80 rounded-[2rem] border border-white/20 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row group"
                  >
                    <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                      <img
                        src={report.photo}
                        alt="Garbage report"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          report.status === 'Cleaned' 
                            ? 'bg-green-100 text-green-600' 
                            : report.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {report.status}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">
                        {report.description}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <p className="flex items-center"><MapPin size={12} className="mr-1" /> {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</p>
                        <p className="flex items-center font-bold text-primary-600"><Award size={12} className="mr-1" /> +10 Points Earned</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
