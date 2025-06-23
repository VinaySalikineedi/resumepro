import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { TemplateOnePDF, TemplateTwoPDF, TemplateThreePDF, TemplateFourPDF, TemplateFivePDF, 
        TemplateSixPDF, TemplateSevenPDF, TemplateEightPDF, TemplateNinePDF, TemplateTenPDF } from './Templates/ResumeTemplates';
import {getFontSizeForName, getLargerFontSizeForName, getAccentClasses} from './utils/HelperFunctions';

// --- Template Definitions (New Components for Each Template) ---
// At top-level inside App.jsx:
const templateOptions = [
  { value: 0, label: 'Modern Professional' },
  { value: 1, label: 'Chronological' },
  { value: 2, label: 'Functional' },
  { value: 3, label: 'Minimalist Elegant' },
  { value: 4, label: 'Executive Two-Column' },
  { value: 5, label: 'Academic CV' },
  { value: 6, label: 'Creative Modern' },
  { value: 7, label: 'College Graduate' },
  { value: 8, label: 'Simple Modern' },
  { value: 9, label: 'Highlighted Sections' }
];
const accentOptions = ['blue', 'purple', 'green', 'red', 'orange', 'teal', 'pink', 'indigo', 'lime', 'amber'];

// --- Main App Component ---
const App = () => {
  // State to manage the current page view
  const [currentPage, setCurrentPage] = useState('home');

  const [templateIdx, setTemplateIdx] = useState(0);
  const [accentColor, setAccentColor] = useState('blue');
  const pdfTemplates = [
    TemplateOnePDF,
    TemplateTwoPDF,
    TemplateThreePDF,
    TemplateFourPDF,
    TemplateFivePDF,
    TemplateSixPDF,
    TemplateSevenPDF,
    TemplateEightPDF,
    TemplateNinePDF,
    TemplateTenPDF
  ];

  const SelectedPdf = pdfTemplates[templateIdx];

  // State to hold resume data, shared across builder and customizer
  const [resumeData, setResumeData] = useState(() => {
    try {
      const savedData = localStorage.getItem('resumeData');
      return savedData ? JSON.parse(savedData) : {
        personal: { name: '', email: '', phone: '', linkedin: '', portfolio: '', summary: '' },
        education: [{ institution: '', degree: '', dates: '' }],
        experience: [{ title: '', company: '', dates: '', description: '' }],
        skills: '',
        languages: '',
        projects: [{ title: '', description: '', technologies: '', link: '' }],
        certifications: [{ name: '', issuer: '', date: '' }],
        awards: [{ name: '', date: '', description: '' }],
      };
    } catch (error) {
      console.error("Failed to load resume data from local storage:", error);
      return {
        personal: { name: '', email: '', phone: '', linkedin: '', portfolio: '', summary: '' },
        education: [{ institution: '', degree: '', dates: '' }],
        experience: [{ title: '', company: '', dates: '', description: '' }],
        skills: '',
        languages: '',
        projects: [{ title: '', description: '', technologies: '', link: '' }],
        certifications: [{ name: '', issuer: '', date: '' }],
        awards: [{ name: '', date: '', description: '' }],
      };
    }
  });

  // State to hold customization settings
  const [customizationSettings, setCustomizationSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('customizationSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        template: 'modern', // Default template
        accentColor: 'blue', // Default accent color ID
      };
    } catch (error) {
      console.error("Failed to load customization settings from local storage:", error);
      return {
        template: 'modern',
        accentColor: 'blue',
      };
    }
  });

  // Effect to save resume data to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    } catch (error) {
      console.error("Failed to save resume data to local storage:", error);
    }
  }, [resumeData]);

  // Effect to save customization settings to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('customizationSettings', JSON.stringify(customizationSettings));
    } catch (error) {
      console.error("Failed to save customization settings to local storage:", error);
    }
  }, [customizationSettings]);

  // Helper to handle input changes for resume data
  const handleResumeDataChange = useCallback((section, field, value, index = null) => {
    setResumeData(prevData => {
      if (index !== null) {
        const updatedSection = [...prevData[section]];
        updatedSection[index] = { ...updatedSection[index], [field]: value };
        return { ...prevData, [section]: updatedSection };
      } else if (typeof prevData[section] === 'string') {
        return { ...prevData, [section]: value };
      } else {
        return { ...prevData, [section]: { ...prevData[section], [field]: value } };
      }
    });
  }, []);

  // Helper to add new items to array sections
  const handleAddItem = useCallback((section) => {
    setResumeData(prevData => {
      const newItem = {
        education: { institution: '', degree: '', dates: '' },
        experience: { title: '', company: '', dates: '', description: '' },
        projects: { title: '', description: '', technologies: '', link: '' },
        certifications: { name: '', issuer: '', date: '' },
        awards: { name: '', date: '', description: '' },
      }[section];
      return { ...prevData, [section]: [...prevData[section], newItem] };
    });
  }, []);

  // Helper to remove items from array sections
  const handleRemoveItem = useCallback((section, index) => {
    setResumeData(prevData => {
      const updatedSection = prevData[section].filter((_, i) => i !== index);
      return { ...prevData, [section]: updatedSection };
    });
  }, []);

  return (
    // Main container with dark theme and space background
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter relative overflow-hidden">
      {/* Subtle space-inspired background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 p-4 bg-gray-800 bg-opacity-70 shadow-lg rounded-b-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            CareerPro+
          </h1>
          <div>
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 mx-2 rounded-md transition-all duration-300 ${
                currentPage === 'home' ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg' : 'hover:text-blue-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('builder')}
              className={`px-4 py-2 mx-2 rounded-md transition-all duration-300 ${
                currentPage === 'builder' ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg' : 'hover:text-purple-400'
              }`}
            >
              Build Resume
            </button>
            <button
              onClick={() => setCurrentPage('customize')}
              className={`px-4 py-2 mx-2 rounded-md transition-all duration-300 ${
                currentPage === 'customize' ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg' : 'hover:text-green-400'
              }`}
            >
              Customize
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content based on current state */}
      <main className="relative z-10 container mx-auto p-4 py-8">
        {currentPage === 'home' && <HomePage onGetStarted={() => setCurrentPage('builder')} />}
        {currentPage === 'builder' && (
          <ResumeBuilder
            resumeData={resumeData}
            onInputChange={handleResumeDataChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onCustomize={() => setCurrentPage('customize')}
            templateIdx={templateIdx}
            setTemplateIdx={setTemplateIdx}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            pdfTemplates={pdfTemplates}
          />
        )}
        {currentPage === 'customize' && (
          <CustomizePage
            resumeData={resumeData}
            customizationSettings={customizationSettings}
            setCustomizationSettings={setCustomizationSettings}
          />
        )}
      </main>

      {/* Tailwind CSS custom animations */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        .font-inter {
            font-family: 'Inter', sans-serif;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9);
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }

        /* Custom carousel styles for horizontal scrolling */
        .carousel-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
            -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
            scroll-behavior: smooth; /* Smooth scroll on button click */
        }
        .carousel-container::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome, Safari, Opera */
        }
        `}
      </style>
    </div>
  );
};

// HomePage Component (same as before)
const HomePage = ({ onGetStarted }) => {
  return (
    <section className="text-center py-20 bg-gray-800 bg-opacity-60 rounded-xl shadow-2xl backdrop-blur-sm">
      <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
        Build Your Professional Resume
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          In Minutes
        </span>
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
        Craft a stellar resume with ease using our intuitive builder. Select templates, customize sections, and download your perfect resume for your next career leap.
      </p>
      <button
        onClick={onGetStarted}
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Get Started Now!
      </button>

      {/* Feature Cards Section - Placeholder */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <FeatureCard
          title="Customizable Templates"
          description="Choose from a variety of modern, professional templates to suit your style."
          icon="😍"
        />
        <FeatureCard
          title="Real-Time Preview"
          description="See your resume come to life as you type with our live preview feature."
          icon="👀"
        />
        <FeatureCard
          title="PDF Download"
          description="Instantly download your finished resume in a print-ready PDF format."
          icon="✨"
        />
      </div>
    </section>
  );
};

// Reusable Feature Card Component for Homepage
const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-gray-700 bg-opacity-70 p-6 rounded-xl shadow-xl border border-gray-600 hover:border-blue-500 transform hover:scale-105 transition-all duration-300">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const ResumeBuilder = ({
  resumeData, onInputChange, onAddItem, onRemoveItem, onCustomize,
  templateIdx, setTemplateIdx, accentColor, setAccentColor, pdfTemplates
}) => {
  const SelectedPdf = pdfTemplates[templateIdx];
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Resume Input Form (Left Panel on Desktop) */}
      <div className="w-[6.5in] p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
          Build Your Resume
        </h2>

        {/* Personal Information */}
        <Section title="Personal Information">
          <Input label="Full Name" value={resumeData.personal.name} onChange={(e) => onInputChange('personal', 'name', e.target.value)} />
          <Input label="Email" type="email" value={resumeData.personal.email} onChange={(e) => onInputChange('personal', 'email', e.target.value)} />
          <Input label="Phone" type="tel" value={resumeData.personal.phone} onChange={(e) => onInputChange('personal', 'phone', e.target.value)} />
          <Input label="LinkedIn Profile" value={resumeData.personal.linkedin} onChange={(e) => onInputChange('personal', 'linkedin', e.target.value)} />
          <Input label="Portfolio Link" value={resumeData.personal.portfolio} onChange={(e) => onInputChange('personal', 'portfolio', e.target.value)} />
        </Section>

        {/* Professional Summary */}
        <Section title="Professional Summary">
          <TextArea
            label="Provide a concise summary of your professional background and goals."
            value={resumeData.personal.summary}
            onChange={(e) => onInputChange('personal', 'summary', e.target.value)}
            rows="5"
          />
        </Section>

        {/* Education Section */}
        <Section title="Education">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="space-y-2 border border-gray-600 p-4 rounded-lg mb-4 relative">
              <Input label="Institution" value={edu.institution} onChange={(e) => onInputChange('education', 'institution', e.target.value, index)} />
              <Input label="Degree/Field of Study" value={edu.degree} onChange={(e) => onInputChange('education', 'degree', e.target.value, index)} />
              <Input label="Dates (e.g., 2018 - 2022)" value={edu.dates} onChange={(e) => onInputChange('education', 'dates', e.target.value, index)} />
              {resumeData.education.length > 1 && (
                <RemoveButton onClick={() => onRemoveItem('education', index)} />
              )}
            </div>
          ))}
          <AddButton onClick={() => onAddItem('education')} text="Add Education" />
        </Section>

        {/* Work Experience Section */}
        <Section title="Work Experience">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-2 border border-gray-600 p-4 rounded-lg mb-4 relative">
              <Input label="Job Title" value={exp.title} onChange={(e) => onInputChange('experience', 'title', e.target.value, index)} />
              <Input label="Company" value={exp.company} onChange={(e) => onInputChange('experience', 'company', e.target.value, index)} />
              <Input label="Dates (e.g., Jan 2020 - Dec 2022)" value={exp.dates} onChange={(e) => onInputChange('experience', 'dates', e.target.value, index)} />
              <TextArea label="Description (use bullet points)" value={exp.description} onChange={(e) => onInputChange('experience', 'description', e.target.value, index)} />
              {resumeData.experience.length > 1 && (
                <RemoveButton onClick={() => onRemoveItem('experience', index)} />
              )}
            </div>
          ))}
          <AddButton onClick={() => onAddItem('experience')} text="Add Experience" />
        </Section>

        {/* Skills Section */}
        <Section title="Skills">
          <TextArea
            label="List your skills (comma-separated)"
            value={resumeData.skills}
            onChange={(e) => onInputChange('skills', '', e.target.value)}
            rows="4"
          />
        </Section>

        {/* Languages Section */}
        <Section title="Languages">
          <TextArea
            label="List languages you speak and your proficiency (e.g., English: Native, Spanish: Fluent)"
            value={resumeData.languages}
            onChange={(e) => onInputChange('languages', '', e.target.value)}
            rows="3"
          />
        </Section>


        {/* Projects Section (Optional) */}
        <Section title="Projects">
          {resumeData.projects.map((proj, index) => (
            <div key={index} className="space-y-2 border border-gray-600 p-4 rounded-lg mb-4 relative">
              <Input label="Project Title" value={proj.title} onChange={(e) => onInputChange('projects', 'title', e.target.value, index)} />
              <TextArea label="Description" value={proj.description} onChange={(e) => onInputChange('projects', 'description', e.target.value, index)} />
              <Input label="Technologies Used" value={proj.technologies} onChange={(e) => onInputChange('projects', 'technologies', e.target.value, index)} />
              <Input label="Project Link" value={proj.link} onChange={(e) => onInputChange('projects', 'link', e.target.value, index)} />
              {resumeData.projects.length > 1 && (
                <RemoveButton onClick={() => onRemoveItem('projects', index)} />
              )}
            </div>
          ))}
          <AddButton onClick={() => onAddItem('projects')} text="Add Project" />
        </Section>

        {/* Certifications Section */}
        <Section title="Certifications">
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="space-y-2 border border-gray-600 p-4 rounded-lg mb-4 relative">
              <Input label="Certification Name" value={cert.name} onChange={(e) => onInputChange('certifications', 'name', e.target.value, index)} />
              <Input label="Issuer" value={cert.issuer} onChange={(e) => onInputChange('certifications', 'issuer', e.target.value, index)} />
              <Input label="Date Issued" value={cert.date} onChange={(e) => onInputChange('certifications', 'date', e.target.value, index)} />
              {resumeData.certifications.length > 1 && (
                <RemoveButton onClick={() => onRemoveItem('certifications', index)} />
              )}
            </div>
          ))}
          <AddButton onClick={() => onAddItem('certifications')} text="Add Certification" />
        </Section>

        {/* Awards/Honors Section */}
        <Section title="Awards/Honors">
          {resumeData.awards.map((award, index) => (
            <div key={index} className="space-y-2 border border-gray-600 p-4 rounded-lg mb-4 relative">
              <Input label="Award Name" value={award.name} onChange={(e) => onInputChange('awards', 'name', e.target.value, index)} />
              <Input label="Date Received" value={award.date} onChange={(e) => onInputChange('awards', 'date', e.target.value, index)} />
              <TextArea label="Description" value={award.description} onChange={(e) => onInputChange('awards', 'description', e.target.value, index)} />
              {resumeData.awards.length > 1 && (
                <RemoveButton onClick={() => onRemoveItem('awards', index)} />
              )}
            </div>
          ))}
          <AddButton onClick={() => onAddItem('awards')} text="Add Award" />
        </Section>

        <button
          onClick={onCustomize}
          className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Customize Your Resume
        </button>
      </div>
      {/* --- Right: PDF Preview & Download --- */}
      <div className="h-[9.8in] flex-1 p-4 bg-black rounded-xl shadow-2xl overflow-auto border border-gray-300 min-w-[400px]">
        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-6">Live Preview</h3>
       <div className="flex gap-4 mb-6">
          {/* Template Selection*/}
          <div className="relative inline-block w-64 bg-gray-500 rounded-lg shadow-lg">
            <select
              value={templateIdx}
              onChange={e => setTemplateIdx(Number(e.target.value))}
              className="appearance-none w-full bg-black text-white px-4 py-3 rounded-b-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 text-base"
            >
              {templateOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {/* Accent Color Selection */}
          <div className="relative inline-block w-60 bg-gray-300 rounded-lg shadow-lg">
            <select
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              className="appearance-none w-full bg-black text-white px-4 py-3 rounded-b-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 text-base"
            >
              {accentOptions.map(c => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
       </div>
        {/* PDF Preview */}
        <div className="mb-4 border border-gray-900 rounded bg-white overflow-hidden" style={{ width: '100%', minHeight: 700 }}>
          <PDFViewer width="100%" height={700}>
            <SelectedPdf resumeData={resumeData} accentColor={accentColor} />
          </PDFViewer>
        </div>
        {/* Download Button */}
        <PDFDownloadLink
          document={<SelectedPdf resumeData={resumeData} accentColor={accentColor} />}
          fileName="CareerProResumeDownload.pdf"
          className="block w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg hover:scale-105 transition-transform text-center"
        >
          {({ loading }) => loading ? 'Preparing PDF...' : 'Download PDF'}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

// NEW: CustomizePage Component
const CustomizePage = ({ resumeData, customizationSettings, setCustomizationSettings }) => {
  const resumeRef = useRef(null); // Ref for the resume preview element
  const carouselRef = useRef(null); // Ref for scrolling the carousel

  // ... inside CustomizePage function/component
  const pdfTemplates = {
    modern: TemplateOnePDF,
    classic: TemplateTwoPDF,
    functional: TemplateThreePDF,
    elegant: TemplateFourPDF,
    executive: TemplateFivePDF,
    academic: TemplateSixPDF,
    creative: TemplateSevenPDF,
    college: TemplateEightPDF,
    minimalist: TemplateNinePDF,
    professional: TemplateTenPDF,
  };

  const SelectedPdf = pdfTemplates[customizationSettings.template];
  const accentColor = customizationSettings.accentColor;

  // Handles changes to customization settings
  const handleSettingChange = useCallback((key, value) => {
    setCustomizationSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  }, [setCustomizationSettings]);

  // Function to scroll the carousel
  const scrollCarousel = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = 240; // Approx width of card (200px) + gap (16px) + some buffer
      if (direction === 'left') {
        carouselRef.current.scrollLeft -= scrollAmount;
      } else {
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }
  }, []);

  const accentColorOptions = [
    { id: 'blue', name: 'Blue', previewBg: 'bg-blue-500' },
    { id: 'purple', name: 'Purple', previewBg: 'bg-purple-500' },
    { id: 'green', name: 'Green', previewBg: 'bg-green-500' },
    { id: 'red', name: 'Red', previewBg: 'bg-red-500' },
    { id: 'orange', name: 'Orange', previewBg: 'bg-orange-500' },
    { id: 'teal', name: 'Teal', previewBg: 'bg-teal-500' },
    { id: 'pink', name: 'Pink', previewBg: 'bg-pink-500' },
    { id: 'indigo', name: 'Indigo', previewBg: 'bg-indigo-500' },
    { id: 'lime', name: 'Lime', previewBg: 'bg-lime-500' },
    { id: 'amber', name: 'Amber', previewBg: 'bg-amber-500' },
  ];

  // Updated templates array with new IDs and descriptions
  const templates = [
    { id: 'modern', name: 'Modern Professional', description: 'Clean, balanced, single-column.' },
    { id: 'classic', name: 'Chronological', description: 'Traditional with date emphasis.' },
    { id: 'functional', name: 'Functional', description: 'Skills-focused with side contact.' },
    { id: 'elegant', name: 'Minimalist Elegant', description: 'Clean lines, subtle accents.' },
    { id: 'executive', name: 'Executive Two-Column', description: 'Formal, structured, distinct sections.' },
    { id: 'academic', name: 'Academic', description: 'Detailed, suited for research/academia.' },
    { id: 'creative', name: 'Creative Modern', description: 'Asymmetrical, visual appeal.' },
    { id: 'college', name: 'College Graduate', description: 'Emphasizes education and projects.' },
    { id: 'minimalist', name: 'Simple Modern', description: 'Very clean, effective use of space.' },
    { id: 'professional', name: 'Highlighted Sections', description: 'Individual sections with highlighted headers.' },
  ];

  // Simplified HTML snippets for carousel previews - UPDATED FOR NEW TEMPLATES
  const getTemplatePreviewHtml = (templateId, accentColor) => {
    const { textColor, borderColor, nameColor } = getAccentClasses(accentColor);
    const commonClasses = 'text-xs leading-tight';
    const accentHeadingClass = `${textColor} font-semibold`;
    const accentBorderClass = `border-b ${borderColor}`;
    const accentBgColorClass = `bg-${accentColor}-600`;

    // Example names for preview to show dynamic sizing
    const shortName = "J. Doe";
    const longName = "Jonathan Alexander Longlastname";

    let nameToUse = shortName;
    let nameFontSizePreviewClass = getFontSizeForName(nameToUse);
    let largeNameFontSizePreviewClass = getLargerFontSizeForName(nameToUse);


    switch (templateId) {
      case 'modern':
        nameToUse = shortName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2">
                <div class="text-center"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <p class="text-xs text-gray-500 text-center">Contact Info</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Summ</h5></div>
                <p class="text-xs">Summary overview...</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Exp</h5></div>
                <p class="text-xs font-semibold">Role @ Comp</p>
                <ul class="list-disc list-inside text-xs"><li>Desc.</li></ul>
            </div>`;
      case 'classic': // Chronological
        nameToUse = longName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2">
                <div class="text-center border-b pb-1 border-gray-300"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Exp</h5></div>
                <div class="grid grid-cols-4"><p class="col-span-1 text-xs text-gray-700">Dates</p><div class="col-span-3"><p class="text-xs font-semibold">Role</p><p class="text-xs">Company</p></div></div>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Edu</h5></div>
                <div class="grid grid-cols-4"><p class="col-span-1 text-xs text-gray-700">Dates</p><div class="col-span-3"><p class="text-xs font-semibold">Degree</p></div></div>
            </div>`;
      case 'functional':
        nameToUse = shortName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2 grid grid-cols-4 gap-1">
                <div class="col-span-1 pr-1 border-r border-gray-300">
                    <h4 class="text-sm font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4>
                    <p class="text-xs text-gray-700 mt-2">Email</p>
                    <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Skills</h5></div>
                    <ul class="list-disc list-inside text-xs"><li>Skill 1</li></ul>
                </div>
                <div class="col-span-3 pl-1">
                    <div class="pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Summ</h5></div>
                    <p class="text-xs">Profile overview...</p>
                    <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Exp</h5></div>
                    <p class="text-xs font-semibold">Role, Company</p>
                </div>
            </div>`;
      case 'elegant': // Minimalist Elegant
        nameToUse = longName;
        largeNameFontSizePreviewClass = getLargerFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-3">
                <div class="text-center mb-2"><h4 class="${largeNameFontSizePreviewClass} font-light ${nameColor} tracking-wide">${nameToUse}</h4></div>
                <div class="h-0.5 w-12 mx-auto mt-1 mb-1 ${borderColor}"></div>
                <p class="text-xs text-gray-500 text-center">Contact Info</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Summary</h5></div>
                <p class="text-xs text-center">Elegant overview...</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Experience</h5></div>
                <p class="text-xs font-semibold">Job Title, Company</p>
            </div>`;
      case 'executive': // Executive Two-Column
        nameToUse = shortName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2 grid grid-cols-3 gap-1">
                <div class="col-span-3 text-center"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <div class="col-span-1 pr-1 border-r border-gray-300">
                    <div class="pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Profile</h5></div>
                    <p class="text-xs">Summary...</p>
                    <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Skills</h5></div>
                    <ul class="list-disc list-inside text-xs"><li>Skill</li></ul>
                </div>
                <div class="col-span-2 pl-1">
                    <div class="pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Experience</h5></div>
                    <p class="text-xs font-semibold">Role | Company</p>
                    <ul class="list-disc list-inside text-xs"><li>Key achievement</li></ul>
                </div>
            </div>`;
      case 'academic':
        nameToUse = shortName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2">
                <div class="text-center border-b pb-1 border-gray-300"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <p class="text-xs text-gray-500 text-center">Contact Info</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Edu</h5></div>
                <p class="text-xs font-semibold">Degree</p><p class="text-xs">Institution, Dates</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Research Exp</h5></div>
                <p class="text-xs font-semibold">Role @ Org</p>
            </div>`;
      case 'creative': // Creative Modern
        nameToUse = longName;
        largeNameFontSizePreviewClass = getLargerFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2 grid grid-cols-3 gap-1">
                <div class="col-span-3 text-center"><h4 class="font-extrabold ${largeNameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <div class="col-span-1 pr-1">
                    <div class="pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Sum</h5></div>
                    <p class="text-xs">Brief...</p>
                    <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Skills</h5></div>
                    <div class="flex flex-wrap gap-1"><span class="px-1 rounded-full border ${borderColor}">S1</span></div>
                </div>
                <div class="col-span-2 pl-1 border-l border-gray-300">
                    <div class="pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Exp</h5></div>
                    <p class="text-xs font-semibold">Role @ Comp</p>
                    <ul class="list-disc list-inside text-xs"><li>Desc.</li></ul>
                </div>
            </div>`;
      case 'college': // College Graduate
        nameToUse = shortName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-2">
                <div class="text-center border-b pb-1 border-gray-200"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <p class="text-xs text-gray-500 text-center">Contact Info</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Edu</h5></div>
                <p class="text-xs font-semibold">Degree, Uni (Dates)</p>
                <div class="mt-2 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Projects</h5></div>
                <p class="text-xs font-semibold">Project Title</p>
            </div>`;
      case 'minimalist': // Simple Modern
        nameToUse = longName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-3">
                <div class="text-center border-b pb-1 border-gray-200"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <p class="text-xs text-gray-500 text-center">Contact Info</p>
                <div class="mt-3 pb-1 ${accentBorderClass}"><h5 class="${accentHeadingClass}">Summary</h5></div>
                <p class="text-xs">Simple clean summary...</p>
            </div>`;
      case 'professional': // Highlighted Sections
        nameToUse = shortName;
        nameFontSizePreviewClass = getFontSizeForName(nameToUse);
        return `
            <div class="${commonClasses} p-3">
                <div class="text-center mb-2"><h4 class="font-bold ${nameFontSizePreviewClass} ${nameColor}">${nameToUse}</h4></div>
                <h5 class="text-base font-bold py-1 px-2 mb-1 text-white ${accentBgColorClass} rounded-md">Summary</h5>
                <p class="text-xs">Executive overview...</p>
                <h5 class="text-base font-bold py-1 px-2 mt-2 mb-1 text-white ${accentBgColorClass} rounded-md">Experience</h5>
                <p class="text-xs">Role at Company</p>
            </div>`;
      default: return `<div class="text-center text-gray-500">Select a template</div>`;
    }
  };

  const resetSettings = useCallback(() => {
    setCustomizationSettings({
      template: 'modern',
      accentColor: 'blue',
    });
  }, [setCustomizationSettings]);

  // Scroll to selected template in carousel
  useEffect(() => {
    if (carouselRef.current) {
      const selectedButton = carouselRef.current.querySelector(`.template-card.selected`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [customizationSettings.template]); // Dependency on selected template

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Customization Controls (Left Panel) */}
      <div className="w-[6.5in] h-[8in] p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 mb-6">
          Customize Your Resume
        </h2>

        {/* Template Selection Carousel */}
        <Section title="Templates">
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 z-20 p-2 bg-gray-700 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div ref={carouselRef} className="carousel-container flex gap-4 p-2 -mx-2 overflow-x-auto">
              {templates.map((tpl) => {
                const isSelected = customizationSettings.template === tpl.id;
                const accentBorderClass = isSelected ? `border-blue-500 ring-2 ring-blue-500` : 'border-gray-600 hover:border-blue-400';
                const scaleClass = isSelected ? 'scale-105' : '';

                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSettingChange('template', tpl.id)}
                    className={`flex-shrink-0 w-[200px] h-[300px] p-2 rounded-lg border-2 ${accentBorderClass} transition-all duration-300 transform ${scaleClass} bg-gray-700 hover:bg-gray-600 text-left relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 ${isSelected ? 'selected' : ''}`}
                    aria-label={`Select ${tpl.name} template`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic pointer-events-none z-0">
                      {tpl.name} Template Preview
                    </div>
                    {/* Miniature HTML preview */}
                    <div
                      dangerouslySetInnerHTML={{ __html: getTemplatePreviewHtml(tpl.id, customizationSettings.accentColor) }}
                      className="w-full h-full border border-dashed border-gray-500 rounded text-gray-900 bg-white scale-[0.7] origin-top-left overflow-hidden pointer-events-none"
                      style={{
                        transform: 'scale(0.6)', // Shrink further to fit thumbnail size
                        transformOrigin: 'top left',
                        width: '166.6%', // Compensate for scaling down 0.6 = 1/0.6
                        height: '166.6%',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-700 to-transparent opacity-70 group-hover:opacity-0 transition-opacity pointer-events-none"></div> {/* Overlay to fade text on hover */}
                    <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold text-center z-10">{tpl.name}</div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 z-20 p-2 bg-gray-700 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Section>

        {/* Accent Color Selection */}
        <Section title="Accent Color">
          <div className="flex flex-wrap gap-3">
            {accentColorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => handleSettingChange('accentColor', color.id)}
                className={`w-10 h-10 rounded-full border-2 ${color.previewBg} ${
                  customizationSettings.accentColor === color.id
                    ? 'ring-4 ring-offset-2 ring-blue-500 ring-offset-gray-800'
                    : 'border-gray-600'
                } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800`}
                title={color.name}
                aria-label={`Select ${color.name} accent color`}
              ></button>
            ))}
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={resetSettings}
            className="flex-1 px-6 py-3 bg-gray-700 text-gray-200 font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-600 hover:border-gray-500"
          >
            Reset to Default
          </button>
          <PDFDownloadLink
            document={<SelectedPdf resumeData={resumeData} accentColor={accentColor} />}
            fileName="resume.pdf"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {({ loading }) =>
              loading ? "Preparing PDF..." : "Download PDF"
            }
          </PDFDownloadLink>
        </div>
      </div>

      {/* Customized Resume Live Preview (Right Panel) */}
      <div className="border rounded shadow overflow-hidden w-full h-[80vh]">
        <PDFViewer width="100%" height="100%">
          <SelectedPdf
            resumeData={resumeData}
            accentColor={accentColor}
          />
        </PDFViewer>
      </div>
    </div>
  );
};


// Reusable Section Wrapper for Form (used in ResumeBuilder)
const Section = ({ title, children }) => (
  <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-700 bg-opacity-50">
    <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Reusable Input Component
const Input = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-gray-300 text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full p-3 rounded-md bg-gray-900 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      value={value}
      onChange={onChange}
    />
  </div>
);

// Reusable TextArea Component
const TextArea = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-gray-300 text-sm font-medium mb-1">{label}</label>
    <textarea
      className="w-full p-3 rounded-md bg-gray-900 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      rows={rows}
      value={value}
      onChange={onChange}
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
        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-full transition-colors"
        title="Remove Item"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
        </svg>
    </button>
);

// Export the main App component for rendering
export default App;
