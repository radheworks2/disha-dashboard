
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Define Student type to match Supabase table structure
interface Student {
  id: string;
  name: string;
  class: string;
  phone_number: string;
  school_name: string;
  state: string;
  district: string;
}

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch students from Supabase
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        const studentData = data as Student[];
        setStudents(studentData);
        setFilteredStudents(studentData);
        
        // Extract unique districts and schools
        const uniqueDistricts = Array.from(new Set(studentData.map(student => student.district)));
        const uniqueSchools = Array.from(new Set(studentData.map(student => student.school_name)));
        
        setDistricts(uniqueDistricts);
        setSchools(uniqueSchools);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Apply filters when criteria change
    const applyFilters = () => {
      let filtered = [...students];
      
      if (selectedDistrict) {
        filtered = filtered.filter(student => student.district === selectedDistrict);
      }
      
      if (selectedSchool) {
        filtered = filtered.filter(student => student.school_name === selectedSchool);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          student => 
            student.name.toLowerCase().includes(query) || 
            student.phone_number.toLowerCase().includes(query)
        );
      }
      
      setFilteredStudents(filtered);
    };
    
    applyFilters();
  }, [selectedDistrict, selectedSchool, searchQuery, students]);

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Student Name', 'Class', 'Phone Number', 'School Name', 'State', 'District'];
      const rows = filteredStudents.map(student => [
        student.name,
        student.class,
        student.phone_number,
        student.school_name,
        student.state,
        student.district
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'disha_student_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const resetFilters = () => {
    setSelectedDistrict("");
    setSelectedSchool("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={selectedSchool}
                onValueChange={setSelectedSchool}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or phone"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-2">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
            
            <Button
              onClick={handleExport}
              className="bg-disha-primary hover:bg-disha-secondary flex items-center gap-2"
              disabled={filteredStudents.length === 0}
            >
              <FileText size={16} />
              Export to CSV
            </Button>
          </div>
          
          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>School Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>District</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Loading student data...
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.phone_number}</TableCell>
                      <TableCell>{student.school_name}</TableCell>
                      <TableCell>{student.state}</TableCell>
                      <TableCell>{student.district}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
