import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  User, 
  Users, 
  Database, 
  Plus, 
  Trash2, 
  Upload
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseCSVData } from "@/utils/mockData";

interface DbUser {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

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

const UserManagement: React.FC = () => {
  const { addUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<DbUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'user');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleAddUser = async () => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, role: 'user' }])
        .select()
        .single();

      if (error) throw error;

      setUsers(prev => [...prev, data]);
      setUsername("");
      setPassword("");
      setIsDialogOpen(false);
      toast.success("User added successfully");
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleRemoveUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== id));
      toast.success("User removed successfully");
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-disha-primary hover:bg-disha-secondary">
              <Plus size={16} className="mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with regular permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-disha-primary hover:bg-disha-secondary"
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveUser(user.id)}
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

const AdminManagement: React.FC = () => {
  const { addUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState<DbUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin');
      
      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    }
  };

  const handleAddAdmin = async () => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, role: 'admin' }])
        .select()
        .single();

      if (error) throw error;

      setAdmins(prev => [...prev, data]);
      setUsername("");
      setPassword("");
      setIsDialogOpen(false);
      toast.success("Admin added successfully");
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (admins.length <= 1) {
      toast.error("Cannot remove the last admin");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAdmins(admins.filter(admin => admin.id !== id));
      toast.success("Admin removed successfully");
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-disha-primary hover:bg-disha-secondary">
              <Plus size={16} className="mr-2" /> Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin account with full permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-disha-primary hover:bg-disha-secondary"
                onClick={handleAddAdmin}
              >
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {admin.role}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAdmin(admin.id)}
                    disabled={admins.length <= 1 && admin.id === "1"}
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

const DataManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
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
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
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
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Failed to remove student');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        const parsedData = parseCSVData(csvContent);
        
        if (parsedData.length === 0) {
          toast.error("No valid data found in CSV file");
          return;
        }
        
        setStudents([...students, ...parsedData]);
        toast.success(`Imported ${parsedData.length} students successfully`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to parse CSV file");
      }
    };
    
    reader.readAsText(file);
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

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Manage users, admins, and data</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User size={18} className="text-disha-primary" />
                User Management
              </CardTitle>
              <CardDescription>Manage regular users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Add or remove users with standard permissions to access the dashboard.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users size={18} className="text-disha-primary" />
                Admin Management
              </CardTitle>
              <CardDescription>Manage admin accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Create or remove admin accounts with full system access and privileges.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Database size={18} className="text-disha-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Manage student records</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Add, edit, or remove student records. Import data from CSV files.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User size={16} />
                Users
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2">
                <Users size={16} />
                Admins
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database size={16} />
                Data
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="admins">
              <AdminManagement />
            </TabsContent>
            
            <TabsContent value="data">
              <DataManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
