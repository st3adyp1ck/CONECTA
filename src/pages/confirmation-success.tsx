import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { TravelerBackground } from "@/components/TravelerBackground";
import { CheckCircle, ArrowRight, Brain, Network } from "lucide-react";

export default function ConfirmationSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/login");
    }
  }, [countdown, navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <BackgroundAnimation />
      <TravelerBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="border-primary/20 shadow-glow bg-card/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 flex flex-col items-center text-center pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-24 w-24 flex items-center justify-center">
                <Network className="absolute opacity-30 animate-pulse-glow text-primary/40 h-16 w-16 scale-150" />
                <Brain className="relative z-10 text-primary animate-pulse-glow h-16 w-16" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-serif">Email Confirmed!</CardTitle>
            <CardDescription>
              Your account has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="h-24 w-24 text-green-500 animate-pulse-slow" />
              </motion.div>
            </div>
            <p className="text-muted-foreground">
              Thank you for confirming your email address. You can now sign in to your CONECTA account and start exploring San Cristobal de las Casas.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Redirecting to login in {countdown} seconds...
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                onClick={() => navigate("/login")}
              >
                Go to Login <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-center">
            <p className="text-xs text-muted-foreground/70">
              CONECTA - Your digital guide to San Cristobal de las Casas
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
