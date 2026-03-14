import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Filter, Search, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleJoin = async (eventId) => {
    try {
      await api.post('/events/join', { eventId });
      toast.success("Joined event successfully! +50 Eco-Points.");
      
      // Refresh events
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join event");
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold font-poppins mb-4"
            >
              Cleanup <span className="gradient-text">Drives</span>
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400">
              Join local cleanup events, meet like-minded eco-conscious travelers, and make a real impact on our environment.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
              />
            </div>
            <button className="px-6 py-3.5 bg-primary-600 text-white rounded-2xl flex items-center justify-center space-x-2 font-bold shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all">
              <Plus size={18} />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full py-20 text-center glass rounded-[3rem] border border-white/20 dark:bg-gray-900/80">
                <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <Calendar size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No events found</h3>
                <p className="text-gray-500">Be the first to create a cleanup drive in your area!</p>
              </div>
            ) : (
              filteredEvents.map((event, idx) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                        <Calendar size={24} />
                      </div>
                      <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck size={12} />
                        <span>Verified</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold font-poppins mb-3 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <MapPin size={16} className="text-primary-600" />
                        </div>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Calendar size={16} className="text-primary-600" />
                        </div>
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Users size={16} className="text-primary-600" />
                        </div>
                        <span>{event.volunteers.length} Volunteers Joined</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-auto">
                    <button
                      onClick={() => handleJoin(event._id)}
                      className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-primary-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                    >
                      <span>Join Event</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
