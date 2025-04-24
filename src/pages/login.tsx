import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock, Mail, ArrowRight, Globe, Mountain, Compass, Brain, Network, Map, Camera, Palmtree, Star, Sparkles } from "lucide-react";
import { authService } from "@/services";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { TravelerBackground } from "@/components/TravelerBackground";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  // Initialize form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem('userEmail') || "",
      password: "",
      rememberMe: localStorage.getItem('userEmail') ? true : false,
    },
  });

  // Hide welcome message after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await authService.signIn(values.email, values.password, values.rememberMe);

      if ('error' in result && result.error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error.message,
        });
        return;
      }

      // Check if user is admin
      const adminResult = await authService.isAdmin();

      if ('error' in adminResult && adminResult.error) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: adminResult.error.message,
        });
        return;
      }

      // Successful login
      toast({
        title: "Login successful",
        description: "Welcome to CONECTA",
      });

      // Redirect to the page they were trying to access or home
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // No avatar-related functions needed here anymore

  // Enhanced floating icon animation variants
  const floatingIconVariants = {
    initial: { opacity: 0, scale: 0, filter: "blur(10px)" },
    animate: (i: number) => ({
      opacity: [0, 0.8, 0.6],
      scale: [0, 1.3, 1],
      filter: ["blur(10px)", "blur(0px)"],
      transition: {
        delay: i * 0.2,
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
      }
    }),
    float: (i: number) => ({
      y: [0, -15 - (i * 2), 5, -10, 0],
      x: [0, i % 2 === 0 ? 15 : -15, i % 3 === 0 ? -10 : 10, i % 2 === 0 ? 5 : -5, 0],
      rotate: [0, i % 2 === 0 ? 15 : -15, i % 3 === 0 ? -5 : 5, i % 2 === 0 ? 10 : -10, 0],
      scale: [1, 1 + (i % 3) * 0.05, 1 - (i % 2) * 0.05, 1],
      filter: ["drop-shadow(0 0 0px rgba(0, 128, 128, 0))", "drop-shadow(0 0 3px rgba(0, 128, 128, 0.3))", "drop-shadow(0 0 0px rgba(0, 128, 128, 0))"],
      transition: {
        delay: i * 0.1,
        duration: 6 + i,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animation */}
      <BackgroundAnimation
        density="high"
        speed="medium"
        interactive={true}
        intensityLevel="intense"
      />

      {/* Traveler background elements */}
      <TravelerBackground />

      {/* Floating icons with enhanced animations */}
      <AnimatePresence>
        {/* Original icons with enhanced animations */}
        <motion.div
          className="absolute top-[20%] left-[15%] text-primary/30 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={1}
          whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0], filter: "drop-shadow(0 0 12px rgba(0, 128, 128, 0.5))" }}
        >
          <Compass size={60} />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] right-[20%] text-secondary/30 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={2}
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0], filter: "drop-shadow(0 0 12px rgba(200, 100, 50, 0.5))" }}
        >
          <Mountain size={70} />
        </motion.div>
        <motion.div
          className="absolute top-[40%] right-[25%] text-accent/30 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={3}
          whileHover={{ scale: 1.2, rotate: 360, filter: "drop-shadow(0 0 12px rgba(100, 150, 100, 0.5))" }}
          transition={{ rotate: { duration: 1.5 } }}
        >
          <Globe size={50} />
        </motion.div>

        {/* New floating icons */}
        <motion.div
          className="absolute top-[60%] left-[25%] text-primary/30 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={4}
          whileHover={{ scale: 1.2, filter: "drop-shadow(0 0 12px rgba(0, 128, 128, 0.5))" }}
        >
          <Map size={55} />
        </motion.div>
        <motion.div
          className="absolute top-[15%] right-[40%] text-secondary/30 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={5}
          whileHover={{ scale: 1.2, filter: "drop-shadow(0 0 12px rgba(200, 100, 50, 0.5))" }}
        >
          <Camera size={45} />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[40%] text-accent/30 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={6}
          whileHover={{ scale: 1.2, filter: "drop-shadow(0 0 12px rgba(100, 150, 100, 0.5))" }}
        >
          <Palmtree size={50} />
        </motion.div>
        <motion.div
          className="absolute top-[35%] left-[35%] text-primary/20 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={7}
          whileHover={{ scale: 1.2, rotate: 360, filter: "drop-shadow(0 0 12px rgba(255, 215, 0, 0.5))" }}
          transition={{ rotate: { duration: 1 } }}
        >
          <Star size={40} />
        </motion.div>
        <motion.div
          className="absolute bottom-[40%] right-[35%] text-secondary/20 z-10 filter drop-shadow-lg"
          variants={floatingIconVariants}
          initial="initial"
          animate={["animate", "float"]}
          custom={8}
          whileHover={{ scale: 1.2, filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.7))" }}
        >
          <Sparkles size={35} />
        </motion.div>
      </AnimatePresence>

      {/* Welcome message */}
      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-20"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <Network className="absolute opacity-30 animate-pulse-glow text-primary/40 h-24 w-24 scale-150" />
                  <Brain className="relative z-10 text-primary animate-pulse-glow h-24 w-24" />
                </div>
              </motion.div>
              <motion.h1
                className="text-4xl font-serif mb-4 gradient-text-animated"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Welcome to CONECTA
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Your digital guide to San Cristobal
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: showWelcomeMessage ? 2.5 : 0, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-primary/20 shadow-glow backdrop-blur-md bg-background/80 overflow-hidden animate-pulse-glow">
          <motion.div
            className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-shift"
            style={{ backgroundSize: '200% 100%' }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          ></motion.div>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-24 w-24 flex items-center justify-center">
                <Network className="absolute opacity-30 animate-pulse-glow text-primary/40 h-16 w-16 scale-150" />
                <Brain className="relative z-10 text-primary animate-pulse-glow h-16 w-16" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-serif">Welcome to CONECTA</CardTitle>
            <CardDescription>
              Please sign in to explore San Cristobal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-background/50 border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                    {...form.register("email")}
                  />
                </motion.div>
                {form.formState.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {form.formState.errors.email.message}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </Label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="password"
                    type="password"
                    className="bg-background/50 border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                    {...form.register("password")}
                  />
                </motion.div>
                {form.formState.errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {form.formState.errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...form.register("rememberMe")}
                  className="border-primary/30 data-[state=checked]:bg-primary/80"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 shadow-glow hover:shadow-glow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-xs text-muted-foreground/70">
                CONECTA - Your digital guide to San Cristobal de las Casas
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
