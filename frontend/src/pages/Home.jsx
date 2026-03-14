import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, MapPin, Award, Users, ArrowRight, ShieldCheck, Leaf, Globe } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const Home = () => {
  const stats = [
    { label: 'Tourist Places Cleaned', value: '1,200+', icon: <Leaf className="text-primary-600" /> },
    { label: 'Active Volunteers', value: '5,000+', icon: <Users className="text-secondary-600" /> },
    { label: 'Dustbins Located', value: '2,500+', icon: <MapPin className="text-earth-600" /> },
    { label: 'Eco-Points Awarded', value: '150K+', icon: <Award className="text-yellow-500" /> },
  ];

  const features = [
    {
      title: 'Find Nearby Bins',
      description: 'Use our interactive map to find the nearest public dustbins and recycling points in real-time.',
      icon: <MapPin className="text-primary-600" size={32} />,
      link: '/map'
    },
    {
      title: 'Report Garbage',
      description: 'Spot garbage at a tourist place? Take a photo, report it, and help local authorities clean it up.',
      icon: <Trash2 className="text-red-500" size={32} />,
      link: '/report'
    },
    {
      title: 'Join Cleanup Drives',
      description: 'Participate in local volunteer events and cleanup drives to make a direct impact.',
      icon: <Users className="text-secondary-600" size={32} />,
      link: '/events'
    },
    {
      title: 'Earn Rewards',
      description: 'Get eco-points for every positive action. Trade points for badges and showcase your impact.',
      icon: <Award className="text-yellow-500" size={32} />,
      link: '/dashboard'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-group grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold text-sm mb-6">
              Empowering Eco-Conscious Travelers
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-poppins leading-tight mb-6">
              Keep Our <span className="gradient-text">Destinations</span> Pure & Clean
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              The ultimate platform for smart waste management at tourist places. Find bins, report waste, and earn rewards for keeping nature beautiful.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/map"
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Find Nearby Bins</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/report"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
              >
                Report Waste
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-tr from-primary-200 to-secondary-200 rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
                alt="Beautiful Landscape"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl shadow-xl border border-white/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-500 rounded-full text-white">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Platform Reliability</p>
                      <p className="text-lg font-bold">100% Verified</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Impact Score</p>
                    <p className="text-lg font-bold text-primary-600">9.8/10</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
              >
                <div className="inline-block p-4 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold font-poppins mb-1">
                  <AnimatedCounter value={stat.value} />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-4">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Our smart system combines technology with community effort to ensure our travel destinations remain pristine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-poppins">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <h2 className="text-4xl md:text-6xl font-bold font-poppins mb-8 relative z-10">
              Ready to make a difference?
            </h2>
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of eco-conscious tourists today. Together, we can preserve the beauty of our world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-primary-600 rounded-2xl font-bold shadow-xl hover:bg-gray-50 transition-all transform hover:scale-105"
              >
                Join the Movement
              </Link>
              <Link
                to="/map"
                className="px-10 py-4 bg-primary-700 text-white rounded-2xl font-bold hover:bg-primary-800 transition-all border border-primary-500/30"
              >
                Explore Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Trash2 className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold font-poppins gradient-text">
              Clean Tourist
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Making the world cleaner, one tourist at a time. Join our community of eco-conscious travelers.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <Globe className="text-gray-400 hover:text-primary-600 cursor-pointer transition-colors" />
            <Users className="text-gray-400 hover:text-primary-600 cursor-pointer transition-colors" />
            <Leaf className="text-gray-400 hover:text-primary-600 cursor-pointer transition-colors" />
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Clean Tourist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
