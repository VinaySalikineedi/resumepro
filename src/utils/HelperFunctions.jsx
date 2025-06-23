// HelperFunction.jsx

// Helper to convert Tailwind color classes to hex codes for react-pdf
export const tailwindColorMap = {
    // Blues
    'text-blue-600': '#2563EB',
    'border-blue-400': '#60A5FA',
    'text-blue-700': '#1D4ED8',
    'bg-blue-500': '#3B82F6',
    'bg-blue-600': '#2563EB',
    'bg-blue-700': '#1D4ED8',
    'hover:bg-blue-700': '#1D4ED8', // For buttons, though hover isn't direct in PDF
    'focus:ring-blue-500': '#3B82F6',
    'focus:border-blue-500': '#3B82F6',

    // Purples
    'text-purple-600': '#9333EA',
    'border-purple-400': '#C084FC',
    'text-purple-700': '#7E22CE',
    'from-purple-500': '#A855F7',
    'to-purple-600': '#9333EA',
    'bg-purple-600': '#9333EA',

    // Greens
    'text-green-600': '#16A34A',
    'border-green-400': '#4ADE80',
    'text-green-700': '#15803D',

    // Grays and Whites
    'bg-gray-800': '#1F2937',
    'text-white': '#FFFFFF',
    'text-gray-300': '#D1D5DB',
    'bg-gray-700': '#374151',
    'text-gray-200': '#E5E7EB',
    'bg-white': '#FFFFFF',
    'text-gray-600': '#4B5563',
    'text-gray-700': '#374151',
    'border-gray-300': '#D1D5DB',
    'placeholder-gray-400': '#9CA3AF',
    'focus:ring-gray-300': '#D1D5DB',

    // Specific for Template 7
    'bg-gradient-to-br-from-blue-700-to-purple-800': ['#1D4ED8', '#6B21A8'],
    'text-gray-50': '#F9FAFB',
    'text-gray-400': '#9CA3AF',

    // Specific for Template 8
    'bg-gradient-to-r-from-blue-600-to-purple-700': ['#2563EB', '#7E22CE'],
    'bg-gray-900': '#111827',
    'text-yellow-400': '#FBBF24',

    // Specific for Template 9
    'bg-gradient-to-r-from-indigo-600-to-purple-700': ['#4F46E5', '#7E22CE'],
    'text-indigo-600': '#4F46E5',
    'border-indigo-400': '#818CF8',

    // Specific for Template 10
    'bg-gradient-to-r-from-teal-500-to-blue-600': ['#14B8A6', '#2563EB'],
    'text-teal-600': '#0D9488',
    'border-teal-400': '#2DD4BF',
    'bg-teal-500': '#14B8A6',

    // Fallback for general accent colors
    'text-red-600': '#DC2626', 'border-red-400': '#F87171', 'name-red-700': '#B91C1C',
    'text-orange-600': '#EA580C', 'border-orange-400': '#FB923C', 'name-orange-700': '#C2410C',
    'text-pink-600': '#DB2777', 'border-pink-400': '#F472B6', 'name-pink-700': '#BE185D',
    'text-lime-600': '#65A30D', 'border-lime-400': '#A3E635', 'name-lime-700': '#4D7C0F',
    'text-amber-600': '#D97706', 'border-amber-400': '#FCD34D', 'name-amber-700': '#B45309',
    'text-gray-800': '#1F2937', 'border-gray-400': '#9CA3AF', 'name-gray-900': '#111827',
    'default': '#000000',
};

// Helper to convert Tailwind color classes to hex codes for react-pdf
export const getColorFromTailwind = (tailwindClass, defaultColor = '#000000') => {
    const color = tailwindColorMap[tailwindClass];
    if (Array.isArray(color)) {
        return color[0]; // Return the first color for gradients for simplicity in direct color use
    }
    return color || defaultColor;
};

// Map Tailwind font size classes to react-pdf font sizes
export const getPdfFontSize = (tailwindClass) => {
    switch (tailwindClass) {
        case 'text-xs': return 8;
        case 'text-sm': return 10;
        case 'text-base': return 12;
        case 'text-lg': return 14;
        case 'text-xl': return 16;
        case 'text-2xl': return 18;
        case 'text-3xl': return 24;
        case 'text-4xl': return 32;
        case 'text-5xl': return 40;
        default: return 11; // Default for unspecified, slightly smaller for body text
    }
};

// Helper for Dynamic Font Sizing for Name
export const getFontSizeForName = (name) => {
    if (!name) return 'text-4xl'; // Default size if no name
    const len = name.length;
    if (len > 30) return 'text-2xl'; // For very long names
    if (len > 20) return 'text-3xl'; // For long names
    return 'text-4xl'; // Default size for average names
};

// A slightly larger range for templates that initially use text-5xl
export const getLargerFontSizeForName = (name) => {
    if (!name) return 'text-5xl';
    const len = name.length;
    if (len > 30) return 'text-3xl'; // Scale down more for very long names
    if (len > 20) return 'text-4xl'; // Scale down for long names
    return 'text-5xl'; // Default large size
};

// Accent Color Class Generator
export const getAccentClasses = (accentColor) => {
    switch (accentColor) {
        case 'blue': return { textColor: 'text-blue-600', borderColor: 'border-blue-400', nameColor: 'text-blue-700' };
        case 'purple': return { textColor: 'text-purple-600', borderColor: 'border-purple-400', nameColor: 'text-purple-700' };
        case 'green': return { textColor: 'text-green-600', borderColor: 'border-green-400', nameColor: 'text-green-700' };
        case 'red': return { textColor: 'text-red-600', borderColor: 'border-red-400', nameColor: 'text-red-700' };
        case 'orange': return { textColor: 'text-orange-600', borderColor: 'border-orange-400', nameColor: 'text-orange-700' };
        case 'teal': return { textColor: 'text-teal-600', borderColor: 'border-teal-400', nameColor: 'text-teal-700' };
        case 'pink': return { textColor: 'text-pink-600', borderColor: 'border-pink-400', nameColor: 'text-pink-700' };
        case 'indigo': return { textColor: 'text-indigo-600', borderColor: 'border-indigo-400', nameColor: 'text-indigo-700' };
        case 'lime': return { textColor: 'text-lime-600', borderColor: 'border-lime-400', nameColor: 'text-lime-700' };
        case 'amber': return { textColor: 'text-amber-600', borderColor: 'border-amber-400', nameColor: 'text-amber-700' };
        default: return { textColor: 'text-gray-800', borderColor: 'border-gray-400', nameColor: 'text-gray-900' };
    }
};
