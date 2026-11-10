import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, MapPin, Plus, Trash2, ShieldCheck, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    recipient: user?.name || '',
    phone: user?.phone || '',
    addressLines: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
    isDefault: false,
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updateData = { name, phone };
    if (password) updateData.password = password;

    const res = await updateProfile(updateData);
    if (res.success) {
      setPassword('');
    }
    setSaving(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.recipient || !newAddr.addressLines || !newAddr.postalCode) {
      toast.error('Please fill all address fields');
      return;
    }

    const currentAddresses = user?.addresses || [];
    const updated = [...currentAddresses, newAddr];
    const res = await updateProfile({ addresses: updated });
    if (res.success) {
      setShowAddressForm(false);
      setNewAddr({
        recipient: user?.name || '',
        phone: user?.phone || '',
        addressLines: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '',
        isDefault: false,
      });
    }
  };

  const handleDeleteAddress = async (index) => {
    const current = [...(user?.addresses || [])];
    current.splice(index, 1);
    await updateProfile({ addresses: current });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your identity, personal security, and saved delivery addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 md:col-span-1 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 text-2xl font-black flex items-center justify-center mx-auto shadow-inner uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {user?.role} Account
          </span>
        </div>

        {/* Edit Info & Security */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm md:col-span-2 space-y-6">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address (Read-only)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">New Password (leave empty to keep current)</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Saved Addresses Section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Saved Delivery Addresses</h3>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Add New Shipping Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={newAddr.recipient}
                    onChange={(e) => setNewAddr({ ...newAddr, recipient: e.target.value })}
                    required
                    className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    required
                    className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Address (House, Street, Area)"
                    value={newAddr.addressLines}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLines: e.target.value })}
                    required
                    className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                    className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Postal PIN"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    required
                    className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List Addresses */}
            <div className="space-y-3">
              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{addr.recipient}</p>
                      <p className="text-slate-600">{addr.addressLines}</p>
                      <p className="text-slate-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="text-slate-400 mt-1">Phone: {addr.phone}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No saved addresses yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;

