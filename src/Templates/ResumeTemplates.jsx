import React from 'react';
import { Document, Page, View, Text, Font, StyleSheet } from '@react-pdf/renderer';
// Import the helper functions
import {
    tailwindColorMap,
    getColorFromTailwind,
    getPdfFontSize,
    getFontSizeForName,
    getLargerFontSizeForName,
    getAccentClasses
} from '../utils/HelperFunctions';

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
    mb3: { marginBottom: 12 },
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

export const TemplateOnePDF = ({ resumeData, accentColor }) => {
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

export const TemplateTwoPDF = ({ resumeData, accentColor }) => {
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
                                <View style={[pdfStyles.flexRow, {flexWrap: 'wrap'}]}>
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

export const TemplateThreePDF = ({ resumeData, accentColor }) => {
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

export const TemplateFourPDF = ({ resumeData, accentColor }) => {
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

export const TemplateFivePDF = ({ resumeData, accentColor }) => {
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
                        <View style={[pdfStyles.flexRow, { flexWrap: 'wrap' }]}>
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

export const TemplateSixPDF = ({ resumeData, accentColor }) => {
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

export const TemplateSevenPDF = ({ resumeData, accentColor }) => {
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

export const TemplateEightPDF = ({ resumeData, accentColor }) => {
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

export const TemplateNinePDF = ({ resumeData, accentColor }) => {
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

export const TemplateTenPDF = ({ resumeData, accentColor }) => {
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
