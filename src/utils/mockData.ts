
export interface Student {
  id: string;
  name: string;
  class: string;
  phoneNumber: string;
  schoolName: string;
  state: string;
  district: string;
}

// Mock student data
export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    class: "10th",
    phoneNumber: "9876543210",
    schoolName: "Delhi Public School",
    state: "Delhi",
    district: "South Delhi"
  },
  {
    id: "2",
    name: "Priya Patel",
    class: "12th",
    phoneNumber: "8765432109",
    schoolName: "St. Mary's School",
    state: "Maharashtra",
    district: "Mumbai"
  },
  {
    id: "3",
    name: "Aditya Kumar",
    class: "9th",
    phoneNumber: "7654321098",
    schoolName: "Army Public School",
    state: "Karnataka",
    district: "Bangalore"
  },
  {
    id: "4",
    name: "Neha Singh",
    class: "11th",
    phoneNumber: "6543210987",
    schoolName: "Kendriya Vidyalaya",
    state: "Tamil Nadu",
    district: "Chennai"
  },
  {
    id: "5",
    name: "Vikram Malhotra",
    class: "8th",
    phoneNumber: "9876543211",
    schoolName: "Ryan International School",
    state: "Uttar Pradesh",
    district: "Lucknow"
  },
  {
    id: "6",
    name: "Ananya Desai",
    class: "10th",
    phoneNumber: "8765432100",
    schoolName: "DAV Public School",
    state: "Gujarat",
    district: "Ahmedabad"
  },
  {
    id: "7",
    name: "Rajesh Verma",
    class: "12th",
    phoneNumber: "7654321099",
    schoolName: "Bal Bharati Public School",
    state: "Rajasthan",
    district: "Jaipur"
  },
  {
    id: "8",
    name: "Kavita Reddy",
    class: "9th",
    phoneNumber: "6543210988",
    schoolName: "Bharatiya Vidya Bhavan",
    state: "Telangana",
    district: "Hyderabad"
  },
  {
    id: "9",
    name: "Mohit Jain",
    class: "11th",
    phoneNumber: "9876543212",
    schoolName: "Modern School",
    state: "Madhya Pradesh",
    district: "Bhopal"
  },
  {
    id: "10",
    name: "Divya Chauhan",
    class: "8th",
    phoneNumber: "8765432101",
    schoolName: "The Heritage School",
    state: "Punjab",
    district: "Amritsar"
  }
];

// Get unique districts
export const getDistricts = (): string[] => {
  return Array.from(new Set(mockStudents.map(student => student.district)));
};

// Get unique schools
export const getSchools = (): string[] => {
  return Array.from(new Set(mockStudents.map(student => student.schoolName)));
};

// Get unique states
export const getStates = (): string[] => {
  return Array.from(new Set(mockStudents.map(student => student.state)));
};

// Filter students by criteria
export interface FilterCriteria {
  district?: string;
  school?: string;
  searchQuery?: string;
}

export const filterStudents = (criteria: FilterCriteria): Student[] => {
  return mockStudents.filter(student => {
    // District filter
    if (criteria.district && student.district !== criteria.district) {
      return false;
    }
    
    // School filter
    if (criteria.school && student.schoolName !== criteria.school) {
      return false;
    }
    
    // Search filter (on name or phone)
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(query) || 
        student.phoneNumber.includes(query)
      );
    }
    
    return true;
  });
};

// Format and export data to CSV
export const exportToCSV = (data: Student[]): string => {
  const headers = ["Student Name", "Class", "Phone Number", "School Name", "State", "District"];
  const rows = data.map(student => 
    [student.name, student.class, student.phoneNumber, student.schoolName, student.state, student.district]
  );
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

export const parseCSVData = (csvContent: string): Student[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: `imported-${index}`,
      name: values[0] || '',
      class: values[1] || '',
      phoneNumber: values[2] || '',
      schoolName: values[3] || '',
      state: values[4] || '',
      district: values[5] || ''
    };
  }).filter(student => student.name); // Filter out empty rows
};
