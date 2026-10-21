export interface QuickDish {
  name: string;        // Kannada name: e.g. 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್'
  nameEn: string;      // English name: e.g. 'Bisi Bele Bath'
  category: string;
  spice: 0 | 1 | 2 | 3;
  veg: boolean;
  description: string;
  image: string;
  defaultPrice: number;
  region?: string;     // e.g. 'Coastal Karavali', 'Old Mysore', 'North Karnataka', 'Malnad & Coorg'
  keywords: string[];  // English & phonetic aliases
}

// ── COMPREHENSIVE KARNATAKA FOOD DICTIONARY FOR AUTO-TRANSLITERATION ──
const KANNADA_TERM_MAP: Record<string, string> = {
  // Meats & Seafood
  'chicken': 'ಚಿಕನ್',
  'koli': 'ಕೋಳಿ',
  'kori': 'ಕೋಳಿ',
  'nati': 'ನಾಟಿ',
  'mutton': 'ಮಟನ್',
  'meat': 'ಮಾಂಸ',
  'fish': 'ಮೀನು',
  'meenu': 'ಮೀನು',
  'meen': 'ಮೀನು',
  'bangude': 'ಬಾಂಗುಡೆ',
  'bangdi': 'ಬಾಂಗುಡೆ',
  'bangda': 'ಬಾಂಗುಡೆ',
  'mackerel': 'ಬಾಂಗುಡೆ',
  'anjal': 'ಅಂಜಲ್',
  'surmai': 'ಅಂಜಲ್',
  'kingfish': 'ಅಂಜಲ್',
  'seer': 'ಅಂಜಲ್',
  'kane': 'ಕಾಣೆ',
  'ladyfish': 'ಕಾಣೆ',
  'manji': 'ಮಾಂಜಿ',
  'pomfret': 'ಮಾಂಜಿ',
  'paplet': 'ಮಾಂಜಿ',
  'buthai': 'ಬೂತಾಯಿ',
  'boothai': 'ಬೂತಾಯಿ',
  'tarli': 'ಬೂತಾಯಿ',
  'sardine': 'ಬೂತಾಯಿ',
  'sardines': 'ಬೂತಾಯಿ',
  'prawn': 'ಸೀಗಡಿ',
  'prawns': 'ಸೀಗಡಿ',
  'shrimp': 'ಸೀಗಡಿ',
  'yetti': 'ಸೀಗಡಿ',
  'sigadi': 'ಸೀಗಡಿ',
  'seegadi': 'ಸೀಗಡಿ',
  'crab': 'ಏಡಿ',
  'crabs': 'ಏಡಿ',
  'denji': 'ಏಡಿ',
  'edi': 'ಏಡಿ',
  'marwai': 'ಮಾರ್ವಾಯಿ',
  'clams': 'ಮಾರ್ವಾಯಿ',
  'clam': 'ಮಾರ್ವಾಯಿ',
  'tisre': 'ಮಾರ್ವಾಯಿ',
  'squid': 'ಸ್ಕ್ವಿಡ್',
  'bondas': 'ಬೊಂಡಾಸ್',
  'calamari': 'ಸ್ಕ್ವಿಡ್',
  'egg': 'ಮೊಟ್ಟೆ',
  'eggs': 'ಮೊಟ್ಟೆ',
  'motte': 'ಮೊಟ್ಟೆ',
  'pork': 'ಹಂದಿ',
  'pandi': 'ಪಾಂಡಿ',
  'handi': 'ಹಂದಿ',
  'beef': 'ಬೀಫ್',

  // Preparations & Cooking Styles
  'fry': 'ಫ್ರೈ',
  'tawa': 'ತವಾ',
  'rawa': 'ರವಾ',
  'rava': 'ರವಾ',
  'sukka': 'ಸುಕ್ಕಾ',
  'ghee': 'ಘೀ',
  'roast': 'ರೋಸ್ಟ್',
  'gassi': 'ಗಸಿ',
  'gasi': 'ಗಸಿ',
  'curry': 'ಕರಿ',
  'gravy': 'ಗ್ರೇವಿ',
  'saaru': 'ಸಾರು',
  'saru': 'ಸಾರು',
  'sambar': 'ಸಾಂಬಾರ್',
  'sambhar': 'ಸಾಂಬಾರ್',
  'rasam': 'ರಸಂ',
  'kebab': 'ಕಬಾಬ್',
  'kabab': 'ಕಬಾಬ್',
  'tikka': 'ಟಿಕ್ಕಾ',
  'tandoori': 'ತಂದೂರಿ',
  'biryani': 'ಬಿರಿಯಾನಿ',
  'biriyani': 'ಬಿರಿಯಾನಿ',
  'palya': 'ಪಲ್ಯ',
  'pallya': 'ಪಲ್ಯ',
  'bhurji': 'ಭುರ್ಜಿ',
  'bafat': 'ಬಾಫತ್',
  'sorpotel': 'ಸಾರ್ಪೋಟೇಲ್',
  'pulimunchi': 'ಪುಳಿಮುಂಚಿ',
  'chops': 'ಚಾಪ್ಸ್',
  'masala': 'ಮಸಾಲ',
  'chilli': 'ಚಿಲ್ಲಿ',
  'chilly': 'ಚಿಲ್ಲಿ',
  'pepper': 'ಪೆಪ್ಪರ್',
  'lollipop': 'ಲಾಲಿಪಾಪ್',

  // Grains, Breads & Tiffins
  'dosa': 'ದೋಸೆ',
  'dose': 'ದೋಸೆ',
  'masala dosa': 'ಮಸಾಲ ದೋಸೆ',
  'benne': 'ಬೆಣ್ಣೆ',
  'benne dosa': 'ಬೆಣ್ಣೆ ದೋಸೆ',
  'open': 'ಓಪನ್',
  'set': 'ಸೆಟ್',
  'set dosa': 'ಸೆಟ್ ದೋಸೆ',
  'neer': 'ನೀರ್',
  'neer dosa': 'ನೀರ್ ದೋಸೆ',
  'davangere': 'ದಾವಣಗೆರೆ',
  'mysore': 'ಮೈಸೂರು',
  'rotti': 'ರೊಟ್ಟಿ',
  'roti': 'ರೊಟ್ಟಿ',
  'akki': 'ಅಕ್ಕಿ',
  'akki rotti': 'ಅಕ್ಕಿ ರೊಟ್ಟಿ',
  'jolada': 'ಜೋಳದ',
  'jola': 'ಜೋಳದ',
  'jolada rotti': 'ಜೋಳದ ರೊಟ್ಟಿ',
  'ragi': 'ರಾಗಿ',
  'ragi mudde': 'ರಾಗಿ ಮುದ್ದೆ',
  'ragi rotti': 'ರಾಗಿ ರೊಟ್ಟಿ',
  'mudde': 'ಮುದ್ದೆ',
  'idli': 'ಇಡ್ಲಿ',
  'thatte': 'ತಟ್ಟೆ',
  'thatte idli': 'ತಟ್ಟೆ ಇಡ್ಲಿ',
  'vada': 'ವಡೆ',
  'maddur': 'ಮದ್ದೂರು',
  'maddur vada': 'ಮದ್ದೂರು ವಡೆ',
  'kadubu': 'ಕಡುಬು',
  'kotte': 'ಕೊಟ್ಟೆ',
  'kotte kadubu': 'ಕೊಟ್ಟೆ ಕಡುಬು',
  'pundi': 'ಪುಂಡಿ',
  'buns': 'ಬನ್ಸ್',
  'mangalore buns': 'ಮಂಗಳೂರು ಬನ್ಸ್',
  'mangalore': 'ಮಂಗಳೂರು',
  'mangaluru': 'ಮಂಗಳೂರು',
  'goli': 'ಗೋಳಿ',
  'baje': 'ಬಜೆ',
  'goli baje': 'ಗೋಳಿ ಬಜೆ',
  'patrode': 'ಪತ್ರೊಡೆ',
  'pathrode': 'ಪತ್ರೊಡೆ',
  'kadambuttu': 'ಕಡಂಬುಟ್ಟು',
  'oti': 'ಒಟ್ಟಿ',
  'pulao': 'ಪಲಾವ್',
  'pulav': 'ಪಲಾವ್',
  'bath': 'ಬಾತ್',
  'baath': 'ಬಾತ್',
  'bisi': 'ಬಿಸಿ',
  'bele': 'ಬೇಳೆ',
  'bisi bele bath': 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
  'vangi': 'ವಾಂಗಿ',
  'vangi bath': 'ವಾಂಗಿ ಬಾತ್',
  'chitranna': 'ಚಿತ್ರಾನ್ನ',
  'lemon': 'ನಿಂಬೆ',
  'puliyogare': 'ಪುಳಿಯೋಗರೆ',
  'tamarind': 'ಹುಣಸೆ',
  'khara': 'ಖಾರಾ',
  'khara bath': 'ಖಾರಾ ಬಾತ್',
  'kesari': 'ಕೇಸರಿ',
  'kesari bath': 'ಕೇಸರಿ ಬಾತ್',
  'uppittu': 'ಉಪ್ಪಿಟ್ಟು',
  'upma': 'ಉಪ್ಪಿಟ್ಟು',
  'shavige': 'ಶಾವಿಗೆ',
  'rice': 'ಅನ್ನ',
  'anna': 'ಅನ್ನ',
  'red rice': 'ಕೆಂಪು ಅನ್ನ',
  'curd': 'ಮೊಸರು',
  'mosaranna': 'ಮೊಸರನ್ನ',
  'curd rice': 'ಮೊಸರನ್ನ',
  'jeera': 'ಜೀರಾ',
  'ghee rice': 'ಘೀ ರೈಸ್',
  'donne': 'ದೊನ್ನೆ',
  'donne biryani': 'ದೊನ್ನೆ ಬಿರಿಯಾನಿ',

  // Vegetables & Curries
  'yennegai': 'ಎಣ್ಣೆಗಾಯಿ',
  'badanekayi': 'ಬದನೆಕಾಯಿ',
  'brinjal': 'ಬದನೆಕಾಯಿ',
  'shenga': 'ಶೇಂಗಾ',
  'peanut': 'ಶೇಂಗಾ',
  'chutney': 'ಚಟ್ನಿ',
  'pudi': 'ಪುಡಿ',
  'kaalu': 'ಕಾಳು',
  'moong': 'ಹೆಸರು ಕಾಳು',
  'hesaru': 'ಹೆಸರು',
  'kadle': 'ಕಡಲೆ',
  'soppu': 'ಸೊಪ್ಪು',
  'soppina': 'ಸೊಪ್ಪಿನ',
  'bassaru': 'ಬಸ್ಸಾರು',
  'majjige': 'ಮಜ್ಜಿಗೆ',
  'huli': 'ಹುಳಿ',
  'paneer': 'ಪನ್ನೀರ್',
  'mushroom': 'ಅಣಬೆ',
  'anabe': 'ಅಣಬೆ',
  'gobi': 'ಗೋಬಿ',
  'manchurian': 'ಮಂಚೂರಿಯನ್',
  'baby corn': 'ಬೇಬಿ ಕಾರ್ನ್',
  'corn': 'ಕಾರ್ನ್',
  'mirchi': 'ಮೆಣಸಿನಕಾಯಿ',
  'menasinakai': 'ಮೆಣಸಿನಕಾಯಿ',
  'bajji': 'ಬಜ್ಜಿ',
  'girmit': 'ಗಿರ್ಮಿಟ್',
  'mandakki': 'ಮಂಡಕ್ಕಿ',
  'oggarane': 'ಒಗ್ಗರಣೆ',
  'dal': 'ದಾಲ್',
  'tadka': 'ತಡ್ಕಾ',
  'bamboo': 'ಕಣಿಲೆ',
  'kanile': 'ಕಣಿಲೆ',

  // Sweets & Desserts
  'mysore pak': 'ಮೈಸೂರು ಪಾಕ್',
  'pak': 'ಪಾಕ್',
  'holige': 'ಹೋಳಿಗೆ',
  'obbattu': 'ಒಬ್ಬಟ್ಟು',
  'payasa': 'ಪಾಯಸ',
  'payasam': 'ಪಾಯಸ',
  'gasagase': 'ಗಸಗಸೆ',
  'halasina': 'ಹಲಸಿನ',
  'jackfruit': 'ಹಲಸಿನ ಹಣ್ಣು',
  'halbai': 'ಹಾಲಬಾಯಿ',
  'dharwad': 'ಧಾರವಾಡ',
  'peda': 'ಪೇಡ',
  'dharwad peda': 'ಧಾರವಾಡ ಪೇಡ',
  'karadantu': 'ಕರದಂಟು',
  'gokak': 'ಗೋಕಾಕ್',
  'kunda': 'ಕುಂದಾ',
  'belagavi': 'ಬೆಳಗಾವಿ',
  'chiroti': 'ಚಿರೋಟಿ',
  'pheni': 'ಫೇಣಿ',

  // Beverages & Extras
  'coffee': 'ಕಾಫಿ',
  'filter coffee': 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
  'tea': 'ಚಹಾ',
  'chai': 'ಚಹಾ',
  'kokum': 'ಕೊಕ್ಕಂ',
  'cooler': 'ಕೂಲರ್',
  'juice': 'ಜ್ಯೂಸ್',
  'kashaya': 'ಕಷಾಯ',
  'badam': 'ಬಾದಾಮಿ',
  'milk': 'ಹಾಲು',
  'buttermilk': 'ಮಜ್ಜಿಗೆ',
  'papad': 'ಹಪ್ಪಳ',
  'pickle': 'ಉಪ್ಪಿನಕಾಯಿ',
  'thali': 'ಊಟ (ಥಾಳಿ)',
  'meals': 'ಊಟ',
  'oota': 'ಊಟ',
  'combo': 'ಕಾಂಬೋ',
  'special': 'ಸ್ಪೆಷಲ್',
};

// Phonetic fallback engine for converting any english word to Kannada characters
const PHONETIC_CONSONANTS: Record<string, string> = {
  'ch': 'ಚ', 'sh': 'ಶ', 'th': 'ತ', 'dh': 'ಧ', 'bh': 'ಭ', 'kh': 'ಖ', 'gh': 'ಘ',
  'ph': 'ಫ', 'jh': 'ಝ', 'k': 'ಕ', 'g': 'ಗ', 'j': 'ಜ', 't': 'ಟ', 'd': 'ಡ',
  'n': 'ನ', 'p': 'ಪ', 'b': 'ಬ', 'm': 'ಮ', 'y': 'ಯ', 'r': 'ರ', 'l': 'ಲ',
  'v': 'ವ', 'w': 'ವ', 's': 'ಸ', 'h': 'ಹ', 'f': 'ಫ', 'z': 'ಝ',
};

export function transliterateToKannada(englishText: string): string {
  if (!englishText || !englishText.trim()) return '';
  const clean = englishText.trim().toLowerCase();

  // 1. Direct full phrase match
  if (KANNADA_TERM_MAP[clean]) {
    return KANNADA_TERM_MAP[clean];
  }

  // 2. Tokenize words & multi-word subphrases
  const words = clean.split(/\s+/);
  const result: string[] = [];
  let i = 0;

  while (i < words.length) {
    // Check 3-word combo
    if (i + 2 < words.length) {
      const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (KANNADA_TERM_MAP[threeWord]) {
        result.push(KANNADA_TERM_MAP[threeWord]);
        i += 3;
        continue;
      }
    }
    // Check 2-word combo
    if (i + 1 < words.length) {
      const twoWord = `${words[i]} ${words[i + 1]}`;
      if (KANNADA_TERM_MAP[twoWord]) {
        result.push(KANNADA_TERM_MAP[twoWord]);
        i += 2;
        continue;
      }
    }
    // Single word match
    const single = words[i];
    if (KANNADA_TERM_MAP[single]) {
      result.push(KANNADA_TERM_MAP[single]);
    } else {
      // Phonetic fallback for unfamiliar syllables
      let wordResult = '';
      let wIdx = 0;
      while (wIdx < single.length) {
        if (wIdx + 1 < single.length) {
          const pair = single.slice(wIdx, wIdx + 2);
          if (PHONETIC_CONSONANTS[pair]) {
            wordResult += PHONETIC_CONSONANTS[pair];
            wIdx += 2;
            continue;
          }
        }
        const char = single[wIdx];
        if (PHONETIC_CONSONANTS[char]) {
          wordResult += PHONETIC_CONSONANTS[char];
        } else if (char === 'a' || char === 'e' || char === 'i' || char === 'o' || char === 'u') {
          // Add vowel mark or baseline
          if (wordResult.length === 0) {
            wordResult += char === 'a' ? 'ಅ' : char === 'i' ? 'ಇ' : char === 'u' ? 'ಉ' : char === 'e' ? 'ಎ' : 'ಒ';
          }
        }
        wIdx++;
      }
      result.push(wordResult || single);
    }
    i++;
  }

  return result.join(' ');
}

// Auto-detect dish properties (veg/non-veg, image, price, category, spice)
export function detectDishAttributes(name: string): {
  veg: boolean;
  category: string;
  image: string;
  defaultPrice: number;
  spice: 0 | 1 | 2 | 3;
} {
  const lower = name.toLowerCase();

  // Seafood
  if (
    lower.includes('fish') || lower.includes('bangude') || lower.includes('bangdi') ||
    lower.includes('bangda') || lower.includes('anjal') || lower.includes('surmai') ||
    lower.includes('kane') || lower.includes('manji') || lower.includes('pomfret') ||
    lower.includes('buthai') || lower.includes('sardine') || lower.includes('squid') ||
    lower.includes('bombil') || lower.includes('rawas') || lower.includes('meen')
  ) {
    const isCurry = lower.includes('curry') || lower.includes('gravy') || lower.includes('pulimunchi') || lower.includes('saaru');
    return {
      veg: false,
      category: 'Fish & seafood',
      image: isCurry ? '/fish-curry.jpg' : '/anjal-tawa-fry.jpg',
      defaultPrice: 280,
      spice: 2,
    };
  }

  // Prawn / Crab
  if (
    lower.includes('prawn') || lower.includes('shrimp') || lower.includes('yetti') ||
    lower.includes('sigadi') || lower.includes('crab') || lower.includes('denji') ||
    lower.includes('clams') || lower.includes('marwai')
  ) {
    return {
      veg: false,
      category: 'Fish & seafood',
      image: '/prawn-ghee-roast.jpg',
      defaultPrice: 380,
      spice: 3,
    };
  }

  // Chicken
  if (
    lower.includes('chicken') || lower.includes('kori') || lower.includes('koli') ||
    lower.includes('nati') || lower.includes('lollipop') || lower.includes('kebab')
  ) {
    const isRoast = lower.includes('roast') || lower.includes('ghee');
    const isRotti = lower.includes('rotti') || lower.includes('roti');
    return {
      veg: false,
      category: 'Chicken',
      image: isRotti ? '/kori-rotti.jpg' : isRoast ? '/chicken-ghee-roast.jpg' : '/chicken-sukka.jpg',
      defaultPrice: 310,
      spice: 2,
    };
  }

  // Mutton
  if (lower.includes('mutton') || lower.includes('lamb') || lower.includes('goat') || lower.includes('chops')) {
    return {
      veg: false,
      category: 'Coastal classics',
      image: '/chicken-ghee-roast.jpg',
      defaultPrice: 420,
      spice: 3,
    };
  }

  // Egg
  if (lower.includes('egg') || lower.includes('motte') || lower.includes('bhurji')) {
    return {
      veg: false,
      category: 'Sides & extras',
      image: '/cinematic-cuisine.jpg',
      defaultPrice: 190,
      spice: 2,
    };
  }

  // Pork
  if (lower.includes('pork') || lower.includes('pandi') || lower.includes('bafat') || lower.includes('sorpotel')) {
    return {
      veg: false,
      category: 'Coastal classics',
      image: '/cinematic-cuisine.jpg',
      defaultPrice: 380,
      spice: 3,
    };
  }

  // Dosa / Rotti / Tiffin (Griddle)
  if (
    lower.includes('dosa') || lower.includes('dose') || lower.includes('rotti') ||
    lower.includes('roti') || lower.includes('idli') || lower.includes('vada') ||
    lower.includes('kadubu') || lower.includes('buns') || lower.includes('baje') ||
    lower.includes('pundi') || lower.includes('patrode')
  ) {
    return {
      veg: true,
      category: 'From the griddle',
      image: lower.includes('neer') ? '/neer-dosa.jpg' : '/kori-rotti.jpg',
      defaultPrice: 140,
      spice: 1,
    };
  }

  // Rice / Bath / Biryani / Thali
  if (
    lower.includes('rice') || lower.includes('bath') || lower.includes('baath') ||
    lower.includes('biryani') || lower.includes('thali') || lower.includes('mudde') ||
    lower.includes('chitranna') || lower.includes('puliyogare') || lower.includes('pulao')
  ) {
    return {
      veg: !lower.includes('biryani') || lower.includes('veg'),
      category: 'Coastal classics',
      image: '/red-rice.jpg',
      defaultPrice: 180,
      spice: 1,
    };
  }

  // Beverages
  if (
    lower.includes('juice') || lower.includes('cooler') || lower.includes('tea') ||
    lower.includes('coffee') || lower.includes('kashaya') || lower.includes('kokum')
  ) {
    return {
      veg: true,
      category: 'Beverages',
      image: '/kokum-cooler.jpg',
      defaultPrice: 80,
      spice: 0,
    };
  }

  // Vegetarian / General fallback
  return {
    veg: true,
    category: 'Vegetarian',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 180,
    spice: 1,
  };
}

// ── 120+ EXPANDED AUTHENTIC KARNATAKA DISHES CATALOGUE ──
export const KARNATAKA_FOOD_CATALOGUE: QuickDish[] = [
  // ── COASTAL KARAVALI (ಮಂಗಳೂರು, ಉಡುಪಿ, ಕುಂದಾಪುರ, ಕಾರವಾರ) ──
  {
    name: 'ಬಾಂಗುಡೆ ರವಾ ಫ್ರೈ',
    nameEn: 'Bangude (Bangdi) Rawa Fry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Fresh king mackerel marinated in fiery red Karavali masala, crusted with rava and pan-fried crisp.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 260,
    region: 'Coastal Karavali',
    keywords: ['bangdi', 'bangda', 'bangude', 'mackerel', 'bangdi fry', 'bangdi fish fry', 'bangda fry', 'fish fry', 'rava fry', 'tawa fry', 'mackerel fry']
  },
  {
    name: 'ಬಾಂಗುಡೆ ಪುಳಿಮುಂಚಿ',
    nameEn: 'Bangude (Bangdi) Pulimunchi',
    category: 'Fish & seafood',
    spice: 3,
    veg: false,
    description: 'Iconic Tulu fiery-tangy mackerel curry simmered with tamarind, Byadgi chillies and whole spices.',
    image: '/fish-curry.jpg',
    defaultPrice: 280,
    region: 'Coastal Karavali',
    keywords: ['bangdi', 'bangda', 'bangude', 'pulimunchi', 'curry', 'bangdi curry', 'fish curry', 'mackerel curry', 'gravy']
  },
  {
    name: 'ಬಾಂಗುಡೆ ತವಾ ಫ್ರೈ',
    nameEn: 'Bangude (Bangdi) Masala Tawa Fry',
    category: 'Fish & seafood',
    spice: 3,
    veg: false,
    description: 'Whole mackerel coated in thick Kundapur masala, shallow fried on cast-iron tawa.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 270,
    region: 'Coastal Karavali',
    keywords: ['bangdi', 'bangda', 'bangude', 'tawa fry', 'masala fry', 'bangdi fish fry', 'fish fry']
  },
  {
    name: 'ಅಂಜಲ್ ತವಾ ಫ್ರೈ',
    nameEn: 'Anjal (Seer Fish) Tawa Fry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Fresh Seer Fish steak pan-seared with traditional Karavali masala on cast-iron tawa.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 380,
    region: 'Coastal Karavali',
    keywords: ['anjal', 'surmai', 'seer fish', 'kingfish', 'anjal fry', 'anjal tawa fry', 'fish fry', 'surmai fry']
  },
  {
    name: 'ಅಂಜಲ್ ರವಾ ಫ್ರೈ',
    nameEn: 'Anjal (Seer Fish) Rawa Fry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Crispy rava-crusted Kingfish steak shallow fried golden in pure coconut oil.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 390,
    region: 'Coastal Karavali',
    keywords: ['anjal', 'surmai', 'kingfish', 'rava fry', 'rawa fry', 'fish fry', 'anjal rava fry']
  },
  {
    name: 'ಅಂಜಲ್ ಕರಿ / ಗಸಿ',
    nameEn: 'Anjal (Kingfish) Coastal Curry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Tender Kingfish simmered in thick coconut-kokum Karavali gravy — authentic coastal comfort.',
    image: '/fish-curry.jpg',
    defaultPrice: 420,
    region: 'Coastal Karavali',
    keywords: ['anjal', 'surmai', 'kingfish', 'curry', 'gassi', 'fish curry', 'gravy']
  },
  {
    name: 'ಕಾಣೆ ಮಸಾಲ ಫ್ರೈ',
    nameEn: 'Kane (Ladyfish) Tala Fry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Whole ladyfish coated in red chilli-coconut masala and shallow fried crisp — Karavali pride.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 320,
    region: 'Coastal Karavali',
    keywords: ['kane', 'ladyfish', 'kane fry', 'kane tala fry', 'fish fry', 'lady fish']
  },
  {
    name: 'ಮಾಂಜಿ (ಪಾಂಫ್ರೆಟ್) ರವಾ ಫ್ರೈ',
    nameEn: 'Manji (Pomfret) Rawa Fry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Whole white pomfret crusted with crisp rava and fried until golden outside, tender inside.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 450,
    region: 'Coastal Karavali',
    keywords: ['manji', 'pomfret', 'white pomfret', 'paplet', 'manji fry', 'fish fry', 'pomfret fry']
  },
  {
    name: 'ಬೂತಾಯಿ (ತಾರ್ಲಿ) ಫ್ರೈ',
    nameEn: 'Buthai (Sardine) Masala Fry',
    category: 'Fish & seafood',
    spice: 3,
    veg: false,
    description: 'Fresh coastal sardines marinated in fiery red masala and fried crisp — the daily staple of Karavali.',
    image: '/anjal-tawa-fry.jpg',
    defaultPrice: 190,
    region: 'Coastal Karavali',
    keywords: ['buthai', 'boothai', 'tarli', 'sardine', 'sardines', 'fish fry', 'sardine fry']
  },
  {
    name: 'ಮೀನು ಕರಿ (ಕರಾವಳಿ ಗಸಿ)',
    nameEn: 'Mangalorean Fish Curry',
    category: 'Fish & seafood',
    spice: 2,
    veg: false,
    description: 'Tangy kokum-based coastal fish curry simmered with fresh ground coconut and Byadgi chillies.',
    image: '/fish-curry.jpg',
    defaultPrice: 290,
    region: 'Coastal Karavali',
    keywords: ['fish curry', 'meen curry', 'meenu curry', 'curry', 'gravy', 'fish gravy']
  },
  {
    name: 'ಸೀಗಡಿ ಘೀ ರೋಸ್ಟ್',
    nameEn: 'Prawn Ghee Roast',
    category: 'Coastal classics',
    spice: 3,
    veg: false,
    description: "Mangalore's crown jewel — tiger prawns slow-roasted in tangy Byadgi chilli ghee masala.",
    image: '/prawn-ghee-roast.jpg',
    defaultPrice: 420,
    region: 'Coastal Karavali',
    keywords: ['prawn', 'shrimp', 'yetti', 'sigadi', 'seegadi', 'prawn ghee roast', 'ghee roast']
  },
  {
    name: 'ಸೀಗಡಿ ಸುಕ್ಕಾ',
    nameEn: 'Prawn (Yetti) Sukka',
    category: 'Fish & seafood',
    spice: 3,
    veg: false,
    description: 'Juicy prawns dry-tossed with freshly grated roasted coconut, mustard and crispy curry leaves.',
    image: '/prawn-ghee-roast.jpg',
    defaultPrice: 380,
    region: 'Coastal Karavali',
    keywords: ['prawn', 'yetti', 'sigadi', 'shrimp', 'prawn sukka', 'yetti sukka', 'sukka']
  },
  {
    name: 'ಏಡಿ ಸುಕ್ಕಾ',
    nameEn: 'Crab (Denji) Sukka',
    category: 'Fish & seafood',
    spice: 3,
    veg: false,
    description: 'Whole mud crab pieces tossed in a rich roasted coconut, black pepper and coriander dry masala.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 440,
    region: 'Coastal Karavali',
    keywords: ['crab', 'denji', 'aadi', 'edi', 'crab sukka', 'denji sukka', 'sukka']
  },
  {
    name: 'ಮಾರ್ವಾಯಿ (ಸಿಂಪಿ) ಸುಕ್ಕಾ',
    nameEn: 'Marwai (Clams) Sukka',
    category: 'Fish & seafood',
    spice: 3,
    veg: false,
    description: 'Fresh baby clams in shell sauteed with grated coconut, green chillies and coastal spices — GSB Konkani delicacy.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 340,
    region: 'Coastal Karavali',
    keywords: ['marwai', 'clams', 'tisre', 'simpi', 'clams sukka', 'marwai sukka', 'sukka']
  },
  {
    name: 'ಚಿಕನ್ ಘೀ ರೋಸ್ಟ್',
    nameEn: 'Chicken Ghee Roast',
    category: 'Chicken',
    spice: 3,
    veg: false,
    description: "Mangalore's legendary dish — chicken slow-roasted in tangy Byadgi chilli ghee masala.",
    image: '/chicken-ghee-roast.jpg',
    defaultPrice: 340,
    region: 'Coastal Karavali',
    keywords: ['chicken', 'kori', 'koli', 'chicken ghee roast', 'ghee roast', 'kori ghee roast', 'roast']
  },
  {
    name: 'ಕೋಳಿ ರೊಟ್ಟಿ',
    nameEn: 'Kori Rotti (Chicken Curry & Crisp Rotti)',
    category: 'Coastal classics',
    spice: 2,
    veg: false,
    description: 'Crispy wafer-thin rice roti served with spiced coconut-based chicken curry. A timeless Tulu tradition.',
    image: '/kori-rotti.jpg',
    defaultPrice: 310,
    region: 'Coastal Karavali',
    keywords: ['kori rotti', 'koli rotti', 'chicken rotti', 'kori', 'koli', 'rotti', 'chicken curry rotti', 'kori rotti set']
  },
  {
    name: 'ಚಿಕನ್ ಸುಕ್ಕಾ (ಕೋಳಿ ಸುಕ್ಕಾ)',
    nameEn: 'Chicken Sukka (Kori Sukka)',
    category: 'Chicken',
    spice: 3,
    veg: false,
    description: 'Tender chicken stir-fried dry with freshly ground roasted coconut masala and crispy curry leaves.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 320,
    region: 'Coastal Karavali',
    keywords: ['chicken', 'kori', 'koli', 'chicken sukka', 'kori sukka', 'koli sukka', 'sukka', 'dry chicken']
  },
  {
    name: 'ಕುಂದಾಪುರ ಕೋಳಿ ಗಸಿ',
    nameEn: 'Kundapur Chicken Curry',
    category: 'Chicken',
    spice: 2,
    veg: false,
    description: 'Kundapur style chicken curry simmered in rich coconut-chilli gravy with roasted spices.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 290,
    region: 'Coastal Karavali',
    keywords: ['chicken', 'kori', 'koli', 'kundapur', 'chicken curry', 'kori gassi', 'curry']
  },
  {
    name: 'ನೀರ್ ದೋಸೆ',
    nameEn: 'Neer Dosa (4 pcs)',
    category: 'From the griddle',
    spice: 0,
    veg: true,
    description: 'Melt-in-mouth paper-thin coastal rice crepes served with freshly ground coconut chutney.',
    image: '/neer-dosa.jpg',
    defaultPrice: 145,
    region: 'Coastal Karavali',
    keywords: ['neer dosa', 'neerdosa', 'dosa', 'chutney', 'breakfast', 'tulu']
  },
  {
    name: 'ಮಂಗಳೂರು ಬನ್ಸ್',
    nameEn: 'Mangalore Buns (Banana Puri)',
    category: 'From the griddle',
    spice: 0,
    veg: true,
    description: 'Fluffy, mildly sweet fermented banana and curd puris served with spicy coconut chutney and sambar.',
    image: '/kori-rotti.jpg',
    defaultPrice: 90,
    region: 'Coastal Karavali',
    keywords: ['mangalore buns', 'buns', 'banana puri', 'mangalore', 'breakfast', 'snacks']
  },
  {
    name: 'ಗೋಳಿ ಬಜೆ',
    nameEn: 'Goli Baje (Mangalore Bajji)',
    category: 'Sides & extras',
    spice: 1,
    veg: true,
    description: 'Crisp outside, cloud-soft inside golden fritters made with sour curd, ginger and green chillies.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 85,
    region: 'Coastal Karavali',
    keywords: ['goli baje', 'mangalore bajji', 'baje', 'bajji', 'snacks', 'starter']
  },
  {
    name: 'ಪತ್ರೊಡೆ',
    nameEn: 'Patrode (Colocasia Leaf Rolls)',
    category: 'Vegetarian',
    spice: 2,
    veg: true,
    description: 'Fresh colocasia leaves smeared with spicy-sweet spiced rice paste, steamed and tawa shallow-fried in coconut oil.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 160,
    region: 'Coastal Karavali',
    keywords: ['patrode', 'pathrode', 'colocasia', 'kesuvina', 'malnad', 'snacks']
  },
  {
    name: 'ಕೊಟ್ಟೆ ಕಡುಬು',
    nameEn: 'Kotte Kadubu (Jackfruit Leaf Idli)',
    category: 'From the griddle',
    spice: 0,
    veg: true,
    description: 'Aromatic steamed rice-dal cakes woven into jackfruit leaf cups, infused with natural herbal fragrance.',
    image: '/neer-dosa.jpg',
    defaultPrice: 120,
    region: 'Coastal Karavali',
    keywords: ['kotte kadubu', 'kadubu', 'idli', 'jackfruit leaf', 'breakfast', 'festive']
  },
  {
    name: 'ಪುಂಡಿ ಗಟ್ಟಿ',
    nameEn: 'Pundi Gatti (Rice Dumplings)',
    category: 'Coastal classics',
    spice: 0,
    veg: true,
    description: 'Steamed round rice dumplings tempered with mustard and coconut, best dipped in spicy coconut fish/chicken curry.',
    image: '/neer-dosa.jpg',
    defaultPrice: 110,
    region: 'Coastal Karavali',
    keywords: ['pundi', 'pundi gatti', 'rice dumplings', 'tulu', 'breakfast']
  },
  {
    name: 'ಕೊಕ್ಕಂ ಕೂಲರ್',
    nameEn: 'Fresh Kokum Cooler',
    category: 'Beverages',
    spice: 0,
    veg: true,
    description: 'Chilled tangy-sweet coastal kokum sherbet with roasted cumin and crushed ice.',
    image: '/kokum-cooler.jpg',
    defaultPrice: 90,
    region: 'Coastal Karavali',
    keywords: ['kokum', 'cooler', 'juice', 'kokum cooler', 'sherbet', 'drink']
  },

  // ── SOUTH KARNATAKA & OLD MYSORE (ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಮಂಡ್ಯ, ಹಾಸನ) ──
  {
    name: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
    nameEn: 'Bisi Bele Bath',
    category: 'Coastal classics',
    spice: 2,
    veg: true,
    description: 'The pride of Karnataka — rice and lentils slow-cooked with fresh vegetables, tamarind, and aromatic spice blend in pure ghee.',
    image: '/red-rice.jpg',
    defaultPrice: 160,
    region: 'Old Mysore',
    keywords: ['bisi bele bath', 'bisibelebath', 'bisi bele baath', 'rice', 'bath', 'mysore']
  },
  {
    name: 'ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ',
    nameEn: 'Mysore Masala Dosa',
    category: 'From the griddle',
    spice: 2,
    veg: true,
    description: 'Crispy golden dosa smeared inside with fiery red garlic-chilli chutney, stuffed with spiced potato masala and butter.',
    image: '/kori-rotti.jpg',
    defaultPrice: 140,
    region: 'Old Mysore',
    keywords: ['mysore masala dosa', 'mysore dosa', 'masala dosa', 'dosa', 'dose', 'red chutney']
  },
  {
    name: 'ದಾವಣಗೆರೆ ಬೆಣ್ಣೆ ದೋಸೆ',
    nameEn: 'Davangere Benne Dosa',
    category: 'From the griddle',
    spice: 1,
    veg: true,
    description: 'Fluffy, crisp golden dosa roasted generously in dollops of fresh white butter, served with spicy potato palya and coconut chutney.',
    image: '/neer-dosa.jpg',
    defaultPrice: 150,
    region: 'Central Karnataka',
    keywords: ['davangere benne dosa', 'benne dosa', 'butter dosa', 'davangere', 'dosa', 'dose']
  },
  {
    name: 'ತಟ್ಟೆ ಇಡ್ಲಿ (ಬಿದಡಿ ಸ್ಟೈಲ್)',
    nameEn: 'Thatte Idli with Red Chutney & Butter',
    category: 'From the griddle',
    spice: 1,
    veg: true,
    description: 'Large, plate-sized ultra-soft steamed idli topped with fresh butter, spicy chutney pudi and coconut chutney.',
    image: '/neer-dosa.jpg',
    defaultPrice: 90,
    region: 'Old Mysore',
    keywords: ['thatte idli', 'idli', 'bidadi idli', 'plate idli', 'breakfast', 'chutney']
  },
  {
    name: 'ರಾಗಿ ಮುದ್ದೆ ನಾಟಿ ಕೋಳಿ ಸಾರು',
    nameEn: 'Ragi Mudde with Nati Koli Saaru',
    category: 'Coastal classics',
    spice: 3,
    veg: false,
    description: 'Steaming hot finger millet balls served with fiery, rustic country chicken curry — traditional Karnataka village feast.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 280,
    region: 'Old Mysore',
    keywords: ['ragi mudde', 'nati koli saaru', 'mudde', 'nati koli', 'nati chicken', 'country chicken', 'saaru']
  },
  {
    name: 'ನಾಟಿ ಕೋಳಿ ಸಾರು',
    nameEn: 'Nati Koli Saaru (Country Chicken Curry)',
    category: 'Chicken',
    spice: 3,
    veg: false,
    description: 'Free-range country chicken slow-cooked with freshly pounded whole spices, garlic, shallots and coriander.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 320,
    region: 'Old Mysore',
    keywords: ['nati koli saaru', 'nati koli', 'country chicken', 'nati chicken', 'koli saaru', 'saaru', 'curry']
  },
  {
    name: 'ರಾಗಿ ಮುದ್ದೆ ಬಸ್ಸಾರು ಜೊತೆ',
    nameEn: 'Ragi Mudde with Bassaru & Palya',
    category: 'Vegetarian',
    spice: 2,
    veg: true,
    description: 'Nutritious ragi balls served with traditional dill & greens strained saaru and tempered palya.',
    image: '/red-rice.jpg',
    defaultPrice: 150,
    region: 'Old Mysore',
    keywords: ['ragi mudde', 'bassaru', 'mudde', 'soppina saaru', 'bassaru palya', 'healthy']
  },
  {
    name: 'ಅಕ್ಕಿ ರೊಟ್ಟಿ ಚಟ್ನಿ ಜೊತೆ',
    nameEn: 'Akki Rotti with Coconut Chutney',
    category: 'From the griddle',
    spice: 1,
    veg: true,
    description: 'Hand-patted rice flour flatbread speckled with fresh dill leaves, onions, green chillies and cumin, roasted crisp.',
    image: '/kori-rotti.jpg',
    defaultPrice: 110,
    region: 'Old Mysore',
    keywords: ['akki rotti', 'akki roti', 'rice roti', 'rotti', 'breakfast', 'sabsige']
  },
  {
    name: 'ರಾಗಿ ರೊಟ್ಟಿ',
    nameEn: 'Ragi Rotti with Spicy Chutney',
    category: 'From the griddle',
    spice: 1,
    veg: true,
    description: 'Wholesome finger millet flatbread mixed with onions, coriander and green chillies, roasted with ghee.',
    image: '/kori-rotti.jpg',
    defaultPrice: 110,
    region: 'Old Mysore',
    keywords: ['ragi rotti', 'ragi roti', 'finger millet', 'rotti', 'healthy']
  },
  {
    name: 'ಚಿತ್ರಾನ್ನ (ನಿಂಬೆಹಣ್ಣಿನ ಅನ್ನ)',
    nameEn: 'Chitranna (Lemon Rice with Peanuts)',
    category: 'Coastal classics',
    spice: 1,
    veg: true,
    description: 'Fragrant steamed rice tempered with crunchy peanuts, mustard, curry leaves, turmeric and tangy lemon juice.',
    image: '/red-rice.jpg',
    defaultPrice: 100,
    region: 'Old Mysore',
    keywords: ['chitranna', 'lemon rice', 'nimbe anna', 'rice', 'bath', 'breakfast']
  },
  {
    name: 'ಪುಳಿಯೋಗರೆ',
    nameEn: 'Temple Style Puliyogare (Tamarind Rice)',
    category: 'Coastal classics',
    spice: 2,
    veg: true,
    description: 'Traditional temple-recipe rice tossed in thick, spicy, sweet and tangy tamarind paste with roasted sesame and peanuts.',
    image: '/red-rice.jpg',
    defaultPrice: 120,
    region: 'Old Mysore',
    keywords: ['puliyogare', 'puliyodharai', 'tamarind rice', 'temple rice', 'melkote puliyogare']
  },
  {
    name: 'ವಾಂಗಿ ಬಾತ್',
    nameEn: 'Vangi Bath (Brinjal Rice)',
    category: 'Coastal classics',
    spice: 2,
    veg: true,
    description: 'Tender baby brinjals sauteed with authentic Vangi Bath spice blend, tossed with steamed rice and dry coconut.',
    image: '/red-rice.jpg',
    defaultPrice: 130,
    region: 'Old Mysore',
    keywords: ['vangi bath', 'vangi baath', 'brinjal rice', 'rice', 'bath']
  },
  {
    name: 'ಖಾರಾ ಬಾತ್ (ಉಪ್ಪಿಟ್ಟು)',
    nameEn: 'Khara Bath (Vegetable Rava Upma)',
    category: 'From the griddle',
    spice: 2,
    veg: true,
    description: 'Semolina roasted in ghee and cooked with mixed vegetables, tomato, and aromatic Karnataka spice powder.',
    image: '/neer-dosa.jpg',
    defaultPrice: 90,
    region: 'Old Mysore',
    keywords: ['khara bath', 'kharabath', 'upma', 'uppittu', 'chow chow bath']
  },
  {
    name: 'ಕೇಸರಿ ಬಾತ್',
    nameEn: 'Kesari Bath (Pineapple / Saffron Rava Halwa)',
    category: 'Vegetarian',
    spice: 0,
    veg: true,
    description: 'Golden semolina dessert infused with saffron, cardamom, pineapple, roasted cashews and pure desi ghee.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 90,
    region: 'Old Mysore',
    keywords: ['kesari bath', 'kesaribath', 'kesari', 'sheera', 'halwa', 'chow chow bath']
  },
  {
    name: 'ಮದ್ದೂರು ವಡೆ',
    nameEn: 'Maddur Vada (Crispy Onion Fritters)',
    category: 'Sides & extras',
    spice: 1,
    veg: true,
    description: 'Iconic crispy savoury snack from Maddur town made with rice flour, semolina, onions, curry leaves and green chillies.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 70,
    region: 'Old Mysore',
    keywords: ['maddur vada', 'maddur vade', 'vada', 'snacks', 'maddur']
  },
  {
    name: 'ಸೆಟ್ ದೋಸೆ ಸಾಗು ಜೊತೆ',
    nameEn: 'Set Dosa with Vegetable Sagu (3 pcs)',
    category: 'From the griddle',
    spice: 1,
    veg: true,
    description: 'Trio of ultra-soft, spongy dosas served with mild coconut vegetable sagu and coconut chutney.',
    image: '/neer-dosa.jpg',
    defaultPrice: 120,
    region: 'Old Mysore',
    keywords: ['set dosa', 'sponge dosa', 'dosa', 'sagu', 'breakfast']
  },
  {
    name: 'ದೊನ್ನೆ ಬಿರಿಯಾನಿ (ಚಿಕನ್)',
    nameEn: 'Bangalore Military Donne Biryani (Chicken)',
    category: 'Coastal classics',
    spice: 3,
    veg: false,
    description: 'Signature military-hotel style biryani cooked with small-grain Seeraga Samba rice, mint, coriander and marinated chicken in eco areca palms.',
    image: '/chicken-ghee-roast.jpg',
    defaultPrice: 280,
    region: 'Old Mysore',
    keywords: ['donne biryani', 'donne biriyani', 'military biryani', 'chicken biryani', 'seeraga samba']
  },
  {
    name: 'ದೊನ್ನೆ ಬಿರಿಯಾನಿ (ಮಟನ್)',
    nameEn: 'Bangalore Military Donne Biryani (Mutton)',
    category: 'Coastal classics',
    spice: 3,
    veg: false,
    description: 'Fragrant Seeraga Samba rice slow-cooked with tender mutton pieces, green herbs, pepper and pure ghee.',
    image: '/chicken-ghee-roast.jpg',
    defaultPrice: 380,
    region: 'Old Mysore',
    keywords: ['donne biryani', 'mutton biryani', 'mutton donne biryani', 'military hotel']
  },
  {
    name: 'ಮಂಡ್ಯ ಮಟನ್ ಚಾಪ್ಸ್',
    nameEn: 'Mandya Mutton Chops',
    category: 'Coastal classics',
    spice: 3,
    veg: false,
    description: 'Tender mutton rib chops cooked in thick green herb, shallots and black pepper masala gravy.',
    image: '/chicken-ghee-roast.jpg',
    defaultPrice: 420,
    region: 'Old Mysore',
    keywords: ['mutton chops', 'mandya mutton', 'chops', 'mutton fry', 'mutton curry']
  },
  {
    name: 'ಮೈಸೂರು ಪಾಕ್',
    nameEn: 'Ghee Mysore Pak',
    category: 'Vegetarian',
    spice: 0,
    veg: true,
    description: 'Royal dessert created in the Mysore Palace — melt-in-mouth golden gram flour fudge rich with pure cow ghee.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 130,
    region: 'Old Mysore',
    keywords: ['mysore pak', 'mysorepak', 'ghee mysore pak', 'sweet', 'mithai']
  },
  {
    name: 'ಬೇಳೆ ಹೋಳಿಗೆ (ಒಬ್ಬಟ್ಟು)',
    nameEn: 'Bele Holige / Obbattu with Pure Ghee',
    category: 'Vegetarian',
    spice: 0,
    veg: true,
    description: 'Paper-thin sweet flatbread stuffed with cooked chana dal, jaggery and cardamom, served warm with molten ghee.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 80,
    region: 'Old Mysore',
    keywords: ['holige', 'obbattu', 'bele holige', 'puran poli', 'sweet', 'festive']
  },
  {
    name: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
    nameEn: 'South Indian Filter Coffee',
    category: 'Beverages',
    spice: 0,
    veg: true,
    description: 'Freshly decocted chicory coffee beans frothed with hot creamy milk in traditional brass davarah-tumbler.',
    image: '/kokum-cooler.jpg',
    defaultPrice: 50,
    region: 'Old Mysore',
    keywords: ['filter coffee', 'coffee', 'kaapi', 'chicory', 'hot coffee']
  },

  // ── NORTH KARNATAKA (ಹುಬ್ಬಳ್ಳಿ, ಧಾರವಾಡ, ಬೆಳಗಾವಿ, ಬಿಜಾಪುರ, ಗುಲ್ಬರ್ಗಾ) ──
  {
    name: 'ಜೋಳದ ರೊಟ್ಟಿ ಎಣ್ಣೆಗಾಯಿ ಊಟ',
    nameEn: 'Jolada Rotti Meal with Yennegai Badanekayi',
    category: 'Coastal classics',
    spice: 3,
    veg: true,
    description: 'Thin, crisp jowar rotis served with stuffed baby brinjal curry, shenga chutney pudi, kaalu palya, raw onion and curd.',
    image: '/red-rice.jpg',
    defaultPrice: 190,
    region: 'North Karnataka',
    keywords: ['jolada rotti', 'jowar roti', 'yennegai', 'badanekayi', 'north karnataka thali', 'uttara karnataka']
  },
  {
    name: 'ಎಣ್ಣೆಗಾಯಿ ಬದನೆಕಾಯಿ',
    nameEn: 'Yennegai Badanekayi (Stuffed Brinjal Curry)',
    category: 'Vegetarian',
    spice: 3,
    veg: true,
    description: 'Baby eggplants slit and stuffed with roasted peanuts, sesame, dry coconut and Gurez masala gravy.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 160,
    region: 'North Karnataka',
    keywords: ['yennegai', 'badanekayi', 'stuffed brinjal', 'curry', 'north karnataka']
  },
  {
    name: 'ಶೇಂಗಾ ಚಟ್ನಿ ಪುಡಿ ಮೊಸರು ಜೊತೆ',
    nameEn: 'Shenga Chutney Pudi with Fresh Curd',
    category: 'Sides & extras',
    spice: 2,
    veg: true,
    description: 'Dry roasted peanut chutney powder with garlic, red chillies and cumin, paired with cool thick curd.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 60,
    region: 'North Karnataka',
    keywords: ['shenga chutney pudi', 'peanut powder', 'chutney pudi', 'shenga pudi', 'curd']
  },
  {
    name: 'ಗಿರ್ಮಿಟ್ (ಮಂಡಕ್ಕಿ ಮಸಾಲ)',
    nameEn: 'Girmit (Hubli-Dharwad Puffed Rice Chaat)',
    category: 'Sides & extras',
    spice: 2,
    veg: true,
    description: 'Puffed rice tossed in spiced gram flour gravy, roasted peanuts, sev, fresh coriander and finely chopped onions.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 70,
    region: 'North Karnataka',
    keywords: ['girmit', 'mandakki', 'hubli', 'dharwad', 'chaat', 'snacks']
  },
  {
    name: 'ಮೆಣಸಿನಕಾಯಿ ಬಜ್ಜಿ (ಮಿರ್ಚಿ)',
    nameEn: 'Menasinakai Bajji (Mirchi Bajji 4 pcs)',
    category: 'Sides & extras',
    spice: 2,
    veg: true,
    description: 'Plump Bhavnagri chillies dipped in spiced chickpea batter and deep-fried golden, dusted with cumin-salt.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 80,
    region: 'North Karnataka',
    keywords: ['mirchi bajji', 'menasinakai bajji', 'bajji', 'fritters', 'snacks']
  },
  {
    name: 'ಧಾರವಾಡ ಪೇಡ',
    nameEn: 'Dharwad Peda (Mishra Peda Special)',
    category: 'Vegetarian',
    spice: 0,
    veg: true,
    description: 'Iconic caramelized milk solids fudge with a distinct deep brown hue and velvety sugar crust.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 140,
    region: 'North Karnataka',
    keywords: ['dharwad peda', 'peda', 'dharwad', 'sweet', 'mithai']
  },
  {
    name: 'ಗೋಕಾಕ್ ಕರದಂಟು',
    nameEn: 'Gokak Karadantu (Nut & Jaggery Fudge)',
    category: 'Vegetarian',
    spice: 0,
    veg: true,
    description: 'Energy-rich chewy confection made with edible gum (dink), jaggery, dry dates, cashews, pistachios and almonds.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 150,
    region: 'North Karnataka',
    keywords: ['karadantu', 'gokak karadantu', 'gokak', 'dry fruit sweet', 'healthy sweet']
  },
  {
    name: 'ಬೆಳಗಾವಿ ಕುಂದಾ',
    nameEn: 'Belagavi Kunda (Slow-Caramelized Khoya)',
    category: 'Vegetarian',
    spice: 0,
    veg: true,
    description: 'Belagavi heritage specialty of milk and khoya boiled for hours over firewood until rich caramel perfection.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 130,
    region: 'North Karnataka',
    keywords: ['belagavi kunda', 'kunda', 'belgaum kunda', 'sweet']
  },

  // ── MALNAD & COORG (ಕೊಡಗು, ಚಿಕ್ಕಮಗಳೂರು, ಶಿವಮೊಗ್ಗ) ──
  {
    name: 'ಕೊಡಗು ಪಾಂಡಿ ಕರಿ',
    nameEn: 'Coorg Pandi Curry (Kachampuli Pork)',
    category: 'Coastal classics',
    spice: 3,
    veg: false,
    description: 'World-famous Coorg specialty: succulent pork slow-simmered in roasted black pepper masala and sour Kachampuli vinegar.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 390,
    region: 'Malnad & Coorg',
    keywords: ['pandi curry', 'coorg pork', 'pork curry', 'kachampuli', 'coorg', 'kodagu']
  },
  {
    name: 'ಕಡಂಬುಟ್ಟು (ಅಕ್ಕಿ ಉಂಡೆ)',
    nameEn: 'Kadambuttu (Coorg Steamed Rice Balls 4 pcs)',
    category: 'From the griddle',
    spice: 0,
    veg: true,
    description: 'Soft, melt-in-mouth broken rice dumplings flavored with a hint of cardamom, designed to soak up spicy curries.',
    image: '/neer-dosa.jpg',
    defaultPrice: 120,
    region: 'Malnad & Coorg',
    keywords: ['kadambuttu', 'coorg rice balls', 'dumplings', 'coorg', 'kodagu']
  },
  {
    name: 'ಅಕ್ಕಿ ಒಟ್ಟಿ',
    nameEn: 'Coorg Akki Oti (Rice Flatbread)',
    category: 'From the griddle',
    spice: 0,
    veg: true,
    description: 'Traditional Coorg bread made from cooked rice dough, roasted over wood fire with homemade butter and honey.',
    image: '/kori-rotti.jpg',
    defaultPrice: 110,
    region: 'Malnad & Coorg',
    keywords: ['akki oti', 'coorg roti', 'rice roti', 'coorg', 'kodagu']
  },
  {
    name: 'ಕಣಿಲೆ ಸಾಂಬಾರ್ (ಬಿದಿರಿನ ಕಣಿಲೆ)',
    nameEn: 'Kanile (Fresh Bamboo Shoot) Curry',
    category: 'Vegetarian',
    spice: 2,
    veg: true,
    description: 'Tender monsoon bamboo shoots cooked with toor dal, coconut masala and local Malnad spices.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 170,
    region: 'Malnad & Coorg',
    keywords: ['kanile', 'bamboo shoot', 'kanile sambar', 'malnad', 'monsoon']
  },
  {
    name: 'ಮಲೆನಾಡು ಕಷಾಯ',
    nameEn: 'Malnad Herbal Kashaya',
    category: 'Beverages',
    spice: 1,
    veg: true,
    description: 'Soothing Ayurvedic brew of coriander seeds, black pepper, dry ginger, cloves and jaggery steeped in warm milk.',
    image: '/kokum-cooler.jpg',
    defaultPrice: 60,
    region: 'Malnad & Coorg',
    keywords: ['kashaya', 'herbal drink', 'malnad kashaya', 'ayurvedic', 'health']
  },

  // ── POPULAR MAINSTAYS ACROSS KARNATAKA ──
  {
    name: 'ಗೋಬಿ ಮಂಚೂರಿಯನ್',
    nameEn: 'Gobi Manchurian (Crispy Dry)',
    category: 'Sides & extras',
    spice: 2,
    veg: true,
    description: 'Crispy battered cauliflower florets tossed in garlic, ginger, green chillies, spring onions and soya sauce.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 180,
    region: 'Karnataka Street Food',
    keywords: ['gobi manchurian', 'gobi', 'manchurian', 'chinese', 'starter', 'crispy gobi']
  },
  {
    name: 'ಮೊಟ್ಟೆ ರೈಸ್ (ಎಗ್ ರೈಸ್)',
    nameEn: 'Karnataka Street Style Egg Rice',
    category: 'Coastal classics',
    spice: 2,
    veg: false,
    description: 'Steaming basmati rice wok-tossed with scrambled eggs, onions, green chillies, crushed pepper and fresh coriander.',
    image: '/red-rice.jpg',
    defaultPrice: 160,
    region: 'Karnataka Street Food',
    keywords: ['egg rice', 'motte rice', 'motte anna', 'fast food', 'street food']
  },
  {
    name: 'ಮೊಸರನ್ನ (ತಣ್ಣನೆಯ ಮೊಸರು ಅನ್ನ)',
    nameEn: 'Temple Style Curd Rice (Mosaranna)',
    category: 'Coastal classics',
    spice: 0,
    veg: true,
    description: 'Comforting soft rice mixed with fresh thick curd, tempered with mustard, ginger, curry leaves, pomegranate and cashews.',
    image: '/red-rice.jpg',
    defaultPrice: 110,
    region: 'Universal Karnataka',
    keywords: ['curd rice', 'mosaranna', 'mosaru anna', 'comfort food', 'dahi rice']
  },
  {
    name: 'ಟೊಮೇಟೊ ಬಾತ್',
    nameEn: 'Tomato Bath with Coconut Chutney',
    category: 'Coastal classics',
    spice: 2,
    veg: true,
    description: 'Aromatic rice spiced with ripe country tomatoes, mint, green peas and cloves, served with chilled raita.',
    image: '/red-rice.jpg',
    defaultPrice: 120,
    region: 'Universal Karnataka',
    keywords: ['tomato bath', 'tomato baath', 'tomato rice', 'rice', 'breakfast']
  },
  {
    name: 'ಪನ್ನೀರ್ ಬಟರ್ ಮಸಾಲ',
    nameEn: 'Paneer Butter Masala',
    category: 'Vegetarian',
    spice: 1,
    veg: true,
    description: 'Fresh malai paneer cubes simmered in a silky, buttery tomato-cashew makhani gravy with fenugreek.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 260,
    region: 'Popular Curries',
    keywords: ['paneer butter masala', 'paneer', 'makhani', 'curry', 'veg curry']
  },
  {
    name: 'ದಾಲ್ ತಡ್ಕಾ',
    nameEn: 'Yellow Dal Tadka with Ghee & Garlic',
    category: 'Vegetarian',
    spice: 1,
    veg: true,
    description: 'Creamy yellow lentils tempered with sizzling garlic, cumin, red chillies and pure desi ghee.',
    image: '/cinematic-cuisine.jpg',
    defaultPrice: 160,
    region: 'Popular Curries',
    keywords: ['dal tadka', 'dal', 'yellow dal', 'garlic dal', 'lentils']
  },
  {
    name: 'ಜೀರಾ ರೈಸ್',
    nameEn: 'Aromatic Jeera Rice',
    category: 'Coastal classics',
    spice: 0,
    veg: true,
    description: 'Fluffy long-grain basmati rice tempered with whole cumin seeds, ghee and freshly chopped coriander.',
    image: '/red-rice.jpg',
    defaultPrice: 140,
    region: 'Popular Rice',
    keywords: ['jeera rice', 'cumin rice', 'rice', 'ghee rice']
  },
  {
    name: 'ವೆಜ್ ದಮ್ ಬಿರಿಯಾನಿ',
    nameEn: 'Royal Veg Dum Biryani',
    category: 'Coastal classics',
    spice: 2,
    veg: true,
    description: 'Basmati rice slow-cooked in dum with fresh beans, carrots, peas, potatoes, mint, fried onions and saffron milk.',
    image: '/red-rice.jpg',
    defaultPrice: 220,
    region: 'Popular Rice',
    keywords: ['veg biryani', 'vegetable biryani', 'dum biryani', 'biryani']
  },
  {
    name: 'ಚಿಕನ್ 65',
    nameEn: 'Coastal Spiced Chicken 65',
    category: 'Chicken',
    spice: 3,
    veg: false,
    description: 'Spicy, crunchy deep-fried chicken cubes tossed with curry leaves, mustard seeds and slit green chillies.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 260,
    region: 'Starters',
    keywords: ['chicken', 'chicken 65', 'chilli chicken', 'starter', 'crispy chicken']
  },
  {
    name: 'ಚಿಕನ್ ಕಬಾಬ್',
    nameEn: 'Karavali Spiced Chicken Kebab',
    category: 'Chicken',
    spice: 2,
    veg: false,
    description: 'Crispy fried boneless chicken bites marinated with coastal spices, ginger and garlic.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 250,
    region: 'Starters',
    keywords: ['chicken', 'kebab', 'chicken kebab', 'kabab', 'fry']
  },
  {
    name: 'ಚಿಕನ್ ಲಾಲಿಪಾಪ್',
    nameEn: 'Chicken Lollipop (Coastal Masala 6 pcs)',
    category: 'Chicken',
    spice: 2,
    veg: false,
    description: 'Crisp chicken winglets shaped into lollipops, fried golden and served with hot garlic-chilli sauce.',
    image: '/chicken-sukka.jpg',
    defaultPrice: 270,
    region: 'Starters',
    keywords: ['chicken', 'lollipop', 'chicken lollipop', 'wings', 'starter']
  },
  {
    name: 'ಚಿಕನ್ ತಂದೂರಿ (ಹಾಫ್)',
    nameEn: 'Tandoori Chicken (Half)',
    category: 'Chicken',
    spice: 2,
    veg: false,
    description: 'Chicken leg & breast marinated in hung curd, Kashmiri chilli and freshly ground spices, roasted smoky in tandoor.',
    image: '/chicken-ghee-roast.jpg',
    defaultPrice: 290,
    region: 'Tandoor Specials',
    keywords: ['chicken', 'tandoori', 'tandoori chicken', 'kebab', 'tandoor']
  },
];
