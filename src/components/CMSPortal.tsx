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
  Upload,
  UploadCloud,
  FileText,
  CheckSquare
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
    bulkAddPhotos,
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
  const [cmsTab, setCmsTab] = useState<'overview' | 'photos' | 'add' | 'bulk' | 'categories' | 'security'>('overview');

  // Bulk Upload state
  interface BulkStagedItem {
    tempId: string;
    src: string;
    filename: string;
    title: string;
    category: string;
    categoryName: string;
    tag: string;
    location: string;
    description: string;
    camera: string;
    lens: string;
    shutter: string;
    aperture: string;
    iso: string;
    featured: boolean;
    width: number;
    height: number;
    fileSize: number;
  }
  const [bulkStagedPhotos, setBulkStagedPhotos] = useState<BulkStagedItem[]>([]);
  const [batchCategory, setBatchCategory] = useState<string>('aircraft');
  const [batchLocation, setBatchLocation] = useState<string>('London Heathrow Airport (LHR)');
  const [batchTag, setBatchTag] = useState<string>('Airliner');
  const [batchCamera, setBatchCamera] = useState<string>('Canon EOS Professional');
  const [batchLens, setBatchLens] = useState<string>('Canon EF 100-400mm f/4.5-5.6L IS');
  const [batchShutter, setBatchShutter] = useState<string>('1/1600s');
  const [batchAperture, setBatchAperture] = useState<string>('f/6.3');
  const [batchIso, setBatchIso] = useState<string>('ISO 200');
  const [batchUrlsInput, setBatchUrlsInput] = useState<string>('');
  const [isBulkDragging, setIsBulkDragging] = useState<boolean>(false);

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

  const handleBulkFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const catObj = categories.find((c) => c.id === batchCategory);

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const cleanTitle = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();

        const img = new Image();
        img.onload = () => {
          setBulkStagedPhotos((prev) => [
            ...prev,
            {
              tempId: `bulk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              src,
              filename: file.name,
              title: cleanTitle || 'Untitled Photograph',
              category: batchCategory,
              categoryName: catObj?.name || 'Aircraft',
              tag: batchTag || 'Airliner',
              location: batchLocation || 'United Kingdom',
              description: `Original full-resolution aviation capture from bulk upload.`,
              camera: batchCamera,
              lens: batchLens,
              shutter: batchShutter,
              aperture: batchAperture,
              iso: batchIso,
              featured: false,
              width: img.naturalWidth || 1920,
              height: img.naturalHeight || 1280,
              fileSize: file.size
            }
          ]);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddBatchUrls = () => {
    const urls = batchUrlsInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (urls.length === 0) {
      showNotification('Please enter at least one valid image URL');
      return;
    }
    const catObj = categories.find((c) => c.id === batchCategory);

    const newItems: BulkStagedItem[] = urls.map((url, i) => {
      const rawName = url.split('/').pop()?.split('?')[0] || `photo_${i + 1}.jpg`;
      const cleanTitle = rawName
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim();

      return {
        tempId: `bulk-url-${Date.now()}-${i}`,
        src: url,
        filename: rawName,
        title: cleanTitle || `Aviation Photo ${i + 1}`,
        category: batchCategory,
        categoryName: catObj?.name || 'Aircraft',
        tag: batchTag || 'Airliner',
        location: batchLocation || 'United Kingdom',
        description: `Archival aviation photograph imported via batch URL.`,
        camera: batchCamera,
        lens: batchLens,
        shutter: batchShutter,
        aperture: batchAperture,
        iso: batchIso,
        featured: false,
        width: 1920,
        height: 1280,
        fileSize: 350000
      };
    });

    setBulkStagedPhotos((prev) => [...prev, ...newItems]);
    setBatchUrlsInput('');
    showNotification(`Added ${newItems.length} photos to staging queue`);
  };

  const handleApplyBatchSettings = () => {
    const catObj = categories.find((c) => c.id === batchCategory);
    setBulkStagedPhotos((prev) =>
      prev.map((item) => ({
        ...item,
        category: batchCategory,
        categoryName: catObj?.name || item.categoryName,
        location: batchLocation,
        tag: batchTag,
        camera: batchCamera,
        lens: batchLens,
        shutter: batchShutter,
        aperture: batchAperture,
        iso: batchIso
      }))
    );
    showNotification(`Applied batch settings to ${bulkStagedPhotos.length} staged photos`);
  };

  const handleCommitBulkUpload = () => {
    if (bulkStagedPhotos.length === 0) {
      showNotification('No photos staged for upload');
      return;
    }

    bulkAddPhotos(
      bulkStagedPhotos.map((item) => ({
        title: item.title,
        filename: item.filename,
        category: item.category,
        categoryName: item.categoryName,
        tag: item.tag,
        src: item.src,
        width: item.width,
        height: item.height,
        location: item.location,
        year: new Date().getFullYear().toString(),
        description: item.description,
        featured: item.featured,
        camera: item.camera,
        lens: item.lens,
        exif: {
          shutter: item.shutter,
          aperture: item.aperture,
          iso: item.iso,
          focalLength: '300mm'
        },
        fileSize: item.fileSize
      }))
    );

    setBulkStagedPhotos([]);
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
              <h2 className="text-lg font-bold font-display text-white">Aviography CMS Studio</h2>
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
            <span className="text-sm font-bold font-display text-white">Aviography CMS Studio</span>
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
          <span>Add Single Photograph</span>
        </button>

        <button
          onClick={() => setCmsTab('bulk')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            cmsTab === 'bulk'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Bulk Photo Upload</span>
          {bulkStagedPhotos.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-neutral-950 font-bold">
              {bulkStagedPhotos.length}
            </span>
          )}
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

        {/* TAB 3B: BULK PHOTO UPLOAD */}
        {cmsTab === 'bulk' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div>
                <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-amber-400" />
                  <span>Bulk Photograph Upload & Batch Staging</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Upload multiple image files simultaneously or import multiple image URLs in one batch.
                </p>
              </div>

              {bulkStagedPhotos.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBulkStagedPhotos([])}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-rose-400 bg-neutral-950 border border-neutral-800 rounded-lg transition-colors"
                  >
                    Clear Queue
                  </button>
                  <button
                    onClick={handleCommitBulkUpload}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Import All ({bulkStagedPhotos.length}) to Catalog</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dropzone & Import Methods Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Multi-file Dropzone */}
              <div className="lg:col-span-7">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsBulkDragging(true);
                  }}
                  onDragLeave={() => setIsBulkDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsBulkDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleBulkFiles(e.dataTransfer.files);
                    }
                  }}
                  className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
                    isBulkDragging
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-neutral-700 bg-neutral-900/60 hover:border-neutral-500'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Drop Multiple Photograph Files Here
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mb-4">
                    Select multiple JPEG, PNG, or WebP images from your device. Each file will be automatically parsed with natural dimensions.
                  </p>
                  <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer transition-colors shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>Select Multiple Image Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleBulkFiles(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Batch URLs Textarea Input */}
              <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Batch Image URLs Import</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Paste one image URL per line to stage web-hosted photographs:
                  </p>
                  <textarea
                    rows={4}
                    value={batchUrlsInput}
                    onChange={(e) => setBatchUrlsInput(e.target.value)}
                    placeholder="https://example.com/photos/a380_heathrow.jpg&#10;https://example.com/photos/f18_riat.jpg"
                    className="mt-2 w-full p-2.5 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none resize-none"
                  />
                </div>
                <button
                  onClick={handleAddBatchUrls}
                  disabled={!batchUrlsInput.trim()}
                  className="w-full py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Parse & Add URLs to Staging Queue</span>
                </button>
              </div>
            </div>

            {/* Batch Defaults Configuration Card */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Batch Metadata Defaults
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Apply consistent category, location, and camera settings across all staged photos.
                  </p>
                </div>
                <button
                  onClick={handleApplyBatchSettings}
                  disabled={bulkStagedPhotos.length === 0}
                  className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-lg transition-colors"
                >
                  Apply Settings to All ({bulkStagedPhotos.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Target Category</label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
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
                  <label className="block text-neutral-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={batchLocation}
                    onChange={(e) => setBatchLocation(e.target.value)}
                    placeholder="e.g. London Heathrow Airport (LHR)"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Subject / Tag</label>
                  <input
                    type="text"
                    value={batchTag}
                    onChange={(e) => setBatchTag(e.target.value)}
                    placeholder="e.g. Airbus A380 / Fast Jet"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Camera Body</label>
                  <input
                    type="text"
                    value={batchCamera}
                    onChange={(e) => setBatchCamera(e.target.value)}
                    placeholder="Canon EOS Professional"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            {/* Staging Queue Review */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span className="font-semibold text-white">
                  Staging Queue ({bulkStagedPhotos.length} Photographs Ready)
                </span>
                {bulkStagedPhotos.length > 0 && (
                  <span className="text-[11px] text-amber-400">
                    Review and edit titles or categories before importing
                  </span>
                )}
              </div>

              {bulkStagedPhotos.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
                  <UploadCloud className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-300 font-medium">Staging Queue is Currently Empty</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Drag and drop files above or select multiple images to batch stage photos for import.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden divide-y divide-neutral-800/60 max-h-[500px] overflow-y-auto">
                  {bulkStagedPhotos.map((item, idx) => (
                    <div
                      key={item.tempId}
                      className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-neutral-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-[11px] font-mono text-neutral-500 w-5">
                          {idx + 1}.
                        </span>
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-14 h-10 object-cover rounded bg-neutral-950 shrink-0"
                        />
                        <div className="flex-1 sm:w-64">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              setBulkStagedPhotos((prev) =>
                                prev.map((p) => (p.tempId === item.tempId ? { ...p, title: newTitle } : p))
                              );
                            }}
                            className="w-full px-2.5 py-1 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded text-white font-medium"
                          />
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                            {item.filename} · {item.width}×{item.height}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const catId = e.target.value;
                            const catObj = categories.find((c) => c.id === catId);
                            setBulkStagedPhotos((prev) =>
                              prev.map((p) =>
                                p.tempId === item.tempId
                                  ? { ...p, category: catId, categoryName: catObj?.name || p.categoryName }
                                  : p
                              )
                            );
                          }}
                          className="px-2.5 py-1 text-xs bg-neutral-950 border border-neutral-800 rounded text-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() =>
                            setBulkStagedPhotos((prev) => prev.filter((p) => p.tempId !== item.tempId))
                          }
                          className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                          title="Remove from queue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Commit Button */}
              {bulkStagedPhotos.length > 0 && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCommitBulkUpload}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg hover:shadow-amber-400/20"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Confirm & Import All {bulkStagedPhotos.length} Photographs to Catalog</span>
                  </button>
                </div>
              )}
            </div>
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
