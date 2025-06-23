import React from 'react';
import { Document, Page, View, Text, Font, StyleSheet } from '@react-pdf/renderer';
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

// --- Cover Letter PDF Stylesheet ---
const coverLetterPdfStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
        padding: 40,
        fontSize: getPdfFontSize('text-base'),
        color: '#333',
    },
    // Common styles
    textXs: { fontSize: 8 },
    textSm: { fontSize: 10 },
    textBase: { fontSize: 12 },
    textLg: { fontSize: 14 },
    textXl: { fontSize: 16 },
    text2xl: { fontSize: 18 },
    text3xl: { fontSize: 24 },
    text4xl: { fontSize: 32 },
    text5xl: { fontSize: 40 },
    mb2: { marginBottom: 8 },
    mb3: { marginBottom: 12 },
    mb4: { marginBottom: 16 },
    mb6: { marginBottom: 24 },
    mt2: { marginTop: 8 },
    mt4: { marginTop: 16 },
    mt6: { marginTop: 24 },
    lineHeight: { lineHeight: 1.5 },

    // Template 1 (Modern Professional) specific styles
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
        justifyContent: 'flex-start',
    },
    templateOneRight: {
        width: '65%',
        padding: 32,
        backgroundColor: getColorFromTailwind('bg-white'),
        flexDirection: 'column',
    },
    templateOneSenderName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: getColorFromTailwind('text-blue-400'), // Example accent color
    },
    templateOneContactInfo: {
        fontSize: 10,
        color: getColorFromTailwind('text-gray-300'),
        marginBottom: 4,
    },
    templateOneHeaderRight: {
        marginBottom: 20,
    },
    templateOneRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateOneSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: getColorFromTailwind('text-blue-600'),
    },
    templateOneBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateOneClosing: {
        marginTop: 20,
        fontSize: 12,
    },
    templateOneSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 2 (Chronological Classic) specific styles
    templateTwoPage: {
        padding: 40,
        backgroundColor: '#f9fafb',
    },
    templateTwoHeader: {
        marginBottom: 30,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    templateTwoSenderName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    templateTwoSenderDetails: {
        fontSize: 10,
        color: '#666',
        marginBottom: 10,
    },
    templateTwoDate: {
        fontSize: 10,
        textAlign: 'right',
        marginBottom: 10,
        color: '#555',
    },
    templateTwoRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateTwoSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#444',
    },
    templateTwoBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateTwoClosing: {
        marginTop: 20,
        fontSize: 11,
    },
    templateTwoSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 3 (Functional Focused) specific styles
    templateThreeContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        padding: 40,
        backgroundColor: '#ffffff',
    },
    templateThreeLeftCol: {
        width: '30%',
        paddingRight: 20,
        borderRightWidth: 1,
        borderColor: '#eee',
    },
    templateThreeRightCol: {
        width: '70%',
        paddingLeft: 20,
    },
    templateThreeSenderName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    templateThreeContactDetail: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateThreeDate: {
        fontSize: 10,
        marginBottom: 15,
        color: '#666',
    },
    templateThreeRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateThreeSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    templateThreeBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateThreeClosing: {
        marginTop: 20,
        fontSize: 11,
    },
    templateThreeSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 4 (Clean & Minimal) specific styles
    templateFourPage: {
        padding: 50,
        backgroundColor: '#f8fafc',
    },
    templateFourHeader: {
        marginBottom: 30,
        alignItems: 'center',
    },
    templateFourSenderName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    templateFourContactDetails: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    templateFourDivider: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        width: '80%',
        marginVertical: 15,
    },
    templateFourDateRecipient: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    templateFourDate: {
        fontSize: 10,
        color: '#555',
        marginBottom: 5,
    },
    templateFourRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateFourSubject: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    templateFourBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateFourClosing: {
        marginTop: 25,
        fontSize: 11,
    },
    templateFourSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 5 (Executive Standard) specific styles
    templateFivePage: {
        padding: 40,
        backgroundColor: '#fdfdfd',
        borderLeftWidth: 10,
    },
    templateFiveHeader: {
        marginBottom: 30,
    },
    templateFiveSenderName: {
        fontSize: 20,
        fontWeight: 'extrabold',
        marginBottom: 4,
    },
    templateFiveContactInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateFiveDate: {
        fontSize: 10,
        textAlign: 'right',
        marginBottom: 15,
        color: '#555',
    },
    templateFiveRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateFiveSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    templateFiveBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateFiveClosing: {
        marginTop: 20,
        fontSize: 11,
    },
    templateFiveSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 6 (Creative Layout) specific styles
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
    templateSixSenderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f7fafc',
        marginBottom: 4,
    },
    templateSixContactInfo: {
        fontSize: 9,
        color: '#cbd5e0',
        marginBottom: 4,
    },
    templateSixDate: {
        fontSize: 9,
        color: '#cbd5e0',
        marginBottom: 15,
        textAlign: 'left', // Aligned left in sidebar
    },
    templateSixRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateSixSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#444',
    },
    templateSixBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateSixClosing: {
        marginTop: 20,
        fontSize: 11,
    },
    templateSixSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 7 (Gradient Elegance) specific styles
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
    templateSevenSenderName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: getColorFromTailwind('text-gray-50'),
        marginBottom: 5,
    },
    templateSevenSenderContact: {
        fontSize: 10,
        color: getColorFromTailwind('text-gray-300'),
        marginBottom: 4,
    },
    templateSevenContent: {
        padding: 30,
        flexDirection: 'column',
        color: '#E2E8F0',
    },
    templateSevenDate: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginBottom: 10,
        color: '#A0AEC0',
    },
    templateSevenRecipientInfo: {
        fontSize: 10,
        color: '#CBD5E0',
        marginBottom: 2,
    },
    templateSevenSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#A0AEC0',
    },
    templateSevenBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateSevenClosing: {
        marginTop: 20,
        fontSize: 11,
        color: '#CBD5E0',
    },
    templateSevenSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },

    // Template 8 (Bold & Modern) specific styles
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
    templateEightSenderName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: getColorFromTailwind('text-yellow-400'),
        marginBottom: 5,
    },
    templateEightSenderContact: {
        fontSize: 10,
        color: '#CBD5E0',
        marginBottom: 4,
    },
    templateEightContent: {
        padding: 30,
        flexDirection: 'column',
        color: '#333',
    },
    templateEightDate: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginBottom: 10,
        color: '#555',
    },
    templateEightRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateEightSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#444',
    },
    templateEightBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateEightClosing: {
        marginTop: 20,
        fontSize: 11,
    },
    templateEightSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 9 (Professional Split) specific styles
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
    templateNineSenderName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    templateNineSenderContact: {
        fontSize: 9,
        color: '#C7D2FE',
        marginBottom: 4,
    },
    templateNineDate: {
        fontSize: 9,
        color: '#C7D2FE',
        marginBottom: 15,
        textAlign: 'left',
    },
    templateNineRecipientInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
    },
    templateNineSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#4F46E5',
    },
    templateNineBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    templateNineClosing: {
        marginTop: 20,
        fontSize: 11,
    },
    templateNineSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Template 10 (Teal & Blue Accent) specific styles
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
    templateTenSenderName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0F2F2',
        marginBottom: 5,
    },
    templateTenSenderContact: {
        fontSize: 10,
        color: '#A7F3D0',
        marginBottom: 4,
    },
    templateTenContent: {
        paddingHorizontal: 30,
        paddingBottom: 30,
        flexDirection: 'column',
        color: '#0D9488',
    },
    templateTenDate: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginBottom: 10,
        color: '#2DD4BF',
    },
    templateTenRecipientInfo: {
        fontSize: 10,
        color: '#0F766E',
        marginBottom: 2,
    },
    templateTenSubject: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#14B8A6',
    },
    templateTenBodyText: {
        fontSize: 11,
        marginBottom: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
        color: '#0F766E',
    },
    templateTenClosing: {
        marginTop: 20,
        fontSize: 11,
        color: '#0D9488',
    },
    templateTenSignature: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0D9488',
    },
});

// --- Cover Letter Templates ---

export const CoverLetterTemplateOnePDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getFontSizeForName(sender.name));

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateOneContainer}>
                <View style={coverLetterPdfStyles.templateOneLeft}>
                    <Text style={[coverLetterPdfStyles.templateOneSenderName, { fontSize: senderNameFontSize, color: getColorFromTailwind(nameColor) }]}>
                        {sender.name}
                    </Text>
                    {sender.address && <Text style={coverLetterPdfStyles.templateOneContactInfo}>{sender.address}</Text>}
                    {sender.cityStateZip && <Text style={coverLetterPdfStyles.templateOneContactInfo}>{sender.cityStateZip}</Text>}
                    {sender.phone && <Text style={coverLetterPdfStyles.templateOneContactInfo}>{sender.phone}</Text>}
                    {sender.email && <Text style={coverLetterPdfStyles.templateOneContactInfo}>{sender.email}</Text>}
                    {sender.linkedin && <Text style={coverLetterPdfStyles.templateOneContactInfo}>{sender.linkedin}</Text>}
                </View>

                <View style={coverLetterPdfStyles.templateOneRight}>
                    <View style={coverLetterPdfStyles.templateOneHeaderRight}>
                        {date && <Text style={[coverLetterPdfStyles.textSm, {marginBottom: 10}]}>{date}</Text>}
                        {recipient.name && <Text style={coverLetterPdfStyles.templateOneRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateOneRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateOneRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateOneRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateOneRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateOneSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateOneBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateOneClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateOneSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateTwoPDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateTwoPage}>
                <View style={[coverLetterPdfStyles.templateTwoHeader, { borderColor: getColorFromTailwind(borderColor) }]}>
                    <Text style={[coverLetterPdfStyles.templateTwoSenderName, { color: getColorFromTailwind(nameColor) }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateTwoSenderDetails}>
                        {sender.address}, {sender.cityStateZip} | {sender.phone} | {sender.email} | {sender.linkedin}
                    </Text>
                </View>

                {date && <Text style={coverLetterPdfStyles.templateTwoDate}>{date}</Text>}

                <View style={coverLetterPdfStyles.mb4}>
                    {recipient.name && <Text style={coverLetterPdfStyles.templateTwoRecipientInfo}>{recipient.name}</Text>}
                    {recipient.title && <Text style={coverLetterPdfStyles.templateTwoRecipientInfo}>{recipient.title}</Text>}
                    {recipient.company && <Text style={coverLetterPdfStyles.templateTwoRecipientInfo}>{recipient.company}</Text>}
                    {recipient.address && <Text style={coverLetterPdfStyles.templateTwoRecipientInfo}>{recipient.address}</Text>}
                    {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateTwoRecipientInfo}>{recipient.cityStateZip}</Text>}
                </View>

                {subject && <Text style={[coverLetterPdfStyles.templateTwoSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                {bodyParagraphs.map((paragraph, index) => (
                    <Text key={index} style={coverLetterPdfStyles.templateTwoBodyText}>
                        {paragraph}
                    </Text>
                ))}

                {closing && <Text style={coverLetterPdfStyles.templateTwoClosing}>{closing}</Text>}
                {signature && <Text style={coverLetterPdfStyles.templateTwoSignature}>{signature}</Text>}
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateThreePDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getFontSizeForName(sender.name));

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateThreeContainer}>
                <View style={coverLetterPdfStyles.templateThreeLeftCol}>
                    <Text style={[coverLetterPdfStyles.templateThreeSenderName, { fontSize: senderNameFontSize, color: getColorFromTailwind(nameColor) }]}>
                        {sender.name}
                    </Text>
                    {sender.phone && <Text style={coverLetterPdfStyles.templateThreeContactDetail}>{sender.phone}</Text>}
                    {sender.email && <Text style={coverLetterPdfStyles.templateThreeContactDetail}>{sender.email}</Text>}
                    {sender.linkedin && <Text style={coverLetterPdfStyles.templateThreeContactDetail}>{sender.linkedin}</Text>}
                    <View style={coverLetterPdfStyles.mt4}>
                        <Text style={[coverLetterPdfStyles.textSm, {color: getColorFromTailwind(textColor), fontWeight: 'bold'}]}>Address:</Text>
                        <Text style={coverLetterPdfStyles.templateThreeContactDetail}>{sender.address}</Text>
                        <Text style={coverLetterPdfStyles.templateThreeContactDetail}>{sender.cityStateZip}</Text>
                    </View>
                </View>

                <View style={coverLetterPdfStyles.templateThreeRightCol}>
                    {date && <Text style={coverLetterPdfStyles.templateThreeDate}>{date}</Text>}

                    <View style={coverLetterPdfStyles.mb4}>
                        {recipient.name && <Text style={coverLetterPdfStyles.templateThreeRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateThreeRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateThreeRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateThreeRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateThreeRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateThreeSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateThreeBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateThreeClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateThreeSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateFourPDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateFourPage}>
                <View style={coverLetterPdfStyles.templateFourHeader}>
                    <Text style={[coverLetterPdfStyles.templateFourSenderName, { color: getColorFromTailwind(nameColor) }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateFourContactDetails}>
                        {sender.address}, {sender.cityStateZip} | {sender.phone} | {sender.email}
                    </Text>
                    <View style={[coverLetterPdfStyles.templateFourDivider, { borderColor: getColorFromTailwind(borderColor) }]} />
                </View>

                <View style={coverLetterPdfStyles.templateFourDateRecipient}>
                    {date && <Text style={coverLetterPdfStyles.templateFourDate}>{date}</Text>}
                    {recipient.name && <Text style={coverLetterPdfStyles.templateFourRecipientInfo}>{recipient.name}</Text>}
                    {recipient.title && <Text style={coverLetterPdfStyles.templateFourRecipientInfo}>{recipient.title}</Text>}
                    {recipient.company && <Text style={coverLetterPdfStyles.templateFourRecipientInfo}>{recipient.company}</Text>}
                    {recipient.address && <Text style={coverLetterPdfStyles.templateFourRecipientInfo}>{recipient.address}</Text>}
                    {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateFourRecipientInfo}>{recipient.cityStateZip}</Text>}
                </View>

                {subject && <Text style={[coverLetterPdfStyles.templateFourSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                {bodyParagraphs.map((paragraph, index) => (
                    <Text key={index} style={coverLetterPdfStyles.templateFourBodyText}>
                        {paragraph}
                    </Text>
                ))}

                {closing && <Text style={coverLetterPdfStyles.templateFourClosing}>{closing}</Text>}
                {signature && <Text style={coverLetterPdfStyles.templateFourSignature}>{signature}</Text>}
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateFivePDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getLargerFontSizeForName(sender.name));

    return (
        <Document>
            <Page size="A4" style={[coverLetterPdfStyles.templateFivePage, { borderLeftColor: getColorFromTailwind(borderColor) }]}>
                <View style={coverLetterPdfStyles.templateFiveHeader}>
                    <Text style={[coverLetterPdfStyles.templateFiveSenderName, { fontSize: senderNameFontSize, color: getColorFromTailwind(nameColor) }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateFiveContactInfo}>
                        {sender.address}, {sender.cityStateZip}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateFiveContactInfo}>
                        {sender.phone} | {sender.email} | {sender.linkedin}
                    </Text>
                </View>

                {date && <Text style={coverLetterPdfStyles.templateFiveDate}>{date}</Text>}

                <View style={coverLetterPdfStyles.mb4}>
                    {recipient.name && <Text style={coverLetterPdfStyles.templateFiveRecipientInfo}>{recipient.name}</Text>}
                    {recipient.title && <Text style={coverLetterPdfStyles.templateFiveRecipientInfo}>{recipient.title}</Text>}
                    {recipient.company && <Text style={coverLetterPdfStyles.templateFiveRecipientInfo}>{recipient.company}</Text>}
                    {recipient.address && <Text style={coverLetterPdfStyles.templateFiveRecipientInfo}>{recipient.address}</Text>}
                    {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateFiveRecipientInfo}>{recipient.cityStateZip}</Text>}
                </View>

                {subject && <Text style={[coverLetterPdfStyles.templateFiveSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                {bodyParagraphs.map((paragraph, index) => (
                    <Text key={index} style={coverLetterPdfStyles.templateFiveBodyText}>
                        {paragraph}
                    </Text>
                ))}

                {closing && <Text style={coverLetterPdfStyles.templateFiveClosing}>{closing}</Text>}
                {signature && <Text style={coverLetterPdfStyles.templateFiveSignature}>{signature}</Text>}
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateSixPDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getLargerFontSizeForName(sender.name));

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateSixContainer}>
                <View style={coverLetterPdfStyles.templateSixLeftCol}>
                    <Text style={[coverLetterPdfStyles.templateSixSenderName, { fontSize: senderNameFontSize, color: getColorFromTailwind(nameColor) }]}>
                        {sender.name}
                    </Text>
                    {sender.address && <Text style={coverLetterPdfStyles.templateSixContactInfo}>{sender.address}</Text>}
                    {sender.cityStateZip && <Text style={coverLetterPdfStyles.templateSixContactInfo}>{sender.cityStateZip}</Text>}
                    {sender.phone && <Text style={coverLetterPdfStyles.templateSixContactInfo}>{sender.phone}</Text>}
                    {sender.email && <Text style={coverLetterPdfStyles.templateSixContactInfo}>{sender.email}</Text>}
                    {sender.linkedin && <Text style={coverLetterPdfStyles.templateSixContactInfo}>{sender.linkedin}</Text>}
                    {date && <Text style={coverLetterPdfStyles.templateSixDate}>{date}</Text>}
                </View>

                <View style={coverLetterPdfStyles.templateSixRightCol}>
                    <View style={coverLetterPdfStyles.mb4}>
                        {recipient.name && <Text style={coverLetterPdfStyles.templateSixRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateSixRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateSixRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateSixRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateSixRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateSixSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateSixBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateSixClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateSixSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateSevenPDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getLargerFontSizeForName(sender.name));

    // Dynamic gradient background for the header
    const headerGradientStyle = {
        backgroundColor: tailwindColorMap['bg-gradient-to-br-from-blue-700-to-purple-800'][1],
    };

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateSevenContainer}>
                <View style={[coverLetterPdfStyles.templateSevenHeader, headerGradientStyle]}>
                    <Text style={[coverLetterPdfStyles.templateSevenSenderName, { fontSize: senderNameFontSize }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateSevenSenderContact}>
                        {sender.phone} | {sender.email} | {sender.linkedin}
                    </Text>
                </View>

                <View style={coverLetterPdfStyles.templateSevenContent}>
                    {date && <Text style={coverLetterPdfStyles.templateSevenDate}>{date}</Text>}

                    <View style={coverLetterPdfStyles.mb4}>
                        {recipient.name && <Text style={coverLetterPdfStyles.templateSevenRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateSevenRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateSevenRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateSevenRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateSevenRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateSevenSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateSevenBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateSevenClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateSevenSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateEightPDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getLargerFontSizeForName(sender.name));

    // Dynamic gradient background for the header
    const headerGradientStyle = {
        backgroundColor: tailwindColorMap['bg-gradient-to-r-from-blue-600-to-purple-700'][1],
    };

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateEightContainer}>
                <View style={[coverLetterPdfStyles.templateEightHeader, headerGradientStyle]}>
                    <Text style={[coverLetterPdfStyles.templateEightSenderName, { fontSize: senderNameFontSize }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateEightSenderContact}>
                        {sender.email} | {sender.phone} | {sender.linkedin}
                    </Text>
                </View>

                <View style={coverLetterPdfStyles.templateEightContent}>
                    {date && <Text style={coverLetterPdfStyles.templateEightDate}>{date}</Text>}

                    <View style={coverLetterPdfStyles.mb4}>
                        {recipient.name && <Text style={coverLetterPdfStyles.templateEightRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateEightRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateEightRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateEightRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateEightRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateEightSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateEightBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateEightClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateEightSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateNinePDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getLargerFontSizeForName(sender.name));

    // Dynamic gradient background for the left column
    const leftColGradientStyle = {
        backgroundColor: tailwindColorMap['bg-gradient-to-r-from-indigo-600-to-purple-700'][0],
    };

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateNineContainer}>
                <View style={[coverLetterPdfStyles.templateNineLeftCol, leftColGradientStyle]}>
                    <Text style={[coverLetterPdfStyles.templateNineSenderName, { fontSize: senderNameFontSize }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateNineSenderContact}>
                        {sender.address}, {sender.cityStateZip}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateNineSenderContact}>
                        {sender.phone} | {sender.email}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateNineSenderContact}>{sender.linkedin}</Text>
                    {date && <Text style={coverLetterPdfStyles.templateNineDate}>{date}</Text>}
                </View>

                <View style={coverLetterPdfStyles.templateNineRightCol}>
                    <View style={coverLetterPdfStyles.mb4}>
                        {recipient.name && <Text style={coverLetterPdfStyles.templateNineRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateNineRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateNineRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateNineRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateNineRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateNineSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateNineBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateNineClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateNineSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};

export const CoverLetterTemplateTenPDF = ({ coverLetterData, accentColor }) => {
    const { sender, date, recipient, subject, bodyParagraphs, closing, signature } = coverLetterData;
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const senderNameFontSize = getPdfFontSize(getLargerFontSizeForName(sender.name));

    // Dynamic gradient background for the header
    const headerGradientStyle = {
        backgroundColor: tailwindColorMap['bg-gradient-to-r-from-teal-500-to-blue-600'][1],
    };

    return (
        <Document>
            <Page size="A4" style={coverLetterPdfStyles.templateTenContainer}>
                <View style={[coverLetterPdfStyles.templateTenHeader, headerGradientStyle]}>
                    <Text style={[coverLetterPdfStyles.templateTenSenderName, { fontSize: senderNameFontSize }]}>
                        {sender.name}
                    </Text>
                    <Text style={coverLetterPdfStyles.templateTenSenderContact}>
                        {sender.email} | {sender.phone} | {sender.linkedin}
                    </Text>
                </View>

                <View style={coverLetterPdfStyles.templateTenContent}>
                    {date && <Text style={coverLetterPdfStyles.templateTenDate}>{date}</Text>}

                    <View style={coverLetterPdfStyles.mb4}>
                        {recipient.name && <Text style={coverLetterPdfStyles.templateTenRecipientInfo}>{recipient.name}</Text>}
                        {recipient.title && <Text style={coverLetterPdfStyles.templateTenRecipientInfo}>{recipient.title}</Text>}
                        {recipient.company && <Text style={coverLetterPdfStyles.templateTenRecipientInfo}>{recipient.company}</Text>}
                        {recipient.address && <Text style={coverLetterPdfStyles.templateTenRecipientInfo}>{recipient.address}</Text>}
                        {recipient.cityStateZip && <Text style={coverLetterPdfStyles.templateTenRecipientInfo}>{recipient.cityStateZip}</Text>}
                    </View>

                    {subject && <Text style={[coverLetterPdfStyles.templateTenSubject, {color: getColorFromTailwind(textColor)}]}>Subject: {subject}</Text>}

                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={coverLetterPdfStyles.templateTenBodyText}>
                            {paragraph}
                        </Text>
                    ))}

                    {closing && <Text style={coverLetterPdfStyles.templateTenClosing}>{closing}</Text>}
                    {signature && <Text style={coverLetterPdfStyles.templateTenSignature}>{signature}</Text>}
                </View>
            </Page>
        </Document>
    );
};
