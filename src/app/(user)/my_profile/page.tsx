'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function MyProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  //!! Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  //!! Load user profile data
  useEffect(() => {
    if (user && !loading) {
      setName(user.user_metadata?.name || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
      setPhone(user.user_metadata?.phone || '');
      setAddress(user.user_metadata?.address || '');
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user, loading]);

  //!! Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  //!! Handle save profile
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name,
          phone,
          address,
        },
      });

      if (error) throw error;

      setIsEditing(false);
      // Show success message (you can add a toast notification here)
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message (you can add a toast notification here)
    } finally {
      setIsSaving(false);
    }
  };

  //!! Handle cancel edit
  const handleCancel = () => {
    if (user) {
      setName(user.user_metadata?.name || user.email?.split('@')[0] || '');
      setPhone(user.user_metadata?.phone || '');
      setAddress(user.user_metadata?.address || '');
    }
    setIsEditing(false);
  };

  //!! Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  //!! Show loading state
  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  
  //!! Return the profile page
  return (
    <div className="relative">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-white py-10 sm:py-20 lg:py-24 min-h-screen">
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
              My{' '}
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-[32px] border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Profile Header with Avatar */}
            <div className="relative bg-gradient-to-br from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent px-6 sm:px-8 py-8 sm:py-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#f5e3a1] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={getUserDisplayName()}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                      aria-label="Change avatar"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="mb-1 text-2xl sm:text-3xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-2xl font-bold text-gray-900 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Your Name"
                      />
                    ) : (
                      getUserDisplayName()
                    )}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">{email}</p>
                </div>

                {/* Edit/Save Button */}
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-full border-2 border-[#D4AF37] bg-white px-4 py-2 text-sm font-semibold text-[#D4AF37] transition-all duration-200 hover:bg-[#D4AF37]/5"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-6">
              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1">
                      Email Address
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="your@email.com"
                      />
                    ) : (
                      <p className="text-sm sm:text-base font-medium text-gray-900">{email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1">
                      Phone Number
                    </p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="+233 XX XXX XXXX"
                      />
                    ) : (
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1">
                      Delivery Address
                    </p>
                    {isEditing ? (
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#D4AF37] focus:outline-none resize-none"
                        placeholder="Enter your delivery address"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {address || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-8 rounded-[32px] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Account Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
                Change Password
              </button>
              <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
                Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

