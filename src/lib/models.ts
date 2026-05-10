export interface PaintSpec {
  id?: string;
  manufacturer: string;
  range?: string; // e.g. Diamond Matt, Heritage
  colourName: string;
  colourCode?: string; // Hex code
  finish: string; // e.g., Matt, Eggshell, Satin, Gloss, Masonry
}

export interface Job {
  id?: string;
  name: string; // e.g., "1428 Elm Street Exterior"
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  startDate: Date | string;
  dueDate?: Date | string;
  status: 'active' | 'completed' | 'pending';
  paintSpecs: PaintSpec[];
  imageUrls?: string[];
  completedImageUrl?: string; // Legacy field for the main proof image
  createdAt: Date | string;
  updatedAt: Date | string;
}
