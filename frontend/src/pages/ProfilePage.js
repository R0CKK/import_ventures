import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading: authLoading, updateProfileInContext } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profile: {
      phone: '',
      company: {
        name: '',
        registrationNumber: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      taxInfo: {
        taxId: '',
        vatNumber: ''
      }
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const justUpdatedRef = useRef(false);

  useEffect(() => {
    // Only update profileData from user if we didn't just update it
    if (user && !justUpdatedRef.current) {
      setProfileData({
        name: user.name,
        email: user.email,
        profile: {
          phone: user.profile?.phone || '',
          company: {
            name: user.profile?.company?.name || '',
            registrationNumber: user.profile?.company?.registrationNumber || ''
          },
          address: {
            street: user.profile?.address?.street || '',
            city: user.profile?.address?.city || '',
            state: user.profile?.address?.state || '',
            zipCode: user.profile?.address?.zipCode || '',
            country: user.profile?.address?.country || ''
          },
          taxInfo: {
            taxId: user.profile?.taxInfo?.taxId || '',
            vatNumber: user.profile?.taxInfo?.vatNumber || ''
          }
        }
      });
    }
    // Reset the flag after setting the data (if it was set)
    if (justUpdatedRef.current) {
      justUpdatedRef.current = false;
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        // Check if field is empty, which means we're updating a direct field like 'phone'
        ...(field === '' 
          ? { [section]: value }
          : { [section]: { ...prev.profile[section], [field]: value } }
        )
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/users/profile', {
        name: profileData.name,
        profile: profileData.profile
      });

      // Update the local profileData state with the response data
      // The response.data.data contains the updated user object
      const updatedUserData = response.data.data;
      
      // Set flag to indicate we just updated, so useEffect doesn't override
      justUpdatedRef.current = true;
      
      // Update profileData state to match the response, ensuring proper nested structure
      setProfileData({
        name: updatedUserData.name,
        email: updatedUserData.email,
        profile: {
          phone: updatedUserData.profile?.phone || '',
          company: {
            name: updatedUserData.profile?.company?.name || '',
            registrationNumber: updatedUserData.profile?.company?.registrationNumber || ''
          },
          address: {
            street: updatedUserData.profile?.address?.street || '',
            city: updatedUserData.profile?.address?.city || '',
            state: updatedUserData.profile?.address?.state || '',
            zipCode: updatedUserData.profile?.address?.zipCode || '',
            country: updatedUserData.profile?.address?.country || ''
          },
          taxInfo: {
            taxId: updatedUserData.profile?.taxInfo?.taxId || '',
            vatNumber: updatedUserData.profile?.taxInfo?.vatNumber || ''
          }
        }
      });
      
      // Update the user context to reflect the changes
      updateProfileInContext(updatedUserData);
      
      setSuccess(response.data.message);
      
      // Switch back to view mode after successful update
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="text-center mt-6">Loading...</div>;
  if (!user) return <div className="text-center mt-6">Please login to view your profile</div>;

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="section-title text-center mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <i data-lucide="user" className="text-2xl text-foreground"></i>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  user.role === 'seller' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Account Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Member since</span>
                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Status</span>
                    <span className={user.isActive ? 'text-green-500' : 'text-red-500'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {isEditing ? 'Edit Profile' : 'Your Profile'}
                </h2>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {success && (
                <div className="bg-green-500 text-white p-3 rounded mb-4">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="bg-red-500 text-white p-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={profileData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input bg-muted"
                        value={profileData.email}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-4">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profileData.profile.phone}
                      onChange={(e) => handleProfileChange('phone', '', e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.company?.name || ''}
                          onChange={(e) => handleProfileChange('company', 'name', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Registration Number</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.company?.registrationNumber || ''}
                          onChange={(e) => handleProfileChange('company', 'registrationNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.address?.street || ''}
                          onChange={(e) => handleProfileChange('address', 'street', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.address?.city || ''}
                          onChange={(e) => handleProfileChange('address', 'city', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.address?.state || ''}
                          onChange={(e) => handleProfileChange('address', 'state', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">ZIP Code</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.address?.zipCode || ''}
                          onChange={(e) => handleProfileChange('address', 'zipCode', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.address?.country || ''}
                          onChange={(e) => handleProfileChange('address', 'country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tax Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="form-label">Tax ID</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.taxInfo?.taxId || ''}
                          onChange={(e) => handleProfileChange('taxInfo', 'taxId', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">VAT Number</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.profile.taxInfo?.vatNumber || ''}
                          onChange={(e) => handleProfileChange('taxInfo', 'vatNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset profile data to original values
                        if (user) {
                          setProfileData({
                            name: user.name,
                            email: user.email,
                            profile: user.profile || {
                              phone: '',
                              company: { name: '', registrationNumber: '' },
                              address: { street: '', city: '', state: '', zipCode: '', country: '' },
                              taxInfo: { taxId: '', vatNumber: '' }
                            }
                          });
                        }
                        setError('');
                        setSuccess('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display view-only profile
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted">Full Name</p>
                        <p className="font-medium">{profileData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Phone</p>
                        <p className="font-medium">{profileData.profile.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted">Company Name</p>
                        <p className="font-medium">{profileData.profile.company?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Registration Number</p>
                        <p className="font-medium">{profileData.profile.company?.registrationNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Address</h3>
                    <div>
                      <p className="text-sm text-muted">Street Address</p>
                      <p className="font-medium">{profileData.profile.address?.street || 'Not provided'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted">City</p>
                        <p className="font-medium">{profileData.profile.address?.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">State</p>
                        <p className="font-medium">{profileData.profile.address?.state || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">ZIP Code</p>
                        <p className="font-medium">{profileData.profile.address?.zipCode || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted">Country</p>
                      <p className="font-medium">{profileData.profile.address?.country || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Tax Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted">Tax ID</p>
                        <p className="font-medium">{profileData.profile.taxInfo?.taxId || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">VAT Number</p>
                        <p className="font-medium">{profileData.profile.taxInfo?.vatNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;