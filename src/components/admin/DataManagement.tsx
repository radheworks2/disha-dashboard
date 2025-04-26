
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseCSVData } from "@/utils/mockData";

interface Student {
  id: string;
  name: string;
  class: string;
  phone_number: string;
  school_name: string;
  state: string;
  district: string;
  created_at: string;
}

const DataManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students: ' + error.message);
    }
  };

  const handleAddStudent = async () => {
    if (!name || !className || !phoneNumber || !schoolName || !state || !district) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name,
          class: className,
          phone_number: phoneNumber,
          school_name: schoolName,
          state,
          district
        }])
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [...prev, data]);
      toast.success("Student added successfully");
      
      setName("");
      setClassName("");
      setPhoneNumber("");
      setSchoolName("");
      setState("");
      setDistrict("");
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student: ' + error.message);
    }
  };

  const handleRemoveStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(students.filter(student => student.id !== id));
      toast.success("Student removed successfully");
    } catch (error: any) {
      console.error('Error removing student:', error);
      toast.error('Failed to remove student: ' + error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvContent = event.target?.result as string;
        const importedData = parseCSVData(csvContent);
        
        if (importedData.length === 0) {
          toast.error("No valid data found in CSV file");
          return;
        }
        
        // Map the imported data to match the Student interface we use here
        for (const student of importedData) {
          const mappedStudent = {
            name: student.name,
            class: student.class,
            phone_number: student.phoneNumber || '',  // Map from mockData.Student.phoneNumber to our phone_number
            school_name: student.schoolName || '',    // Map from mockData.Student.schoolName to our school_name
            state: student.state || '',
            district: student.district || ''
          };
          
          try {
            await supabase.from('students').insert([mappedStudent]);
          } catch (error: any) {
            console.error('Error inserting student:', error);
            toast.error(`Failed to import student ${student.name}: ${error.message}`);
          }
        }
        
        // Refresh students list
        fetchStudents();
        toast.success(`Imported ${importedData.length} students successfully`);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to parse CSV file: " + error.message);
      }
    };
    
    reader.readAsText(file);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Management</h2>
        
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <Button variant="outline" onClick={triggerFileUpload}>
            <Upload size={16} className="mr-2" /> Import CSV
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-disha-primary hover:bg-disha-secondary">
                <Plus size={16} className="mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter student details to add to the database.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    placeholder="e.g., 10th"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school">School Name</Label>
                  <Input
                    id="school"
                    placeholder="School name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-disha-primary hover:bg-disha-secondary"
                  onClick={handleAddStudent}
                >
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>School Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>District</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.phone_number}</TableCell>
                <TableCell>{student.school_name}</TableCell>
                <TableCell>{student.state}</TableCell>
                <TableCell>{student.district}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveStudent(student.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataManagement;
