
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Types for user roles and authentication
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (username: string, password: string, role: UserRole) => Promise<boolean>;
  removeUser: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("dishaUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Also set auth session with Supabase
        supabase.auth.signInWithPassword({
          email: `${parsedUser.username}@example.com`, // Using username as email for simplicity
          password: 'password'
        }).catch(err => {
          console.error("Error refreshing Supabase session:", err);
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("dishaUser");
      }
    }
  }, []);

  // Login function using Supabase
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First authenticate with Supabase (using username as email for simplicity)
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`, // Using username as email for simplicity
        password: password
      });

      if (authError) {
        toast.error("Invalid username or password");
        return false;
      }
      
      // Fetch user from Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !users) {
        toast.error("Invalid username or password");
        return false;
      }

      // Create user object from Supabase data
      const loggedInUser = {
        id: users.id,
        username: users.username,
        role: users.role as UserRole
      };

      setUser(loggedInUser);
      localStorage.setItem("dishaUser", JSON.stringify(loggedInUser));
      toast.success(`Welcome, ${username}!`);
      
      // Redirect based on role
      if (users.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong during login");
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear local state
    setUser(null);
    localStorage.removeItem("dishaUser");
    toast.success("You have been logged out");
    navigate("/");
  };

  // Add user function (admin only)
  const addUser = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      return false;
    }

    try {
      // First create auth user in Supabase
      const { error: authError } = await supabase.auth.signUp({
        email: `${username}@example.com`, // Using username as email for simplicity
        password: password
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast.error('Failed to create user: ' + authError.message);
        return false;
      }

      // Check if username already exists
      const { data: existingUsers } = await supabase
        .from('users')
        .select('username')
        .eq('username', username);
        
      if (existingUsers && existingUsers.length > 0) {
        toast.error("Username already exists");
        return false;
      }
      
      // Insert the new user
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, role }])
        .select()
        .single();

      if (error) {
        console.error('Error adding user:', error);
        toast.error('Failed to add user: ' + error.message);
        return false;
      }

      toast.success(`${role === "admin" ? "Admin" : "User"} added successfully`);
      return true;
    } catch (error: any) {
      console.error("Add user error:", error);
      toast.error(error.message || "Error adding user");
      return false;
    }
  };

  // Remove user function (admin only)
  const removeUser = async (id: string): Promise<boolean> => {
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      return false;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("User removed successfully");
      return true;
    } catch (error: any) {
      console.error("Remove user error:", error);
      toast.error(error.message || "Error removing user");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        addUser,
        removeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
