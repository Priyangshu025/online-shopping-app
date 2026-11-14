import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

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
    <div className="container-page py-10 sm:py-16 space-y-8 max-w-4xl">
      
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">Manage personal details, security, and saved addresses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Profile Card */}
        <div className="bg-surface-alt p-6 rounded-card border border-line/60 space-y-3 text-center md:col-span-1">
          <div className="w-16 h-16 rounded-full bg-white border border-line text-ink text-xl font-semibold flex items-center justify-center mx-auto uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-semibold text-ink text-base">{user?.name}</h2>
            <p className="text-xs text-ink-muted">{user?.email}</p>
          </div>
          <span className="inline-block text-xs font-medium text-ink bg-white border border-line px-3 py-1 rounded-full uppercase tracking-wider">
            {user?.role} account
          </span>
        </div>

        {/* Edit Info & Security */}
        <div className="bg-surface p-6 sm:p-8 rounded-card border border-line/60 md:col-span-2 space-y-6">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <h2 className="font-semibold text-ink text-base pb-3 border-b border-line/50">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1.5">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91..."
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-ink-muted block mb-1.5">Email address (read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input bg-surface-alt cursor-not-allowed opacity-80"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-ink-muted block mb-1.5">New password (optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to keep current password"
                  className="input"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={saving}
              >
                {saving ? 'Saving changes...' : 'Save changes'}
              </Button>
            </div>
          </form>

          {/* Saved Addresses Section */}
          <div className="pt-6 border-t border-line/60 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink text-base">Saved Addresses</h2>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add address</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-5 bg-surface-alt rounded-card border border-line space-y-3">
                <h3 className="text-xs font-semibold text-ink">New Delivery Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={newAddr.recipient}
                    onChange={(e) => setNewAddr({ ...newAddr, recipient: e.target.value })}
                    required
                    className="input h-10 text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    required
                    className="input h-10 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Address (House, Street, Area)"
                    value={newAddr.addressLines}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLines: e.target.value })}
                    required
                    className="input h-10 text-xs sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                    className="input h-10 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Postal PIN"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    required
                    className="input h-10 text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm">
                    Save address
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* List Addresses */}
            <div className="space-y-3">
              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 bg-surface-alt rounded-xl border border-line/50 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-ink">{addr.recipient}</p>
                      <p className="text-ink-muted">{addr.addressLines}</p>
                      <p className="text-ink-muted">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="text-ink-muted pt-1">Phone: {addr.phone}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="p-1.5 text-ink-muted hover:text-danger rounded-full transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink-muted">No saved addresses yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
