import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    address: user?.address || '',
    agentId: user?.agentId || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would dispatch an action to update the user profile
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Edit Profile
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                id="fullName"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Input
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Input
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Input
                id="businessName"
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Input
                id="address"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Input
                id="agentId"
                label="Agent ID"
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
              >
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
            </div>
            
            <Button
              variant="outline"
            >
              Change Password
            </Button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            
            <Button
              variant="outline"
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
