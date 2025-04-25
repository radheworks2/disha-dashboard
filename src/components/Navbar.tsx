
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <h1 className="text-xl font-semibold text-disha-dark">Disha Dashboard</h1>
        <div>
          {isAuthenticated && (
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100"
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
