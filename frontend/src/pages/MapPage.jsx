import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Info, Trash2, Recycle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)',
};

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

// Helper to calculate distance in KM
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [dustbins, setDustbins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingBin, setIsAddingBin] = useState(false);
  const [newBinType, setNewBinType] = useState('normal');
  const [isGlobalView, setIsGlobalView] = useState(false);
  const [osmBins, setOsmBins] = useState([]);
  const [isFetchingOsm, setIsFetchingOsm] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    console.error("Google Maps API failed to load", loadError);
  }

  const handleAddBin = async () => {
    if (!userLocation) {
      toast.error("Please allow location access to add a bin.");
      return;
    }
    
    try {
      const { data } = await api.post('/dustbins', {
        locationName: `Bin at ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        type: newBinType,
      });
      setDustbins([...dustbins, data]);
      setIsAddingBin(false);
      toast.success("New dustbin added at your current location!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add bin");
    }
  };

  const fetchOsmBins = async (lat, lng) => {
    setIsFetchingOsm(true);
    try {
      // Overpass API query for waste_baskets within 3km
      const query = `[out:json];node["amenity"="waste_basket"](around:3000,${lat},${lng});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.elements) {
        const bins = data.elements.map(el => ({
          _id: `osm-${el.id}`,
          locationName: el.tags.name || 'Public Waste Basket',
          latitude: el.lat,
          longitude: el.lng,
          type: 'osm',
          distance: getDistance(lat, lng, el.lat, el.lng)
        }));
        setOsmBins(bins);
      }
    } catch (error) {
      console.error("OSM fetch failed", error);
    } finally {
      setIsFetchingOsm(false);
    }
  };

  const handleDeleteBin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dustbin?")) return;
    
    try {
      await api.delete(`/dustbins/${id}`);
      setDustbins(dustbins.filter(bin => bin._id !== id));
      if (selectedBin?._id === id) setSelectedBin(null);
      toast.success("Dustbin removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete bin");
    }
  };

  const getGeoLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setLocationError(null);
          if (map) map.panTo(pos);
          fetchOsmBins(pos.lat, pos.lng);
          console.log("📍 User location captured:", pos);
        },
        (error) => {
          let errorMsg = "Error: The Geolocation service failed.";
          if (error.code === 1) errorMsg = "Location permission denied. Using default map center (New Delhi).";
          else if (error.code === 2) errorMsg = "Location unavailable. Using default map center.";
          else if (error.code === 3) errorMsg = "Location request timed out. Using default map center.";
          
          setLocationError(errorMsg);
          if (!locationError) {
            toast(errorMsg, { icon: '📍', duration: 4000 });
          }
          
          setUserLocation(center);
          if (map) map.panTo(center);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setUserLocation(center);
    }
  }, [map, locationError]);

  useEffect(() => {
    getGeoLocation();

    const fetchDustbins = async () => {
      try {
        const { data } = await api.get('/dustbins');
        setDustbins(data);
      } catch (error) {
        console.error("Error fetching dustbins", error);
        toast.error("Failed to load dustbins data.");
      }
    };
    fetchDustbins();
  }, [getGeoLocation]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const filteredBins = dustbins
    .filter(bin => bin.locationName.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(bin => {
      if (userLocation) {
        return {
          ...bin,
          distance: getDistance(userLocation.lat, userLocation.lng, bin.latitude, bin.longitude)
        };
      }
      return bin;
    })
    .filter(bin => {
      // If Global View is ON, show everything
      if (isGlobalView) return true;
      // If NO location yet, show everything
      if (!userLocation) return true;
      // Filter by 50km radius for true "nearby" view
      return (bin.distance || 0) <= 50;
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const allVisibleBins = [...filteredBins, ...osmBins].sort((a, b) => (a.distance || 0) - (b.distance || 0));

  // Automatically switch to global view if no nearby bins are found
  useEffect(() => {
    if (dustbins.length > 0 && filteredBins.length === 0 && !isGlobalView && userLocation) {
      console.log("No bins nearby, suggesting Global View...");
    }
  }, [dustbins, filteredBins, isGlobalView, userLocation]);

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Hidden on mobile, overlay on desktop */}
      <div className="w-full md:w-80 glass dark:bg-gray-900/90 border-r border-gray-200 dark:border-gray-800 p-6 overflow-y-auto hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-poppins gradient-text">Nearby Bins</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => getGeoLocation()}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
              title="Refresh My Location"
            >
              <Navigation size={18} />
            </button>
            <button 
              onClick={() => setIsGlobalView(!isGlobalView)}
              className={`p-1.5 rounded-lg transition-colors ${isGlobalView ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}
              title={isGlobalView ? "Showing All Bins" : "Showing Nearby Bins"}
            >
              <Recycle size={18} className={isGlobalView ? 'rotate-12' : ''} />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {isFetchingOsm && (
            <div className="flex items-center justify-center space-x-2 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-[10px] font-bold text-blue-600">Scanning real-world bins...</span>
            </div>
          )}
          {allVisibleBins.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <div className="inline-block p-4 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="font-bold text-sm">No bins nearby!</h3>
                <p className="text-[10px] text-gray-500 mt-1">
                  We couldn't find any bins within 50km of your current location. 
                  Currently, we only have demo bins seeded in New Delhi.
                </p>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setIsGlobalView(true)}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Recycle size={14} />
                  <span>Show All Bins in India</span>
                </button>
                
                <button 
                  onClick={() => {
                    if (map) {
                      map.panTo(center);
                      map.setZoom(13);
                    }
                  }}
                  className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                >
                  <Navigation size={14} />
                  <span>Go to Demo Area (New Delhi)</span>
                </button>
                
                <p className="text-[10px] text-gray-400 mt-4">
                  Or use the **Contribute** button below to add a bin at your exact location!
                </p>
              </div>
            </div>
          ) : (
            allVisibleBins.map((bin) => (
              <motion.div
                key={bin._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedBin(bin);
                  if (map) map.panTo({ lat: bin.latitude, lng: bin.longitude });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedBin?._id === bin._id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${bin.type === 'recycle' ? 'bg-blue-100 text-blue-600' : bin.type === 'osm' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                    {bin.type === 'recycle' ? <Recycle size={20} /> : bin.type === 'osm' ? <MapIcon size={20} /> : <Trash2 size={20} />}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm">{bin.locationName}</h3>
                      {bin.type !== 'osm' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBin(bin._id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 capitalize">{bin.type === 'osm' ? 'Public Bin' : bin.type + ' Waste'}</p>
                      {bin.distance && (
                        <p className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
                          {bin.distance < 1 ? `${(bin.distance * 1000).toFixed(0)}m` : `${bin.distance.toFixed(1)}km`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Map Implementation */}
      <div className="flex-grow relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || center}
          zoom={14}
          onLoad={(map) => setMap(map)}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{ "color": "#e5e5e5" }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {/* User Marker */}
          {userLocation && !locationError && (
            <Marker
              position={userLocation}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {/* Dustbin Markers */}
          {allVisibleBins.map((bin) => (
            <Marker
              key={bin._id}
              position={{ lat: bin.latitude, lng: bin.longitude }}
              onClick={() => setSelectedBin(bin)}
              icon={{
                url: bin.type === 'recycle' 
                  ? 'https://cdn-icons-png.flaticon.com/512/3299/3299935.png'
                  : bin.type === 'osm'
                  ? 'https://cdn-icons-png.flaticon.com/512/3299/3299853.png'
                  : 'https://cdn-icons-png.flaticon.com/512/3299/3299931.png',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          ))}

          {selectedBin && (
            <InfoWindow
              position={{ lat: selectedBin.latitude, lng: selectedBin.longitude }}
              onCloseClick={() => setSelectedBin(null)}
            >
              <div className="p-2 min-w-[200px] text-gray-900">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1.5 rounded-md ${selectedBin.type === 'recycle' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {selectedBin.type === 'recycle' ? <Recycle size={16} /> : <Trash2 size={16} />}
                  </div>
                  <h4 className="font-bold">{selectedBin.locationName}</h4>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p className="flex items-center"><Navigation size={12} className="mr-1" /> Nearby Public Spot</p>
                  <p className="flex items-center"><Info size={12} className="mr-1" /> Open 24/7</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button 
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.latitude},${selectedBin.longitude}`;
                      window.open(url, '_blank');
                    }}
                    className="flex-grow py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                  >
                    Directions
                  </button>
                  <button 
                    onClick={() => handleDeleteBin(selectedBin._id)}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete Bin"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Floating Controls */}
        <div className="absolute top-6 left-6 right-6 md:left-auto md:w-80 flex flex-col space-y-4">
          <div className="glass p-4 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-900/80 flex items-center space-x-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <MapPin size={20} />
            </div>
            <input
              type="text"
              placeholder="Search bins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full dark:text-white"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => {
                getGeoLocation();
              }}
              className="glass p-3 rounded-xl shadow-lg border border-white/20 dark:bg-gray-900/80 flex items-center justify-center space-x-2 text-xs font-bold text-primary-600 hover:bg-primary-50 transition-all"
            >
              <Navigation size={14} />
              <span>Go to My Location</span>
            </button>
            
            <button 
              onClick={() => {
                map.panTo(center);
                map.setZoom(14);
              }}
              className="glass p-3 rounded-xl shadow-lg border border-white/20 dark:bg-gray-900/80 flex items-center justify-center space-x-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Trash2 size={14} />
              <span>Show Demo Bins (New Delhi)</span>
            </button>

            <div className="glass p-4 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-900/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contribute</h4>
              <p className="text-[10px] text-gray-500">Seen a new bin? Add it to help others!</p>
              <div className="flex space-x-2">
                <select 
                  value={newBinType}
                  onChange={(e) => setNewBinType(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-[10px] px-2 py-2 flex-grow dark:text-white"
                >
                  <option value="normal">Normal Waste</option>
                  <option value="recycle">Recycling</option>
                </select>
                <button 
                  onClick={handleAddBin}
                  className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Navigation size={14} />
                </button>
              </div>
            </div>
          </div>

          {locationError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded-xl flex items-start space-x-3">
              <Info size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                {locationError} You can search for bins manually or click the button above to see the demo area.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 glass p-4 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-900/80 flex space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-medium dark:text-gray-300">General Waste</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-medium dark:text-gray-300">Recycling</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
