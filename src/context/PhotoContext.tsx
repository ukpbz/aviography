import React, { createContext, useContext, useState, useEffect } from 'react';
import { Photo, Category, AdminCredentials, ActiveTab } from '../types';
import { INITIAL_PHOTOS, INITIAL_CATEGORIES } from '../data/photos';

interface PhotoContextType {
  photos: Photo[];
  categories: Category[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  activePhoto: Photo | null;
  setActivePhoto: (photo: Photo | null) => void;
  adminCredentials: AdminCredentials;
  isAdminAuthenticated: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateCredentials: (newUsername: string, newPassword: string) => boolean;
  addPhoto: (photo: Omit<Photo, 'id'>) => Photo;
  bulkAddPhotos: (photos: Omit<Photo, 'id'>[]) => Photo[];
  updatePhoto: (id: string, updates: Partial<Photo>) => boolean;
  deletePhoto: (id: string) => boolean;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => boolean;
  deleteCategory: (id: string) => boolean;
  resetToDefaultCatalog: () => void;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const STORAGE_KEY_PHOTOS = 'aviography_photos_catalog_v5';
const STORAGE_KEY_CATEGORIES = 'aviography_categories_catalog_v5';
const STORAGE_KEY_AUTH = 'aviography_admin_credentials_v5';
const STORAGE_KEY_SESSION = 'aviography_admin_session_v5';

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'admin',
  updatedAt: new Date().toISOString()
};

const PhotoContext = createContext<PhotoContextType | null>(null);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PHOTOS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_CATEGORIES;
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_CREDENTIALS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SESSION) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
    } catch (e) {
      console.warn('Failed to save photos to local storage', e);
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to local storage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(adminCredentials));
    } catch (e) {
      console.warn('Failed to save credentials to local storage', e);
    }
  }, [adminCredentials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, isAdminAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save session state', e);
    }
  }, [isAdminAuthenticated]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const loginAdmin = (user: string, pass: string): boolean => {
    if (user.trim() === adminCredentials.username && pass === adminCredentials.passwordHash) {
      setIsAdminAuthenticated(true);
      showNotification('Signed in to Aviography CMS Studio');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    showNotification('Logged out from CMS Studio');
  };

  const updateCredentials = (newUsername: string, newPassword: string): boolean => {
    if (!newUsername.trim() || !newPassword.trim()) return false;
    const updated: AdminCredentials = {
      username: newUsername.trim(),
      passwordHash: newPassword.trim(),
      updatedAt: new Date().toISOString()
    };
    setAdminCredentials(updated);
    showNotification('Admin credentials successfully updated');
    return true;
  };

  const addPhoto = (photoData: Omit<Photo, 'id'>): Photo => {
    const newId = `photo-custom-${Date.now()}`;
    const newPhoto: Photo = {
      ...photoData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    showNotification(`Added "${newPhoto.title}" to ${newPhoto.categoryName}`);
    return newPhoto;
  };

  const bulkAddPhotos = (photosData: Omit<Photo, 'id'>[]): Photo[] => {
    const timestamp = Date.now();
    const newPhotos: Photo[] = photosData.map((p, idx) => ({
      ...p,
      id: `photo-bulk-${timestamp}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    }));
    setPhotos((prev) => [...newPhotos, ...prev]);
    showNotification(`Successfully imported ${newPhotos.length} photos to catalog`);
    return newPhotos;
  };

  const updatePhoto = (id: string, updates: Partial<Photo>): boolean => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showNotification('Photo details updated');
    return true;
  };

  const deletePhoto = (id: string): boolean => {
    const photoToDelete = photos.find((p) => p.id === id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (activePhoto?.id === id) setActivePhoto(null);
    showNotification(`Deleted "${photoToDelete?.title || 'photo'}"`);
    return true;
  };

  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newId = catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = {
      ...catData,
      id: newId,
      slug: newId
    };
    setCategories((prev) => [...prev, newCat]);
    showNotification(`Created category "${newCat.name}"`);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>): boolean => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, ...updates };
        }
        return c;
      })
    );
    showNotification('Category updated');
    return true;
  };

  const deleteCategory = (id: string): boolean => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Reassign photos to uncategorized or aviation
    setPhotos((prev) =>
      prev.map((p) => (p.category === id ? { ...p, category: 'aircraft', categoryName: 'Aircraft' } : p))
    );
    showNotification('Category removed');
    return true;
  };

  const resetToDefaultCatalog = () => {
    setPhotos(INITIAL_PHOTOS);
    setCategories(INITIAL_CATEGORIES);
    setAdminCredentials(DEFAULT_CREDENTIALS);
    showNotification('Catalog restored to original photography collection');
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        categories,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        activePhoto,
        setActivePhoto,
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
        notification,
        showNotification
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error('usePhotos must be used within a PhotoProvider');
  return ctx;
};
