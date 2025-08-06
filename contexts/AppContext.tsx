import React, { createContext, useContext, useState } from 'react';
import { snaggingAPI } from '@/services/api';

interface Flat {
  id: string;
  applicationNo: string;
  applicantName: string;
  flatNo: string;
  tower: string;
  area: string;
  bhk: string;
  floor: number;
  possession_date: string;
  project: string;
  mobileNumber: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  applicantImage?: string;
}

interface SnaggingNote {
  id: string;
  category: string;
  note: string;
  timestamp: string;
}

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
}

interface Translation {
  [key: string]: string;
}

interface AppContextType {
  currentFlat: Flat | null;
  setCurrentFlat: (flat: Flat | null) => void;
  snaggingNotes: SnaggingNote[];
  addSnaggingNote: (note: SnaggingNote) => void;
  editSnaggingNote: (id: string, updatedNote: Partial<SnaggingNote>) => void;
  deleteSnaggingNote: (id: string) => void;
  clearSnaggingNotes: () => void;
  signedSnaggingReport: UploadedFile | null;
  signedInventoryReport: UploadedFile | null;
  setSignedSnaggingReport: (file: UploadedFile | null) => void;
  setSignedInventoryReport: (file: UploadedFile | null) => void;
  searchFlat: (searchValue: string, searchType: 'application' | 'mobile') => Promise<Flat | null>;
  submitReport: (report: any, signedSnaggingReport: UploadedFile | null, signedInventoryReport: UploadedFile | null) => Promise<boolean>;
  completeHandover: () => void;
  language: 'en' | 'mr';
  setLanguage: (lang: 'en' | 'mr') => void;
  t: (key: string) => string;
}

const translations: { en: Translation; mr: Translation } = {
  en: {
    // Common
    search: 'Search',
    cancel: 'Cancel',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    submit: 'Submit',
    clear: 'Clear',
    proceed: 'Proceed',
    back: 'Back',
    next: 'Next',
    complete: 'Complete',
    pending: 'Pending',
    completed: 'Completed',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    edit: 'Edit',
    delete: 'Delete',
    select_category: 'Select Category',
    upload_snagging_report: 'Upload Signed Snagging Report',
    upload_inventory_report: 'Upload Signed Inventory Report',
    file_uploaded: 'File uploaded: {name}',
    upload_required: 'Please upload both signed snagging and inventory reports before submitting.',

    // Dashboard
    welcome_back: 'Welcome back,',
    pending_handovers: 'Pending Handovers',
    completed_today: 'Completed Today',
    current_assignment: 'Current Assignment',
    no_active_assignment: 'No Active Assignment',
    search_applications: 'Search Applications',
    quick_actions: 'Quick Actions',
    search_flat: 'Search Flat',
    view_history: 'View History',
    proceed_to_handover: 'Proceed to Snagging',

    // Search
    search_application: 'Search Application',
    search_subtitle: 'Find flat details by application number or mobile number',
    application_no: 'Application No.',
    mobile_no: 'Mobile No.',
    enter_application_number: 'Enter Application Number',
    enter_mobile_number: 'Enter Mobile Number',
    flat_details: 'Flat Details',
    ready_for_handover: 'Ready for Handover',
    configuration: 'Configuration:',
    location: 'Location:',
    possession_date: 'Possession Date:',
    search_options: 'Search Options',
    search_help_text: 'You can search for flats using either the application number or the registered mobile number.',
    example_formats: 'Example formats:',
    no_flat_found_app: 'No flat found with this application number',
    no_flat_found_mobile: 'No flat found with this mobile number',
    please_enter_application: 'Please enter an application number',
    please_enter_mobile: 'Please enter a mobile number',

    // Snagging Report
    snagging_report: 'Snagging Report',
    snagging_summary: 'Snagging Summary',
    instructions: 'Instructions',
    instructions_text: 'Document any issues found during the inspection by adding notes under the relevant categories. You can proceed to submit the report once all issues are documented.',
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    doors_windows: 'Doors & Windows',
    walls_flooring: 'Walls & Flooring',
    kitchen_bathroom: 'Kitchen & Bathroom',
    submit_report: 'Submit Report',
    add_note: 'Add Note',
    add_note_placeholder: 'Enter details of the issue...',
    total_notes: 'Total Notes: {count}',
    snagging_instructions_text: 'Document all snagging issues found during inspection. Add detailed notes under each category and submit the report when complete.',

    // Signature
    digital_signature: 'Digital Signature',
    signature_required: 'Signature Required',
    signature_description: 'Please ask the applicant to sign below to confirm receipt of the flat keys and completion of the snagging report.',
    applicant_signature: 'Applicant Signature',
    sign_here: 'Sign here',
    clear_signature: 'Clear Signature',
    agreement: 'Agreement',
    agreement_text: 'By signing above, I acknowledge that I have reviewed the snagging report and received the flat keys. I confirm that all noted issues will be addressed as per the report.',
    proceed_to_verification: 'Proceed to Verification',
    signature_required_message: 'Please provide a signature before proceeding.',

    // OTP
    otp_verification: 'OTP Verification',
    secure_verification: 'Secure Verification',
    otp_description: 'An OTP has been sent to the applicant\'s registered mobile number for final verification.',
    enter_otp: 'Enter 6-digit OTP',
    time_remaining: 'Time remaining: {time}',
    resend_otp: 'Resend OTP',
    complete_handover: 'Complete Handover',
    verifying: 'Verifying...',
    demo_otp: 'Demo OTP',
    use_demo_otp: 'Use this OTP for testing',
    invalid_otp: 'Invalid OTP',
    invalid_otp_message: 'The OTP you entered is incorrect. Please try again.',
    enter_complete_otp: 'Please enter the complete 6-digit OTP.',
    otp_sent: 'OTP Sent',
    new_otp_sent: 'A new OTP has been sent to the registered mobile number.',
    handover_complete: 'Handover Complete!',
    handover_complete_message: 'The flat handover has been successfully completed and recorded.',
    security_note: '🔒 This verification ensures secure handover completion and creates an audit trail for the transaction.',

    // History
    handover_history: 'Handover History',
    history_subtitle: 'View all your completed and pending handovers',
    recent_activity: 'Recent Activity',
    this_month_summary: 'This Month Summary',
    total_handovers: 'Total Handovers:',
    success_rate: 'Success Rate:',
    average_time: 'Average Time:',

    // Profile
    field_agent: 'Field Agent',
    contact_information: 'Contact Information',
    performance_stats: 'Performance Stats',
    total_handovers_stat: 'Total Handovers',
    success_rate_stat: 'Success Rate',
    this_month_stat: 'This Month',
    recent_achievements: 'Recent Achievements',
    top_performer: 'Top Performer',
    top_performer_desc: 'Completed 25 handovers this month',
    quality_champion: 'Quality Champion',
    quality_champion_desc: 'Maintained 96% success rate',
    account: 'Account',
    account_settings: 'Account Settings',
    help_support: 'Help & Support',
    logout: 'Logout',
    logout_confirm: 'Are you sure you want to logout?',
    app_info: 'Flat Handover App v1.0.0',
    copyright: '© 2024 Property Management',

    // Login
    flat_handover: 'Flat Handover',
    agent_portal: 'Agent Portal',
    email_address: 'Email Address',
    password: 'Password',
    sign_in: 'Sign In',
    demo_credentials: 'Demo Credentials:',
    invalid_credentials: 'Invalid email or password',
    enter_credentials: 'Please enter both email and password',
  },
  mr: {
    // Common
    search: 'शोधा',
    cancel: 'रद्द करा',
    ok: 'ठीक आहे',
    yes: 'होय',
    no: 'नाही',
    submit: 'सबमिट करा',
    clear: 'साफ करा',
    proceed: 'पुढे जा',
    back: 'मागे',
    next: 'पुढे',
    complete: 'पूर्ण',
    pending: 'प्रलंबित',
    completed: 'पूर्ण झाले',
    in_progress: 'प्रगतीत',
    on_hold: 'थांबवले',
    edit: 'संपादन करा',
    delete: 'हटवा',
    select_category: 'श्रेणी निवडा',
    upload_snagging_report: 'सही केलेला स्नॅगिंग अहवाल अपलोड करा',
    upload_inventory_report: 'सही केलेला इन्व्हेंटरी अहवाल अपलोड करा',
    file_uploaded: 'फाइल अपलोड झाली: {name}',
    upload_required: 'कृपया सही केलेले स्नॅगिंग आणि इन्व्हेंटरी अहवाल सबमिट करण्यापूर्वी अपलोड करा.',

    // Dashboard
    welcome_back: 'परत स्वागत,',
    pending_handovers: 'प्रलंबित हस्तांतरण',
    completed_today: 'आज पूर्ण झाले',
    current_assignment: 'सध्याची नियुक्ती',
    no_active_assignment: 'कोणतीही सक्रिय नियुक्ती नाही',
    search_applications: 'अर्ज शोधा',
    quick_actions: 'त्वरित क्रिया',
    search_flat: 'फ्लॅट शोधा',
    view_history: 'इतिहास पहा',
    proceed_to_handover: 'हस्तांतरणासाठी पुढे जा',

    // Search
    search_application: 'अर्ज शोधा',
    search_subtitle: 'अर्ज क्रमांक किंवा मोबाइल नंबरद्वारे फ्लॅटचे तपशील शोधा',
    application_no: 'अर्ज क्र.',
    mobile_no: 'मोबाइल क्र.',
    enter_application_number: 'अर्ज क्रमांक प्रविष्ट करा',
    enter_mobile_number: 'मोबाइल नंबर प्रविष्ट करा',
    flat_details: 'फ्लॅटचे तपशील',
    ready_for_handover: 'हस्तांतरणासाठी तयार',
    configuration: 'कॉन्फिगरेशन:',
    location: 'स्थान:',
    possession_date: 'ताब्यात घेण्याची तारीख:',
    search_options: 'शोध पर्याय',
    search_help_text: 'तुम्ही अर्ज क्रमांक किंवा नोंदणीकृत मोबाइल नंबर वापरून फ्लॅट शोधू शकता.',
    example_formats: 'उदाहरण स्वरूप:',
    no_flat_found_app: 'या अर्ज क्रमांकासह कोणताही फ्लॅट सापडला नाही',
    no_flat_found_mobile: 'या मोबाइल नंबरसह कोणताही फ्लॅट सापडला नाही',
    please_enter_application: 'कृपया अर्ज क्रमांक प्रविष्ट करा',
    please_enter_mobile: 'कृपया मोबाइल नंबर प्रविष्ट करा',

    // Snagging Report
    snagging_report: 'स्नॅगिंग अहवाल',
    snagging_summary: 'स्नॅगिंग सारांश',
    instructions: 'सूचना',
    instructions_text: 'तपासणी दरम्यान आढळलेल्या कोणत्याही समस्यांचे दस्तऐवजीकरण संबंधित श्रेणींखाली नोट्स जोडून करा. सर्व समस्यांचे दस्तऐवजीकरण पूर्ण झाल्यावर तुम्ही अहवाल सबमिट करू शकता.',
    electrical: 'विद्युत',
    plumbing: 'प्लंबिंग',
    doors_windows: 'दरवाजे आणि खिडक्या',
    walls_flooring: 'भिंती आणि फ्लोअरिंग',
    kitchen_bathroom: 'स्वयंपाकघर आणि स्नानगृह',
    submit_report: 'अहवाल सबमिट करा',
    add_note: 'नोट जोडा',
    add_note_placeholder: 'समस्येचे तपशील प्रविष्ट करा...',
    total_notes: 'एकूण नोट्स: {count}',
    snagging_instructions_text: 'तपासणी दरम्यान आढळलेल्या सर्व स्नॅगिंग समस्यांचे दस्तऐवजीकरण करा. प्रत्येक श्रेणी अंतर्गत तपशीलवार नोट्स जोडा आणि पूर्ण झाल्यावर अहवाल सबमिट करा.',

    // Signature
    digital_signature: 'डिजिटल स्वाक्षरी',
    signature_required: 'स्वाक्षरी आवश्यक',
    signature_description: 'कृपया अर्जदाराला स्नॅगिंग अहवाल पुनरावलोकन केल्याची आणि फ्लॅटच्या चाव्या मिळाल्याची पुष्टी करण्यासाठी खाली स्वाक्षरी करण्यास सांगा.',
    applicant_signature: 'अर्जदाराची स्वाक्षरी',
    sign_here: 'येथे स्वाक्षरी करा',
    clear_signature: 'स्वाक्षरी साफ करा',
    agreement: 'करार',
    agreement_text: 'वर स्वाक्षरी करून, मी कबूल करतो की मी स्नॅगिंग अहवाल पुनरावलोकन केला आहे आणि फ्लॅटच्या चाव्या मिळाल्या आहेत. मी पुष्टी करतो की नोंदवलेल्या समस्यांचे अहवालानुसार निराकरण केले जाईल.',
    proceed_to_verification: 'पडताळणीसाठी पुढे जा',
    signature_required_message: 'कृपया पुढे जाण्यापूर्वी स्वाक्षरी प्रदान करा.',

    // OTP
    otp_verification: 'OTP पडताळणी',
    secure_verification: 'सुरक्षित पडताळणी',
    otp_description: 'अंतिम पडताळणीसाठी अर्जदाराच्या नोंदणीकृत मोबाइल नंबरवर OTP पाठवला गेला आहे.',
    enter_otp: '6-अंकी OTP प्रविष्ट करा',
    time_remaining: 'उर्वरित वेळ: {time}',
    resend_otp: 'OTP पुन्हा पाठवा',
    complete_handover: 'हस्तांतरण पूर्ण करा',
    demo_otp: 'डेमो OTP',
    use_demo_otp: 'चाचणीसाठी हा OTP वापरा',
    invalid_otp: 'अवैध OTP',
    invalid_otp_message: 'तुम्ही प्रविष्ट केलेला OTP चुकीचा आहे. कृपया पुन्हा प्रयत्न करा.',
    enter_complete_otp: 'कृपया संपूर्ण 6-अंकी OTP प्रविष्ट करा.',
    otp_sent: 'OTP पाठवला',
    new_otp_sent: 'नोंदणीकृत मोबाइल नंबरवर नवीन OTP पाठवला गेला आहे.',
    handover_complete: 'हस्तांतरण पूर्ण!',
    handover_complete_message: 'फ्लॅट हस्तांतरण यशस्वीरित्या पूर्ण झाले आणि नोंदवले गेले.',
    security_note: '🔒 ही पडताळणी सुरक्षित हस्तांतरण पूर्णता सुनिश्चित करते आणि व्यवहारासाठी ऑडिट ट्रेल तयार करते.',

    // History
    handover_history: 'हस्तांतरण इतिहास',
    history_subtitle: 'तुमचे सर्व पूर्ण आणि प्रलंबित हस्तांतरण पहा',
    recent_activity: 'अलीकडील क्रियाकलाप',
    this_month_summary: 'या महिन्याचा सारांश',
    total_handovers: 'एकूण हस्तांतरण:',
    success_rate: 'यश दर:',
    average_time: 'सरासरी वेळ:',

    // Profile
    field_agent: 'फील्ड एजंट',
    contact_information: 'संपर्क माहिती',
    performance_stats: 'कामगिरी आकडेवारी',
    total_handovers_stat: 'एकूण हस्तांतरण',
    success_rate_stat: 'यश दर',
    this_month_stat: 'या महिन्यात',
    recent_achievements: 'अलीकडील उपलब्धी',
    top_performer: 'सर्वोत्तम कामगिरी',
    top_performer_desc: 'या महिन्यात 25 हस्तांतरण पूर्ण केले',
    quality_champion: 'गुणवत्ता चॅम्पियन',
    quality_champion_desc: '96% यश दर राखला',
    account: 'खाते',
    account_settings: 'खाते सेटिंग्ज',
    help_support: 'मदत आणि समर्थन',
    logout: 'लॉगआउट',
    logout_confirm: 'तुम्हाला खात्री आहे की तुम्ही लॉगआउट करू इच्छिता?',
    app_info: 'फ्लॅट हस्तांतरण अॅप v1.0.0',
    copyright: '© 2024 प्रॉपर्टी मॅनेजमेंट',

    // Login
    flat_handover: 'फ्लॅट हस्तांतरण',
    agent_portal: 'एजंट पोर्टल',
    email_address: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    sign_in: 'साइन इन',
    demo_credentials: 'डेमो क्रेडेन्शियल्स:',
    invalid_credentials: 'अवैध ईमेल किंवा पासवर्ड',
    enter_credentials: 'कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा',
  },
};

const defaultSnaggingNotes: SnaggingNote[] = [
  {
    id: '1',
    category: 'Electrical',
    note: 'Faulty main switchboard detected',
    timestamp: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    category: 'Plumbing',
    note: 'Minor leak in kitchen tap',
    timestamp: '2024-02-15T10:05:00Z',
  },
];

const mockFlats: Flat[] = [
  {
    id: '1',
    applicationNo: '250201000010',
    applicantName: 'Rajesh Kumar',
    flatNo: 'A-101',
    tower: 'Tower A',
    area: '1200 sq ft',
    bhk: '2BHK',
    floor: 1,
    possession_date: '2024-02-15',
    project: 'Green Valley Residency',
    mobileNumber: '+91 98765 43210',
    status: 'pending',
    applicantImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    applicationNo: '240100145809',
    applicantName: 'Priya Sharma',
    flatNo: 'B-205',
    tower: 'Tower B',
    area: '1450 sq ft',
    bhk: '3BHK',
    floor: 2,
    possession_date: '2024-02-20',
    project: 'Green Valley Residency',
    mobileNumber: '+91 87654 32109',
    status: 'pending',
    applicantImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    applicationNo: '240100145810',
    applicantName: 'Mohammad Ali',
    flatNo: 'C-305',
    tower: 'Tower C',
    area: '1600 sq ft',
    bhk: '3BHK',
    floor: 3,
    possession_date: '2024-02-25',
    project: 'Green Valley Residency',
    mobileNumber: '+91 76543 21098',
    status: 'pending',
    applicantImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentFlat, setCurrentFlat] = useState<Flat | null>(null);
  const [snaggingNotes, setSnaggingNotes] = useState<SnaggingNote[]>(defaultSnaggingNotes);
  const [signedSnaggingReport, setSignedSnaggingReport] = useState<UploadedFile | null>(null);
  const [signedInventoryReport, setSignedInventoryReport] = useState<UploadedFile | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const addSnaggingNote = (note: SnaggingNote) => {
    setSnaggingNotes(prev => [...prev, note]);
  };

  const editSnaggingNote = (id: string, updatedNote: Partial<SnaggingNote>) => {
    setSnaggingNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updatedNote, timestamp: new Date().toISOString() } : note
      )
    );
  };

  const deleteSnaggingNote = (id: string) => {
    setSnaggingNotes(prev => prev.filter(note => note.id !== id));
  };

  const clearSnaggingNotes = () => {
    setSnaggingNotes([]);
  };

  const searchFlat = async (searchValue: string, searchType: 'application' | 'mobile'): Promise<Flat | null> => {
    try {
      // Try to use the API first
      // For mobile search, remove +91 prefix before sending to API
      let apiSearchValue = searchValue;
      if (searchType === 'mobile') {
        apiSearchValue = searchValue.replace(/^\+91\s*/, '').replace(/\s/g, '');
      }
      
      const response = await snaggingAPI.searchFlat(apiSearchValue, searchType);
      
      if (response.data.success && response.data.data) {
        // Map API response to Flat interface
        const apiFlat = response.data.data;
        return {
          id: Date.now().toString(),
          applicationNo: apiFlat.applicationNo || searchValue,
          applicantName: apiFlat.FirstName || 'Unknown',
          flatNo: apiFlat.FlatNo || 'N/A',
          tower: apiFlat.Wing || 'N/A',
          area: 'N/A', // Not provided in API response
          bhk: apiFlat.AptType || 'N/A',
          floor: parseInt(apiFlat.FloorNo) || 1,
          possession_date: apiFlat.possession_date || new Date().toISOString().split('T')[0],
          project: apiFlat.ProjectName || 'N/A',
          mobileNumber: apiFlat.MobileNo || 'N/A',
          status: apiFlat.status || 'pending',
          applicantImage: apiFlat.ImagePath,
        };
      }
    } catch (error) {
      console.error('API search failed, falling back to mock data:', error);
    }

    // Fallback to mock data if API fails
    await new Promise(resolve => setTimeout(resolve, 1000));
    let flat: Flat | undefined;

    if (searchType === 'application') {
      flat = mockFlats.find(f => f.applicationNo.toLowerCase() === searchValue.toLowerCase());
    } else {
      const cleanSearchValue = searchValue.replace(/[\s\-\(\)]/g, '');
      flat = mockFlats.find(f => {
        const cleanMobileNumber = f.mobileNumber.replace(/[\s\-\(\)]/g, '');
        return cleanMobileNumber.includes(cleanSearchValue) || cleanSearchValue.includes(cleanMobileNumber.slice(-10));
      });
    }
    return flat || null;
  };

  const submitReport = async (report: any, signedSnaggingReport: UploadedFile | null, signedInventoryReport: UploadedFile | null): Promise<boolean> => {
    try {
      // Try to use the API first
      const response = await snaggingAPI.submitReport({
        report,
        signedSnaggingReport,
        signedInventoryReport
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error('API submit failed, using fallback:', error);
      // Fallback simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitting report with files:', { report, signedSnaggingReport, signedInventoryReport });
      return true;
    }
  };

  const completeHandover = () => {
    if (currentFlat) {
      setCurrentFlat({ ...currentFlat, status: 'completed' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentFlat,
        setCurrentFlat,
        snaggingNotes,
        addSnaggingNote,
        editSnaggingNote,
        deleteSnaggingNote,
        clearSnaggingNotes,
        signedSnaggingReport,
        signedInventoryReport,
        setSignedSnaggingReport,
        setSignedInventoryReport,
        searchFlat,
        submitReport,
        completeHandover,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}