export interface PaintSpec {
  id?: string;
  manufacturer: string;
  range?: string;
  colorName: string;
  colorCode?: string;
  finish: string; // e.g., Matte, Eggshell, Semi-Gloss
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
  completedImageUrl?: string; // Firebase Storage URL
  createdAt: Date | string;
  updatedAt: Date | string;
}
