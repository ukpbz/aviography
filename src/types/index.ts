export interface PhotoExif {
  shutter?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
}

export interface Photo {
  id: string;
  title: string;
  filename: string;
  category: string;
  categoryName: string;
  tag?: string;
  src: string;
  width: number;
  height: number;
  location: string;
  year?: string;
  description: string;
  featured?: boolean;
  camera?: string;
  lens?: string;
  exif?: PhotoExif;
  fileSize?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  folder?: string;
  webDir?: string;
  originalAlbum?: string;
  description: string;
  icon?: string;
  coverPhoto?: string;
  subCategories?: string[];
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Plain/SHA representation for CMS security
  updatedAt?: string;
}

export type ViewMode = 'grid' | 'masonry' | 'fullscreen-slide';

export type ActiveTab = 'home' | 'gallery' | 'about' | 'contact' | 'cms';

export interface HomepageSlide {
  id: string;
  title: string;
  src: string;
  location: string;
  tag: string;
  aircraft: string;
  resolution: string;
}
