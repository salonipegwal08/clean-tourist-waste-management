import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Trash2, 
  Users, 
  Award, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  MapPin, 
  LayoutDashboard 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import AnimatedCounter from '../components/AnimatedCounter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const stats = [
    { label: 'Total Reports', value: '482', change: '+12%', icon: <Trash2 className="text-red-500" />, positive: true },
    { label: 'Cleaned Areas', value: '315', change: '+18%', icon: <ShieldCheck className="text-green-500" />, positive: true },
    { label: 'Active Volunteers', value: '1,240', change: '+5%', icon: <Users className="text-primary-500" />, positive: true },
    { label: 'Avg. Cleanliness', value: '8.4', change: '-2%', icon: <TrendingUp className="text-secondary-500" />, positive: false },
  ];

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Reports Filed',
        data: [65, 59, 80, 81, 56, 95],
        backgroundColor: '#22c55e',
        borderRadius: 8,
      },
      {
        label: 'Reports Resolved',
        data: [45, 48, 62, 70, 48, 82],
        backgroundColor: '#0ea5e9',
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Cleanliness Trend',
        data: [7.8, 8.2, 8.0, 8.4],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['Public Dustbins', 'Recycling Points', 'Collection Centers'],
    datasets: [
      {
        data: [450, 280, 120],
        backgroundColor: ['#22c55e', '#0ea5e9', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-4"
            >
              Cleanliness <span className="gradient-text">Dashboard</span>
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400">
              Real-time analytics and impact reports of our smart waste management system.
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 dark:shadow-none transition-all">
              Live Data
            </button>
            <button className="px-6 py-2 text-gray-500 hover:text-primary-600 font-bold text-sm transition-colors">
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-[2rem] border border-white/20 dark:bg-gray-900/80 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${stat.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-poppins mb-1">
                <AnimatedCounter value={stat.value} />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] border border-white/20 dark:bg-gray-900/80 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-poppins flex items-center space-x-2">
                <BarChart3 className="text-primary-600" size={20} />
                <span>Reports Overview</span>
              </h3>
            </div>
            <div className="h-[300px]">
              <Bar 
                data={barData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, border: { display: false } }, x: { grid: { display: false }, border: { display: false } } }
                }} 
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] border border-white/20 dark:bg-gray-900/80 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-poppins flex items-center space-x-2">
                <TrendingUp className="text-primary-600" size={20} />
                <span>Cleanliness Trends</span>
              </h3>
            </div>
            <div className="h-[300px]">
              <Line 
                data={lineData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { border: { display: false } }, x: { grid: { display: false }, border: { display: false } } }
                }} 
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 glass p-8 rounded-[2.5rem] border border-white/20 dark:bg-gray-900/80 shadow-sm"
          >
            <h3 className="text-xl font-bold font-poppins mb-8">Infrastructure</h3>
            <div className="h-[250px] mb-8">
              <Doughnut 
                data={doughnutData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
                }} 
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/20 dark:bg-gray-900/80 shadow-sm"
          >
            <h3 className="text-xl font-bold font-poppins mb-8 flex items-center space-x-2">
              <Calendar className="text-primary-600" size={20} />
              <span>Upcoming Cleanup Drives</span>
            </h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl text-center min-w-[80px] shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary-200">March</p>
                      <p className="text-2xl font-bold">{12 + i}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary-600 transition-colors">Coastal Cleanup Drive 2026</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <MapPin size={14} className="mr-1" /> Marine Drive, Mumbai
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">42 Volunteers</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
