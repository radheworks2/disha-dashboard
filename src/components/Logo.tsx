
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 flex items-center justify-center rounded bg-disha-primary text-white font-bold">
        D
      </div>
      <span className="text-xl font-semibold text-disha-dark">Disha</span>
    </Link>
  );
};

export default Logo;
