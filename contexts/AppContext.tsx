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

interface AppContextType {
  currentFlat: Flat | null;
  setCurrentFlat: (flat: Flat | null) => void;
  checklist: ChecklistItem[];
  updateChecklistItem: (id: string, checked: boolean, issue?: string) => void;
  resetChecklist: () => void;
  searchFlat: (searchValue: string, searchType: 'application' | 'mobile') => Promise<Flat | null>;
  submitComplaint: (complaint: any) => Promise<boolean>;
  completeHandover: () => void;
}

const defaultChecklist: ChecklistItem[] = [
  // Electrical Items
  { id: '1', category: 'Electrical', item: 'Main switchboard working properly', checked: false },
  { id: '2', category: 'Electrical', item: 'All switches and socket points functional', checked: false },
  { id: '3', category: 'Electrical', item: 'Light fixtures installed and working', checked: false },
  { id: '4', category: 'Electrical', item: 'Fan points and fans working', checked: false },
  { id: '5', category: 'Electrical', item: 'Electrical meter installed and functional', checked: false },
  
  // Plumbing & Water
  { id: '6', category: 'Plumbing', item: 'Kitchen tap and sink working', checked: false },
  { id: '7', category: 'Plumbing', item: 'Bathroom taps and fixtures working', checked: false },
  { id: '8', category: 'Plumbing', item: 'Toilet flush and drainage working', checked: false },
  { id: '9', category: 'Plumbing', item: 'Water pressure adequate', checked: false },
  { id: '10', category: 'Plumbing', item: 'No water leakage in pipes', checked: false },
  
  // Doors & Windows
  { id: '11', category: 'Doors & Windows', item: 'Main door lock and handle working', checked: false },
  { id: '12', category: 'Doors & Windows', item: 'All room doors opening/closing properly', checked: false },
  { id: '13', category: 'Doors & Windows', item: 'Windows opening/closing smoothly', checked: false },
  { id: '14', category: 'Doors & Windows', item: 'Window grills properly installed', checked: false },
  
  // Walls & Flooring
  { id: '15', category: 'Walls & Flooring', item: 'Wall paint and finishing quality', checked: false },
  { id: '16', category: 'Walls & Flooring', item: 'Floor tiles properly laid', checked: false },
  { id: '17', category: 'Walls & Flooring', item: 'No cracks in walls or ceiling', checked: false },
  
  // Kitchen & Bathroom
  { id: '18', category: 'Kitchen & Bathroom', item: 'Kitchen platform and cabinets', checked: false },
  { id: '19', category: 'Kitchen & Bathroom', item: 'Bathroom tiles and fittings', checked: false },
  { id: '20', category: 'Kitchen & Bathroom', item: 'Exhaust fans working', checked: false },
];

const mockFlats: Flat[] = [
  {
    id: '1',
    applicationNo: 'APP001',
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
    applicationNo: 'APP002',
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
    applicationNo: 'APP003',
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
      completeHandover
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