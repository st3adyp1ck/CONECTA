import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock, Mail, ArrowRight, User, Brain, Network } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { TravelerBackground } from "@/components/TravelerBackground";

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      const result = await signUp(values.email, values.password, values.name);

      if ('error' in result && result.error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: result.error.message,
        });
        return;
      }

      // Successful signup
      toast({
        title: "Account created successfully",
        description: "Please sign in with your new account",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
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

      {/* Sign up card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            <CardTitle className="text-2xl font-serif">Create an Account</CardTitle>
            <CardDescription>
              Join CONECTA to explore San Cristobal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Name
                </Label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="bg-background/50 border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                    {...form.register("name")}
                  />
                </motion.div>
                {form.formState.errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {form.formState.errors.name.message}
                  </motion.p>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Confirm Password
                </Label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-background/50 border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                    {...form.register("confirmPassword")}
                  />
                </motion.div>
                {form.formState.errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {form.formState.errors.confirmPassword.message}
                  </motion.p>
                )}
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
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
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
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
