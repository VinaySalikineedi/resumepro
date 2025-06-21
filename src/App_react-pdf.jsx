import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { Document, Page, View, Text, Image, Font, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// Register Inter font - crucial for consistent PDF typography
Font.register({
    family: 'Inter',
    src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvGFptjcMwFg.ttf', // Regular
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvGFptjcMwFg.ttf' },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvGFptycLxjf.ttf', fontWeight: 'bold' },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvGFptjcMwFg.ttf', fontStyle: 'italic' }
    ]
});

// Helper to convert Tailwind color classes to hex codes for react-pdf
const tailwindColorMap = {
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

const getColorFromTailwind = (tailwindClass, defaultColor = '#000000') => {
    const color = tailwindColorMap[tailwindClass];
    if (Array.isArray(color)) {
        return color[0]; // Return the first color for gradients for simplicity in direct color use
    }
    return color || defaultColor;
};

// Map Tailwind font size classes to react-pdf font sizes
const getPdfFontSize = (tailwindClass) => {
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
        default: return 12; // Default for unspecified
    }
};

// --- Helper for Dynamic Font Sizing for Name ---
const getFontSizeForName = (name) => {
    if (!name) return 'text-4xl'; // Default size if no name
    const len = name.length;
    if (len > 30) return 'text-2xl'; // For very long names
    if (len > 20) return 'text-3xl'; // For long names
    return 'text-4xl'; // Default size for average names
};

// A slightly larger range for templates that initially use text-5xl
const getLargerFontSizeForName = (name) => {
    if (!name) return 'text-5xl';
    const len = name.length;
    if (len > 30) return 'text-3xl'; // Scale down more for very long names
    if (len > 20) return 'text-4xl'; // Scale down for long names
    return 'text-5xl'; // Default large size
};

// --- Accent Color Class Generator ---
const getAccentClasses = (accentColor) => {
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

// Reusable Resume Section for Preview (updated to accept accent classes)
const ResumeSectionDisplay = ({ title, children, accentTextColorClass, accentBorderColorClass, sectionId }) => (
  // Added sectionId for specific styling if needed for certain templates
  <div id={sectionId} className={`mb-4 pb-2 border-b ${accentBorderColorClass}`}>
    <h3 className={`text-xl font-bold mb-2 ${accentTextColorClass} uppercase`}>{title}</h3>
    {children}
  </div>
);

// --- React-PDF Stylesheet ---
const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
    },
    // Common styles for sections
    sectionHeading: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
    },
    subHeading: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    textXs: { fontSize: 8 },
    textSm: { fontSize: 10 },
    textBase: { fontSize: 12 },
    textLg: { fontSize: 14 },
    textXl: { fontSize: 16 },
    text2xl: { fontSize: 18 },
    text3xl: { fontSize: 24 },
    text4xl: { fontSize: 32 },
    text5xl: { fontSize: 40 },
    flexRow: { flexDirection: 'row' },
    flexCol: { flexDirection: 'column' },
    alignItemsCenter: { alignItems: 'center' },
    justifyContentCenter: { justifyContent: 'center' },
    justifyContentBetween: { justifyContent: 'space-between' },
    p4: { padding: 16 },
    px4: { paddingHorizontal: 16 },
    py2: { paddingVertical: 8 },
    py4: { paddingVertical: 16 },
    mb2: { marginBottom: 8 },
    mb4: { marginBottom: 16 },
    mb6: { marginBottom: 24 },
    mt2: { marginTop: 8 },
    mt4: { marginTop: 16 },
    mt6: { marginTop: 24 },
    textCenter: { textAlign: 'center' },
    textJustify: { textAlign: 'justify' },
    rounded: { borderRadius: 4 },
    roundedLg: { borderRadius: 8 },
    roundedFull: { borderRadius: 9999 },
    shadowLg: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    // Specific for TemplateOnePDF
    templateOneContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    templateOneLeft: {
        width: '35%',
        padding: 24,
        backgroundColor: getColorFromTailwind('bg-gray-800'),
        color: getColorFromTailwind('text-white'),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    templateOneRight: {
        width: '65%',
        padding: 32,
        backgroundColor: getColorFromTailwind('bg-white'),
        flexDirection: 'column',
    },
    templateOneName: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 1.2,
    },
    templateOneContact: {
        color: getColorFromTailwind('text-gray-300'),
        fontSize: 10,
        marginBottom: 8,
    },
    templateOneAboutMeText: {
        color: getColorFromTailwind('text-gray-300'),
        fontSize: 10,
        textAlign: 'justify',
    },
    templateOneSkillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
    },
    templateOneSkillBadge: {
        backgroundColor: getColorFromTailwind('bg-gray-700'),
        color: getColorFromTailwind('text-gray-200'),
        fontSize: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        margin: 4,
    },
    templateOneExperienceItem: {
        marginBottom: 16,
    },
    templateOneExperienceTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateOneExperienceMeta: {
        fontSize: 10,
        color: getColorFromTailwind('text-gray-600'),
    },
    templateOneExperienceDescription: {
        fontSize: 10,
        color: getColorFromTailwind('text-gray-700'),
        marginTop: 4,
    },
    // Specific for TemplateTwoPDF
    templateTwoContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#f9fafb',
        padding: 40,
    },
    templateTwoHeader: {
        marginBottom: 24,
        alignItems: 'center',
    },
    templateTwoName: {
        fontWeight: 'bold',
        marginBottom: 4,
        lineHeight: 1.2,
    },
    templateTwoTitle: {
        fontSize: 14,
        color: '#4a4a4a',
    },
    templateTwoContactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
        fontSize: 10,
        color: '#555',
    },
    templateTwoContactItem: {
        marginHorizontal: 8,
    },
    templateTwoContent: {
        flexDirection: 'row',
        flexGrow: 1,
        marginTop: 24,
    },
    templateTwoLeftCol: {
        width: '30%',
        marginRight: 24,
        paddingRight: 16,
    },
    templateTwoRightCol: {
        width: '70%',
        paddingLeft: 16,
        flexGrow: 1,
    },
    templateTwoSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
    },
    templateTwoItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateTwoItemSubtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateTwoItemDescription: {
        fontSize: 10,
        color: '#444',
        marginBottom: 8,
    },
    templateTwoSkillBadge: {
        backgroundColor: '#eee',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 9,
        margin: 2,
    },
    // Specific for TemplateThreePDF
    templateThreeContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 40,
        backgroundColor: '#ffffff',
    },
    templateThreeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    templateThreeNameSection: {
        flexDirection: 'column',
    },
    templateThreeName: {
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: 2,
    },
    templateThreeProfession: {
        fontSize: 14,
        color: '#555',
    },
    templateThreeContactSection: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontSize: 10,
        color: '#666',
    },
    templateThreeContactItem: {
        marginBottom: 2,
    },
    templateThreeContent: {
        flexDirection: 'row',
        flexGrow: 1,
    },
    templateThreeLeftCol: {
        width: '35%',
        paddingRight: 20,
    },
    templateThreeRightCol: {
        width: '65%',
        paddingLeft: 20,
        borderLeftWidth: 1,
        borderColor: '#eee',
    },
    templateThreeSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
    },
    templateThreeExperienceItem: {
        marginBottom: 15,
    },
    templateThreeJobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateThreeCompany: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateThreeDescription: {
        fontSize: 9,
        color: '#444',
    },
    templateThreeSkill: {
        fontSize: 10,
        marginBottom: 4,
        color: '#444',
    },
    // Specific for TemplateFourPDF
    templateFourContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 40,
        backgroundColor: '#f8fafc',
    },
    templateFourHeader: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 10,
        borderBottomWidth: 2,
    },
    templateFourName: {
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: 5,
    },
    templateFourContactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 10,
        color: '#555',
    },
    templateFourContactItem: {
        marginHorizontal: 8,
    },
    templateFourContent: {
        flexDirection: 'row',
        flexGrow: 1,
        borderTopWidth: 1,
        paddingTop: 10,
    },
    templateFourLeftCol: {
        width: '30%',
        paddingRight: 20,
    },
    templateFourRightCol: {
        width: '70%',
        paddingLeft: 20,
    },
    templateFourSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
    },
    templateFourItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateFourItemSubtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateFourItemDescription: {
        fontSize: 9,
        color: '#444',
        marginBottom: 8,
    },
    templateFourSkillBadge: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 9,
        margin: 2,
        color: '#3f51b5',
    },
    // Specific for TemplateFivePDF
    templateFiveContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 30,
        backgroundColor: '#fdfdfd',
        borderLeftWidth: 10,
    },
    templateFiveHeader: {
        marginBottom: 25,
        alignItems: 'center',
    },
    templateFiveName: {
        fontWeight: 'extrabold',
        marginBottom: 5,
        lineHeight: 1.2,
    },
    templateFiveContactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 9,
        color: '#555',
        marginTop: 5,
    },
    templateFiveContactItem: {
        marginHorizontal: 6,
    },
    templateFiveContent: {
        flexDirection: 'column',
    },
    templateFiveSection: {
        marginBottom: 20,
    },
    templateFiveSectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingBottom: 3,
        borderBottomWidth: 1,
    },
    templateFiveItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateFiveItemSubtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateFiveItemDescription: {
        fontSize: 9,
        color: '#444',
        marginBottom: 8,
    },
    templateFiveSkillBadge: {
        backgroundColor: '#e6ffe6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 9,
        margin: 2,
        color: '#1a751a',
    },
    // Specific for TemplateSixPDF
    templateSixContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f4f8',
    },
    templateSixLeftCol: {
        width: '35%',
        backgroundColor: '#2d3748',
        padding: 25,
        color: '#ffffff',
        flexDirection: 'column',
    },
    templateSixRightCol: {
        width: '65%',
        padding: 25,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    templateSixName: {
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: 10,
        color: '#f7fafc',
    },
    templateSixContactInfo: {
        fontSize: 9,
        color: '#cbd5e0',
        marginBottom: 4,
    },
    templateSixSectionTitleLeft: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: '#4a5568',
        color: '#f7fafc',
        marginTop: 20,
    },
    templateSixAboutText: {
        fontSize: 9,
        color: '#cbd5e0',
        textAlign: 'justify',
    },
    templateSixSkill: {
        fontSize: 9,
        color: '#f7fafc',
        backgroundColor: '#4a5568',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        margin: 3,
    },
    templateSixSectionTitleRight: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
    },
    templateSixExperienceItem: {
        marginBottom: 15,
    },
    templateSixJobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateSixCompany: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateSixDescription: {
        fontSize: 9,
        color: '#444',
    },
    // Specific for TemplateSevenPDF
    templateSevenContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1A202C',
        color: '#F7FAFC',
    },
    templateSevenHeader: {
        padding: 40,
        backgroundColor: tailwindColorMap['bg-gradient-to-br-from-blue-700-to-purple-800'][1],
        flexDirection: 'column',
        alignItems: 'center',
    },
    templateSevenName: {
        fontWeight: 'bold',
        color: getColorFromTailwind('text-gray-50'),
        marginBottom: 5,
    },
    templateSevenProfession: {
        fontSize: 14,
        color: getColorFromTailwind('text-gray-400'),
    },
    templateSevenContactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        fontSize: 10,
        color: getColorFromTailwind('text-gray-300'),
    },
    templateSevenContactItem: {
        marginHorizontal: 10,
    },
    templateSevenContent: {
        flexDirection: 'row',
        flexGrow: 1,
        padding: 30,
    },
    templateSevenLeftCol: {
        width: '30%',
        marginRight: 20,
        flexDirection: 'column',
    },
    templateSevenRightCol: {
        width: '70%',
        flexDirection: 'column',
    },
    templateSevenSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#4A5568',
        color: '#A0AEC0',
    },
    templateSevenItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    templateSevenItemSubtitle: {
        fontSize: 10,
        color: '#CBD5E0',
        marginBottom: 2,
    },
    templateSevenItemDescription: {
        fontSize: 9,
        color: '#CBD5E0',
        marginBottom: 8,
    },
    templateSevenSkill: {
        fontSize: 9,
        backgroundColor: '#2D3748',
        color: '#E2E8F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        margin: 4,
    },
    // Specific for TemplateEightPDF
    templateEightContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#F7FAFC',
    },
    templateEightHeader: {
        padding: 30,
        backgroundColor: tailwindColorMap['bg-gradient-to-r-from-blue-600-to-purple-700'][1],
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    templateEightName: {
        fontWeight: 'bold',
        color: getColorFromTailwind('text-yellow-400'),
        marginBottom: 5,
    },
    templateEightProfession: {
        fontSize: 16,
        color: '#E2E8F0',
    },
    templateEightContactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        fontSize: 10,
        color: '#CBD5E0',
    },
    templateEightContactItem: {
        marginHorizontal: 10,
    },
    templateEightContent: {
        padding: 30,
        flexDirection: 'column',
    },
    templateEightSection: {
        marginBottom: 20,
    },
    templateEightSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#E2E8EB',
    },
    templateEightItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    templateEightItemSubtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateEightItemDescription: {
        fontSize: 9,
        color: '#444',
        marginBottom: 8,
    },
    templateEightSkill: {
        fontSize: 9,
        backgroundColor: '#EBF8FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        margin: 4,
        color: '#2B6CB0',
    },
    // Specific for TemplateNinePDF
    templateNineContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
    },
    templateNineLeftCol: {
        width: '30%',
        backgroundColor: tailwindColorMap['bg-gradient-to-r-from-indigo-600-to-purple-700'][0],
        padding: 25,
        color: '#ffffff',
        flexDirection: 'column',
    },
    templateNineRightCol: {
        width: '70%',
        padding: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    templateNineName: {
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: 10,
        color: '#ffffff',
    },
    templateNineProfession: {
        fontSize: 12,
        color: '#E0E7FF',
    },
    templateNineContactInfo: {
        fontSize: 9,
        color: '#C7D2FE',
        marginBottom: 4,
    },
    templateNineSectionTitleLeft: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: '#6366F1',
        color: '#E0E7FF',
        marginTop: 20,
    },
    templateNineSkill: {
        fontSize: 9,
        color: '#3730A3',
        backgroundColor: '#C7D2FE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        margin: 3,
    },
    templateNineSectionTitleRight: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: '#E0E7FF',
        color: '#4F46E5',
    },
    templateNineExperienceItem: {
        marginBottom: 15,
    },
    templateNineJobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#312E81',
    },
    templateNineCompany: {
        fontSize: 10,
        color: '#6366F1',
        marginBottom: 2,
    },
    templateNineDescription: {
        fontSize: 9,
        color: '#4F46E5',
    },
    // Specific for TemplateTenPDF
    templateTenContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#F0FDFA',
    },
    templateTenHeader: {
        padding: 30,
        backgroundColor: tailwindColorMap['bg-gradient-to-r-from-teal-500-to-blue-600'][1],
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    templateTenName: {
        fontWeight: 'bold',
        color: '#E0F2F2',
        marginBottom: 5,
    },
    templateTenProfession: {
        fontSize: 16,
        color: '#CCFBF1',
    },
    templateTenContactInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        fontSize: 10,
        color: '#A7F3D0',
    },
    templateTenContactItem: {
        marginHorizontal: 10,
    },
    templateTenContent: {
        paddingHorizontal: 30,
        paddingBottom: 30,
        flexDirection: 'column',
    },
    templateTenSection: {
        marginBottom: 20,
    },
    templateTenSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#99F6E4',
        color: '#14B8A6',
    },
    templateTenItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0D9488',
    },
    templateTenItemSubtitle: {
        fontSize: 10,
        color: '#2DD4BF',
        marginBottom: 2,
    },
    templateTenItemDescription: {
        fontSize: 9,
        color: '#0F766E',
        marginBottom: 8,
    },
    templateTenSkill: {
        fontSize: 9,
        backgroundColor: '#CCFBF1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        margin: 4,
        color: '#0D9488',
    },
});

// --- ResumeSection Component for PDF ---
const ResumeSection = ({ title, children, accentTextColorClass, accentBorderColorClass }) => (
    <View style={[pdfStyles.mb4, pdfStyles.pb2, { borderBottomWidth: 1, borderColor: getColorFromTailwind(accentBorderColorClass || 'border-gray-300') }]}>
        <Text style={[pdfStyles.sectionHeading, { color: getColorFromTailwind(accentTextColorClass || 'text-gray-800') }]}>{title.toUpperCase()}</Text>
        {children}
    </View>
);

// --- PDF TEMPLATE COMPONENTS ---

const TemplateOnePDF = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSize = getPdfFontSize(getFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateOneContainer}>
                <View style={pdfStyles.templateOneLeft}>
                    {resumeData.personal.name && (
                        <View style={pdfStyles.mb4}>
                            <Text style={[pdfStyles.templateOneName, { fontSize: nameFontSize, color: getColorFromTailwind(nameColor) }]}>{resumeData.personal.name}</Text>
                            <Text style={[pdfStyles.templateOneContact, pdfStyles.textCenter]}>{resumeData.personal.profession}</Text>
                        </View>
                    )}
                    {resumeData.personal.email && <Text style={pdfStyles.templateOneContact}>{resumeData.personal.email}</Text>}
                    {resumeData.personal.phone && <Text style={pdfStyles.templateOneContact}>{resumeData.personal.phone}</Text>}
                    {resumeData.personal.linkedin && <Text style={pdfStyles.templateOneContact}>{resumeData.personal.linkedin}</Text>}
                    {resumeData.personal.portfolio && <Text style={pdfStyles.templateOneContact}>{resumeData.personal.portfolio}</Text>}

                    {resumeData.personal.summary && (
                        <View style={[pdfStyles.mt4, pdfStyles.mb4]}>
                            <Text style={[pdfStyles.sectionHeading, { color: getColorFromTailwind(textColor) }]}>ABOUT ME</Text>
                            <Text style={pdfStyles.templateOneAboutMeText}>{resumeData.personal.summary}</Text>
                        </View>
                    )}

                    {resumeData.skills && (
                        <View style={[pdfStyles.mt4, pdfStyles.mb4]}>
                            <Text style={[pdfStyles.sectionHeading, { color: getColorFromTailwind(textColor) }]}>SKILLS</Text>
                            <View style={pdfStyles.templateOneSkillsContainer}>
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <Text key={i} style={pdfStyles.templateOneSkillBadge}>{skill.trim()}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                    {resumeData.languages && (
                        <View style={[pdfStyles.mt4, pdfStyles.mb4]}>
                            <Text style={[pdfStyles.sectionHeading, { color: getColorFromTailwind(textColor) }]}>LANGUAGES</Text>
                            <Text style={pdfStyles.templateOneAboutMeText}>{resumeData.languages}</Text>
                        </View>
                    )}
                </View>

                <View style={pdfStyles.templateOneRight}>
                    {resumeData.experience.some(exp => exp.title) && (
                        <ResumeSection title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.experience.map((exp, index) => exp.title && (
                                <View key={index} style={pdfStyles.templateOneExperienceItem}>
                                    <Text style={pdfStyles.templateOneExperienceTitle}>{exp.title} at {exp.company}</Text>
                                    <Text style={pdfStyles.templateOneExperienceMeta}>{exp.dates}</Text>
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <Text key={i} style={pdfStyles.templateOneExperienceDescription}>• {line.trim()}</Text>
                                    ))}
                                </View>
                            ))}
                        </ResumeSection>
                    )}

                    {resumeData.education.some(edu => edu.institution) && (
                        <ResumeSection title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.education.map((edu, index) => edu.institution && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateOneExperienceTitle}>{edu.degree}</Text>
                                    <Text style={pdfStyles.templateOneExperienceMeta}>{edu.institution} - {edu.dates}</Text>
                                </View>
                            ))}
                        </ResumeSection>
                    )}

                    {resumeData.projects.some(proj => proj.title) && (
                        <ResumeSection title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.projects.map((proj, index) => proj.title && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateOneExperienceTitle}>{proj.title}</Text>
                                    {proj.link && <Text style={pdfStyles.templateOneExperienceMeta}>{proj.link}</Text>}
                                    {proj.technologies && <Text style={pdfStyles.templateOneExperienceMeta}>Technologies: {proj.technologies}</Text>}
                                    <Text style={pdfStyles.templateOneExperienceDescription}>{proj.description}</Text>
                                </View>
                            ))}
                        </ResumeSection>
                    )}

                    {resumeData.certifications.some(cert => cert.name) && (
                        <ResumeSection title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.certifications.map((cert, index) => cert.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateOneExperienceTitle}>{cert.name}</Text>
                                    <Text style={pdfStyles.templateOneExperienceMeta}>{cert.issuer} - {cert.date}</Text>
                                </View>
                            ))}
                        </ResumeSection>
                    )}

                    {resumeData.awards.some(award => award.name) && (
                        <ResumeSection title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.awards.map((award, index) => award.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateOneExperienceTitle}>{award.name}</Text>
                                    <Text style={pdfStyles.templateOneExperienceMeta}>{award.date}</Text>
                                    <Text style={pdfStyles.templateOneExperienceDescription}>{award.description}</Text>
                                </View>
                            ))}
                        </ResumeSection>
                    )}
                </View>
            </Page>
        </Document>
    );
};

const TemplateTwoPDF = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSize = getPdfFontSize(getFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateTwoContainer}>
                <View style={pdfStyles.templateTwoHeader}>
                    {resumeData.personal.name && (
                        <Text style={[pdfStyles.templateTwoName, { fontSize: nameFontSize, color: getColorFromTailwind(nameColor) }]}>{resumeData.personal.name}</Text>
                    )}
                    {resumeData.personal.profession && (
                        <Text style={pdfStyles.templateTwoTitle}>{resumeData.personal.profession}</Text>
                    )}
                    <View style={pdfStyles.templateTwoContactInfo}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateTwoContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateTwoContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateTwoContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateTwoContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                {resumeData.personal.summary && (
                    <ResumeSection title="Profile Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                    </ResumeSection>
                )}

                <View style={pdfStyles.templateTwoContent}>
                    <View style={pdfStyles.templateTwoLeftCol}>
                        {resumeData.education.some(edu => edu.institution) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EDUCATION</Text>
                                {resumeData.education.map((edu, index) => edu.institution && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateTwoItemTitle}>{edu.degree}</Text>
                                        <Text style={pdfStyles.templateTwoItemSubtitle}>{edu.institution}</Text>
                                        <Text style={pdfStyles.templateTwoItemSubtitle}>{edu.dates}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.skills && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>SKILLS</Text>
                                <View style={pdfStyles.flexRow, {flexWrap: 'wrap'}}>
                                    {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                        <Text key={i} style={pdfStyles.templateTwoSkillBadge}>{skill.trim()}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                         {resumeData.languages && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>LANGUAGES</Text>
                                <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                            </View>
                        )}
                         {resumeData.certifications.some(cert => cert.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>CERTIFICATIONS</Text>
                                {resumeData.certifications.map((cert, index) => cert.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateTwoItemTitle}>{cert.name}</Text>
                                        <Text style={pdfStyles.templateTwoItemSubtitle}>{cert.issuer}</Text>
                                        <Text style={pdfStyles.templateTwoItemSubtitle}>{cert.date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {resumeData.awards.some(award => award.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>AWARDS</Text>
                                {resumeData.awards.map((award, index) => award.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateTwoItemTitle}>{award.name}</Text>
                                        <Text style={pdfStyles.templateTwoItemSubtitle}>{award.date}</Text>
                                        <Text style={pdfStyles.templateTwoItemDescription}>{award.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={pdfStyles.templateTwoRightCol}>
                        {resumeData.experience.some(exp => exp.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EXPERIENCE</Text>
                                {resumeData.experience.map((exp, index) => exp.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateTwoItemTitle}>{exp.title} at {exp.company}</Text>
                                        <Text style={pdfStyles.templateTwoItemSubtitle}>{exp.dates}</Text>
                                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <Text key={i} style={pdfStyles.templateTwoItemDescription}>• {line.trim()}</Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.projects.some(proj => proj.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateTwoSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>PROJECTS</Text>
                                {resumeData.projects.map((proj, index) => proj.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateTwoItemTitle}>{proj.title}</Text>
                                        {proj.link && <Text style={pdfStyles.templateTwoItemSubtitle}>{proj.link}</Text>}
                                        {proj.technologies && <Text style={pdfStyles.templateTwoItemSubtitle}>Technologies: {proj.technologies}</Text>}
                                        <Text style={pdfStyles.templateTwoItemDescription}>{proj.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const TemplateThreePDF = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSize = getPdfFontSize(getFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateThreeContainer}>
                <View style={pdfStyles.templateThreeHeader}>
                    <View style={pdfStyles.templateThreeNameSection}>
                        {resumeData.personal.name && (
                            <Text style={[pdfStyles.templateThreeName, { fontSize: nameFontSize, color: getColorFromTailwind(nameColor) }]}>{resumeData.personal.name}</Text>
                        )}
                        {resumeData.personal.profession && (
                            <Text style={pdfStyles.templateThreeProfession}>{resumeData.personal.profession}</Text>
                        )}
                    </View>
                    <View style={pdfStyles.templateThreeContactSection}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateThreeContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateThreeContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateThreeContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateThreeContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                <View style={pdfStyles.templateThreeContent}>
                    <View style={pdfStyles.templateThreeLeftCol}>
                        {resumeData.personal.summary && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>SUMMARY</Text>
                                <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                            </View>
                        )}

                        {resumeData.skills && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>SKILLS</Text>
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <Text key={i} style={pdfStyles.templateThreeSkill}>• {skill.trim()}</Text>
                                ))}
                            </View>
                        )}

                        {resumeData.education.some(edu => edu.institution) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EDUCATION</Text>
                                {resumeData.education.map((edu, index) => edu.institution && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateThreeJobTitle}>{edu.degree}</Text>
                                        <Text style={pdfStyles.templateThreeCompany}>{edu.institution}</Text>
                                        <Text style={pdfStyles.templateThreeCompany}>{edu.dates}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.languages && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>LANGUAGES</Text>
                                <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                            </View>
                        )}

                        {resumeData.certifications.some(cert => cert.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>CERTIFICATIONS</Text>
                                {resumeData.certifications.map((cert, index) => cert.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateThreeSkill}>{cert.name}</Text>
                                        <Text style={pdfStyles.templateThreeCompany}>{cert.issuer} - {cert.date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.awards.some(award => award.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>AWARDS</Text>
                                {resumeData.awards.map((award, index) => award.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateThreeSkill}>{award.name}</Text>
                                        <Text style={pdfStyles.templateThreeCompany}>{award.date}</Text>
                                        <Text style={pdfStyles.templateThreeDescription}>{award.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={pdfStyles.templateThreeRightCol}>
                        {resumeData.experience.some(exp => exp.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EXPERIENCE</Text>
                                {resumeData.experience.map((exp, index) => exp.title && (
                                    <View key={index} style={pdfStyles.templateThreeExperienceItem}>
                                        <Text style={pdfStyles.templateThreeJobTitle}>{exp.title}, {exp.company}</Text>
                                        <Text style={pdfStyles.templateThreeCompany}>{exp.dates}</Text>
                                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <Text key={i} style={pdfStyles.templateThreeDescription}>• {line.trim()}</Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.projects.some(proj => proj.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateThreeSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>PROJECTS</Text>
                                {resumeData.projects.map((proj, index) => proj.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateThreeJobTitle}>{proj.title}</Text>
                                        {proj.link && <Text style={pdfStyles.templateThreeCompany}>{proj.link}</Text>}
                                        {proj.technologies && <Text style={pdfStyles.templateThreeCompany}>Technologies: {proj.technologies}</Text>}
                                        <Text style={pdfStyles.templateThreeDescription}>{proj.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const TemplateFourPDF = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSize = getPdfFontSize(getFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateFourContainer}>
                <View style={[pdfStyles.templateFourHeader, { borderBottomColor: getColorFromTailwind(borderColor) }]}>
                    {resumeData.personal.name && (
                        <Text style={[pdfStyles.templateFourName, { fontSize: nameFontSize, color: getColorFromTailwind(nameColor) }]}>{resumeData.personal.name}</Text>
                    )}
                    {resumeData.personal.profession && (
                        <Text style={pdfStyles.templateFourProfession}>{resumeData.personal.profession}</Text>
                    )}
                    <View style={pdfStyles.templateFourContactInfo}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateFourContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateFourContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateFourContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateFourContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                {resumeData.personal.summary && (
                    <ResumeSection title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                    </ResumeSection>
                )}

                <View style={pdfStyles.templateFourContent}>
                    <View style={pdfStyles.templateFourLeftCol}>
                        {resumeData.education.some(edu => edu.institution) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EDUCATION</Text>
                                {resumeData.education.map((edu, index) => edu.institution && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateFourItemTitle}>{edu.degree}</Text>
                                        <Text style={pdfStyles.templateFourItemSubtitle}>{edu.institution}</Text>
                                        <Text style={pdfStyles.templateFourItemSubtitle}>{edu.dates}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.skills && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>SKILLS</Text>
                                <View style={[pdfStyles.flexRow, { flexWrap: 'wrap' }]}>
                                    {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                        <Text key={i} style={pdfStyles.templateFourSkillBadge}>{skill.trim()}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {resumeData.languages && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>LANGUAGES</Text>
                                <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                            </View>
                        )}

                        {resumeData.certifications.some(cert => cert.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>CERTIFICATIONS</Text>
                                {resumeData.certifications.map((cert, index) => cert.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateFourItemTitle}>{cert.name}</Text>
                                        <Text style={pdfStyles.templateFourItemSubtitle}>{cert.issuer} - {cert.date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.awards.some(award => award.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>AWARDS</Text>
                                {resumeData.awards.map((award, index) => award.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateFourItemTitle}>{award.name}</Text>
                                        <Text style={pdfStyles.templateFourItemSubtitle}>{award.date}</Text>
                                        <Text style={pdfStyles.templateFourItemDescription}>{award.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={pdfStyles.templateFourRightCol}>
                        {resumeData.experience.some(exp => exp.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EXPERIENCE</Text>
                                {resumeData.experience.map((exp, index) => exp.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateFourItemTitle}>{exp.title} at {exp.company}</Text>
                                        <Text style={pdfStyles.templateFourItemSubtitle}>{exp.dates}</Text>
                                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <Text key={i} style={pdfStyles.templateFourItemDescription}>• {line.trim()}</Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.projects.some(proj => proj.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={[pdfStyles.templateFourSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>PROJECTS</Text>
                                {resumeData.projects.map((proj, index) => proj.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateFourItemTitle}>{proj.title}</Text>
                                        {proj.link && <Text style={pdfStyles.templateFourItemSubtitle}>{proj.link}</Text>}
                                        {proj.technologies && <Text style={pdfStyles.templateFourItemSubtitle}>Technologies: {proj.technologies}</Text>}
                                        <Text style={pdfStyles.templateFourItemDescription}>{proj.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const TemplateFivePDF = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSize = getPdfFontSize(getLargerFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={[pdfStyles.templateFiveContainer, { borderLeftColor: getColorFromTailwind(borderColor) }]}>
                <View style={pdfStyles.templateFiveHeader}>
                    {resumeData.personal.name && (
                        <Text style={[pdfStyles.templateFiveName, { fontSize: nameFontSize, color: getColorFromTailwind(nameColor) }]}>{resumeData.personal.name}</Text>
                    )}
                    {resumeData.personal.profession && (
                        <Text style={pdfStyles.templateFiveProfession}>{resumeData.personal.profession}</Text>
                    )}
                    <View style={pdfStyles.templateFiveContactInfo}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateFiveContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateFiveContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateFiveContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateFiveContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                {resumeData.personal.summary && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>SUMMARY</Text>
                        <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                    </View>
                )}

                {resumeData.experience.some(exp => exp.title) && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EXPERIENCE</Text>
                        {resumeData.experience.map((exp, index) => exp.title && (
                            <View key={index} style={pdfStyles.mb3}>
                                <Text style={pdfStyles.templateFiveItemTitle}>{exp.title} at {exp.company}</Text>
                                <Text style={pdfStyles.templateFiveItemSubtitle}>{exp.dates}</Text>
                                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                    <Text key={i} style={pdfStyles.templateFiveItemDescription}>• {line.trim()}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {resumeData.education.some(edu => edu.institution) && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>EDUCATION</Text>
                        {resumeData.education.map((edu, index) => edu.institution && (
                            <View key={index} style={pdfStyles.mb2}>
                                <Text style={pdfStyles.templateFiveItemTitle}>{edu.degree}</Text>
                                <Text style={pdfStyles.templateFiveItemSubtitle}>{edu.institution}</Text>
                                <Text style={pdfStyles.templateFiveItemSubtitle}>{edu.dates}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {resumeData.skills && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>SKILLS</Text>
                        <View style={pdfStyles.flexRow, { flexWrap: 'wrap' }}>
                            {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                <Text key={i} style={pdfStyles.templateFiveSkillBadge}>{skill.trim()}</Text>
                            ))}
                        </View>
                    </View>
                )}

                {resumeData.projects.some(proj => proj.title) && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>PROJECTS</Text>
                        {resumeData.projects.map((proj, index) => proj.title && (
                            <View key={index} style={pdfStyles.mb3}>
                                <Text style={pdfStyles.templateFiveItemTitle}>{proj.title}</Text>
                                {proj.link && <Text style={pdfStyles.templateFiveItemSubtitle}>{proj.link}</Text>}
                                {proj.technologies && <Text style={pdfStyles.templateFiveItemSubtitle}>Technologies: {proj.technologies}</Text>}
                                <Text style={pdfStyles.templateFiveItemDescription}>{proj.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {resumeData.certifications.some(cert => cert.name) && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>CERTIFICATIONS</Text>
                        {resumeData.certifications.map((cert, index) => cert.name && (
                            <View key={index} style={pdfStyles.mb2}>
                                <Text style={pdfStyles.templateFiveItemTitle}>{cert.name}</Text>
                                <Text style={pdfStyles.templateFiveItemSubtitle}>{cert.issuer} - {cert.date}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {resumeData.awards.some(award => award.name) && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>AWARDS</Text>
                        {resumeData.awards.map((award, index) => award.name && (
                            <View key={index} style={pdfStyles.mb2}>
                                <Text style={pdfStyles.templateFiveItemTitle}>{award.name}</Text>
                                <Text style={pdfStyles.templateFiveItemSubtitle}>{award.date}</Text>
                                <Text style={pdfStyles.templateFiveItemDescription}>{award.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {resumeData.languages && (
                    <View style={pdfStyles.templateFiveSection}>
                        <Text style={[pdfStyles.templateFiveSectionTitle, { borderBottomColor: getColorFromTailwind(borderColor), color: getColorFromTailwind(textColor) }]}>LANGUAGES</Text>
                        <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};

const TemplateSixPDF = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSize = getPdfFontSize(getLargerFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateSixContainer}>
                <View style={pdfStyles.templateSixLeftCol}>
                    {resumeData.personal.name && (
                        <View style={pdfStyles.mb4}>
                            <Text style={[pdfStyles.templateSixName, { fontSize: nameFontSize, color: getColorFromTailwind(nameColor) }]}>{resumeData.personal.name}</Text>
                            {resumeData.personal.profession && <Text style={[pdfStyles.contactItem, { color: '#cbd5e0' }]}>{resumeData.personal.profession}</Text>}
                        </View>
                    )}
                    {resumeData.personal.email && <Text style={pdfStyles.templateSixContactInfo}>{resumeData.personal.email}</Text>}
                    {resumeData.personal.phone && <Text style={pdfStyles.templateSixContactInfo}>{resumeData.personal.phone}</Text>}
                    {resumeData.personal.linkedin && <Text style={pdfStyles.templateSixContactInfo}>{resumeData.personal.linkedin}</Text>}
                    {resumeData.personal.portfolio && <Text style={pdfStyles.templateSixContactInfo}>{resumeData.personal.portfolio}</Text>}

                    {resumeData.personal.summary && (
                        <View style={pdfStyles.mt4}>
                            <Text style={[pdfStyles.templateSixSectionTitleLeft, { borderBottomColor: getColorFromTailwind(borderColor) }]}>PROFILE</Text>
                            <Text style={pdfStyles.templateSixAboutText}>{resumeData.personal.summary}</Text>
                        </View>
                    )}

                    {resumeData.skills && (
                        <View style={pdfStyles.mt4}>
                            <Text style={[pdfStyles.templateSixSectionTitleLeft, { borderBottomColor: getColorFromTailwind(borderColor) }]}>SKILLS</Text>
                            <View style={[pdfStyles.flexRow, { flexWrap: 'wrap', marginTop: 5 }]}>
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <Text key={i} style={pdfStyles.templateSixSkill}>{skill.trim()}</Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {resumeData.languages && (
                        <View style={pdfStyles.mt4}>
                            <Text style={[pdfStyles.templateSixSectionTitleLeft, { borderBottomColor: getColorFromTailwind(borderColor) }]}>LANGUAGES</Text>
                            <Text style={pdfStyles.templateSixAboutText}>{resumeData.languages}</Text>
                        </View>
                    )}

                    {resumeData.certifications.some(cert => cert.name) && (
                        <View style={pdfStyles.mt4}>
                            <Text style={[pdfStyles.templateSixSectionTitleLeft, { borderBottomColor: getColorFromTailwind(borderColor) }]}>CERTIFICATIONS</Text>
                            {resumeData.certifications.map((cert, index) => cert.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateSixAboutText}>{cert.name}</Text>
                                    <Text style={[pdfStyles.templateSixAboutText, { fontSize: 8 }]}>{cert.issuer} - {cert.date}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.awards.some(award => award.name) && (
                        <View style={pdfStyles.mt4}>
                            <Text style={[pdfStyles.templateSixSectionTitleLeft, { borderBottomColor: getColorFromTailwind(borderColor) }]}>AWARDS</Text>
                            {resumeData.awards.map((award, index) => award.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateSixAboutText}>{award.name}</Text>
                                    <Text style={[pdfStyles.templateSixAboutText, { fontSize: 8 }]}>{award.date}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={pdfStyles.templateSixRightCol}>
                    {resumeData.experience.some(exp => exp.title) && (
                        <ResumeSection title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.experience.map((exp, index) => exp.title && (
                                <View key={index} style={pdfStyles.templateSixExperienceItem}>
                                    <Text style={pdfStyles.templateSixJobTitle}>{exp.title} at {exp.company}</Text>
                                    <Text style={pdfStyles.templateSixCompany}>{exp.dates}</Text>
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <Text key={i} style={pdfStyles.templateSixDescription}>• {line.trim()}</Text>
                                    ))}
                                </View>
                            ))}
                        </ResumeSection>
                    )}

                    {resumeData.education.some(edu => edu.institution) && (
                        <ResumeSection title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.education.map((edu, index) => edu.institution && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateSixJobTitle}>{edu.degree}</Text>
                                    <Text style={pdfStyles.templateSixCompany}>{edu.institution}</Text>
                                    <Text style={pdfStyles.templateSixCompany}>{edu.dates}</Text>
                                </View>
                            ))}
                        </ResumeSection>
                    )}

                    {resumeData.projects.some(proj => proj.title) && (
                        <ResumeSection title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.projects.map((proj, index) => proj.title && (
                                <View key={index} style={pdfStyles.mb3}>
                                    <Text style={pdfStyles.templateSixJobTitle}>{proj.title}</Text>
                                    {proj.link && <Text style={pdfStyles.templateSixCompany}>{proj.link}</Text>}
                                    {proj.technologies && <Text style={pdfStyles.templateSixCompany}>Technologies: {proj.technologies}</Text>}
                                    <Text style={pdfStyles.templateSixDescription}>{proj.description}</Text>
                                </View>
                            ))}
                        </ResumeSection>
                    )}
                </View>
            </Page>
        </Document>
    );
};

const TemplateSevenPDF = ({ resumeData, accentColor }) => {
    const nameFontSize = getPdfFontSize(getLargerFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateSevenContainer}>
                <View style={pdfStyles.templateSevenHeader}>
                    {resumeData.personal.name && (
                        <Text style={[pdfStyles.templateSevenName, { fontSize: nameFontSize }]}>{resumeData.personal.name}</Text>
                    )}
                    {resumeData.personal.profession && (
                        <Text style={pdfStyles.templateSevenProfession}>{resumeData.personal.profession}</Text>
                    )}
                    <View style={pdfStyles.templateSevenContactInfo}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateSevenContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateSevenContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateSevenContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateSevenContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                <View style={pdfStyles.templateSevenContent}>
                    <View style={pdfStyles.templateSevenLeftCol}>
                        {resumeData.personal.summary && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>SUMMARY</Text>
                                <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                            </View>
                        )}

                        {resumeData.skills && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>SKILLS</Text>
                                <View style={[pdfStyles.flexRow, { flexWrap: 'wrap' }]}>
                                    {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                        <Text key={i} style={pdfStyles.templateSevenSkill}>{skill.trim()}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {resumeData.education.some(edu => edu.institution) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>EDUCATION</Text>
                                {resumeData.education.map((edu, index) => edu.institution && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateSevenItemTitle}>{edu.degree}</Text>
                                        <Text style={pdfStyles.templateSevenItemSubtitle}>{edu.institution}</Text>
                                        <Text style={pdfStyles.templateSevenItemSubtitle}>{edu.dates}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.languages && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>LANGUAGES</Text>
                                <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                            </View>
                        )}

                        {resumeData.certifications.some(cert => cert.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>CERTIFICATIONS</Text>
                                {resumeData.certifications.map((cert, index) => cert.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateSevenItemTitle}>{cert.name}</Text>
                                        <Text style={pdfStyles.templateSevenItemSubtitle}>{cert.issuer} - {cert.date}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.awards.some(award => award.name) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>AWARDS</Text>
                                {resumeData.awards.map((award, index) => award.name && (
                                    <View key={index} style={pdfStyles.mb2}>
                                        <Text style={pdfStyles.templateSevenItemTitle}>{award.name}</Text>
                                        <Text style={pdfStyles.templateSevenItemSubtitle}>{award.date}</Text>
                                        <Text style={pdfStyles.templateSevenItemDescription}>{award.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={pdfStyles.templateSevenRightCol}>
                        {resumeData.experience.some(exp => exp.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>EXPERIENCE</Text>
                                {resumeData.experience.map((exp, index) => exp.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateSevenItemTitle}>{exp.title} at {exp.company}</Text>
                                        <Text style={pdfStyles.templateSevenItemSubtitle}>{exp.dates}</Text>
                                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <Text key={i} style={pdfStyles.templateSevenItemDescription}>• {line.trim()}</Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}

                        {resumeData.projects.some(proj => proj.title) && (
                            <View style={pdfStyles.mb4}>
                                <Text style={pdfStyles.templateSevenSectionTitle}>PROJECTS</Text>
                                {resumeData.projects.map((proj, index) => proj.title && (
                                    <View key={index} style={pdfStyles.mb3}>
                                        <Text style={pdfStyles.templateSevenItemTitle}>{proj.title}</Text>
                                        {proj.link && <Text style={pdfStyles.templateSevenItemSubtitle}>{proj.link}</Text>}
                                        {proj.technologies && <Text style={pdfStyles.templateSevenItemSubtitle}>Technologies: {proj.technologies}</Text>}
                                        <Text style={pdfStyles.templateSevenItemDescription}>{proj.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const TemplateEightPDF = ({ resumeData, accentColor }) => {
    const nameFontSize = getPdfFontSize(getLargerFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateEightContainer}>
                <View style={pdfStyles.templateEightHeader}>
                    {resumeData.personal.name && (
                        <Text style={[pdfStyles.templateEightName, { fontSize: nameFontSize }]}>{resumeData.personal.name}</Text>
                    )}
                    {resumeData.personal.profession && (
                        <Text style={pdfStyles.templateEightProfession}>{resumeData.personal.profession}</Text>
                    )}
                    <View style={pdfStyles.templateEightContactInfo}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateEightContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateEightContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateEightContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateEightContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                <View style={pdfStyles.templateEightContent}>
                    {resumeData.personal.summary && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>SUMMARY</Text>
                            <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                        </View>
                    )}

                    {resumeData.experience.some(exp => exp.title) && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>EXPERIENCE</Text>
                            {resumeData.experience.map((exp, index) => exp.title && (
                                <View key={index} style={pdfStyles.mb3}>
                                    <Text style={pdfStyles.templateEightItemTitle}>{exp.title} at {exp.company}</Text>
                                    <Text style={pdfStyles.templateEightItemSubtitle}>{exp.dates}</Text>
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <Text key={i} style={pdfStyles.templateEightItemDescription}>• {line.trim()}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.education.some(edu => edu.institution) && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>EDUCATION</Text>
                            {resumeData.education.map((edu, index) => edu.institution && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateEightItemTitle}>{edu.degree}</Text>
                                    <Text style={pdfStyles.templateEightItemSubtitle}>{edu.institution}</Text>
                                    <Text style={pdfStyles.templateEightItemSubtitle}>{edu.dates}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.skills && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>SKILLS</Text>
                            <View style={[pdfStyles.flexRow, { flexWrap: 'wrap' }]}>
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <Text key={i} style={pdfStyles.templateEightSkill}>{skill.trim()}</Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {resumeData.projects.some(proj => proj.title) && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>PROJECTS</Text>
                            {resumeData.projects.map((proj, index) => proj.title && (
                                <View key={index} style={pdfStyles.mb3}>
                                    <Text style={pdfStyles.templateEightItemTitle}>{proj.title}</Text>
                                    {proj.link && <Text style={pdfStyles.templateEightItemSubtitle}>{proj.link}</Text>}
                                    {proj.technologies && <Text style={pdfStyles.templateEightItemSubtitle}>Technologies: {proj.technologies}</Text>}
                                    <Text style={pdfStyles.templateEightItemDescription}>{proj.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.certifications.some(cert => cert.name) && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>CERTIFICATIONS</Text>
                            {resumeData.certifications.map((cert, index) => cert.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateEightItemTitle}>{cert.name}</Text>
                                    <Text style={pdfStyles.templateEightItemSubtitle}>{cert.issuer} - {cert.date}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.awards.some(award => award.name) && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>AWARDS</Text>
                            {resumeData.awards.map((award, index) => award.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateEightItemTitle}>{award.name}</Text>
                                    <Text style={pdfStyles.templateEightItemSubtitle}>{award.date}</Text>
                                    <Text style={pdfStyles.templateEightItemDescription}>{award.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.languages && (
                        <View style={pdfStyles.templateEightSection}>
                            <Text style={pdfStyles.templateEightSectionTitle}>LANGUAGES</Text>
                            <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

const TemplateNinePDF = ({ resumeData, accentColor }) => {
    const nameFontSize = getPdfFontSize(getLargerFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateNineContainer}>
                <View style={pdfStyles.templateNineLeftCol}>
                    {resumeData.personal.name && (
                        <View style={pdfStyles.mb4}>
                            <Text style={[pdfStyles.templateNineName, { fontSize: nameFontSize }]}>{resumeData.personal.name}</Text>
                            {resumeData.personal.profession && <Text style={pdfStyles.templateNineProfession}>{resumeData.personal.profession}</Text>}
                        </View>
                    )}
                    {resumeData.personal.email && <Text style={pdfStyles.templateNineContactInfo}>{resumeData.personal.email}</Text>}
                    {resumeData.personal.phone && <Text style={pdfStyles.templateNineContactInfo}>{resumeData.personal.phone}</Text>}
                    {resumeData.personal.linkedin && <Text style={pdfStyles.templateNineContactInfo}>{resumeData.personal.linkedin}</Text>}
                    {resumeData.personal.portfolio && <Text style={pdfStyles.templateNineContactInfo}>{resumeData.personal.portfolio}</Text>}

                    {resumeData.personal.summary && (
                        <View style={pdfStyles.mt4}>
                            <Text style={pdfStyles.templateNineSectionTitleLeft}>PROFILE</Text>
                            <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                        </View>
                    )}

                    {resumeData.skills && (
                        <View style={pdfStyles.mt4}>
                            <Text style={pdfStyles.templateNineSectionTitleLeft}>SKILLS</Text>
                            <View style={[pdfStyles.flexRow, { flexWrap: 'wrap', marginTop: 5 }]}>
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <Text key={i} style={pdfStyles.templateNineSkill}>{skill.trim()}</Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {resumeData.languages && (
                        <View style={pdfStyles.mt4}>
                            <Text style={pdfStyles.templateNineSectionTitleLeft}>LANGUAGES</Text>
                            <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                        </View>
                    )}

                    {resumeData.certifications.some(cert => cert.name) && (
                        <View style={pdfStyles.mt4}>
                            <Text style={pdfStyles.templateNineSectionTitleLeft}>CERTIFICATIONS</Text>
                            {resumeData.certifications.map((cert, index) => cert.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.textSm}>{cert.name}</Text>
                                    <Text style={[pdfStyles.textXs]}>{cert.issuer} - {cert.date}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.awards.some(award => award.name) && (
                        <View style={pdfStyles.mt4}>
                            <Text style={pdfStyles.templateNineSectionTitleLeft}>AWARDS</Text>
                            {resumeData.awards.map((award, index) => award.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.textSm}>{award.name}</Text>
                                    <Text style={[pdfStyles.textXs]}>{award.date}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={pdfStyles.templateNineRightCol}>
                    {resumeData.experience.some(exp => exp.title) && (
                        <View style={pdfStyles.mb4}>
                            <Text style={pdfStyles.templateNineSectionTitleRight}>EXPERIENCE</Text>
                            {resumeData.experience.map((exp, index) => exp.title && (
                                <View key={index} style={pdfStyles.templateNineExperienceItem}>
                                    <Text style={pdfStyles.templateNineJobTitle}>{exp.title} at {exp.company}</Text>
                                    <Text style={pdfStyles.templateNineCompany}>{exp.dates}</Text>
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <Text key={i} style={pdfStyles.templateNineDescription}>• {line.trim()}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.education.some(edu => edu.institution) && (
                        <View style={pdfStyles.mb4}>
                            <Text style={pdfStyles.templateNineSectionTitleRight}>EDUCATION</Text>
                            {resumeData.education.map((edu, index) => edu.institution && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateNineJobTitle}>{edu.degree}</Text>
                                    <Text style={pdfStyles.templateNineCompany}>{edu.institution}</Text>
                                    <Text style={pdfStyles.templateNineCompany}>{edu.dates}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.projects.some(proj => proj.title) && (
                        <View style={pdfStyles.mb4}>
                            <Text style={pdfStyles.templateNineSectionTitleRight}>PROJECTS</Text>
                            {resumeData.projects.map((proj, index) => proj.title && (
                                <View key={index} style={pdfStyles.mb3}>
                                    <Text style={pdfStyles.templateNineJobTitle}>{proj.title}</Text>
                                    {proj.link && <Text style={pdfStyles.templateNineCompany}>{proj.link}</Text>}
                                    {proj.technologies && <Text style={pdfStyles.templateNineCompany}>Technologies: {proj.technologies}</Text>}
                                    <Text style={pdfStyles.templateNineDescription}>{proj.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

const TemplateTenPDF = ({ resumeData, accentColor }) => {
    const nameFontSize = getPdfFontSize(getLargerFontSizeForName(resumeData.personal.name));

    return (
        <Document>
            <Page size="A4" style={pdfStyles.templateTenContainer}>
                <View style={pdfStyles.templateTenHeader}>
                    {resumeData.personal.name && (
                        <Text style={[pdfStyles.templateTenName, { fontSize: nameFontSize }]}>{resumeData.personal.name}</Text>
                    )}
                    {resumeData.personal.profession && (
                        <Text style={pdfStyles.templateTenProfession}>{resumeData.personal.profession}</Text>
                    )}
                    <View style={pdfStyles.templateTenContactInfo}>
                        {resumeData.personal.email && <Text style={pdfStyles.templateTenContactItem}>{resumeData.personal.email}</Text>}
                        {resumeData.personal.phone && <Text style={pdfStyles.templateTenContactItem}>{resumeData.personal.phone}</Text>}
                        {resumeData.personal.linkedin && <Text style={pdfStyles.templateTenContactItem}>{resumeData.personal.linkedin}</Text>}
                        {resumeData.personal.portfolio && <Text style={pdfStyles.templateTenContactItem}>{resumeData.personal.portfolio}</Text>}
                    </View>
                </View>

                <View style={pdfStyles.templateTenContent}>
                    {resumeData.personal.summary && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>SUMMARY</Text>
                            <Text style={pdfStyles.textSm}>{resumeData.personal.summary}</Text>
                        </View>
                    )}

                    {resumeData.experience.some(exp => exp.title) && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>EXPERIENCE</Text>
                            {resumeData.experience.map((exp, index) => exp.title && (
                                <View key={index} style={pdfStyles.mb3}>
                                    <Text style={pdfStyles.templateTenItemTitle}>{exp.title} at {exp.company}</Text>
                                    <Text style={pdfStyles.templateTenItemSubtitle}>{exp.dates}</Text>
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <Text key={i} style={pdfStyles.templateTenItemDescription}>• {line.trim()}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.education.some(edu => edu.institution) && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>EDUCATION</Text>
                            {resumeData.education.map((edu, index) => edu.institution && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateTenItemTitle}>{edu.degree}</Text>
                                    <Text style={pdfStyles.templateTenItemSubtitle}>{edu.institution}</Text>
                                    <Text style={pdfStyles.templateTenItemSubtitle}>{edu.dates}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.skills && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>SKILLS</Text>
                            <View style={[pdfStyles.flexRow, { flexWrap: 'wrap' }]}>
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <Text key={i} style={pdfStyles.templateTenSkill}>{skill.trim()}</Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {resumeData.projects.some(proj => proj.title) && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>PROJECTS</Text>
                            {resumeData.projects.map((proj, index) => proj.title && (
                                <View key={index} style={pdfStyles.mb3}>
                                    <Text style={pdfStyles.templateTenItemTitle}>{proj.title}</Text>
                                    {proj.link && <Text style={pdfStyles.templateTenItemSubtitle}>{proj.link}</Text>}
                                    {proj.technologies && <Text style={pdfStyles.templateTenItemSubtitle}>Technologies: {proj.technologies}</Text>}
                                    <Text style={pdfStyles.templateTenItemDescription}>{proj.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.certifications.some(cert => cert.name) && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>CERTIFICATIONS</Text>
                            {resumeData.certifications.map((cert, index) => cert.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateTenItemTitle}>{cert.name}</Text>
                                    <Text style={pdfStyles.templateTenItemSubtitle}>{cert.issuer} - {cert.date}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.awards.some(award => award.name) && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>AWARDS</Text>
                            {resumeData.awards.map((award, index) => award.name && (
                                <View key={index} style={pdfStyles.mb2}>
                                    <Text style={pdfStyles.templateTenItemTitle}>{award.name}</Text>
                                    <Text style={pdfStyles.templateTenItemSubtitle}>{award.date}</Text>
                                    <Text style={pdfStyles.templateTenItemDescription}>{award.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {resumeData.languages && (
                        <View style={pdfStyles.templateTenSection}>
                            <Text style={pdfStyles.templateTenSectionTitle}>LANGUAGES</Text>
                            <Text style={pdfStyles.textSm}>{resumeData.languages}</Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

// --- Helper Components for Input Fields ---
const InputField = ({ label, type = 'text', value, onChange, placeholder, className = "" }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <input
            type={type}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        ></textarea>
    </div>
);

// Reusable Add Button Component
const AddButton = ({ onClick, text }) => (
  <button
    onClick={onClick}
    className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center text-sm"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
    {text}
  </button>
);

// Reusable Remove Button Component
const RemoveButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
        title="Remove"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    </button>
);

// --- Template Definitions (New Components for Each Template) for Web Preview ---

// Template 1: Modern Professional (Clean, balanced single column, clear hierarchy)
const ModernProfessionalTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getFontSizeForName(resumeData.personal.name);
    return (
        <div className="p-6 font-sans leading-relaxed text-gray-900">
            {resumeData.personal.name && (
                <div className="text-center mb-6">
                    <h2 className={`${nameFontSizeClass} font-bold mb-1 ${nameColor}`}>{resumeData.personal.name}</h2>
                    <p className="text-gray-600 text-sm flex justify-center flex-wrap gap-x-3">
                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                        {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                        {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>}
                    </p>
                </div>
            )}
            {resumeData.personal.summary && (
                <ResumeSectionDisplay title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-sm">{resumeData.personal.summary}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.experience.some(exp => exp.title) && (
                <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.experience.map((exp, index) => exp.title && (
                        <div key={index} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-semibold text-base">{exp.title} at {exp.company}</h4>
                                <p className="text-xs text-gray-700">{exp.dates}</p>
                            </div>
                            <ul className="list-disc list-inside text-sm mt-1">
                                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.education.some(edu => edu.institution) && (
                <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.education.map((edu, index) => edu.institution && (
                        <div key={index} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-semibold text-base">{edu.degree}</h4>
                                <p className="text-xs text-gray-700">{edu.dates}</p>
                            </div>
                            <p className="text-sm text-gray-700">{edu.institution}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.skills && (
                <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-sm">{resumeData.skills}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.projects.some(proj => proj.title) && (
                <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.projects.map((proj, index) => proj.title && (
                        <div key={index} className="mb-3">
                            <h4 className="font-semibold text-base">{proj.title}</h4>
                            {proj.link && <p className="text-xs text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                            {proj.technologies && <p className="text-xs text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                            <p className="text-sm">{proj.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.certifications.some(cert => cert.name) && (
                <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.certifications.map((cert, index) => cert.name && (
                        <div key={index} className="mb-2">
                            <h4 className="font-semibold text-base">{cert.name}</h4>
                            <p className="text-xs text-gray-700">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.awards.some(award => award.name) && (
                <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.awards.map((award, index) => award.name && (
                        <div key={index} className="mb-2">
                            <h4 className="font-semibold text-base">{award.name}</h4>
                            <p className="text-xs text-gray-700">{award.date}</p>
                            <p className="text-sm">{award.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.languages && (
                <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-sm">{resumeData.languages}</p>
                </ResumeSectionDisplay>
            )}
        </div>
    );
};

// Template 2: Chronological (Traditional, clear date emphasis)
const ChronologicalTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getFontSizeForName(resumeData.personal.name);
    return (
        <div className="p-8 font-serif text-gray-900">
            {resumeData.personal.name && (
                <div className="text-center mb-6 border-b pb-4 border-gray-300">
                    <h1 className={`${nameFontSizeClass} font-bold ${nameColor}`}>{resumeData.personal.name}</h1>
                    <p className="text-gray-700 text-sm mt-2 flex justify-center flex-wrap gap-x-3">
                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                        {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                        {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>}
                    </p>
                </div>
            )}
            {resumeData.personal.summary && (
                <ResumeSectionDisplay title="Profile Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-sm">{resumeData.personal.summary}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.experience.some(exp => exp.title) && (
                <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.experience.map((exp, index) => exp.title && (
                        <div key={index} className="mb-4 grid grid-cols-4">
                            <p className="col-span-1 text-xs text-gray-700 font-medium">{exp.dates}</p>
                            <div className="col-span-3">
                                <h4 className="font-semibold text-base">{exp.title}</h4>
                                <p className="text-sm text-gray-700 mb-1">{exp.company}</p>
                                <ul className="list-disc list-inside text-sm">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.education.some(edu => edu.institution) && (
                <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.education.map((edu, index) => edu.institution && (
                        <div key={index} className="mb-3 grid grid-cols-4">
                            <p className="col-span-1 text-xs text-gray-700 font-medium">{edu.dates}</p>
                            <div className="col-span-3">
                                <h4 className="font-semibold text-base">{edu.degree}</h4>
                                <p className="text-sm text-gray-700">{edu.institution}</p>
                            </div>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.skills && (
                <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-sm">{resumeData.skills}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.projects.some(proj => proj.title) && (
                <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.projects.map((proj, index) => proj.title && (
                        <div key={index} className="mb-3">
                            <h4 className="font-semibold text-base">{proj.title}</h4>
                            {proj.link && <p className="text-xs text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                            {proj.technologies && <p className="text-xs text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                            <p className="text-sm">{proj.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.certifications.some(cert => cert.name) && (
                <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.certifications.map((cert, index) => cert.name && (
                        <div key={index} className="mb-2">
                            <h4 className="font-semibold text-base">{cert.name}</h4>
                            <p className="text-xs text-gray-700">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.awards.some(award => award.name) && (
                <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.awards.map((award, index) => award.name && (
                        <div key={index} className="mb-2">
                            <h4 className="font-semibold text-base">{award.name}</h4>
                            <p className="text-xs text-gray-700">{award.date}</p>
                            <p className="text-sm">{award.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.languages && (
                <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-sm">{resumeData.languages}</p>
                </ResumeSectionDisplay>
            )}
        </div>
    );
};

// Template 3: Functional (Skills-focused, side-column for contact)
const FunctionalTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getFontSizeForName(resumeData.personal.name);
    return (
        <div className="p-8 font-sans text-gray-900 grid grid-cols-4 gap-6">
            <div className="col-span-1 pr-4 border-r border-gray-300">
                {resumeData.personal.name && (
                    <div className="mb-6">
                        <h2 className={`${nameFontSizeClass} font-bold ${nameColor}`}>{resumeData.personal.name}</h2>
                        <div className="mt-4 text-sm text-gray-700 space-y-1">
                            {resumeData.personal.email && <p><span className="font-semibold">Email:</span> {resumeData.personal.email}</p>}
                            {resumeData.personal.phone && <p><span className="font-semibold">Phone:</span> {resumeData.personal.phone}</p>}
                            {resumeData.personal.linkedin && <p><span className="font-semibold">LinkedIn:</span> <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{resumeData.personal.linkedin.replace(/(^\w+:|^)\/\//, '')}</a></p>}
                            {resumeData.personal.portfolio && <p><span className="font-semibold">Portfolio:</span> <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{resumeData.personal.portfolio.replace(/(^\w+:|^)\/\//, '')}</a></p>}
                        </div>
                    </div>
                )}
                {resumeData.skills && (
                    <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <ul className="list-disc list-inside text-sm">
                            {resumeData.skills.split(',').map((skill, i) => skill.trim() && <li key={i}>{skill.trim()}</li>)}
                        </ul>
                    </ResumeSectionDisplay>
                )}
                {resumeData.languages && (
                    <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <p className="text-sm">{resumeData.languages}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.certifications.some(cert => cert.name) && (
                    <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.certifications.map((cert, index) => cert.name && (
                            <p key={index} className="text-sm">{cert.name} ({cert.issuer})</p>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.awards.some(award => award.name) && (
                    <ResumeSectionDisplay title="Awards" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.awards.map((award, index) => award.name && (
                            <p key={index} className="text-sm">{award.name}</p>
                        ))}
                    </ResumeSectionDisplay>
                )}
            </div>
            <div className="col-span-3 pl-4">
                {resumeData.personal.summary && (
                    <ResumeSectionDisplay title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <p className="text-sm">{resumeData.personal.summary}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.experience.some(exp => exp.title) && (
                    <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.experience.map((exp, index) => exp.title && (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-semibold text-base">{exp.title}, {exp.company}</h4>
                                    <p className="text-xs text-gray-700">{exp.dates}</p>
                                </div>
                                <ul className="list-disc list-inside text-sm mt-1">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.education.some(edu => edu.institution) && (
                    <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.education.map((edu, index) => edu.institution && (
                            <div key={index} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-semibold text-base">{edu.degree}</h4>
                                    <p className="text-xs text-gray-700">{edu.dates}</p>
                                </div>
                                <p className="text-sm text-gray-700">{edu.institution}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.projects.some(proj => proj.title) && (
                    <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.projects.map((proj, index) => proj.title && (
                            <div key={index} className="mb-3">
                                <h4 className="font-semibold text-base">{proj.title}</h4>
                                {proj.link && <p className="text-xs text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                                {proj.technologies && <p className="text-xs text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                                <p className="text-sm">{proj.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
            </div>
        </div>
    );
};

// Template 4: Clean & Minimal (Simple, effective, strong sectioning)
const CleanMinimalTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getFontSizeForName(resumeData.personal.name);
    return (
        <div className="p-8 font-sans text-gray-900">
            {resumeData.personal.name && (
                <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: getColorFromTailwind(borderColor) }}>
                    <h1 className={`${nameFontSizeClass} font-bold ${nameColor}`}>{resumeData.personal.name}</h1>
                    {resumeData.personal.profession && <p className="text-gray-700 text-lg mt-1">{resumeData.personal.profession}</p>}
                    <p className="text-gray-600 text-sm mt-2 flex justify-center flex-wrap gap-x-3">
                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                        {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                        {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>}
                    </p>
                </div>
            )}
            {resumeData.personal.summary && (
                <ResumeSectionDisplay title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-base">{resumeData.personal.summary}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.experience.some(exp => exp.title) && (
                <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.experience.map((exp, index) => exp.title && (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-lg">{exp.title} at {exp.company}</h3>
                                <p className="text-sm text-gray-700">{exp.dates}</p>
                            </div>
                            <ul className="list-disc list-inside text-base mt-1">
                                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.education.some(edu => edu.institution) && (
                <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.education.map((edu, index) => edu.institution && (
                        <div key={index} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-lg">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.dates}</p>
                            </div>
                            <p className="text-base text-gray-700">{edu.institution}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.skills && (
                <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-base">{resumeData.skills}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.projects.some(proj => proj.title) && (
                <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.projects.map((proj, index) => proj.title && (
                        <div key={index} className="mb-3">
                            <h3 className="font-semibold text-lg">{proj.title}</h3>
                            {proj.link && <p className="text-sm text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                            {proj.technologies && <p className="text-sm text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                            <p className="text-base">{proj.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.certifications.some(cert => cert.name) && (
                <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.certifications.map((cert, index) => cert.name && (
                        <div key={index} className="mb-2">
                            <h3 className="font-semibold text-lg">{cert.name}</h3>
                            <p className="text-sm text-gray-700">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.awards.some(award => award.name) && (
                <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.awards.map((award, index) => award.name && (
                        <div key={index} className="mb-2">
                            <h3 className="font-semibold text-lg">{award.name}</h3>
                            <p className="text-sm text-gray-700">{award.date}</p>
                            <p className="text-base">{award.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.languages && (
                <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-base">{resumeData.languages}</p>
                </ResumeSectionDisplay>
            )}
        </div>
    );
};

// Template 5: Executive (Formal, professional, strong header)
const ExecutiveTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getLargerFontSizeForName(resumeData.personal.name);
    return (
        <div className="p-8 font-serif text-gray-900 border-l-8" style={{ borderColor: getColorFromTailwind(borderColor) }}>
            {resumeData.personal.name && (
                <div className="text-center mb-8">
                    <h1 className={`${nameFontSizeClass} font-extrabold ${nameColor} tracking-tight mb-2`}>{resumeData.personal.name}</h1>
                    {resumeData.personal.profession && <p className="text-gray-700 text-xl font-medium">{resumeData.personal.profession}</p>}
                    <p className="text-gray-600 text-sm mt-3 flex justify-center flex-wrap gap-x-4">
                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                        {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                        {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>}
                    </p>
                </div>
            )}
            {resumeData.personal.summary && (
                <ResumeSectionDisplay title="Professional Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-base leading-relaxed">{resumeData.personal.summary}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.experience.some(exp => exp.title) && (
                <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.experience.map((exp, index) => exp.title && (
                        <div key={index} className="mb-5">
                            <h3 className="font-bold text-lg">{exp.title}</h3>
                            <p className="text-sm text-gray-700">{exp.company} | {exp.dates}</p>
                            <ul className="list-disc list-inside text-base mt-1">
                                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.education.some(edu => edu.institution) && (
                <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.education.map((edu, index) => edu.institution && (
                        <div key={index} className="mb-4">
                            <h3 className="font-bold text-lg">{edu.degree}</h3>
                            <p className="text-sm text-gray-700">{edu.institution} | {edu.dates}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.skills && (
                <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-base">{resumeData.skills}</p>
                </ResumeSectionDisplay>
            )}
            {resumeData.projects.some(proj => proj.title) && (
                <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.projects.map((proj, index) => proj.title && (
                        <div key={index} className="mb-4">
                            <h3 className="font-bold text-lg">{proj.title}</h3>
                            {proj.link && <p className="text-sm text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                            {proj.technologies && <p className="text-sm text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                            <p className="text-base">{proj.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.certifications.some(cert => cert.name) && (
                <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.certifications.map((cert, index) => cert.name && (
                        <div key={index} className="mb-3">
                            <h3 className="font-bold text-lg">{cert.name}</h3>
                            <p className="text-sm text-gray-700">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.awards.some(award => award.name) && (
                <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    {resumeData.awards.map((award, index) => award.name && (
                        <div key={index} className="mb-3">
                            <h3 className="font-bold text-lg">{award.name}</h3>
                            <p className="text-sm text-gray-700">{award.date}</p>
                            <p className="text-base">{award.description}</p>
                        </div>
                    ))}
                </ResumeSectionDisplay>
            )}
            {resumeData.languages && (
                <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                    <p className="text-base">{resumeData.languages}</p>
                </ResumeSectionDisplay>
            )}
        </div>
    );
};

// Template 6: Creative (Two-column, modern, with profile photo placeholder)
const CreativeTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getLargerFontSizeForName(resumeData.personal.name);
    return (
        <div className="flex font-sans text-gray-900 min-h-screen bg-gray-50">
            <div className="w-1/3 bg-gray-800 text-white p-8 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-5xl font-bold text-gray-300 mb-6">
                    {/* Placeholder for Profile Image or Initials */}
                    {resumeData.personal.name ? resumeData.personal.name[0].toUpperCase() : 'JD'}
                </div>
                {resumeData.personal.name && (
                    <h2 className={`${nameFontSizeClass} font-bold text-center mb-4 ${nameColor}`}>{resumeData.personal.name}</h2>
                )}
                {resumeData.personal.profession && (
                    <p className="text-gray-300 text-lg mb-6 text-center">{resumeData.personal.profession}</p>
                )}
                <div className="w-full text-sm space-y-2 mb-8">
                    {resumeData.personal.email && <p className="flex items-center"><span className="mr-2 text-gray-400">📧</span> {resumeData.personal.email}</p>}
                    {resumeData.personal.phone && <p className="flex items-center"><span className="mr-2 text-gray-400">📞</span> {resumeData.personal.phone}</p>}
                    {resumeData.personal.linkedin && <p className="flex items-center"><span className="mr-2 text-gray-400">🔗</span> <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">LinkedIn</a></p>}
                    {resumeData.personal.portfolio && <p className="flex items-center"><span className="mr-2 text-gray-400">🌐</span> <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">Portfolio</a></p>}
                </div>
                {resumeData.personal.summary && (
                    <ResumeSectionDisplay title="Profile" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="creative-left-section">
                        <p className="text-sm text-gray-300">{resumeData.personal.summary}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.skills && (
                    <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="creative-left-section">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                <span key={i} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs">{skill.trim()}</span>
                            ))}
                        </div>
                    </ResumeSectionDisplay>
                )}
                {resumeData.languages && (
                    <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="creative-left-section">
                        <p className="text-sm text-gray-300">{resumeData.languages}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.certifications.some(cert => cert.name) && (
                    <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="creative-left-section">
                        {resumeData.certifications.map((cert, index) => cert.name && (
                            <div key={index} className="mb-2">
                                <h4 className="font-semibold text-sm text-gray-200">{cert.name}</h4>
                                <p className="text-xs text-gray-400">{cert.issuer} - {cert.date}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.awards.some(award => award.name) && (
                    <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="creative-left-section">
                        {resumeData.awards.map((award, index) => award.name && (
                            <div key={index} className="mb-2">
                                <h4 className="font-semibold text-sm text-gray-200">{award.name}</h4>
                                <p className="text-xs text-gray-400">{award.date}</p>
                                <p className="text-sm text-gray-300">{award.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
            </div>
            <div className="w-2/3 p-8">
                {resumeData.experience.some(exp => exp.title) && (
                    <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.experience.map((exp, index) => exp.title && (
                            <div key={index} className="mb-5">
                                <h3 className="font-bold text-lg">{exp.title} at {exp.company}</h3>
                                <p className="text-sm text-gray-700 mb-1">{exp.dates}</p>
                                <ul className="list-disc list-inside text-base">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.education.some(edu => edu.institution) && (
                    <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.education.map((edu, index) => edu.institution && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.institution} | {edu.dates}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.projects.some(proj => proj.title) && (
                    <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.projects.map((proj, index) => proj.title && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg">{proj.title}</h3>
                                {proj.link && <p className="text-sm text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                                {proj.technologies && <p className="text-sm text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                                <p className="text-base">{proj.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
            </div>
        </div>
    );
};

// Template 7: Gradient Elegance (Modern, sleek, gradient header)
const GradientEleganceTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getLargerFontSizeForName(resumeData.personal.name);

    // Dynamic gradient background for the header
    const headerGradientStyle = {
        background: `linear-gradient(to bottom right, ${tailwindColorMap['bg-gradient-to-br-from-blue-700-to-purple-800'][0]}, ${tailwindColorMap['bg-gradient-to-br-from-blue-700-to-purple-800'][1]})`
    };

    return (
        <div className="font-sans text-gray-100 min-h-screen bg-gray-900">
            <div className="p-10 text-center text-white" style={headerGradientStyle}>
                {resumeData.personal.name && (
                    <h1 className={`${nameFontSizeClass} font-bold mb-2`}>{resumeData.personal.name}</h1>
                )}
                {resumeData.personal.profession && (
                    <p className="text-gray-200 text-lg mb-4">{resumeData.personal.profession}</p>
                )}
                <div className="flex justify-center flex-wrap gap-x-6 text-gray-300 text-sm">
                    {resumeData.personal.email && <span className="flex items-center"><span className="mr-1">📧</span> {resumeData.personal.email}</span>}
                    {resumeData.personal.phone && <span className="flex items-center"><span className="mr-1">📞</span> {resumeData.personal.phone}</span>}
                    {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline flex items-center"><span className="mr-1">🔗</span> LinkedIn</a>}
                    {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline flex items-center"><span className="mr-1">🌐</span> Portfolio</a>}
                </div>
            </div>

            <div className="p-8 grid grid-cols-3 gap-8">
                <div className="col-span-1">
                    {resumeData.personal.summary && (
                        <ResumeSectionDisplay title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            <p className="text-sm text-gray-300">{resumeData.personal.summary}</p>
                        </ResumeSectionDisplay>
                    )}
                    {resumeData.skills && (
                        <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                    <span key={i} className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md text-xs">{skill.trim()}</span>
                                ))}
                            </div>
                        </ResumeSectionDisplay>
                    )}
                    {resumeData.education.some(edu => edu.institution) && (
                        <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.education.map((edu, index) => edu.institution && (
                                <div key={index} className="mb-3">
                                    <h4 className="font-semibold text-base text-gray-100">{edu.degree}</h4>
                                    <p className="text-xs text-gray-400">{edu.institution}</p>
                                    <p className="text-xs text-gray-400">{edu.dates}</p>
                                </div>
                            ))}
                        </ResumeSectionDisplay>
                    )}
                    {resumeData.languages && (
                        <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            <p className="text-sm text-gray-300">{resumeData.languages}</p>
                        </ResumeSectionDisplay>
                    )}
                    {resumeData.certifications.some(cert => cert.name) && (
                        <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.certifications.map((cert, index) => cert.name && (
                                <div key={index} className="mb-2">
                                    <h4 className="font-semibold text-sm text-gray-200">{cert.name}</h4>
                                    <p className="text-xs text-gray-400">{cert.issuer} - {cert.date}</p>
                                </div>
                            ))}
                        </ResumeSectionDisplay>
                    )}
                    {resumeData.awards.some(award => award.name) && (
                        <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.awards.map((award, index) => award.name && (
                                <div key={index} className="mb-2">
                                    <h4 className="font-semibold text-sm text-gray-200">{award.name}</h4>
                                    <p className="text-xs text-gray-400">{award.date}</p>
                                    <p className="text-sm text-gray-300">{award.description}</p>
                                </div>
                            ))}
                        </ResumeSectionDisplay>
                    )}
                </div>

                <div className="col-span-2">
                    {resumeData.experience.some(exp => exp.title) && (
                        <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.experience.map((exp, index) => exp.title && (
                                <div key={index} className="mb-5">
                                    <h3 className="font-bold text-lg text-gray-50">{exp.title} at {exp.company}</h3>
                                    <p className="text-sm text-gray-400 mb-1">{exp.dates}</p>
                                    <ul className="list-disc list-inside text-base text-gray-300">
                                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </ResumeSectionDisplay>
                    )}
                    {resumeData.projects.some(proj => proj.title) && (
                        <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                            {resumeData.projects.map((proj, index) => proj.title && (
                                <div key={index} className="mb-4">
                                    <h3 className="font-bold text-lg text-gray-50">{proj.title}</h3>
                                    {proj.link && <p className="text-sm text-blue-200 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                                    {proj.technologies && <p className="text-sm text-gray-400 italic mb-1">Technologies: {proj.technologies}</p>}
                                    <p className="text-base text-gray-300">{proj.description}</p>
                                </div>
                            ))}
                        </ResumeSectionDisplay>
                    )}
                </div>
            </div>
        </div>
    );
};

// Template 8: Bold & Modern (Strong use of color, emphasis on name)
const BoldModernTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getLargerFontSizeForName(resumeData.personal.name);

    // Dynamic gradient background for the header
    const headerGradientStyle = {
        background: `linear-gradient(to right, ${tailwindColorMap['bg-gradient-to-r-from-blue-600-to-purple-700'][0]}, ${tailwindColorMap['bg-gradient-to-r-from-blue-600-to-purple-700'][1]})`
    };

    return (
        <div className="font-sans text-gray-900 min-h-screen bg-gray-50">
            <div className="p-10 text-white text-center shadow-lg" style={headerGradientStyle}>
                {resumeData.personal.name && (
                    <h1 className={`${nameFontSizeClass} font-bold mb-2 text-yellow-300`}>{resumeData.personal.name}</h1>
                )}
                {resumeData.personal.profession && (
                    <p className="text-xl font-light mb-4">{resumeData.personal.profession}</p>
                )}
                <div className="flex justify-center flex-wrap gap-x-6 text-gray-200 text-sm">
                    {resumeData.personal.email && <span className="flex items-center"><span className="mr-1">📧</span> {resumeData.personal.email}</span>}
                    {resumeData.personal.phone && <span className="flex items-center"><span className="mr-1">📞</span> {resumeData.personal.phone}</span>}
                    {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-yellow-100 hover:underline flex items-center"><span className="mr-1">🔗</span> LinkedIn</a>}
                    {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-yellow-100 hover:underline flex items-center"><span className="mr-1">🌐</span> Portfolio</a>}
                </div>
            </div>

            <div className="p-8">
                {resumeData.personal.summary && (
                    <ResumeSectionDisplay title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <p className="text-base">{resumeData.personal.summary}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.experience.some(exp => exp.title) && (
                    <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.experience.map((exp, index) => exp.title && (
                            <div key={index} className="mb-5">
                                <h3 className="font-bold text-lg">{exp.title} at {exp.company}</h3>
                                <p className="text-sm text-gray-700 mb-1">{exp.dates}</p>
                                <ul className="list-disc list-inside text-base">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.education.some(edu => edu.institution) && (
                    <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.education.map((edu, index) => edu.institution && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.institution} | {edu.dates}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.skills && (
                    <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">{skill.trim()}</span>
                            ))}
                        </div>
                    </ResumeSectionDisplay>
                )}
                {resumeData.projects.some(proj => proj.title) && (
                    <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.projects.map((proj, index) => proj.title && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg">{proj.title}</h3>
                                {proj.link && <p className="text-sm text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                                {proj.technologies && <p className="text-sm text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                                <p className="text-base">{proj.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.certifications.some(cert => cert.name) && (
                    <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.certifications.map((cert, index) => cert.name && (
                            <div key={index} className="mb-3">
                                <h3 className="font-bold text-lg">{cert.name}</h3>
                                <p className="text-sm text-gray-700">{cert.issuer} - {cert.date}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.awards.some(award => award.name) && (
                    <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.awards.map((award, index) => award.name && (
                            <div key={index} className="mb-3">
                                <h3 className="font-bold text-lg">{award.name}</h3>
                                <p className="text-sm text-gray-700">{award.date}</p>
                                <p className="text-base">{award.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.languages && (
                    <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <p className="text-base">{resumeData.languages}</p>
                    </ResumeSectionDisplay>
                )}
            </div>
        </div>
    );
};

// Template 9: Professional Split (Left sidebar for personal, right for experience)
const ProfessionalSplitTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getLargerFontSizeForName(resumeData.personal.name);

    const leftColStyle = {
        background: `linear-gradient(to right, ${tailwindColorMap['bg-gradient-to-r-from-indigo-600-to-purple-700'][0]}, ${tailwindColorMap['bg-gradient-to-r-from-indigo-600-to-purple-700'][1]})`
    };

    return (
        <div className="flex font-sans text-gray-900 min-h-screen bg-gray-100">
            <div className="w-1/3 text-white p-8" style={leftColStyle}>
                {resumeData.personal.name && (
                    <div className="mb-8">
                        <h1 className={`${nameFontSizeClass} font-bold mb-2`}>{resumeData.personal.name}</h1>
                        {resumeData.personal.profession && <p className="text-indigo-100 text-lg">{resumeData.personal.profession}</p>}
                    </div>
                )}
                <div className="text-sm space-y-3 mb-8">
                    {resumeData.personal.email && <p className="flex items-center"><span className="mr-2 text-indigo-200">📧</span> {resumeData.personal.email}</p>}
                    {resumeData.personal.phone && <p className="flex items-center"><span className="mr-2 text-indigo-200">📞</span> {resumeData.personal.phone}</p>}
                    {resumeData.personal.linkedin && <p className="flex items-center"><span className="mr-2 text-indigo-200">🔗</span> <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:underline break-all">LinkedIn</a></p>}
                    {resumeData.personal.portfolio && <p className="flex items-center"><span className="mr-2 text-indigo-200">🌐</span> <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:underline break-all">Portfolio</a></p>}
                </div>

                {resumeData.personal.summary && (
                    <ResumeSectionDisplay title="Profile" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="professional-split-left-section">
                        <p className="text-sm text-indigo-100">{resumeData.personal.summary}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.skills && (
                    <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="professional-split-left-section">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                <span key={i} className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs">{skill.trim()}</span>
                            ))}
                        </div>
                    </ResumeSectionDisplay>
                )}
                {resumeData.languages && (
                    <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="professional-split-left-section">
                        <p className="text-sm text-indigo-100">{resumeData.languages}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.certifications.some(cert => cert.name) && (
                    <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="professional-split-left-section">
                        {resumeData.certifications.map((cert, index) => cert.name && (
                            <div key={index} className="mb-2">
                                <h4 className="font-semibold text-sm text-indigo-100">{cert.name}</h4>
                                <p className="text-xs text-indigo-200">{cert.issuer} - {cert.date}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.awards.some(award => award.name) && (
                    <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor} sectionId="professional-split-left-section">
                        {resumeData.awards.map((award, index) => award.name && (
                            <div key={index} className="mb-2">
                                <h4 className="font-semibold text-sm text-indigo-100">{award.name}</h4>
                                <p className="text-xs text-indigo-200">{award.date}</p>
                                <p className="text-sm text-indigo-100">{award.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
            </div>
            <div className="w-2/3 p-8">
                {resumeData.experience.some(exp => exp.title) && (
                    <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.experience.map((exp, index) => exp.title && (
                            <div key={index} className="mb-5">
                                <h3 className="font-bold text-lg">{exp.title} at {exp.company}</h3>
                                <p className="text-sm text-gray-700 mb-1">{exp.dates}</p>
                                <ul className="list-disc list-inside text-base">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.education.some(edu => edu.institution) && (
                    <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.education.map((edu, index) => edu.institution && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.institution} | {edu.dates}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.projects.some(proj => proj.title) && (
                    <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.projects.map((proj, index) => proj.title && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg">{proj.title}</h3>
                                {proj.link && <p className="text-sm text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                                {proj.technologies && <p className="text-sm text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                                <p className="text-base">{proj.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
            </div>
        </div>
    );
};

// Template 10: Teal & Blue Accent (Vibrant, modern, clean)
const TealBlueAccentTemplate = ({ resumeData, accentColor }) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const nameFontSizeClass = getLargerFontSizeForName(resumeData.personal.name);

    const headerGradientStyle = {
        background: `linear-gradient(to right, ${tailwindColorMap['bg-gradient-to-r-from-teal-500-to-blue-600'][0]}, ${tailwindColorMap['bg-gradient-to-r-from-teal-500-to-blue-600'][1]})`
    };

    return (
        <div className="font-sans text-gray-900 min-h-screen bg-teal-50">
            <div className="p-10 text-white text-center shadow-lg" style={headerGradientStyle}>
                {resumeData.personal.name && (
                    <h1 className={`${nameFontSizeClass} font-bold mb-2 text-teal-100`}>{resumeData.personal.name}</h1>
                )}
                {resumeData.personal.profession && (
                    <p className="text-xl font-light mb-4 text-teal-200">{resumeData.personal.profession}</p>
                )}
                <div className="flex justify-center flex-wrap gap-x-6 text-teal-100 text-sm">
                    {resumeData.personal.email && <span className="flex items-center"><span className="mr-1">📧</span> {resumeData.personal.email}</span>}
                    {resumeData.personal.phone && <span className="flex items-center"><span className="mr-1">📞</span> {resumeData.personal.phone}</span>}
                    {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-50 hover:underline flex items-center"><span className="mr-1">🔗</span> LinkedIn</a>}
                    {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-teal-50 hover:underline flex items-center"><span className="mr-1">🌐</span> Portfolio</a>}
                </div>
            </div>

            <div className="p-8">
                {resumeData.personal.summary && (
                    <ResumeSectionDisplay title="Summary" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <p className="text-base">{resumeData.personal.summary}</p>
                    </ResumeSectionDisplay>
                )}
                {resumeData.experience.some(exp => exp.title) && (
                    <ResumeSectionDisplay title="Experience" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.experience.map((exp, index) => exp.title && (
                            <div key={index} className="mb-5">
                                <h3 className="font-bold text-lg text-teal-700">{exp.title} at {exp.company}</h3>
                                <p className="text-sm text-gray-700 mb-1">{exp.dates}</p>
                                <ul className="list-disc list-inside text-base">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                                </ul>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.education.some(edu => edu.institution) && (
                    <ResumeSectionDisplay title="Education" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.education.map((edu, index) => edu.institution && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg text-teal-700">{edu.degree}</h3>
                                <p className="text-sm text-gray-700">{edu.institution} | {edu.dates}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.skills && (
                    <ResumeSectionDisplay title="Skills" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {resumeData.skills.split(',').map((skill, i) => skill.trim() && (
                                <span key={i} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-md text-sm">{skill.trim()}</span>
                            ))}
                        </div>
                    </ResumeSectionDisplay>
                )}
                {resumeData.projects.some(proj => proj.title) && (
                    <ResumeSectionDisplay title="Projects" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.projects.map((proj, index) => proj.title && (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold text-lg text-teal-700">{proj.title}</h3>
                                {proj.link && <p className="text-sm text-blue-600 hover:underline mb-1"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                                {proj.technologies && <p className="text-sm text-gray-700 italic mb-1">Technologies: {proj.technologies}</p>}
                                <p className="text-base">{proj.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.certifications.some(cert => cert.name) && (
                    <ResumeSectionDisplay title="Certifications" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.certifications.map((cert, index) => cert.name && (
                            <div key={index} className="mb-3">
                                <h3 className="font-bold text-lg text-teal-700">{cert.name}</h3>
                                <p className="text-sm text-gray-700">{cert.issuer} - {cert.date}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.awards.some(award => award.name) && (
                    <ResumeSectionDisplay title="Awards/Honors" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        {resumeData.awards.map((award, index) => award.name && (
                            <div key={index} className="mb-3">
                                <h3 className="font-bold text-lg text-teal-700">{award.name}</h3>
                                <p className="text-sm text-gray-700">{award.date}</p>
                                <p className="text-base">{award.description}</p>
                            </div>
                        ))}
                    </ResumeSectionDisplay>
                )}
                {resumeData.languages && (
                    <ResumeSectionDisplay title="Languages" accentTextColorClass={textColor} accentBorderColorClass={borderColor}>
                        <p className="text-base">{resumeData.languages}</p>
                    </ResumeSectionDisplay>
                )}
            </div>
        </div>
    );
};

// Initial state for resume data
const initialResumeData = {
    personal: {
        name: 'John Doe',
        profession: 'Software Engineer',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        linkedin: 'https://linkedin.com/in/johndoe',
        portfolio: 'https://johndoe.com',
        summary: 'Highly motivated software engineer with 5+ years of experience in developing robust and scalable applications. Proficient in JavaScript, React, Node.js, and cloud platforms. Seeking to leverage my skills to contribute to innovative projects.'
    },
    experience: [
        {
            title: 'Senior Software Developer',
            company: 'Tech Solutions Inc.',
            dates: 'Jan 2022 - Present',
            description: `- Led development of a new microservices architecture, reducing latency by 30%.
- Implemented CI/CD pipelines using Jenkins, improving deployment frequency by 50%.
- Mentored junior developers and conducted code reviews.`
        },
        {
            title: 'Software Developer',
            company: 'Innovate Corp.',
            dates: 'Mar 2019 - Dec 2021',
            description: `- Developed and maintained web applications using React and Node.js.
- Collaborated with cross-functional teams to define, design, and ship new features.
- Optimized database queries, resulting in a 20% performance improvement.`
        }
    ],
    education: [
        {
            degree: 'Master of Science in Computer Science',
            institution: 'University of Example',
            dates: 'Sept 2018 - May 2020'
        },
        {
            degree: 'Bachelor of Science in Software Engineering',
            institution: 'Another University',
            dates: 'Sept 2014 - May 2018'
        }
    ],
    skills: 'JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes, SQL, MongoDB, Agile, Git, Redux, RESTful APIs',
    projects: [
        {
            title: 'E-commerce Platform',
            link: 'https://github.com/johndoe/ecommerce',
            technologies: 'React, Node.js, Express, MongoDB, Stripe',
            description: 'Developed a full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment gateway integration.'
        },
        {
            title: 'Task Management CLI',
            link: 'https://github.com/johndoe/task-cli',
            technologies: 'Python, Click',
            description: 'Created a command-line interface tool for managing daily tasks, including add, delete, list, and mark as complete functionalities.'
        }
    ],
    certifications: [
        {
            name: 'AWS Certified Solutions Architect - Associate',
            issuer: 'Amazon Web Services',
            date: 'Jan 2023'
        }
    ],
    awards: [
        {
            name: 'Employee of the Year',
            date: 'Dec 2023',
            description: 'Awarded for outstanding contributions to project success and team collaboration.'
        }
    ],
    languages: 'English (Native), Spanish (Conversational)'
};


// Main App Component
const App = () => {
    const [resumeData, setResumeData] = useState(initialResumeData);
    const [selectedTemplate, setSelectedTemplate] = useState('Template1');
    const [accentColor, setAccentColor] = useState('blue');
    const [view, setView] = useState('builder'); // 'builder', 'home', 'customization'

    const handlePersonalChange = (e) => {
        setResumeData({
            ...resumeData,
            personal: { ...resumeData.personal, [e.target.name]: e.target.value },
        });
    };

    const handleExperienceChange = (index, e) => {
        const newExperience = resumeData.experience.map((exp, i) => {
            if (i === index) {
                return { ...exp, [e.target.name]: e.target.value };
            }
            return exp;
        });
        setResumeData({ ...resumeData, experience: newExperience });
    };

    const addExperience = () => {
        setResumeData({
            ...resumeData,
            experience: [...resumeData.experience, { title: '', company: '', dates: '', description: '' }],
        });
    };

    const removeExperience = (index) => {
        const newExperience = resumeData.experience.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, experience: newExperience });
    };

    const handleEducationChange = (index, e) => {
        const newEducation = resumeData.education.map((edu, i) => {
            if (i === index) {
                return { ...edu, [e.target.name]: e.target.value };
            }
            return edu;
        });
        setResumeData({ ...resumeData, education: newEducation });
    };

    const addEducation = () => {
        setResumeData({
            ...resumeData,
            education: [...resumeData.education, { degree: '', institution: '', dates: '' }],
        });
    };

    const removeEducation = (index) => {
        const newEducation = resumeData.education.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, education: newEducation });
    };

    const handleSkillsChange = (e) => {
        setResumeData({ ...resumeData, skills: e.target.value });
    };

    const handleProjectsChange = (index, e) => {
        const newProjects = resumeData.projects.map((proj, i) => {
            if (i === index) {
                return { ...proj, [e.target.name]: e.target.value };
            }
            return proj;
        });
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const addProject = () => {
        setResumeData({
            ...resumeData,
            projects: [...resumeData.projects, { title: '', link: '', technologies: '', description: '' }],
        });
    };

    const removeProject = (index) => {
        const newProjects = resumeData.projects.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const handleCertificationsChange = (index, e) => {
        const newCertifications = resumeData.certifications.map((cert, i) => {
            if (i === index) {
                return { ...cert, [e.target.name]: e.target.value };
            }
            return cert;
        });
        setResumeData({ ...resumeData, certifications: newCertifications });
    };

    const addCertification = () => {
        setResumeData({
            ...resumeData,
            certifications: [...resumeData.certifications, { name: '', issuer: '', date: '' }],
        });
    };

    const removeCertification = (index) => {
        const newCertifications = resumeData.certifications.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, certifications: newCertifications });
    };

    const handleAwardsChange = (index, e) => {
        const newAwards = resumeData.awards.map((award, i) => {
            if (i === index) {
                return { ...award, [e.target.name]: e.target.value };
            }
            return award;
        });
        setResumeData({ ...resumeData, awards: newAwards });
    };

    const addAward = () => {
        setResumeData({
            ...resumeData,
            awards: [...resumeData.awards, { name: '', date: '', description: '' }],
        });
    };

    const removeAward = (index) => {
        const newAwards = resumeData.awards.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, awards: newAwards });
    };

    const handleLanguagesChange = (e) => {
        setResumeData({ ...resumeData, languages: e.target.value });
    };


    const renderSelectedTemplate = () => {
        switch (selectedTemplate) {
            case 'Template1':
                return <ModernProfessionalTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template2':
                return <ChronologicalTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template3':
                return <FunctionalTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template4':
                return <CleanMinimalTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template5':
                return <ExecutiveTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template6':
                return <CreativeTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template7':
                return <GradientEleganceTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template8':
                return <BoldModernTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template9':
                return <ProfessionalSplitTemplate resumeData={resumeData} accentColor={accentColor} />;
            case 'Template10':
                return <TealBlueAccentTemplate resumeData={resumeData} accentColor={accentColor} />;
            default:
                return <ModernProfessionalTemplate resumeData={resumeData} accentColor={accentColor} />;
        }
    };

    const renderSelectedPDFTemplate = () => {
        switch (selectedTemplate) {
            case 'Template1':
                return <TemplateOnePDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template2':
                return <TemplateTwoPDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template3':
                return <TemplateThreePDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template4':
                return <TemplateFourPDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template5':
                return <TemplateFivePDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template6':
                return <TemplateSixPDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template7':
                return <TemplateSevenPDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template8':
                return <TemplateEightPDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template9':
                return <TemplateNinePDF resumeData={resumeData} accentColor={accentColor} />;
            case 'Template10':
                return <TemplateTenPDF resumeData={resumeData} accentColor={accentColor} />;
            default:
                return <TemplateOnePDF resumeData={resumeData} accentColor={accentColor} />;
        }
    };


    const TemplateCard = ({ templateName, displayName, currentTemplate, onSelect }) => (
        <div
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                currentTemplate === templateName
                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-lg'
                    : 'border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onSelect(templateName)}
        >
            <h4 className="font-semibold text-lg mb-2">{displayName}</h4>
            <p className="text-sm text-gray-600">A clean and professional layout.</p>
        </div>
    );

    const ColorPicker = ({ currentColor, onSelect }) => {
        const colors = ['blue', 'purple', 'green', 'red', 'orange', 'teal', 'pink', 'indigo', 'lime', 'amber', 'gray'];
        return (
            <div className="flex flex-wrap gap-2 mt-4">
                {colors.map(color => (
                    <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                            currentColor === color ? 'border-gray-900 ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: tailwindColorMap[`bg-${color}-600`] || (color === 'gray' ? '#4B5563' : '#000000') }}
                        onClick={() => onSelect(color)}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                    ></div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <nav className="mb-8 flex justify-center space-x-4">
                <button
                    onClick={() => setView('home')}
                    className={`py-2 px-4 rounded-md text-lg font-medium transition-colors ${view === 'home' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Home
                </button>
                <button
                    onClick={() => setView('builder')}
                    className={`py-2 px-4 rounded-md text-lg font-medium transition-colors ${view === 'builder' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Resume Builder
                </button>
                <button
                    onClick={() => setView('customization')}
                    className={`py-2 px-4 rounded-md text-lg font-medium transition-colors ${view === 'customization' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Customization
                </button>
            </nav>

            {view === 'home' && (
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Ultimate Resume Builder!</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Craft your perfect resume with ease. Choose from a variety of templates, customize your content, and download
                        a professional PDF, all in one place.
                    </p>
                    <button
                        onClick={() => setView('builder')}
                        className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xl font-semibold"
                    >
                        Get Started - Build Your Resume
                    </button>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Easy Input</h3>
                            <p className="text-gray-600 text-sm">Fill in your details with our intuitive forms.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Stunning Templates</h3>
                            <p className="text-gray-600 text-sm">Select from a range of professionally designed templates.</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Instant PDF</h3>
                            <p className="text-gray-600 text-sm">Download your resume as a high-quality PDF instantly.</p>
                        </div>
                    </div>
                </div>
            )}

            {view === 'builder' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Resume Input Forms */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Resume Data Input</h2>

                        {/* Personal Information */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Personal Information</h3>
                            <InputField label="Full Name" name="name" value={resumeData.personal.name} onChange={handlePersonalChange} placeholder="John Doe" />
                            <InputField label="Profession/Title" name="profession" value={resumeData.personal.profession} onChange={handlePersonalChange} placeholder="Software Engineer" />
                            <InputField label="Email" type="email" name="email" value={resumeData.personal.email} onChange={handlePersonalChange} placeholder="john.doe@example.com" />
                            <InputField label="Phone" type="tel" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} placeholder="123-456-7890" />
                            <InputField label="LinkedIn Profile" name="linkedin" value={resumeData.personal.linkedin} onChange={handlePersonalChange} placeholder="https://linkedin.com/in/yourprofile" />
                            <InputField label="Portfolio/Website" name="portfolio" value={resumeData.personal.portfolio} onChange={handlePersonalChange} placeholder="https://yourportfolio.com" />
                            <TextAreaField label="Summary/Objective" name="summary" value={resumeData.personal.summary} onChange={handlePersonalChange} placeholder="A brief summary of your professional background and goals." rows={4} />
                        </div>

                        {/* Experience */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Experience</h3>
                            {resumeData.experience.map((exp, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md relative shadow-sm">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-3">Experience {index + 1}</h4>
                                    <RemoveButton onClick={() => removeExperience(index)} />
                                    <InputField label="Job Title" name="title" value={exp.title} onChange={(e) => handleExperienceChange(index, e)} placeholder="Software Engineer" />
                                    <InputField label="Company" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} placeholder="Google" />
                                    <InputField label="Dates" name="dates" value={exp.dates} onChange={(e) => handleExperienceChange(index, e)} placeholder="Jan 2020 - Present" />
                                    <TextAreaField label="Description (each point on a new line)" name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} placeholder="- Developed feature X that increased Y by Z%." rows={5} />
                                </div>
                            ))}
                            <AddButton onClick={addExperience} text="Add Experience" />
                        </div>

                        {/* Education */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Education</h3>
                            {resumeData.education.map((edu, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md relative shadow-sm">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-3">Education {index + 1}</h4>
                                    <RemoveButton onClick={() => removeEducation(index)} />
                                    <InputField label="Degree/Field of Study" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="B.S. in Computer Science" />
                                    <InputField label="Institution" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} placeholder="University of California, Berkeley" />
                                    <InputField label="Dates" name="dates" value={edu.dates} onChange={(e) => handleEducationChange(index, e)} placeholder="Sept 2016 - May 2020" />
                                </div>
                            ))}
                            <AddButton onClick={addEducation} text="Add Education" />
                        </div>

                        {/* Skills */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Skills</h3>
                            <TextAreaField label="Key Skills (comma-separated)" name="skills" value={resumeData.skills} onChange={handleSkillsChange} placeholder="JavaScript, React, Node.js, AWS, etc." rows={3} />
                        </div>

                        {/* Projects */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Projects</h3>
                            {resumeData.projects.map((proj, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md relative shadow-sm">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-3">Project {index + 1}</h4>
                                    <RemoveButton onClick={() => removeProject(index)} />
                                    <InputField label="Project Title" name="title" value={proj.title} onChange={(e) => handleProjectsChange(index, e)} placeholder="Personal Portfolio Website" />
                                    <InputField label="Project Link (Optional)" name="link" value={proj.link} onChange={(e) => handleProjectsChange(index, e)} placeholder="https://github.com/your/project" />
                                    <InputField label="Technologies Used (comma-separated)" name="technologies" value={proj.technologies} onChange={(e) => handleProjectsChange(index, e)} placeholder="React, Tailwind CSS, Firebase" />
                                    <TextAreaField label="Description" name="description" value={proj.description} onChange={(e) => handleProjectsChange(index, e)} placeholder="Briefly describe your role and achievements in this project." rows={3} />
                                </div>
                            ))}
                            <AddButton onClick={addProject} text="Add Project" />
                        </div>

                        {/* Certifications */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Certifications</h3>
                            {resumeData.certifications.map((cert, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md relative shadow-sm">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-3">Certification {index + 1}</h4>
                                    <RemoveButton onClick={() => removeCertification(index)} />
                                    <InputField label="Certification Name" name="name" value={cert.name} onChange={(e) => handleCertificationsChange(index, e)} placeholder="AWS Certified Developer" />
                                    <InputField label="Issuing Body" name="issuer" value={cert.issuer} onChange={(e) => handleCertificationsChange(index, e)} placeholder="Amazon Web Services" />
                                    <InputField label="Date Issued/Completed" name="date" value={cert.date} onChange={(e) => handleCertificationsChange(index, e)} placeholder="Jan 2023" />
                                </div>
                            ))}
                            <AddButton onClick={addCertification} text="Add Certification" />
                        </div>

                        {/* Awards/Honors */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Awards & Honors</h3>
                            {resumeData.awards.map((award, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md relative shadow-sm">
                                    <h4 className="font-semibold text-lg text-gray-800 mb-3">Award {index + 1}</h4>
                                    <RemoveButton onClick={() => removeAward(index)} />
                                    <InputField label="Award Name" name="name" value={award.name} onChange={(e) => handleAwardsChange(index, e)} placeholder="Dean's List" />
                                    <InputField label="Date Received" name="date" value={award.date} onChange={(e) => handleAwardsChange(index, e)} placeholder="Spring 2019" />
                                    <TextAreaField label="Description" name="description" value={award.description} onChange={(e) => handleAwardsChange(index, e)} placeholder="Recognized for academic excellence." rows={2} />
                                </div>
                            ))}
                            <AddButton onClick={addAward} text="Add Award" />
                        </div>

                        {/* Languages */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Languages</h3>
                            <TextAreaField label="Languages (comma-separated with proficiency)" name="languages" value={resumeData.languages} onChange={handleLanguagesChange} placeholder="English (Native), Spanish (Conversational)" rows={2} />
                        </div>
                    </div>

                    {/* Right Column: Resume Preview */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 w-full text-center">Live Preview (Web)</h2>
                        <div className="w-full flex justify-center">
                            {renderSelectedTemplate()}
                        </div>
                    </div>
                </div>
            )}

            {view === 'customization' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Customization Options */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Customize Your Resume</h2>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">Select Template</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TemplateCard
                                    templateName="Template1"
                                    displayName="Modern Professional"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template2"
                                    displayName="Chronological Classic"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template3"
                                    displayName="Functional Focused"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template4"
                                    displayName="Clean & Minimal"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template5"
                                    displayName="Executive Standard"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template6"
                                    displayName="Creative Layout"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template7"
                                    displayName="Gradient Elegance"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template8"
                                    displayName="Bold & Modern"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template9"
                                    displayName="Professional Split"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                                <TemplateCard
                                    templateName="Template10"
                                    displayName="Teal & Blue Accent"
                                    currentTemplate={selectedTemplate}
                                    onSelect={setSelectedTemplate}
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">Choose Accent Color</h3>
                            <ColorPicker currentColor={accentColor} onSelect={setAccentColor} />
                        </div>

                        <PDFDownloadLink
                            document={renderSelectedPDFTemplate()}
                            fileName={`${resumeData.personal.name || 'Resume'}_${selectedTemplate}.pdf`}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
                        >
                            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                        </PDFDownloadLink>
                    </div>

                    {/* Right Column: Resume Preview */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 w-full text-center">Live Preview (Web)</h2>
                        <div className="w-full flex justify-center">
                            {renderSelectedTemplate()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2 w-full text-center">PDF Preview</h2>
                        <div className="w-full h-[800px] flex justify-center items-center bg-gray-200 rounded-lg overflow-hidden">
                            <PDFViewer
                                selectedTemplate={selectedTemplate}
                                resumeData={resumeData}
                                accentColor={accentColor}
                            >
                                {renderSelectedPDFTemplate()}
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
export { TemplateOnePDF, TemplateTwoPDF, TemplateThreePDF, TemplateFourPDF, TemplateFivePDF, TemplateSixPDF, TemplateSevenPDF, TemplateEightPDF, TemplateNinePDF, TemplateTenPDF };
