
import React from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, Database } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import AdminManagement from "@/components/admin/AdminManagement";
import DataManagement from "@/components/admin/DataManagement";

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
