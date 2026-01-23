import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PresenterPasswordGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PresenterPasswordGate = ({ onSuccess, onCancel }: PresenterPasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke('validate-presenter', {
        body: { password: password.trim() }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.valid) {
        // Store session in sessionStorage (not localStorage for security)
        sessionStorage.setItem('presenter-authenticated', 'true');
        toast.success("Access granted");
        onSuccess();
      } else {
        setError("Invalid password");
        setPassword("");
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError("Unable to validate. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-4"
      >
        <form onSubmit={handleSubmit} className="bg-background border border-border rounded-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-2">Presenter Access</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your presenter password to access notes
          </p>

          {/* Password input */}
          <div className="relative mb-4">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pr-10"
              autoFocus
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive mb-4 text-center">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isValidating}
            >
              {isValidating ? "Verifying..." : "Enter"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};