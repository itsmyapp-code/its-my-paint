export interface PaintSpec {
  id?: string;
  area: string; // e.g., Kitchen, Bedroom 1, Hallway
  what: string; // e.g., Walls, Ceiling, Trim, Radiators
  manufacturer: string;
  range?: string; // e.g., Diamond Matt, Heritage
  colourName: string;
  colourCode?: string; // Hex code
  finish: string; // e.g., Matt, Eggshell, Satin, Gloss, Masonry
  notes?: string;
}

export interface DecoratorSettings {
  id?: string;
  userId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  updatedAt: Date | string;
}

export interface Job {
  id?: string;
  userId?: string; // Track which decorator owns this job
  name: string; // Property Name/Address
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  startDate: Date | string;
  dueDate?: Date | string;
  status: 'active' | 'completed' | 'pending';
  paintSpecs: PaintSpec[];
  imageUrls?: string[];
  completedImageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
