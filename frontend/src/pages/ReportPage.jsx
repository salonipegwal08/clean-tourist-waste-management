import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Send, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user location automatically
    const getGeoLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationError(null);
            console.log("📍 Location captured successfully");
          },
          (error) => {
            let errorMsg = "Location access is required to report garbage accurately.";
            if (error.code === 1) errorMsg = "Location permission denied. Using default location (New Delhi).";
            else if (error.code === 2) errorMsg = "Location unavailable. Using default location.";
            else if (error.code === 3) errorMsg = "Location request timed out.";
            
            setLocationError(errorMsg);
            if (!locationError) {
              toast(errorMsg, { icon: '📍', duration: 4000 });
            }
            
            // Fallback for demo/development if it fails
            console.warn("Using fallback location due to geolocation error:", error.message);
            setLocation({ lat: 28.6139, lng: 77.2090 }); // Default to New Delhi
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
        setLocation({ lat: 28.6139, lng: 77.2090 });
      }
    };

    getGeoLocation();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo || !location || !description) {
      toast.error("Please provide all required information.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload to Cloudinary (Simulated for this demo, usually handled by backend or direct client-side)
      // For a real app, we'd send the file to our backend which handles Cloudinary
      const formData = new FormData();
      formData.append('file', photo);
      formData.append('upload_preset', 'clean-tourist'); // You'd need a real preset

      // For this demo, we'll assume the backend handles the photo upload if we send it as a base64 or multipart
      // Since we don't have a real Cloudinary setup, we'll use a placeholder URL
      const photoUrl = "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=1000";

      const reportData = {
        photo: photoUrl,
        latitude: location.lat,
        longitude: location.lng,
        description,
      };

      await api.post('/reports', reportData);

      toast.success("Report submitted! +10 Eco-Points earned.");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-poppins mb-4"
          >
            Report <span className="gradient-text">Garbage</span>
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400">
            Help us maintain the beauty of our tourist destinations. Your report makes a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Tips */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/20 dark:bg-gray-900/80 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <ShieldCheck className="text-primary-600" size={20} />
                <span>Quick Tips</span>
              </h3>
              <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <span>Take a clear photo of the garbage and its surroundings.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <span>Ensure your location services are enabled for accuracy.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <span>Describe the type of waste (plastic, food, construction).</span>
                </li>
              </ul>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/20 dark:bg-gray-900/80 shadow-sm bg-primary-50/50">
              <div className="flex items-center space-x-3 mb-3 text-primary-700 dark:text-primary-400 font-bold">
                <AlertCircle size={20} />
                <span>Rewards</span>
              </div>
              <p className="text-sm text-primary-800/80 dark:text-primary-300/80">
                Each verified report earns you 10 Eco-Points. Earn enough to unlock exclusive badges and rewards!
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleSubmit}
              className="glass dark:bg-gray-900/80 p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-800 space-y-8"
            >
              {/* Photo Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  Upload Photo
                </label>
                <div
                  className={`relative h-64 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                    preview 
                      ? 'border-primary-500 bg-primary-50/10' 
                      : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 bg-gray-50/50 dark:bg-gray-800/50'
                  }`}
                  onClick={() => document.getElementById('photo-input').click()}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={32} />
                        <span className="text-white ml-2 font-bold">Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                      </div>
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                    </>
                  )}
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white text-sm"
                  placeholder="Tell us about the garbage issue..."
                />
              </div>

              {/* Location Status */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className={`p-2 rounded-lg ${location ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Automatic Location</p>
                  <p className="text-sm font-medium dark:text-gray-200">
                    {location ? `Detected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Detecting location..."}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
