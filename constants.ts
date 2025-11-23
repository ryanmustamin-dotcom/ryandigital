import { ShapeLevel, TypeLevel, LayoutLevel } from './types';

export const MAX_ROUNDS = 5;

export const REFLECTION_MESSAGES = {
  EXPERT: {
    title: "Master Desain Sejati!",
    message: "Luar biasa! Mata dan insting desainmu sangat tajam. Kamu sudah siap menangani proyek profesional."
  },
  PRO: {
    title: "Desainer Handal",
    message: "Hasil yang sangat bagus. Sedikit lagi latihan untuk mencapai kesempurnaan. Terus asah kemampuanmu!"
  },
  JUNIOR: {
    title: "Butuh Jam Terbang",
    message: "Dasar yang bagus, tapi kamu perlu lebih teliti lagi. Perbanyak latihan melihat detail kecil."
  },
  ROOKIE: {
    title: "Harus Banyak Belajar",
    message: "Jangan menyerah! Desain butuh kepekaan yang dilatih berulang-ulang. Coba lagi ya!"
  }
};

export const getReflection = (score: number) => {
  if (score >= 90) return REFLECTION_MESSAGES.EXPERT;
  if (score >= 75) return REFLECTION_MESSAGES.PRO;
  if (score >= 50) return REFLECTION_MESSAGES.JUNIOR;
  return REFLECTION_MESSAGES.ROOKIE;
};

// SHAPE LEVELS
export const SHAPE_LEVELS: ShapeLevel[] = [
  {
    id: 1,
    name: "Lengkungan Dasar",
    instruction: "Level 1/5: Buat lengkungan sederhana ke bawah.",
    p0: { x: 100, y: 300 },
    p1: { x: 100, y: 100 },
    p2: { x: 500, y: 100 },
    p3: { x: 500, y: 300 }
  },
  {
    id: 2,
    name: "Gelombang Sinus",
    instruction: "Level 2/5: Buat bentuk gelombang S.",
    p0: { x: 100, y: 200 },
    p1: { x: 300, y: 50 },
    p2: { x: 300, y: 350 },
    p3: { x: 500, y: 200 }
  },
  {
    id: 3,
    name: "Sudut Tumpul",
    instruction: "Level 3/5: Buat sudut membulat lebar.",
    p0: { x: 50, y: 350 },
    p1: { x: 50, y: 50 },
    p2: { x: 550, y: 50 },
    p3: { x: 550, y: 350 }
  },
  {
    id: 4,
    name: "Tetesan Air",
    instruction: "Level 4/5: Bentuk asimetris seperti tetesan.",
    p0: { x: 300, y: 50 },
    p1: { x: 50, y: 200 },
    p2: { x: 550, y: 200 },
    p3: { x: 300, y: 350 }
  },
  {
    id: 5,
    name: "Mata Kail",
    instruction: "Level 5/5: Lengkungan tajam dan presisi.",
    p0: { x: 200, y: 350 },
    p1: { x: 200, y: 50 },
    p2: { x: 500, y: 50 },
    p3: { x: 400, y: 250 }
  }
];

// TYPE LEVELS (Complex Kerning)
export const TYPE_LEVELS: TypeLevel[] = [
  {
    id: 1,
    word: "AVA",
    fontFamily: "serif",
    instruction: "Geser huruf 'V' agar jaraknya seimbang di antara kedua 'A'.",
    idealSpacings: [-15, -15] // Negative spacing for AVA usually
  },
  {
    id: 2,
    word: "TYPE",
    fontFamily: "sans-serif",
    instruction: "Sesuaikan jarak T-Y, Y-P, dan P-E.",
    idealSpacings: [-5, 2, 5] 
  },
  {
    id: 3,
    word: "WAVE",
    fontFamily: "Arial",
    instruction: "Perhatikan sudut huruf 'W', 'A', dan 'V'. Rapatkan.",
    idealSpacings: [-8, -8, 2]
  },
  {
    id: 4,
    word: "LYRA",
    fontFamily: "Times New Roman",
    instruction: "Huruf 'L' dan 'Y' memiliki banyak ruang kosong. Sesuaikan.",
    idealSpacings: [-10, 2, 0]
  },
  {
    id: 5,
    word: "AVATAR",
    fontFamily: "sans-serif",
    instruction: "Tantangan terakhir. Buat jarak visual yang konsisten.",
    idealSpacings: [-15, -10, -5, -10, -5]
  }
];

// LAYOUT LEVELS (Drag and Drop Principles)
// Container is assumed 350x350 for calculation simplicity
export const LAYOUT_LEVELS: LayoutLevel[] = [
  {
    id: 1,
    name: "Visual Center",
    instruction: "Geser kotak ke tengah visual (sedikit di atas tengah matematis).",
    gridType: 'center',
    elements: [
      { id: '1', type: 'box', width: 100, height: 100, startX: 20, startY: 20, targetX: 125, targetY: 115, color: 'bg-layout-500' }
    ]
  },
  {
    id: 2,
    name: "Rule of Thirds",
    instruction: "Letakkan titik fokus pada persimpangan garis sepertiga kanan atas.",
    gridType: 'thirds',
    elements: [
      { id: '1', type: 'box', label: 'Fokus', width: 80, height: 80, startX: 135, startY: 135, targetX: 210, targetY: 60, color: 'bg-accent-500' }
    ]
  },
  {
    id: 3,
    name: "Alignment (Rata Kiri)",
    instruction: "Sejajarkan Judul dan Paragraf rata kiri dengan rapi.",
    gridType: 'columns',
    elements: [
      { id: '1', type: 'text', label: 'Judul', width: 150, height: 40, startX: 150, startY: 50, targetX: 40, targetY: 50, color: 'bg-slate-800' },
      { id: '2', type: 'text', label: 'Paragraf', width: 200, height: 80, startX: 20, startY: 150, targetX: 40, targetY: 100, color: 'bg-slate-400' }
    ]
  },
  {
    id: 4,
    name: "Proximity (Pengelompokan)",
    instruction: "Kelompokkan ikon dengan labelnya. Jauhkan dari yang tidak berkaitan.",
    gridType: 'none',
    elements: [
      { id: '1', type: 'box', label: 'Icon', width: 50, height: 50, startX: 280, startY: 280, targetX: 50, targetY: 100, color: 'bg-brand-500' },
      { id: '2', type: 'text', label: 'Label', width: 80, height: 30, startX: 20, startY: 20, targetX: 50, targetY: 160, color: 'bg-slate-500' }
    ]
  },
  {
    id: 5,
    name: "Symmetry",
    instruction: "Buat komposisi simetris. Letakkan kotak kedua seimbang dengan kotak pertama.",
    gridType: 'center',
    elements: [
      { id: '1', type: 'box', width: 80, height: 80, startX: 50, startY: 135, targetX: 50, targetY: 135, color: 'bg-layout-500' }, // Fixed visually (user thinks they can move it but target is start)
      { id: '2', type: 'box', width: 80, height: 80, startX: 135, startY: 20, targetX: 220, targetY: 135, color: 'bg-layout-500' }
    ]
  }
];