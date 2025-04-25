
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

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

// Mock database for users (would be replaced with Supabase)
const mockUsers: { id: string; username: string; password: string; role: UserRole }[] = [
  { id: "1", username: "admin", password: "admin123", role: "admin" },
  { id: "2", username: "user", password: "user123", role: "user" },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("dishaUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("dishaUser");
      }
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // This would be replaced with an actual API call to Supabase
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("dishaUser", JSON.stringify(userWithoutPassword));
      toast.success(`Welcome, ${username}!`);
      
      // Redirect based on role
      if (foundUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      
      return true;
    }

    toast.error("Invalid username or password");
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("dishaUser");
    toast.success("You have been logged out");
    navigate("/");
  };

  // Add user function (admin only)
  const addUser = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // This would be replaced with an actual API call to Supabase
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      return false;
    }

    const exists = mockUsers.some((u) => u.username === username);
    if (exists) {
      toast.error("Username already exists");
      return false;
    }

    mockUsers.push({
      id: String(mockUsers.length + 1),
      username,
      password,
      role,
    });

    toast.success(`${role === "admin" ? "Admin" : "User"} added successfully`);
    return true;
  };

  // Remove user function (admin only)
  const removeUser = async (id: string): Promise<boolean> => {
    // This would be replaced with an actual API call to Supabase
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access");
      return false;
    }

    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      toast.error("User not found");
      return false;
    }

    mockUsers.splice(index, 1);
    toast.success("User removed successfully");
    return true;
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
