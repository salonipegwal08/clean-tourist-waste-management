import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  MapPin, 
  Users, 
  Plus, 
  Filter, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Loader2,
  Settings,
  AlertCircle,
  LayoutDashboard,
  Calendar,
  X
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [dustbins, setDustbins] = useState([]);
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [dustbinForm, setDustbinForm] = useState({ locationName: '', latitude: '', longitude: '', type: 'normal' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', location: '', date: '' });
  const [placeForm, setPlaceForm] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'reports') {
        res = await api.get('/reports');
        setReports(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'dustbins') {
        res = await api.get('/dustbins');
        setDustbins(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'events') {
        res = await api.get('/events');
        setEvents(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'places') {
        res = await api.get('/places');
        setPlaces(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Admin Fetch Error:", error);
      const message = error.response?.data?.message || "Error fetching admin data. Please check if you are logged in as an Admin.";
      toast.error(message);
      // Clear data on error to prevent mapping errors
      if (activeTab === 'reports') setReports([]);
      if (activeTab === 'dustbins') setDustbins([]);
      if (activeTab === 'events') setEvents([]);
      if (activeTab === 'places') setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/reports/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      setReports(reports.map(r => r._id === id ? { ...r, status } : r));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCreateDustbin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dustbins', dustbinForm);
      toast.success("Dustbin added successfully");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to add dustbin");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', eventForm);
      toast.success("Event created successfully");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    try {
      await api.post('/places', placeForm);
      toast.success("Tourist place added");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to add place");
    }
  };

  const handleDeleteDustbin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dustbin?")) return;
    try {
      await api.delete(`/dustbins/${id}`);
      setDustbins(dustbins.filter(b => b._id !== id));
      toast.success("Dustbin removed");
    } catch (error) {
      toast.error("Failed to delete dustbin");
    }
  };

  const tabs = [
    { id: 'reports', name: 'Reports', icon: <Trash2 size={20} /> },
    { id: 'dustbins', name: 'Dustbins', icon: <MapPin size={20} /> },
    { id: 'events', name: 'Events', icon: <Calendar size={20} /> },
    { id: 'places', name: 'Places', icon: <LayoutDashboard size={20} /> },
  ];

  const Modal = ({ title, children }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass dark:bg-gray-900/90 w-full max-w-lg p-8 rounded-[2.5rem] border border-white/20 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold font-poppins">{title}</h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
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
              Admin <span className="gradient-text">Console</span>
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400">
              Centralized control for garbage reports, infrastructure, events, and destinations.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-primary-600'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-poppins capitalize">{activeTab} Management</h2>
          {activeTab !== 'reports' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-lg hover:bg-primary-700 transition-all"
            >
              <Plus size={20} />
              <span>Add {activeTab.slice(0, -1)}</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary-600" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeTab === 'reports' && (
              reports.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                  <Trash2 className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-400">No reports found</h3>
                  <p className="text-sm text-gray-500">All tourist places seem to be clean!</p>
                </div>
              ) : reports.map((report, idx) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass dark:bg-gray-900/80 rounded-[2.5rem] border border-white/20 dark:border-gray-800 overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 h-64 md:h-auto overflow-hidden relative">
                      <img src={report.photo} alt="Report" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                          report.status === 'Cleaned' ? 'bg-green-100 text-green-600' : report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {report.status}
                        </div>
                      </div>
                    </div>
                    <div className="p-8 flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold font-poppins mb-1">{report.description}</h3>
                          <p className="text-sm text-gray-500">By <span className="font-bold text-primary-600">{report.userId?.name || 'User'}</span> • {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                        {['Pending', 'In Progress', 'Cleaned'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(report._id, status)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              report.status === status ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary-50'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {activeTab === 'dustbins' && (
              dustbins.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                  <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-400">No dustbins found</h3>
                  <button onClick={() => setShowModal(true)} className="mt-4 text-primary-600 font-bold hover:underline">Add the first one</button>
                </div>
              ) : dustbins.map((bin, idx) => (
                <div key={bin._id} className="glass dark:bg-gray-900/80 p-6 rounded-3xl border border-white/20 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-2xl ${bin.type === 'recycle' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      <Trash2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{bin.locationName}</h3>
                      <p className="text-sm text-gray-500">
                        {bin.latitude?.toFixed(4) || '0'}, {bin.longitude?.toFixed(4) || '0'} • {bin.type}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteDustbin(bin._id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}

            {activeTab === 'events' && (
              events.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-400">No events found</h3>
                  <button onClick={() => setShowModal(true)} className="mt-4 text-primary-600 font-bold hover:underline">Organize a drive</button>
                </div>
              ) : events.map((event, idx) => (
                <div key={event._id} className="glass dark:bg-gray-900/80 p-6 rounded-3xl border border-white/20 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-primary-600 font-bold">
                    <Users size={18} />
                    <span>{event.volunteers?.length || 0} Joined</span>
                  </div>
                </div>
              ))
            )}

            {activeTab === 'places' && (
              places.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                  <LayoutDashboard className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-400">No destinations found</h3>
                  <button onClick={() => setShowModal(true)} className="mt-4 text-primary-600 font-bold hover:underline">Add a tourist spot</button>
                </div>
              ) : places.map((place, idx) => (
                <div key={place._id} className="glass dark:bg-gray-900/80 p-6 rounded-3xl border border-white/20 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{place.name}</h3>
                    <p className="text-sm text-gray-500">{place.location}</p>
                  </div>
                  <div className="px-4 py-2 bg-primary-100 text-primary-600 rounded-full font-bold text-xs">
                    Score: {place.cleanlinessScore?.toFixed(1) || '0.0'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showModal && (
            <Modal title={`Add New ${activeTab.slice(0, -1)}`}>
              {activeTab === 'dustbins' && (
                <form onSubmit={handleCreateDustbin} className="space-y-6">
                  <input type="text" placeholder="Location Name" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setDustbinForm({...dustbinForm, locationName: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="any" placeholder="Latitude" required className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setDustbinForm({...dustbinForm, latitude: e.target.value})} />
                    <input type="number" step="any" placeholder="Longitude" required className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setDustbinForm({...dustbinForm, longitude: e.target.value})} />
                  </div>
                  <select className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setDustbinForm({...dustbinForm, type: e.target.value})}>
                    <option value="normal">Normal Waste</option>
                    <option value="recycle">Recycling</option>
                  </select>
                  <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg">Save Dustbin</button>
                </form>
              )}
              {activeTab === 'events' && (
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <input type="text" placeholder="Event Title" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                  <textarea placeholder="Description" rows={3} required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                  <input type="text" placeholder="Location" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                  <input type="date" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                  <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg">Create Event</button>
                </form>
              )}
              {activeTab === 'places' && (
                <form onSubmit={handleCreatePlace} className="space-y-6">
                  <input type="text" placeholder="Place Name" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setPlaceForm({...placeForm, name: e.target.value})} />
                  <input type="text" placeholder="Location" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none" onChange={e => setPlaceForm({...placeForm, location: e.target.value})} />
                  <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg">Add Tourist Place</button>
                </form>
              )}
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
