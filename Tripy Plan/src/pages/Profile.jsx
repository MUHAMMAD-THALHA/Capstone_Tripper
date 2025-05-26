import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { 
  FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, 
  FaSave, FaCamera, FaTrash, FaGlobe, FaUtensils, FaHeart, 
  FaPlus, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  // Fetch user profile data
  const { 
    data: user, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userAPI.getProfile,
    retry: 1,
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: {
      travelInterests: [],
      dietaryRestrictions: [],
      preferredCurrency: 'USD'
    },
    favoriteDestinations: []
  });
  const [newInterest, setNewInterest] = useState('');
  const [newDietary, setNewDietary] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        preferences: {
          travelInterests: user.preferences?.travelInterests || [],
          dietaryRestrictions: user.preferences?.dietaryRestrictions || [],
          preferredCurrency: user.preferences?.preferredCurrency || 'USD'
        },
        favoriteDestinations: user.favoriteDestinations || []
      });
      setImagePreview(user.image);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
      setEditMode(false);
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: userAPI.uploadProfileImage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile image uploaded successfully!');
      setImagePreview(data.imageUrl);
      setSelectedFile(null);
    },
    onError: () => {
      toast.error('Failed to upload image. Please try again.');
    }
  });

  const removeImageMutation = useMutation({
    mutationFn: userAPI.removeProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile image removed successfully!');
      setImagePreview(null);
    },
    onError: () => {
      toast.error('Failed to remove image. Please try again.');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !form.preferences.travelInterests.includes(newInterest.trim())) {
      setForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          travelInterests: [...prev.preferences.travelInterests, newInterest.trim()]
        }
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        travelInterests: prev.preferences.travelInterests.filter(item => item !== interest)
      }
    }));
  };

  const handleAddDietary = () => {
    if (newDietary.trim() && !form.preferences.dietaryRestrictions.includes(newDietary.trim())) {
      setForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          dietaryRestrictions: [...prev.preferences.dietaryRestrictions, newDietary.trim()]
        }
      }));
      setNewDietary('');
    }
  };

  const handleRemoveDietary = (diet) => {
    setForm((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietaryRestrictions: prev.preferences.dietaryRestrictions.filter(item => item !== diet)
      }
    }));
  };

  const handleAddDestination = () => {
    if (newDestination.trim() && !form.favoriteDestinations.includes(newDestination.trim())) {
      setForm((prev) => ({
        ...prev,
        favoriteDestinations: [...prev.favoriteDestinations, newDestination.trim()]
      }));
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (destination) => {
    setForm((prev) => ({
      ...prev,
      favoriteDestinations: prev.favoriteDestinations.filter(item => item !== destination)
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(form);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadImage = () => {
    if (selectedFile) {
      uploadImageMutation.mutate(imagePreview);
    } else {
      toast.error('Please select an image to upload');
    }
  };

  const handleRemoveImage = () => {
    removeImageMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-peach">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-peach">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink mb-4">Error Loading Profile</h2>
          <p className="text-gray-700 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peach py-10">
      <Helmet>
        <title>My Profile - Tripy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-darkpink text-center mb-8">My Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border-4 border-pink"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pink/10 rounded-full border-4 border-pink">
                    <FaUserCircle className="text-7xl text-pink" />
                  </div>
                )}
                
                {editMode && (
                  <div className="absolute bottom-0 right-0 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUploadClick}
                      className="w-10 h-10 bg-pink text-white rounded-full flex items-center justify-center"
                      title="Upload image"
                    >
                      <FaCamera />
                    </motion.button>
                    
                    {imagePreview && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveImage}
                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"
                        title="Remove image"
                      >
                        <FaTrash />
                      </motion.button>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              {editMode && selectedFile && (
                <button
                  onClick={handleUploadImage}
                  className="bg-pink text-white px-4 py-2 rounded-lg hover:bg-darkpink transition-colors"
                >
                  Save Image
                </button>
              )}
            </div>
            
            {/* Profile Info Section */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {!editMode ? (
                  <button
                    onClick={handleEdit}
                    className="bg-pink text-white px-4 py-2 rounded-lg hover:bg-darkpink transition-colors flex items-center gap-2"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : null}
              </div>
              
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink disabled:bg-gray-100"
                      />
                      <FaEnvelope className="text-pink" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink disabled:bg-gray-100"
                      />
                      <FaPhone className="text-pink" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Preferred Currency</label>
                    <div className="flex items-center gap-2">
                      <select
                        name="preferredCurrency"
                        value={form.preferences.preferredCurrency}
                        onChange={handlePreferenceChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink disabled:bg-gray-100"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                      <FaGlobe className="text-pink" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1">Address</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink disabled:bg-gray-100"
                    />
                    <FaMapMarkerAlt className="text-pink" />
                  </div>
                </div>
                
                {/* Travel Interests */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1">Travel Interests</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.preferences.travelInterests.map((interest, index) => (
                      <div key={index} className="bg-peach text-darkpink px-3 py-1 rounded-full flex items-center">
                        {interest}
                        {editMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(interest)}
                            className="ml-2 text-pink hover:text-darkpink"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {editMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add interest"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                      />
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="bg-pink text-white px-3 py-2 rounded-lg hover:bg-darkpink transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Dietary Restrictions */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1">Dietary Restrictions</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.preferences.dietaryRestrictions.map((diet, index) => (
                      <div key={index} className="bg-peach text-darkpink px-3 py-1 rounded-full flex items-center">
                        {diet}
                        {editMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDietary(diet)}
                            className="ml-2 text-pink hover:text-darkpink"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                    {form.preferences.dietaryRestrictions.length === 0 && !editMode && (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                  {editMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newDietary}
                        onChange={(e) => setNewDietary(e.target.value)}
                        placeholder="Add dietary restriction"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                      />
                      <button
                        type="button"
                        onClick={handleAddDietary}
                        className="bg-pink text-white px-3 py-2 rounded-lg hover:bg-darkpink transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Favorite Destinations */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1">Favorite Destinations</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.favoriteDestinations.map((destination, index) => (
                      <div key={index} className="bg-peach text-darkpink px-3 py-1 rounded-full flex items-center">
                        {destination}
                        {editMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDestination(destination)}
                            className="ml-2 text-pink hover:text-darkpink"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                    {form.favoriteDestinations.length === 0 && !editMode && (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                  {editMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newDestination}
                        onChange={(e) => setNewDestination(e.target.value)}
                        placeholder="Add destination"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                      />
                      <button
                        type="button"
                        onClick={handleAddDestination}
                        className="bg-pink text-white px-3 py-2 rounded-lg hover:bg-darkpink transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  )}
                </div>
                
                {editMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-pink text-white px-6 py-2 rounded-lg hover:bg-darkpink transition-colors flex items-center gap-2"
                    >
                      <FaSave /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 