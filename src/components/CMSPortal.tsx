import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  RefreshCw,
  LogOut,
  Camera,
  FolderKanban,
  Settings,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { Photo, Category } from '../types';

interface CMSPortalProps {
  onClose: () => void;
}

export const CMSPortal: React.FC<CMSPortalProps> = ({ onClose }) => {
  const {
    photos,
    categories,
    adminCredentials,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateCredentials,
    addPhoto,
    updatePhoto,
    deletePhoto,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaultCatalog,
    showNotification
  } = usePhotos();

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');

  // Active CMS tab
  const [cmsTab, setCmsTab] = useState<'overview' | 'photos' | 'add' | 'categories' | 'security'>('overview');

  // Photo management state
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState('all');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // New photo form state
  const [newPhotoData, setNewPhotoData] = useState<{
    title: string;
    category: string;
    tag: string;
    src: string;
    location: string;
    description: string;
    camera: string;
    lens: string;
    shutter: string;
    aperture: string;
    iso: string;
    featured: boolean;
  }>({
    title: '',
    category: 'aircraft',
    tag: 'Airbus A380',
    src: '',
    location: 'London Heathrow (LHR)',
    description: '',
    camera: 'Canon EOS Professional',
    lens: 'Canon EF 100-400mm f/4.5-5.6L IS',
    shutter: '1/1600s',
    aperture: 'f/6.3',
    iso: 'ISO 200',
    featured: false
  });
  const [uploadPreview, setUploadPreview] = useState<string>('');

  // New category form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Security settings form state
  const [secUsername, setSecUsername] = useState(adminCredentials.username);
  const [secCurrentPassword, setSecCurrentPassword] = useState('');
  const [secNewPassword, setSecNewPassword] = useState('');
  const [secConfirmPassword, setSecConfirmPassword] = useState('');
  const [secError, setSecError] = useState('');
  const [secSuccess, setSecSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(loginUsername, loginPassword);
    if (!success) {
      setLoginError('Invalid credentials. (Default is username: admin, password: admin)');
    }
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');

    if (secCurrentPassword !== adminCredentials.passwordHash) {
      setSecError('Current password does not match.');
      return;
    }

    if (secNewPassword.length < 3) {
      setSecError('New password must be at least 3 characters.');
      return;
    }

    if (secNewPassword !== secConfirmPassword) {
      setSecError('New password and confirmation do not match.');
      return;
    }

    const ok = updateCredentials(secUsername, secNewPassword);
    if (ok) {
      setSecSuccess('Credentials updated successfully!');
      setSecCurrentPassword('');
      setSecNewPassword('');
      setSecConfirmPassword('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadPreview(result);
        setNewPhotoData((prev) => ({
          ...prev,
          src: result,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoData.src) {
      showNotification('Please provide an image URL or upload an image file.');
      return;
    }
    if (!newPhotoData.title.trim()) {
      showNotification('Please enter a photograph title.');
      return;
    }

    const catObj = categories.find((c) => c.id === newPhotoData.category);

    addPhoto({
      title: newPhotoData.title.trim(),
      filename: `custom_${Date.now()}.jpg`,
      category: newPhotoData.category,
      categoryName: catObj?.name || 'Aircraft',
      tag: newPhotoData.tag.trim() || undefined,
      src: newPhotoData.src,
      width: 900,
      height: 600,
      location: newPhotoData.location.trim() || 'United Kingdom',
      year: new Date().getFullYear().toString(),
      description: newPhotoData.description.trim() || `Original photograph from ${catObj?.name} collection.`,
      featured: newPhotoData.featured,
      camera: newPhotoData.camera,
      lens: newPhotoData.lens,
      exif: {
        shutter: newPhotoData.shutter,
        aperture: newPhotoData.aperture,
        iso: newPhotoData.iso,
        focalLength: '300mm'
      }
    });

    // Reset form
    setNewPhotoData({
      title: '',
      category: 'aircraft',
      tag: 'Airbus A380',
      src: '',
      location: 'London Heathrow (LHR)',
      description: '',
      camera: 'Canon EOS Professional',
      lens: 'Canon EF 100-400mm f/4.5-5.6L IS',
      shutter: '1/1600s',
      aperture: 'f/6.3',
      iso: 'ISO 200',
      featured: false
    });
    setUploadPreview('');
    setCmsTab('photos');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory({
      name: newCategoryName.trim(),
      slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: newCategoryDesc.trim() || 'New photography category.',
      originalAlbum: newCategoryName.trim()
    });
    setNewCategoryName('');
    setNewCategoryDesc('');
  };

  // If not logged in, show secure authentication wall
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Aviaography CMS Studio</h2>
              <p className="text-xs text-neutral-400">Secure Content Management Authentication</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Username</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
              <span className="text-amber-400 font-semibold block mb-0.5">Initial Security Credentials:</span>
              Username: <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">admin</code> · Password:{' '}
              <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">admin</code>
              <br />
              <span className="text-neutral-400 mt-1 block">
                You can change the username and password anytime in the CMS Security Settings.
              </span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Authenticate & Enter Studio</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered photos in CMS
  const filteredPhotos = photos.filter((p) => {
    if (photoCategoryFilter !== 'all' && p.category !== photoCategoryFilter) return false;
    if (photoSearch.trim()) {
      const q = photoSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-neutral-100 overflow-y-auto flex flex-col">
      {/* Top CMS Header */}
      <div className="sticky top-0 z-30 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <div className="h-4 w-px bg-neutral-700" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-display text-white">Aviaography CMS Studio</span>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Admin: {adminCredentials.username}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaultCatalog}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
            title="Reset catalog back to initial 85+ photos from Paul Brown's original website"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Originals</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Secondary CMS Navigation Bar */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/80 px-4 sm:px-8 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setCmsTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            cmsTab === 'overview'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCmsTab('photos')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            cmsTab === 'photos'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Manage Photographs ({photos.length})</span>
        </button>

        <button
          onClick={() => setCmsTab('add')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            cmsTab === 'add'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photograph</span>
        </button>

        <button
          onClick={() => setCmsTab('categories')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            cmsTab === 'categories'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setCmsTab('security')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            cmsTab === 'security'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Passwords</span>
        </button>
      </div>

      {/* Main CMS Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* TAB 1: OVERVIEW */}
        {cmsTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Total Photographs</span>
                <p className="text-3xl font-extrabold font-display tabular-nums text-white mt-1">
                  {photos.length}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">Live across all galleries</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Original Categories</span>
                <p className="text-3xl font-extrabold font-display tabular-nums text-amber-400 mt-1">
                  {categories.length}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">Aircraft, Airshows, Bases, Airports, Museums, Carriers</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Featured Showcases</span>
                <p className="text-3xl font-extrabold font-display tabular-nums text-white mt-1">
                  {photos.filter((p) => p.featured).length}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">Spotlight hero items</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Copyright Protection</span>
                <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5" /> Active
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">Anti-theft & right-click locked</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-sm font-bold text-white mb-4">Collection Status by Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const count = photos.filter((p) => p.category === cat.id).length;
                    const pct = Math.round((count / photos.length) * 100) || 0;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-neutral-300">{cat.name}</span>
                          <span className="text-neutral-400 tabular-nums">
                            {count} photos ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">CMS Quick Controls</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Easily add high-resolution aviation photos, edit metadata or titles, delete obsolete files,
                    or change your admin credentials.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCmsTab('add')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    onClick={() => setCmsTab('security')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PHOTOS */}
        {cmsTab === 'photos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={photoSearch}
                    onChange={(e) => setPhotoSearch(e.target.value)}
                    placeholder="Search by title, airfield, tag..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>

                <select
                  value={photoCategoryFilter}
                  onChange={(e) => setPhotoCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setCmsTab('add')}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap self-end sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photograph</span>
              </button>
            </div>

            {/* Photos Table */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3 w-16">Preview</th>
                      <th className="p-3">Title & Location</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Dimensions</th>
                      <th className="p-3">Featured</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredPhotos.map((photo) => (
                      <tr key={photo.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3">
                          <img
                            src={photo.src}
                            alt={photo.title}
                            className="w-12 h-8 object-cover rounded bg-neutral-800"
                          />
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-white">{photo.title}</p>
                          <p className="text-[11px] text-neutral-400">{photo.location}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 text-neutral-300">
                            {photo.categoryName}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-neutral-400">
                          {photo.width}×{photo.height}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => updatePhoto(photo.id, { featured: !photo.featured })}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              photo.featured
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {photo.featured ? 'Featured' : 'Standard'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingPhoto(photo)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                              title="Edit photo details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${photo.title}"?`)) {
                                  deletePhoto(photo.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Photo Modal */}
            {editingPhoto && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
                <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setEditingPhoto(null)}
                    className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-base font-bold text-white mb-4">Edit Photograph Metadata</h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingPhoto.title}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Category</label>
                      <select
                        value={editingPhoto.category}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.id === e.target.value);
                          setEditingPhoto({
                            ...editingPhoto,
                            category: e.target.value,
                            categoryName: cat?.name || editingPhoto.categoryName
                          });
                        }}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Subject / Sub-Tag</label>
                      <input
                        type="text"
                        value={editingPhoto.tag || ''}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, tag: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={editingPhoto.location}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editingPhoto.description}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="featured-edit"
                        checked={editingPhoto.featured}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, featured: e.target.checked })}
                        className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                      />
                      <label htmlFor="featured-edit" className="text-neutral-300">
                        Mark as Featured Showcase Photograph
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => setEditingPhoto(null)}
                        className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updatePhoto(editingPhoto.id, editingPhoto);
                          setEditingPhoto(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD NEW PHOTOGRAPH */}
        {cmsTab === 'add' && (
          <div className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold font-display text-white">Upload New Photograph</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Add an aviation or wildlife capture to your portfolio. You can upload an image file or provide an asset URL.
              </p>
            </div>

            <form onSubmit={handleCreatePhoto} className="space-y-5 text-xs">
              {/* Image Input Options */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-3">
                <label className="block text-neutral-300 font-medium">Image Source <span className="text-amber-400">*</span></label>
                
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-neutral-700 hover:border-amber-400 bg-neutral-900 text-neutral-300 cursor-pointer transition-colors text-center">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Local Image File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="relative">
                  <span className="text-[11px] text-neutral-500 uppercase block mb-1">Or Direct Image URL / Path</span>
                  <input
                    type="text"
                    value={newPhotoData.src}
                    onChange={(e) => {
                      setNewPhotoData({ ...newPhotoData, src: e.target.value });
                      setUploadPreview(e.target.value);
                    }}
                    placeholder="/photos/aviation/page3-1000.jpg or https://..."
                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                {uploadPreview && (
                  <div className="mt-3 relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[3/2] max-h-48">
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-1">Photograph Title <span className="text-amber-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={newPhotoData.title}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, title: e.target.value })}
                    placeholder="e.g. Red Arrows Diamond Nine Display"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Target Category <span className="text-amber-400">*</span></label>
                  <select
                    value={newPhotoData.category}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-1">Subject Tag</label>
                  <input
                    type="text"
                    value={newPhotoData.tag}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, tag: e.target.value })}
                    placeholder="e.g. Fast Jet, Aerobatic, Heavy Transport"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newPhotoData.location}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, location: e.target.value })}
                    placeholder="e.g. RAF Fairford, Gloucestershire"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPhotoData.description}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, description: e.target.value })}
                  placeholder="Notes on the flight pass, lighting conditions, or aircraft squadron..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Shutter Speed</label>
                  <input
                    type="text"
                    value={newPhotoData.shutter}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, shutter: e.target.value })}
                    placeholder="1/1600s"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Aperture</label>
                  <input
                    type="text"
                    value={newPhotoData.aperture}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, aperture: e.target.value })}
                    placeholder="f/6.3"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">ISO</label>
                  <input
                    type="text"
                    value={newPhotoData.iso}
                    onChange={(e) => setNewPhotoData({ ...newPhotoData, iso: e.target.value })}
                    placeholder="ISO 200"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-new"
                  checked={newPhotoData.featured}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, featured: e.target.checked })}
                  className="rounded border-neutral-800 text-amber-500 focus:ring-0"
                />
                <label htmlFor="featured-new" className="text-neutral-300">
                  Feature this image in the spotlight collection
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Photograph to Catalog</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: MANAGE CATEGORIES */}
        {cmsTab === 'categories' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Create category card */}
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Create New Collection Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Category Title</label>
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Warbirds & Heritage"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="Description of the category..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* Existing categories list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = photos.filter((p) => p.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-xl border border-neutral-800 bg-neutral-900 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-amber-400">
                          {count} photos
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
                      <span>Slug: {cat.slug}</span>
                      {categories.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete category "${cat.name}"? Photos will be reassigned to ${categories.find(c => c.id !== cat.id)?.name || 'Aircraft'}.`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY SETTINGS */}
        {cmsTab === 'security' && (
          <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-display">Security & Password Management</h2>
                <p className="text-xs text-neutral-400">Update username and administrative password</p>
              </div>
            </div>

            {secError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{secError}</span>
              </div>
            )}

            {secSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{secSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSecurity} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  value={secUsername}
                  onChange={(e) => setSecUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Current Password <span className="text-amber-400">*</span></label>
                <input
                  type="password"
                  required
                  value={secCurrentPassword}
                  onChange={(e) => setSecCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">New Password <span className="text-amber-400">*</span></label>
                <input
                  type="password"
                  required
                  value={secNewPassword}
                  onChange={(e) => setSecNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Confirm New Password <span className="text-amber-400">*</span></label>
                <input
                  type="password"
                  required
                  value={secConfirmPassword}
                  onChange={(e) => setSecConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Save New Credentials</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
