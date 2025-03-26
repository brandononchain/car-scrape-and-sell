
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto bg-card rounded-xl shadow-lg p-8 border border-border">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
