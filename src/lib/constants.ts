/**
 * UK Paint Manufacturers and Brands - 2026 Professional Standard
 * Categorized for itsmypaint database and UI suggestions.
 */

export interface PaintBrand {
  name: string;
  category: 'Professional' | 'Premium' | 'Modern/Eco' | 'Value' | 'Specialist' | 'Exterior';
  popularRanges: string[];
}

export const UK_PAINT_MANUFACTURERS: PaintBrand[] = [
  {
    name: "Dulux Trade",
    category: "Professional",
    popularRanges: ["Diamond Matt", "Heritage", "Weathershield", "Vinyl Matt", "Diamond Eggshell"]
  },
  {
    name: "Johnstone's Trade",
    category: "Professional",
    popularRanges: ["Perfect Matt", "Stormshield", "Acrylic Eggshell", "Covaplus Vinyl Matt"]
  },
  {
    name: "Crown Trade",
    category: "Professional",
    popularRanges: ["Clean Extreme", "Vinyl Matt", "Fastflow", "Sandtex Specialist"]
  },
  {
    name: "Farrow & Ball",
    category: "Premium",
    popularRanges: ["Estate Emulsion", "Modern Emulsion", "Estate Eggshell", "Modern Eggshell"]
  },
  {
    name: "Little Greene",
    category: "Premium",
    popularRanges: ["Intelligent Matt", "Absolute Matt", "Intelligent Eggshell"]
  },
  {
    name: "Paint & Paper Library",
    category: "Premium",
    popularRanges: ["Pure Flat Emulsion", "Architects Matt"]
  },
  {
    name: "Benjamin Moore",
    category: "Premium",
    popularRanges: ["Aura", "Regal Select", "Scuff-X"]
  },
  {
    name: "Lick",
    category: "Modern/Eco",
    popularRanges: ["Matt", "Eggshell", "Exterior"]
  },
  {
    name: "COAT Paints",
    category: "Modern/Eco",
    popularRanges: ["Flat Matt", "Soft Sheen", "Exterior Eggshell"]
  },
  {
    name: "Earthborn",
    category: "Modern/Eco",
    popularRanges: ["Claypaint", "Lifestyle Emulsion", "Eggshell No.17"]
  },
  {
    name: "Leyland Trade",
    category: "Value",
    popularRanges: ["Contract Matt", "Vinyl Matt", "Vinyl Silk", "Hardwearing Matt"]
  },
  {
    name: "Armstead Trade",
    category: "Value",
    popularRanges: ["Vinyl Matt", "Contract Matt", "Pliolite Masonry"]
  },
  {
    name: "Zinsser",
    category: "Specialist",
    popularRanges: ["B-I-N Primer", "Bulls Eye 1-2-3", "Perma-White", "AllCoat Exterior"]
  },
  {
    name: "Tikkurila",
    category: "Specialist",
    popularRanges: ["Optiva 5", "Helmi", "Everal Aqua"]
  },
  {
    name: "Sandtex",
    category: "Exterior",
    popularRanges: ["High Cover Smooth", "Ultra Smooth Masonry"]
  }
];

export const ALL_MANUFACTURERS = UK_PAINT_MANUFACTURERS.map(m => m.name);

export const GET_RANGES_FOR_MANUFACTURER = (name: string) => {
  return UK_PAINT_MANUFACTURERS.find(m => m.name === name)?.popularRanges || [];
};
