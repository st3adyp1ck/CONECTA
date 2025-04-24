import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { WelcomeBanner } from "./WelcomeBanner";
import { HeaderAnimation } from "./HeaderAnimation";
import { FooterAnimation } from "./FooterAnimation";
import { AnimatedNavLink } from "./AnimatedNavLink";
import { AnimatedSocialIcon } from "./AnimatedSocialIcon";
import { TravelerBackground } from "./TravelerBackground";
import { AnimatedContainer, AnimatedList, AnimatedText } from "@/components/ui/AnimatedContainer";
import { useScrollReveal, useStaggeredScrollReveal } from "@/lib/useScrollReveal";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { createRipple } from "@/lib/ripple";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services";
import {
  Menu,
  Search,
  Map,
  Calendar,
  ShoppingBag,
  User,
  LogOut,
  Compass,
  Globe,
  Palmtree,
  Mountain,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import TransitMap from "./TransitMap";
import LocalGuide from "./LocalGuide";
import MarketNavigator from "./MarketNavigatorSimplified";

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("guide");
  const [animateHeader, setAnimateHeader] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState(authService.getUserAvatarStyle());
  const [avatarSeed, setAvatarSeed] = useState(authService.getUserAvatarSeed());

  // Responsive design hooks
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Scroll reveal hooks for footer sections
  const { ref: footerRef, isVisible: isFooterVisible } = useScrollReveal({
    threshold: 0.1,
    once: true
  });

  // Staggered reveal for footer items
  const { refs: footerItemRefs, isVisible: footerItemsVisible } = useStaggeredScrollReveal({
    count: 3,
    threshold: 0.1,
    staggerDelay: 0.1
  });

  // Add animation effect after component mounts
  useEffect(() => {
    setAnimateHeader(true);
  }, []);

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await signOut();
  };

  const navigateToAdmin = () => {
    // Navigate to the admin dashboard using React Router
    navigate("/admin");
  };

  // Avatar style options
  const avatarStyles = [
    { id: 'avataaars', name: 'Avataaars', description: 'Cartoon style avatars' },
    { id: 'bottts', name: 'Bottts', description: 'Robot style avatars' },
    { id: 'lorelei', name: 'Lorelei', description: 'Minimalist avatars' },
    { id: 'notionists', name: 'Notionists', description: 'Notion style avatars' },
    { id: 'micah', name: 'Micah', description: 'Simple avatars' },
    { id: 'adventurer', name: 'Adventurer', description: 'Adventure style avatars' },
    { id: 'personas', name: 'Personas', description: 'Illustrated avatars' },
    { id: 'pixel-art', name: 'Pixel Art', description: 'Retro pixel art avatars' },
  ];

  // Handle avatar style selection
  const handleAvatarStyleSelect = async (style: string) => {
    setSelectedAvatarStyle(style);
    // Update in both localStorage and database if user is logged in
    if (user) {
      await authService.setUserAvatarStyle(style, user.id);
    } else {
      await authService.setUserAvatarStyle(style);
    }
  };

  // Handle avatar seed change
  const handleAvatarSeedChange = async (seed: string) => {
    setAvatarSeed(seed);
    // Update in both localStorage and database if user is logged in
    if (user) {
      await authService.setUserAvatarSeed(seed, user.id);
    } else {
      await authService.setUserAvatarSeed(seed);
    }
  };

  // Generate random seed
  const generateRandomSeed = async () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    await handleAvatarSeedChange(randomSeed);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Traveler Background with animated elements */}
      <TravelerBackground />

      {/* Enhanced Header with Animations */}
      <HeaderAnimation>
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Mobile Menu */}
          <AnimatedContainer
            animation="fade-in-right"
            delay={0.2}
            className="flex items-center gap-3"
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-primary/10 hover:text-primary pulse-on-hover ripple-container"
                  onClick={(e) => createRipple(e)}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[240px] sm:w-[300px] bg-gradient-to-b from-background/90 to-background/85 backdrop-blur-md relative"
              >
                {/* Subtle noise texture overlay for smoked glass effect */}
                <div
                  className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                  }}
                />
                <AnimatedContainer
                  animation="fade-in-down"
                  className="mb-8 mt-4"
                >
                  <Logo size="md" />
                </AnimatedContainer>
                <AnimatedList
                  animation="fade-in-left"
                  staggerDelay={0.08}
                  className="flex flex-col gap-4"
                >
                  <AnimatedNavLink
                    icon={<Palmtree className="h-4 w-4" />}
                    label="Local Guide"
                    isActive={activeTab === "guide"}
                    onClick={() => setActiveTab("guide")}
                  />
                  <AnimatedNavLink
                    icon={<Map className="h-4 w-4" />}
                    label="Transit Map"
                    isActive={activeTab === "transit"}
                    onClick={() => setActiveTab("transit")}
                  />
                  <AnimatedNavLink
                    icon={<ShoppingBag className="h-4 w-4" />}
                    label="Market Navigator"
                    isActive={activeTab === "market"}
                    onClick={() => setActiveTab("market")}
                  />
                  {user && isAdmin && (
                    <AnimatedNavLink
                      icon={<User className="h-4 w-4" />}
                      label="Admin Dashboard"
                      variant="default"
                      className="mt-4 bg-secondary hover:bg-secondary/90 text-white shadow-md"
                      onClick={navigateToAdmin}
                    />
                  )}
                </AnimatedList>
              </SheetContent>
            </Sheet>

            {/* Logo with hover animation */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{
                  rotate: [-2, 2, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <Logo size="md" withText={false} className="hidden sm:flex" />
                <Logo size="md" className="sm:hidden" />
              </motion.div>

              <motion.span
                className="hidden md:block text-xs bg-accent/30 px-2 py-1 rounded-full text-accent-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(var(--accent), 0.4)"
                }}
              >
                San Cristobal
              </motion.span>
            </motion.div>
          </AnimatedContainer>

          {/* Right Section - Search, Theme Toggle, Language Toggle, Login */}
          <AnimatedContainer
            animation="fade-in-left"
            delay={0.3}
            className="flex items-center gap-3"
          >
            {/* Search Input with animation */}
            <motion.div
              className="relative hidden md:flex w-40 lg:w-64"
              initial={{ width: "40%", opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div
                animate={{
                  x: [0, 3, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute left-2 top-2.5"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </motion.div>
              <input
                type="text"
                placeholder="Search destinations..."
                className="pl-8 h-9 w-full rounded-md border border-input bg-background/80 backdrop-blur-sm px-3 py-1 text-sm shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
              />

              {/* Subtle glow effect on focus */}
              <motion.div
                className="absolute inset-0 rounded-md pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: 1,
                  boxShadow: "0 0 15px rgba(var(--primary), 0.2)"
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Language Toggle */}
            <AnimatedContainer
              animation="fade-in"
              delay={0.4}
              className="flex items-center gap-2"
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <LanguageToggle />
              </motion.div>
            </AnimatedContainer>

            {/* User Section */}
            <AnimatedContainer
              animation="fade-in-scale"
              delay={0.5}
              className="flex items-center gap-3"
              key="logged-in"
            >
              <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="cursor-pointer"
                    title="Click to change your avatar"
                  >
                    <Avatar className="border-2 border-primary/20 shadow-glow">
                      <AvatarImage
                        src={authService.getUserAvatarUrl(user?.email)}
                        alt={user?.email || 'User'}
                      />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Your Avatar</DialogTitle>
                    <DialogDescription>
                      Select an avatar style and customize it to your liking.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue={selectedAvatarStyle} className="mt-4">
                    <TabsList className="grid grid-cols-4 mb-4">
                      {avatarStyles.slice(0, 4).map(style => (
                        <TabsTrigger
                          key={style.id}
                          value={style.id}
                          onClick={() => handleAvatarStyleSelect(style.id)}
                        >
                          {style.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsList className="grid grid-cols-4">
                      {avatarStyles.slice(4).map(style => (
                        <TabsTrigger
                          key={style.id}
                          value={style.id}
                          onClick={() => handleAvatarStyleSelect(style.id)}
                        >
                          {style.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="flex flex-col items-center gap-4 mt-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-glow">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/${selectedAvatarStyle}/svg?seed=${avatarSeed}`}
                            alt="Your avatar"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="seed">Custom Seed</Label>
                            <div className="flex gap-2">
                              <Input
                                id="seed"
                                value={avatarSeed}
                                onChange={(e) => handleAvatarSeedChange(e.target.value)}
                                className="w-[180px]"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={generateRandomSeed}
                              >
                                Random
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            The seed determines your avatar's appearance
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tabs>

                  <DialogFooter className="mt-4">
                    <Button onClick={() => setShowAvatarDialog(false)}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Only show admin button for specific email */}
              {user?.email === 'ib310us@gmail.com' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="default"
                    className="mr-2 bg-secondary hover:bg-secondary/90 text-white shadow-md transition-all duration-300 hover:shadow-lg ripple-container"
                    onClick={(e) => {
                      createRipple(e);
                      navigateToAdmin();
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 0, 0, -10, 0],
                      }}
                      transition={{
                        duration: 5,
                        times: [0, 0.7, 0.8, 0.9, 1],
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                      className="mr-2"
                    >
                      <User className="h-4 w-4" />
                    </motion.div>
                    Admin Panel
                  </Button>
                </motion.div>
              )}

              <motion.div
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(var(--destructive), 0.1)",
                  borderColor: "rgba(var(--destructive), 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300 ripple-container"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LogOut className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </AnimatedContainer>
          </AnimatedContainer>
        </div>
      </HeaderAnimation>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col animate-fade-in">
        <div className="mb-6">
          <WelcomeBanner />
        </div>

        {/* Responsive layout container - column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row flex-1 gap-6">
          {/* Mobile Navigation Tabs - shown only on mobile, ABOVE the map */}
          <motion.div
            className="md:hidden mb-4 order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-soft border-primary/10 bg-gradient-to-b from-background/90 to-background/85 backdrop-blur-md overflow-hidden relative">
              {/* Subtle noise texture overlay for smoked glass effect */}
              <div
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
              <CardContent className="p-3 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-secondary" />
                    <h3 className="font-serif text-lg">Navigation</h3>
                  </div>
                </div>
                <nav className="flex flex-row gap-2 overflow-x-auto pb-1 snap-x">
                  <AnimatedNavLink
                    icon={<Palmtree className="h-4 w-4" />}
                    label="Local Guide"
                    isActive={activeTab === "guide"}
                    onClick={() => setActiveTab("guide")}
                    className="flex-shrink-0 snap-start min-w-[120px]"
                  />
                  <AnimatedNavLink
                    icon={<Map className="h-4 w-4" />}
                    label="Transit Map"
                    isActive={activeTab === "transit"}
                    onClick={() => setActiveTab("transit")}
                    className="flex-shrink-0 snap-start min-w-[120px]"
                  />
                  <AnimatedNavLink
                    icon={<ShoppingBag className="h-4 w-4" />}
                    label="Market Navigator"
                    isActive={activeTab === "market"}
                    onClick={() => setActiveTab("market")}
                    className="flex-shrink-0 snap-start min-w-[150px]"
                  />
                  {/* Admin button removed from mobile navigation as it's already in the top bar */}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Desktop sidebar - hidden on mobile */}
          <motion.aside
            className="md:w-[260px] md:flex-shrink-0 order-3 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hidden md:block shadow-soft border-primary/10 bg-gradient-to-b from-background/90 to-background/85 backdrop-blur-md overflow-hidden relative">
              {/* Subtle noise texture overlay for smoked glass effect */}
              <div
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
              <CardContent className="p-5 relative">
                <div className="flex items-center gap-2 mb-6">
                  <Mountain className="h-5 w-5 text-secondary" />
                  <h3 className="font-serif text-lg">Navigation</h3>
                </div>
                <nav className="flex flex-col gap-3">
                  <AnimatedNavLink
                    icon={<Palmtree className="h-4 w-4" />}
                    label="Local Guide"
                    isActive={activeTab === "guide"}
                    onClick={() => setActiveTab("guide")}
                  />
                  <AnimatedNavLink
                    icon={<Map className="h-4 w-4" />}
                    label="Transit Map"
                    isActive={activeTab === "transit"}
                    onClick={() => setActiveTab("transit")}
                  />
                  <AnimatedNavLink
                    icon={<ShoppingBag className="h-4 w-4" />}
                    label="Market Navigator"
                    isActive={activeTab === "market"}
                    onClick={() => setActiveTab("market")}
                  />
                  {user && isAdmin && (
                    <AnimatedNavLink
                      icon={<User className="h-4 w-4" />}
                      label="Admin Dashboard"
                      variant="default"
                      className="mt-6 bg-secondary hover:bg-secondary/90 text-white shadow-md"
                      onClick={navigateToAdmin}
                    />
                  )}
                </nav>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Content Area - order second on mobile so map appears below navigation buttons */}
          <motion.div
            className="flex-1 order-2 md:order-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Mobile tab triggers - now hidden as we've moved them below the map */}
              <TabsList className="mb-4 hidden bg-background/80 backdrop-blur-sm shadow-soft">
                <TabsTrigger value="guide" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Palmtree className="mr-2 h-4 w-4" />
                  Guide
                </TabsTrigger>
                <TabsTrigger value="transit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Map className="mr-2 h-4 w-4" />
                  Transit
                </TabsTrigger>
                <TabsTrigger value="market" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Market
                </TabsTrigger>
              </TabsList>

              <TabsContent value="guide" className="mt-0 animate-fade-in">
                <LocalGuide />
              </TabsContent>

              <TabsContent value="transit" className="mt-0 animate-fade-in">
                <TransitMap />
              </TabsContent>

              <TabsContent value="market" className="mt-0 animate-fade-in">
                <MarketNavigator />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Enhanced Footer with Animations */}
      <FooterAnimation className="py-6 bg-background/90 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Tagline */}
          <div ref={(el) => footerItemRefs.current[0] = el as HTMLElement}
            className={`reveal-on-scroll ${footerItemsVisible[0] ? 'is-visible' : ''}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Logo size="sm" />
            </motion.div>
            <motion.p
              className="text-xs text-muted-foreground mt-2 max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <AnimatedText
                text="Connecting digital navigation to the old charm of San Cristobal streets"
                animation="fade-in-up"
                delay={0.5}
                duration={0.5}
                wordLevel={true}
                staggerDelay={0.05}
              />
            </motion.p>
          </div>

          {/* Navigation Links */}
          <div
            ref={(el) => footerItemRefs.current[1] = el as HTMLElement}
            className={`grid grid-cols-2 gap-x-12 gap-y-4 text-sm reveal-on-scroll ${footerItemsVisible[1] ? 'is-visible' : ''}`}
          >
            {/* Explore Section */}
            <div>
              <motion.h4
                className="font-medium mb-2 text-primary"
                whileHover={{
                  scale: 1.05,
                  x: 3,
                  transition: { duration: 0.2 }
                }}
              >
                <AnimatedText
                  text="Explore"
                  animation="fade-in"
                  delay={0.6}
                />
              </motion.h4>
              <AnimatedList
                animation="fade-in-left"
                delay={0.7}
                staggerDelay={0.1}
                className="space-y-1 text-muted-foreground"
              >
                {["Centro Histórico", "Pueblos Indígenas", "Mercados Locales", "Naturaleza"].map((item, index) => (
                  <motion.li
                    key={index}
                    className="hover:text-primary transition-colors cursor-pointer"
                    whileHover={{
                      x: 5,
                      color: "hsl(var(--primary))",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </AnimatedList>
            </div>

            {/* Connect Section */}
            <div>
              <motion.h4
                className="font-medium mb-2 text-secondary"
                whileHover={{
                  scale: 1.05,
                  x: 3,
                  transition: { duration: 0.2 }
                }}
              >
                <AnimatedText
                  text="Connect"
                  animation="fade-in"
                  delay={0.6}
                />
              </motion.h4>
              <AnimatedList
                animation="fade-in-left"
                delay={0.8}
                staggerDelay={0.1}
                className="space-y-1 text-muted-foreground"
              >
                {["Digital Nomads", "Local Events", "Language Exchange", "Volunteer"].map((item, index) => (
                  <motion.li
                    key={index}
                    className="hover:text-secondary transition-colors cursor-pointer"
                    whileHover={{
                      x: 5,
                      color: "hsl(var(--secondary))",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </AnimatedList>
            </div>
          </div>

          {/* Social Media and Copyright */}
          <div
            ref={(el) => footerItemRefs.current[2] = el as HTMLElement}
            className={`text-center reveal-on-scroll ${footerItemsVisible[2] ? 'is-visible' : ''}`}
          >
            <AnimatedContainer
              animation="fade-in-up"
              delay={0.9}
              className="flex gap-3 mb-3 justify-center"
            >
              <AnimatedSocialIcon
                icon={<Instagram className="h-4 w-4" />}
                href="https://instagram.com"
                label="Instagram"
              />
              <AnimatedSocialIcon
                icon={<Facebook className="h-4 w-4" />}
                href="https://facebook.com"
                label="Facebook"
              />
              <AnimatedSocialIcon
                icon={<Twitter className="h-4 w-4" />}
                href="https://twitter.com"
                label="Twitter"
              />
              <AnimatedSocialIcon
                icon={<Globe className="h-4 w-4" />}
                href="#"
                label="Website"
              />
            </AnimatedContainer>

            <motion.div
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                color: "hsl(var(--primary))",
                transition: { duration: 0.2 }
              }}
            >
              © {new Date().getFullYear()} CONECTA - San Cristobal Travel App
            </motion.div>
          </div>
        </div>
      </FooterAnimation>
    </div>
  );
};

export default Home;
