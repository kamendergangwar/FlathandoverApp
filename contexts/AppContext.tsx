// import React, { createContext, useContext, useState } from 'react';

// interface Flat {
//   id: string;
//   applicationNo: string;
//   applicantName: string;
//   flatNo: string;
//   tower: string;
//   area: string;
//   bhk: string;
//   floor: number;
//   possession_date: string;
//   project: string;
//   mobileNumber: string;
//   status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
// }

// interface ChecklistItem {
//   id: string;
//   category: string;
//   item: string;
//   checked: boolean;
//   issue?: string;
// }

// interface AppContextType {
//   currentFlat: Flat | null;
//   setCurrentFlat: (flat: Flat | null) => void;
//   checklist: ChecklistItem[];
//   updateChecklistItem: (id: string, checked: boolean, issue?: string) => void;
//   resetChecklist: () => void;
//   searchFlat: (searchValue: string, searchType: 'application' | 'mobile') => Promise<Flat | null>;
//   submitComplaint: (complaint: any) => Promise<boolean>;
//   completeHandover: () => void;
// }

// const defaultChecklist: ChecklistItem[] = [
//   // Electrical Items
//   { id: '1', category: 'Electrical', item: 'Main switchboard working properly', checked: false },
//   { id: '2', category: 'Electrical', item: 'All switches and socket points functional', checked: false },
//   { id: '3', category: 'Electrical', item: 'Light fixtures installed and working', checked: false },
//   { id: '4', category: 'Electrical', item: 'Fan points and fans working', checked: false },
//   { id: '5', category: 'Electrical', item: 'Electrical meter installed and functional', checked: false },
  
//   // Plumbing & Water
//   { id: '6', category: 'Plumbing', item: 'Kitchen tap and sink working', checked: false },
//   { id: '7', category: 'Plumbing', item: 'Bathroom taps and fixtures working', checked: false },
//   { id: '8', category: 'Plumbing', item: 'Toilet flush and drainage working', checked: false },
//   { id: '9', category: 'Plumbing', item: 'Water pressure adequate', checked: false },
//   { id: '10', category: 'Plumbing', item: 'No water leakage in pipes', checked: false },
  
//   // Doors & Windows
//   { id: '11', category: 'Doors & Windows', item: 'Main door lock and handle working', checked: false },
//   { id: '12', category: 'Doors & Windows', item: 'All room doors opening/closing properly', checked: false },
//   { id: '13', category: 'Doors & Windows', item: 'Windows opening/closing smoothly', checked: false },
//   { id: '14', category: 'Doors & Windows', item: 'Window grills properly installed', checked: false },
  
//   // Walls & Flooring
//   { id: '15', category: 'Walls & Flooring', item: 'Wall paint and finishing quality', checked: false },
//   { id: '16', category: 'Walls & Flooring', item: 'Floor tiles properly laid', checked: false },
//   { id: '17', category: 'Walls & Flooring', item: 'No cracks in walls or ceiling', checked: false },
  
//   // Kitchen & Bathroom
//   { id: '18', category: 'Kitchen & Bathroom', item: 'Kitchen platform and cabinets', checked: false },
//   { id: '19', category: 'Kitchen & Bathroom', item: 'Bathroom tiles and fittings', checked: false },
//   { id: '20', category: 'Kitchen & Bathroom', item: 'Exhaust fans working', checked: false },
// ];

// const mockFlats: Flat[] = [
//   {
//     id: '1',
//     applicationNo: 'APP001',
//     applicantName: 'Rajesh Kumar',
//     flatNo: 'A-101',
//     tower: 'Tower A',
//     area: '1200 sq ft',
//     bhk: '2BHK',
//     floor: 1,
//     possession_date: '2024-02-15',
//     project: 'Green Valley Residency',
//     mobileNumber: '+91 98765 43210',
//     status: 'pending'
//   },
//   {
//     id: '2',
//     applicationNo: 'APP002',
//     applicantName: 'Priya Sharma',
//     flatNo: 'B-205',
//     tower: 'Tower B',
//     area: '1450 sq ft',
//     bhk: '3BHK',
//     floor: 2,
//     possession_date: '2024-02-20',
//     project: 'Green Valley Residency',
//     mobileNumber: '+91 87654 32109',
//     status: 'pending'
//   },
//   {
//     id: '3',
//     applicationNo: 'APP003',
//     applicantName: 'Mohammad Ali',
//     flatNo: 'C-305',
//     tower: 'Tower C',
//     area: '1600 sq ft',
//     bhk: '3BHK',
//     floor: 3,
//     possession_date: '2024-02-25',
//     project: 'Green Valley Residency',
//     mobileNumber: '+91 76543 21098',
//     status: 'pending'
//   }
// ];

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [currentFlat, setCurrentFlat] = useState<Flat | null>(null);
//   const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);

//   const updateChecklistItem = (id: string, checked: boolean, issue?: string) => {
//     setChecklist(prev => prev.map(item => 
//       item.id === id ? { ...item, checked, issue } : item
//     ));
//   };

//   const resetChecklist = () => {
//     setChecklist(defaultChecklist.map(item => ({ ...item, checked: false, issue: undefined })));
//   };

//   const searchFlat = async (searchValue: string, searchType: 'application' | 'mobile'): Promise<Flat | null> => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     let flat: Flat | undefined;
    
//     if (searchType === 'application') {
//       flat = mockFlats.find(f => f.applicationNo.toLowerCase() === searchValue.toLowerCase());
//     } else {
//       // Clean mobile number for comparison (remove spaces, dashes, etc.)
//       const cleanSearchValue = searchValue.replace(/[\s\-\(\)]/g, '');
//       flat = mockFlats.find(f => {
//         const cleanMobileNumber = f.mobileNumber.replace(/[\s\-\(\)]/g, '');
//         return cleanMobileNumber.includes(cleanSearchValue) || cleanSearchValue.includes(cleanMobileNumber.slice(-10));
//       });
//     }
    
//     return flat || null;
//   };

//   const submitComplaint = async (complaint: any): Promise<boolean> => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     return true;
//   };

//   const completeHandover = () => {
//     if (currentFlat) {
//       setCurrentFlat({ ...currentFlat, status: 'completed' });
//     }
//   };

//   return (
//     <AppContext.Provider value={{
//       currentFlat,
//       setCurrentFlat,
//       checklist,
//       updateChecklistItem,
//       resetChecklist,
//       searchFlat,
//       submitComplaint,
//       completeHandover
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useApp must be used within an AppProvider');
//   }
//   return context;
// }


import React, { createContext, useContext, useState } from 'react';

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
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  checked: boolean;
  issue?: string;
}
interface Translation {
  [key: string]: string;
}

interface AppContextType {
  currentFlat: Flat | null;
  setCurrentFlat: (flat: Flat | null) => void;
  checklist: ChecklistItem[];
  updateChecklistItem: (id: string, checked: boolean, issue?: string) => void;
  resetChecklist: () => void;
  searchFlat: (searchValue: string, searchType: 'application' | 'mobile') => Promise<Flat | null>;
  submitComplaint: (complaint: any) => Promise<boolean>;
  completeHandover: () => void;
  language: 'en' | 'mr';
  setLanguage: (lang: 'en' | 'mr') => void;
  t: (key: string) => string;
}

const translations: { en: Translation; mr: Translation } = {
  en: {
    // Common
    'search': 'Search',
    'cancel': 'Cancel',
    'ok': 'OK',
    'yes': 'Yes',
    'no': 'No',
    'submit': 'Submit',
    'clear': 'Clear',
    'proceed': 'Proceed',
    'back': 'Back',
    'next': 'Next',
    'complete': 'Complete',
    'pending': 'Pending',
    'completed': 'Completed',
    'in_progress': 'In Progress',
    'on_hold': 'On Hold',
    
    // Dashboard
    'welcome_back': 'Welcome back,',
    'pending_handovers': 'Pending Handovers',
    'completed_today': 'Completed Today',
    'current_assignment': 'Current Assignment',
    'no_active_assignment': 'No Active Assignment',
    'search_applications': 'Search Applications',
    'quick_actions': 'Quick Actions',
    'search_flat': 'Search Flat',
    'view_history': 'View History',
    'proceed_to_handover': 'Proceed to Handover',
    
    // Search
    'search_application': 'Search Application',
    'search_subtitle': 'Find flat details by application number or mobile number',
    'application_no': 'Application No.',
    'mobile_no': 'Mobile No.',
    'enter_application_number': 'Enter Application Number (e.g., 240100145808)',
    'enter_mobile_number': 'Enter Mobile Number (e.g., +91 98765 43210)',
    'flat_details': 'Flat Details',
    'ready_for_handover': 'Ready for Handover',
    'configuration': 'Configuration:',
    'location': 'Location:',
    'possession_date': 'Possession Date:',
    'search_options': 'Search Options',
    'search_help_text': 'You can search for flats using either the application number or the registered mobile number.',
    'example_formats': 'Example formats:',
    'no_flat_found_app': 'No flat found with this application number',
    'no_flat_found_mobile': 'No flat found with this mobile number',
    'please_enter_application': 'Please enter an application number',
    'please_enter_mobile': 'Please enter a mobile number',
    
    // Checklist
    'handover_checklist': 'Handover Checklist',
    'progress': 'Progress',
    'instructions': 'Instructions',
    'instructions_text': 'Check each item with the applicant. At least 70% of items must be completed to proceed with handover. You can report issues for incomplete items or proceed if minimum completion is met.',
    'electrical': 'Electrical',
    'plumbing': 'Plumbing',
    'doors_windows': 'Doors & Windows',
    'walls_flooring': 'Walls & Flooring',
    'kitchen_bathroom': 'Kitchen & Bathroom',
    'proceed_to_signature': 'Proceed to Signature',
    'report_issues': 'Report Issues',
    'minimum_completion_required': 'Minimum 70% completion required',
    'complete_more_items': 'Complete {count} more items to proceed with handover',
    'continue_with_incomplete': 'Continue with {count} incomplete item(s)',
    'proceed_with_incomplete': 'Proceed with Incomplete Checklist?',
    'incomplete_dialog_message': '{count} item(s) are not completed ({percent}% complete). You can proceed with the handover acknowledging the incomplete items or hold the handover to address these issues.',
    'incomplete_items': 'Incomplete Items:',
    'more_items': '+{count} more items',
    'hold_handover': 'Hold Handover',
    'proceed_anyway': 'Proceed Anyway',
    'insufficient_completion': 'Insufficient Completion',
    'insufficient_completion_message': 'At least 70% of the checklist must be completed to proceed with handover. Currently {percent}% completed.',
    
    // Signature
    'digital_signature': 'Digital Signature',
    'signature_required': 'Signature Required',
    'signature_description': 'Please ask the applicant to sign below to confirm receipt of the flat keys and completion of the handover process.',
    'applicant_signature': 'Applicant Signature',
    'sign_here': 'Sign here',
    'clear_signature': 'Clear Signature',
    'agreement': 'Agreement',
    'agreement_text': 'By signing above, I acknowledge that I have received the flat keys and that all items mentioned in the handover checklist have been verified. I confirm that the flat is in acceptable condition for possession.',
    'proceed_to_verification': 'Proceed to Verification',
    'signature_required_message': 'Please provide a signature before proceeding.',
    
    // OTP
    'otp_verification': 'OTP Verification',
    'secure_verification': 'Secure Verification',
    'otp_description': 'An OTP has been sent to the applicant\'s registered mobile number for final verification.',
    'enter_otp': 'Enter 6-digit OTP',
    'time_remaining': 'Time remaining: {time}',
    'resend_otp': 'Resend OTP',
    'complete_handover': 'Complete Handover',
    'verifying': 'Verifying...',
    'demo_otp': 'Demo OTP',
    'use_demo_otp': 'Use this OTP for testing',
    'invalid_otp': 'Invalid OTP',
    'invalid_otp_message': 'The OTP you entered is incorrect. Please try again.',
    'enter_complete_otp': 'Please enter the complete 6-digit OTP.',
    'otp_sent': 'OTP Sent',
    'new_otp_sent': 'A new OTP has been sent to the registered mobile number.',
    'handover_complete': 'Handover Complete!',
    'handover_complete_message': 'The flat handover has been successfully completed and recorded.',
    'security_note': '🔒 This verification ensures secure handover completion and creates an audit trail for the transaction.',
    
    // Complaint
    'report_issues_title': 'Report Issues',
    'handover_on_hold': 'Handover On Hold',
    'issues_found_description': 'Issues found during inspection. Please document all problems below to proceed with complaint registration.',
    'issues_found': 'Issues Found',
    'priority_level': 'Priority Level',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'detailed_description': 'Detailed Description',
    'description_placeholder': 'Describe the issues in detail, including any safety concerns, damage observed, or items that need repair/replacement...',
    'what_happens_next': 'What happens next?',
    'complaint_registered': 'Complaint will be registered in the system',
    'maintenance_notified': 'Maintenance team will be notified',
    'handover_resume': 'Handover will resume after issue resolution',
    'applicant_informed': 'Applicant will be kept informed of progress',
    'submit_complaint': 'Submit Complaint',
    'submitting': 'Submitting...',
    'description_required': 'Description Required',
    'description_required_message': 'Please provide a detailed description of the issues (minimum 10 characters).',
    'complaint_submitted': 'Complaint Submitted',
    'complaint_submitted_message': 'The complaint has been submitted successfully. The handover is now on hold until issues are resolved.',
    
    // History
    'handover_history': 'Handover History',
    'history_subtitle': 'View all your completed and pending handovers',
    'recent_activity': 'Recent Activity',
    'this_month_summary': 'This Month Summary',
    'total_handovers': 'Total Handovers:',
    'success_rate': 'Success Rate:',
    'average_time': 'Average Time:',
    
    // Profile
    'field_agent': 'Field Agent',
    'contact_information': 'Contact Information',
    'performance_stats': 'Performance Stats',
    'total_handovers_stat': 'Total Handovers',
    'success_rate_stat': 'Success Rate',
    'this_month_stat': 'This Month',
    'recent_achievements': 'Recent Achievements',
    'top_performer': 'Top Performer',
    'top_performer_desc': 'Completed 25 handovers this month',
    'quality_champion': 'Quality Champion',
    'quality_champion_desc': 'Maintained 96% success rate',
    'account': 'Account',
    'account_settings': 'Account Settings',
    'help_support': 'Help & Support',
    'logout': 'Logout',
    'logout_confirm': 'Are you sure you want to logout?',
    'app_info': 'Flat Handover App v1.0.0',
    'copyright': '© 2024 Property Management',
    
    // Login
    'flat_handover': 'Flat Handover',
    'agent_portal': 'Agent Portal',
    'email_address': 'Email Address',
    'password': 'Password',
    'sign_in': 'Sign In',
    'demo_credentials': 'Demo Credentials:',
    'invalid_credentials': 'Invalid email or password',
    'enter_credentials': 'Please enter both email and password',
    
    // Checklist Items
    'main_switchboard': 'Main switchboard working properly',
    'switches_sockets': 'All switches and socket points functional',
    'light_fixtures': 'Light fixtures installed and working',
    'fan_points': 'Fan points and fans working',
    'electrical_meter': 'Electrical meter installed and functional',
    'kitchen_tap': 'Kitchen tap and sink working',
    'bathroom_taps': 'Bathroom taps and fixtures working',
    'toilet_flush': 'Toilet flush and drainage working',
    'water_pressure': 'Water pressure adequate',
    'no_leakage': 'No water leakage in pipes',
    'main_door': 'Main door lock and handle working',
    'room_doors': 'All room doors opening/closing properly',
    'windows_opening': 'Windows opening/closing smoothly',
    'window_grills': 'Window grills properly installed',
    'wall_paint': 'Wall paint and finishing quality',
    'floor_tiles': 'Floor tiles properly laid',
    'no_cracks': 'No cracks in walls or ceiling',
    'kitchen_platform': 'Kitchen platform and cabinets',
    'bathroom_tiles': 'Bathroom tiles and fittings',
    'exhaust_fans': 'Exhaust fans working'
  },
  mr: {
    // Common
    'search': 'शोधा',
    'cancel': 'रद्द करा',
    'ok': 'ठीक आहे',
    'yes': 'होय',
    'no': 'नाही',
    'submit': 'सबमिट करा',
    'clear': 'साफ करा',
    'proceed': 'पुढे जा',
    'back': 'मागे',
    'next': 'पुढे',
    'complete': 'पूर्ण',
    'pending': 'प्रलंबित',
    'completed': 'पूर्ण झाले',
    'in_progress': 'प्रगतीत',
    'on_hold': 'थांबवले',
    
    // Dashboard
    'welcome_back': 'परत स्वागत,',
    'pending_handovers': 'प्रलंबित हस्तांतरण',
    'completed_today': 'आज पूर्ण झाले',
    'current_assignment': 'सध्याची नियुक्ती',
    'no_active_assignment': 'कोणतीही सक्रिय नियुक्ती नाही',
    'search_applications': 'अर्ज शोधा',
    'quick_actions': 'त्वरित क्रिया',
    'search_flat': 'फ्लॅट शोधा',
    'view_history': 'इतिहास पहा',
    'proceed_to_handover': 'हस्तांतरणासाठी पुढे जा',
    
    // Search
    'search_application': 'अर्ज शोधा',
    'search_subtitle': 'अर्ज क्रमांक किंवा मोबाइल नंबरद्वारे फ्लॅटचे तपशील शोधा',
    'application_no': 'अर्ज क्र.',
    'mobile_no': 'मोबाइल क्र.',
    'enter_application_number': 'अर्ज क्रमांक प्रविष्ट करा (उदा. 240100145808)',
    'enter_mobile_number': 'मोबाइल नंबर प्रविष्ट करा (उदा. +91 98765 43210)',
    'flat_details': 'फ्लॅटचे तपशील',
    'ready_for_handover': 'हस्तांतरणासाठी तयार',
    'configuration': 'कॉन्फिगरेशन:',
    'location': 'स्थान:',
    'possession_date': 'ताब्यात घेण्याची तारीख:',
    'search_options': 'शोध पर्याय',
    'search_help_text': 'तुम्ही अर्ज क्रमांक किंवा नोंदणीकृत मोबाइल नंबर वापरून फ्लॅट शोधू शकता.',
    'example_formats': 'उदाहरण स्वरूप:',
    'no_flat_found_app': 'या अर्ज क्रमांकासह कोणताही फ्लॅट सापडला नाही',
    'no_flat_found_mobile': 'या मोबाइल नंबरसह कोणताही फ्लॅट सापडला नाही',
    'please_enter_application': 'कृपया अर्ज क्रमांक प्रविष्ट करा',
    'please_enter_mobile': 'कृपया मोबाइल नंबर प्रविष्ट करा',
    
    // Checklist
    'handover_checklist': 'हस्तांतरण चेकलिस्ट',
    'progress': 'प्रगती',
    'instructions': 'सूचना',
    'instructions_text': 'अर्जदारासोबत प्रत्येक बाब तपासा. हस्तांतरण पुढे नेण्यासाठी किमान 70% बाबी पूर्ण करणे आवश्यक आहे. तुम्ही अपूर्ण बाबींसाठी समस्या नोंदवू शकता किंवा किमान पूर्णता पूर्ण झाल्यास पुढे जाऊ शकता.',
    'electrical': 'विद्युत',
    'plumbing': 'प्लंबिंग',
    'doors_windows': 'दरवाजे आणि खिडक्या',
    'walls_flooring': 'भिंती आणि फ्लोअरिंग',
    'kitchen_bathroom': 'स्वयंपाकघर आणि स्नानगृह',
    'proceed_to_signature': 'स्वाक्षरीसाठी पुढे जा',
    'report_issues': 'समस्या नोंदवा',
    'minimum_completion_required': 'किमान 70% पूर्णता आवश्यक',
    'complete_more_items': 'हस्तांतरण पुढे नेण्यासाठी आणखी {count} बाबी पूर्ण करा',
    'continue_with_incomplete': '{count} अपूर्ण बाबींसह सुरू ठेवा',
    'proceed_with_incomplete': 'अपूर्ण चेकलिस्टसह पुढे जायचे?',
    'incomplete_dialog_message': '{count} बाब(ी) पूर्ण झाल्या नाहीत ({percent}% पूर्ण). तुम्ही अपूर्ण बाबी मान्य करून हस्तांतरण पुढे नेऊ शकता किंवा या समस्यांचे निराकरण करण्यासाठी हस्तांतरण थांबवू शकता.',
    'incomplete_items': 'अपूर्ण बाबी:',
    'more_items': '+{count} आणखी बाबी',
    'hold_handover': 'हस्तांतरण थांबवा',
    'proceed_anyway': 'तरीही पुढे जा',
    'insufficient_completion': 'अपुरी पूर्णता',
    'insufficient_completion_message': 'हस्तांतरण पुढे नेण्यासाठी चेकलिस्टची किमान 70% पूर्णता आवश्यक आहे. सध्या {percent}% पूर्ण झाले आहे.',
    
    // Signature
    'digital_signature': 'डिजिटल स्वाक्षरी',
    'signature_required': 'स्वाक्षरी आवश्यक',
    'signature_description': 'कृपया अर्जदाराला फ्लॅटच्या चाव्या मिळाल्याची आणि हस्तांतरण प्रक्रिया पूर्ण झाल्याची पुष्टी करण्यासाठी खाली स्वाक्षरी करण्यास सांगा.',
    'applicant_signature': 'अर्जदाराची स्वाक्षरी',
    'sign_here': 'येथे स्वाक्षरी करा',
    'clear_signature': 'स्वाक्षरी साफ करा',
    'agreement': 'करार',
    'agreement_text': 'वर स्वाक्षरी करून, मी कबूल करतो की मला फ्लॅटच्या चाव्या मिळाल्या आहेत आणि हस्तांतरण चेकलिस्टमध्ये नमूद केलेल्या सर्व बाबी तपासल्या गेल्या आहेत. मी पुष्टी करतो की फ्लॅट ताब्यात घेण्यासाठी स्वीकार्य स्थितीत आहे.',
    'proceed_to_verification': 'पडताळणीसाठी पुढे जा',
    'signature_required_message': 'कृपया पुढे जाण्यापूर्वी स्वाक्षरी प्रदान करा.',
    
    // OTP
    'otp_verification': 'OTP पडताळणी',
    'secure_verification': 'सुरक्षित पडताळणी',
    'otp_description': 'अंतिम पडताळणीसाठी अर्जदाराच्या नोंदणीकृत मोबाइल नंबरवर OTP पाठवला गेला आहे.',
    'enter_otp': '6-अंकी OTP प्रविष्ट करा',
    'time_remaining': 'उर्वरित वेळ: {time}',
    'resend_otp': 'OTP पुन्हा पाठवा',
    'complete_handover': 'हस्तांतरण पूर्ण करा',
    'verifying': 'पडताळत आहे...',
    'demo_otp': 'डेमो OTP',
    'use_demo_otp': 'चाचणीसाठी हा OTP वापरा',
    'invalid_otp': 'अवैध OTP',
    'invalid_otp_message': 'तुम्ही प्रविष्ट केलेला OTP चुकीचा आहे. कृपया पुन्हा प्रयत्न करा.',
    'enter_complete_otp': 'कृपया संपूर्ण 6-अंकी OTP प्रविष्ट करा.',
    'otp_sent': 'OTP पाठवला',
    'new_otp_sent': 'नोंदणीकृत मोबाइल नंबरवर नवीन OTP पाठवला गेला आहे.',
    'handover_complete': 'हस्तांतरण पूर्ण!',
    'handover_complete_message': 'फ्लॅट हस्तांतरण यशस्वीरित्या पूर्ण झाले आणि नोंदवले गेले.',
    'security_note': '🔒 ही पडताळणी सुरक्षित हस्तांतरण पूर्णता सुनिश्चित करते आणि व्यवहारासाठी ऑडिट ट्रेल तयार करते.',
    
    // Complaint
    'report_issues_title': 'समस्या नोंदवा',
    'handover_on_hold': 'हस्तांतरण थांबवले',
    'issues_found_description': 'तपासणी दरम्यान समस्या आढळल्या. तक्रार नोंदणी पुढे नेण्यासाठी कृपया खाली सर्व समस्यांचे दस्तऐवजीकरण करा.',
    'issues_found': 'आढळलेल्या समस्या',
    'priority_level': 'प्राधान्य स्तर',
    'low': 'कमी',
    'medium': 'मध्यम',
    'high': 'उच्च',
    'detailed_description': 'तपशीलवार वर्णन',
    'description_placeholder': 'कोणत्याही सुरक्षा चिंता, निरीक्षण केलेले नुकसान, किंवा दुरुस्ती/बदलीची आवश्यकता असलेल्या बाबींसह समस्यांचे तपशीलवार वर्णन करा...',
    'what_happens_next': 'पुढे काय होईल?',
    'complaint_registered': 'तक्रार सिस्टममध्ये नोंदवली जाईल',
    'maintenance_notified': 'देखभाल टीमला सूचित केले जाईल',
    'handover_resume': 'समस्या निराकरणानंतर हस्तांतरण पुन्हा सुरू होईल',
    'applicant_informed': 'अर्जदाराला प्रगतीची माहिती दिली जाईल',
    'submit_complaint': 'तक्रार सबमिट करा',
    'submitting': 'सबमिट करत आहे...',
    'description_required': 'वर्णन आवश्यक',
    'description_required_message': 'कृपया समस्यांचे तपशीलवार वर्णन प्रदान करा (किमान 10 अक्षरे).',
    'complaint_submitted': 'तक्रार सबमिट केली',
    'complaint_submitted_message': 'तक्रार यशस्वीरित्या सबमिट केली गेली. समस्यांचे निराकरण होईपर्यंत हस्तांतरण थांबवले आहे.',
    
    // History
    'handover_history': 'हस्तांतरण इतिहास',
    'history_subtitle': 'तुमचे सर्व पूर्ण आणि प्रलंबित हस्तांतरण पहा',
    'recent_activity': 'अलीकडील क्रियाकलाप',
    'this_month_summary': 'या महिन्याचा सारांश',
    'total_handovers': 'एकूण हस्तांतरण:',
    'success_rate': 'यश दर:',
    'average_time': 'सरासरी वेळ:',
    
    // Profile
    'field_agent': 'फील्ड एजंट',
    'contact_information': 'संपर्क माहिती',
    'performance_stats': 'कामगिरी आकडेवारी',
    'total_handovers_stat': 'एकूण हस्तांतरण',
    'success_rate_stat': 'यश दर',
    'this_month_stat': 'या महिन्यात',
    'recent_achievements': 'अलीकडील उपलब्धी',
    'top_performer': 'सर्वोत्तम कामगिरी',
    'top_performer_desc': 'या महिन्यात 25 हस्तांतरण पूर्ण केले',
    'quality_champion': 'गुणवत्ता चॅम्पियन',
    'quality_champion_desc': '96% यश दर राखला',
    'account': 'खाते',
    'account_settings': 'खाते सेटिंग्ज',
    'help_support': 'मदत आणि समर्थन',
    'logout': 'लॉगआउट',
    'logout_confirm': 'तुम्हाला खात्री आहे की तुम्ही लॉगआउट करू इच्छिता?',
    'app_info': 'फ्लॅट हस्तांतरण अॅप v1.0.0',
    'copyright': '© 2024 प्रॉपर्टी मॅनेजमेंट',
    
    // Login
    'flat_handover': 'फ्लॅट हस्तांतरण',
    'agent_portal': 'एजंट पोर्टल',
    'email_address': 'ईमेल पत्ता',
    'password': 'पासवर्ड',
    'sign_in': 'साइन इन',
    'demo_credentials': 'डेमो क्रेडेन्शियल्स:',
    'invalid_credentials': 'अवैध ईमेल किंवा पासवर्ड',
    'enter_credentials': 'कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा',
    
    // Checklist Items
    'main_switchboard': 'मुख्य स्विचबोर्ड योग्यरित्या काम करत आहे',
    'switches_sockets': 'सर्व स्विच आणि सॉकेट पॉइंट कार्यक्षम',
    'light_fixtures': 'लाइट फिक्स्चर स्थापित आणि काम करत आहेत',
    'fan_points': 'पंखा पॉइंट आणि पंखे काम करत आहेत',
    'electrical_meter': 'विद्युत मीटर स्थापित आणि कार्यक्षम',
    'kitchen_tap': 'स्वयंपाकघरातील नळ आणि सिंक काम करत आहे',
    'bathroom_taps': 'स्नानगृहातील नळ आणि फिक्स्चर काम करत आहेत',
    'toilet_flush': 'टॉयलेट फ्लश आणि ड्रेनेज काम करत आहे',
    'water_pressure': 'पाण्याचा दाब पुरेसा',
    'no_leakage': 'पाईपमध्ये पाण्याची गळती नाही',
    'main_door': 'मुख्य दरवाजाचे कुलूप आणि हँडल काम करत आहे',
    'room_doors': 'सर्व खोल्यांचे दरवाजे योग्यरित्या उघडत/बंद होत आहेत',
    'windows_opening': 'खिडक्या सहजतेने उघडत/बंद होत आहेत',
    'window_grills': 'खिडकीच्या ग्रिल योग्यरित्या स्थापित',
    'wall_paint': 'भिंतीचे रंग आणि फिनिशिंगची गुणवत्ता',
    'floor_tiles': 'फ्लोअर टाइल्स योग्यरित्या लावल्या',
    'no_cracks': 'भिंती किंवा छतावर तडे नाहीत',
    'kitchen_platform': 'स्वयंपाकघराचे प्लॅटफॉर्म आणि कॅबिनेट',
    'bathroom_tiles': 'स्नानगृहाच्या टाइल्स आणि फिटिंग्ज',
    'exhaust_fans': 'एक्झॉस्ट फॅन काम करत आहेत'
  }
};

const defaultChecklist: ChecklistItem[] = [
  // Electrical Items
  { id: '1', category: 'Electrical', item: 'main_switchboard', checked: false },
  { id: '2', category: 'Electrical', item: 'switches_sockets', checked: false },
  { id: '3', category: 'Electrical', item: 'light_fixtures', checked: false },
  { id: '4', category: 'Electrical', item: 'fan_points', checked: false },
  { id: '5', category: 'Electrical', item: 'electrical_meter', checked: false },
  
  // Plumbing & Water
  { id: '6', category: 'Plumbing', item: 'kitchen_tap', checked: false },
  { id: '7', category: 'Plumbing', item: 'bathroom_taps', checked: false },
  { id: '8', category: 'Plumbing', item: 'toilet_flush', checked: false },
  { id: '9', category: 'Plumbing', item: 'water_pressure', checked: false },
  { id: '10', category: 'Plumbing', item: 'no_leakage', checked: false },
  
  // Doors & Windows
  { id: '11', category: 'Doors & Windows', item: 'main_door', checked: false },
  { id: '12', category: 'Doors & Windows', item: 'room_doors', checked: false },
  { id: '13', category: 'Doors & Windows', item: 'windows_opening', checked: false },
  { id: '14', category: 'Doors & Windows', item: 'window_grills', checked: false },
  
  // Walls & Flooring
  { id: '15', category: 'Walls & Flooring', item: 'wall_paint', checked: false },
  { id: '16', category: 'Walls & Flooring', item: 'floor_tiles', checked: false },
  { id: '17', category: 'Walls & Flooring', item: 'no_cracks', checked: false },
  
  // Kitchen & Bathroom
  { id: '18', category: 'Kitchen & Bathroom', item: 'kitchen_platform', checked: false },
  { id: '19', category: 'Kitchen & Bathroom', item: 'bathroom_tiles', checked: false },
  { id: '20', category: 'Kitchen & Bathroom', item: 'exhaust_fans', checked: false },
];

const mockFlats: Flat[] = [
  {
    id: '1',
    applicationNo: '240100145808',
    applicantName: 'Rajesh Kumar',
    flatNo: 'A-101',
    tower: 'Tower A',
    area: '1200 sq ft',
    bhk: '2BHK',
    floor: 1,
    possession_date: '2024-02-15',
    project: 'Green Valley Residency',
    mobileNumber: '+91 98765 43210',
    status: 'pending'
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
    status: 'pending'
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
    status: 'pending'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentFlat, setCurrentFlat] = useState<Flat | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const updateChecklistItem = (id: string, checked: boolean, issue?: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked, issue } : item
    ));
  };

  const resetChecklist = () => {
    setChecklist(defaultChecklist.map(item => ({ ...item, checked: false, issue: undefined })));
  };

  const searchFlat = async (searchValue: string, searchType: 'application' | 'mobile'): Promise<Flat | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let flat: Flat | undefined;
    
    if (searchType === 'application') {
      flat = mockFlats.find(f => f.applicationNo.toLowerCase() === searchValue.toLowerCase());
    } else {
      // Clean mobile number for comparison (remove spaces, dashes, etc.)
      const cleanSearchValue = searchValue.replace(/[\s\-\(\)]/g, '');
      flat = mockFlats.find(f => {
        const cleanMobileNumber = f.mobileNumber.replace(/[\s\-\(\)]/g, '');
        return cleanMobileNumber.includes(cleanSearchValue) || cleanSearchValue.includes(cleanMobileNumber.slice(-10));
      });
    }
    
    return flat || null;
  };

  const submitComplaint = async (complaint: any): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  };

  const completeHandover = () => {
    if (currentFlat) {
      setCurrentFlat({ ...currentFlat, status: 'completed' });
    }
  };

  return (
    <AppContext.Provider value={{
      currentFlat,
      setCurrentFlat,
      checklist,
      updateChecklistItem,
      resetChecklist,
      searchFlat,
      submitComplaint,
      completeHandover,
      language,
      setLanguage,
      t
    }}>
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