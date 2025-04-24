import React, { useState, useEffect } from "react";
import {
  routeService,
  stopService,
  eventService,
  marketService,
  vendorService,
  reviewService,
  authService
} from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Bus,
  Calendar,
  Store,
  Star,
  Home,
  CheckCircle,
  Loader2,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("transit");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: string } | null>(null);

  // State for form data
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for data loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        switch (activeTab) {
          case 'transit':
            const { data: routesData } = await routeService.getAll();
            setRoutes(routesData || []);
            break;
          case 'guide':
            const { data: eventsData } = await eventService.getAll();
            setEvents(eventsData || []);
            break;
          case 'markets':
            const { data: marketsData } = await marketService.getAll();
            setMarkets(marketsData || []);
            const { data: vendorsData } = await vendorService.getAll();
            setVendors(vendorsData || []);
            break;
          case 'reviews':
            const { data: reviewsData } = await reviewService.getByStatus('pending');
            setReviews(reviewsData || []);
            break;
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const handleAddNew = (type: string) => {
    setDialogType(type);
    setFormData({});
    setShowAddDialog(true);
  };

  const handleEdit = async (id: string, type: string) => {
    setIsLoading(true);
    setDialogType(type);

    try {
      let data;

      switch (type) {
        case 'route':
          const { data: route } = await routeService.getById(id);
          data = route;
          break;
        case 'event':
          const { data: event } = await eventService.getById(id);
          data = event;
          break;
        case 'market':
          const { data: market } = await marketService.getById(id);
          data = market;
          break;
        case 'vendor':
          const { data: vendor } = await vendorService.getById(id);
          data = vendor;
          break;
      }

      if (data) {
        setFormData(data);
        setShowAddDialog(true);
        toast({
          title: "Edit Mode",
          description: `Editing ${type} with ID: ${id}`,
        });
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load item data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string, type: string) => {
    setItemToDelete({ id, type });
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      const { id, type } = itemToDelete;
      let success = false;

      switch (type) {
        case 'route':
          const { success: routeSuccess } = await routeService.delete(id);
          success = routeSuccess;
          if (success) {
            setRoutes(routes.filter(route => route.id !== id));
          }
          break;
        case 'event':
          const { success: eventSuccess } = await eventService.delete(id);
          success = eventSuccess;
          if (success) {
            setEvents(events.filter(event => event.id !== id));
          }
          break;
        case 'market':
          const { success: marketSuccess } = await marketService.delete(id);
          success = marketSuccess;
          if (success) {
            setMarkets(markets.filter(market => market.id !== id));
          }
          break;
        case 'vendor':
          const { success: vendorSuccess } = await vendorService.delete(id);
          success = vendorSuccess;
          if (success) {
            setVendors(vendors.filter(vendor => vendor.id !== id));
          }
          break;
        case 'review':
          const { success: reviewSuccess } = await reviewService.delete(id);
          success = reviewSuccess;
          if (success) {
            setReviews(reviews.filter(review => review.id !== id));
          }
          break;
      }

      if (success) {
        toast({
          title: "Item Deleted",
          description: `${type} with ID: ${id} has been deleted.`,
          variant: "destructive",
        });
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const isEditing = !!formData.id;
      let result;

      switch (dialogType) {
        case 'route':
          if (isEditing) {
            result = await routeService.update(formData.id, formData);
            if (result.data) {
              setRoutes(routes.map(route =>
                route.id === formData.id ? result.data : route
              ));
            }
          } else {
            result = await routeService.create(formData);
            if (result.data) {
              setRoutes([...routes, result.data]);
            }
          }
          break;
        case 'event':
          if (isEditing) {
            result = await eventService.update(formData.id, formData);
            if (result.data) {
              setEvents(events.map(event =>
                event.id === formData.id ? result.data : event
              ));
            }
          } else {
            result = await eventService.create(formData);
            if (result.data) {
              setEvents([...events, result.data]);
            }
          }
          break;
        case 'market':
          if (isEditing) {
            result = await marketService.update(formData.id, formData);
            if (result.data) {
              setMarkets(markets.map(market =>
                market.id === formData.id ? result.data : market
              ));
            }
          } else {
            result = await marketService.create(formData);
            if (result.data) {
              setMarkets([...markets, result.data]);
            }
          }
          break;
        case 'vendor':
          if (isEditing) {
            result = await vendorService.update(formData.id, formData);
            if (result.data) {
              setVendors(vendors.map(vendor =>
                vendor.id === formData.id ? result.data : vendor
              ));
            }
          } else {
            result = await vendorService.create(formData);
            if (result.data) {
              setVendors([...vendors, result.data]);
            }
          }
          break;
      }

      toast({
        title: "Success",
        description: `${isEditing ? 'Updated' : 'Added'} ${dialogType} successfully.`,
        action: (
          <ToastAction altText="View">View</ToastAction>
        ),
      });

      setShowAddDialog(false);
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save data. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReview = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await reviewService.approve(id);

      if (error) {
        throw new Error(error.message);
      }

      // Update the reviews list
      setReviews(reviews.filter(review => review.id !== id));

      toast({
        title: "Review Approved",
        description: "The review has been approved and is now visible to users.",
      });
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve review. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/90 backdrop-blur-md p-4 sticky top-0 z-10 shadow-md relative"
        style={{
          background: `linear-gradient(to bottom, rgba(var(--card), 0.9), rgba(var(--card), 0.85))`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="container mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email || 'Admin'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Animated accent line at the bottom */}
        <div
          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 15s linear infinite',
          }}
        />
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "transit" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("transit")}
                  >
                    <Bus className="mr-2 h-4 w-4" />
                    Transit Management
                  </Button>
                  <Button
                    variant={activeTab === "guide" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("guide")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Local Guide
                  </Button>
                  <Button
                    variant={activeTab === "markets" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("markets")}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Markets & Vendors
                  </Button>
                  <Button
                    variant={activeTab === "reviews" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("reviews")}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Review Management
                  </Button>
                </nav>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Routes</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stops</span>
                  <span className="font-medium">86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Events</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vendors</span>
                  <span className="font-medium">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span className="font-medium">156</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading data...</span>
              </div>
            )}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="transit">Transit Data</TabsTrigger>
                  <TabsTrigger value="guide">Local Guide</TabsTrigger>
                  <TabsTrigger value="markets">Markets & Vendors</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-[200px] pl-8"
                    />
                  </div>
                  {activeTab === "transit" && (
                    <Button onClick={() => handleAddNew("route")}>
                      <Plus className="mr-2 h-4 w-4" /> Add Route
                    </Button>
                  )}
                  {activeTab === "guide" && (
                    <Button onClick={() => handleAddNew("event")}>
                      <Plus className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                  )}
                  {activeTab === "markets" && (
                    <Button onClick={() => handleAddNew("market")}>
                      <Plus className="mr-2 h-4 w-4" /> Add Market
                    </Button>
                  )}
                </div>
              </div>

              {/* Transit Data Tab */}
              <TabsContent value="transit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Minibus Routes</CardTitle>
                    <CardDescription>
                      Manage all minibus routes and stops
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Stops</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3].map((route) => (
                          <TableRow key={route}>
                            <TableCell className="font-medium">
                              R-{100 + route}
                            </TableCell>
                            <TableCell>Downtown Express {route}</TableCell>
                            <TableCell>{5 + route} stops</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(`R-${100 + route}`, "route")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`R-${100 + route}`, "route")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bus Stops</CardTitle>
                    <CardDescription>All registered bus stops</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stop ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Routes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4].map((stop) => (
                          <TableRow key={stop}>
                            <TableCell className="font-medium">
                              S-{200 + stop}
                            </TableCell>
                            <TableCell>Central Station {stop}</TableCell>
                            <TableCell className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" /> Downtown
                            </TableCell>
                            <TableCell>R-101, R-102</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(`S-${200 + stop}`, "stop")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`S-${200 + stop}`, "stop")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Local Guide Tab */}
              <TabsContent value="guide" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>Manage local events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3].map((event) => (
                          <TableRow key={event}>
                            <TableCell className="font-medium">
                              E-{300 + event}
                            </TableCell>
                            <TableCell>Summer Festival {event}</TableCell>
                            <TableCell>June {10 + event}, 2023</TableCell>
                            <TableCell>City Park</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(`E-${300 + event}`, "event")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`E-${300 + event}`, "event")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Places of Interest</CardTitle>
                    <CardDescription>Manage interesting places</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Place ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3].map((place) => (
                          <TableRow key={place}>
                            <TableCell className="font-medium">
                              P-{400 + place}
                            </TableCell>
                            <TableCell>Historic Museum {place}</TableCell>
                            <TableCell>Cultural</TableCell>
                            <TableCell>Downtown</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(`P-${400 + place}`, "place")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`P-${400 + place}`, "place")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Markets & Vendors Tab */}
              <TabsContent value="markets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Markets</CardTitle>
                    <CardDescription>Manage local markets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Market ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Vendors</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2].map((market) => (
                          <TableRow key={market}>
                            <TableCell className="font-medium">
                              M-{500 + market}
                            </TableCell>
                            <TableCell>Farmers Market {market}</TableCell>
                            <TableCell>City Center</TableCell>
                            <TableCell>{20 + market} vendors</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(`M-${500 + market}`, "market")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`M-${500 + market}`, "market")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vendors</CardTitle>
                    <CardDescription>Manage market vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Market</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4].map((vendor) => (
                          <TableRow key={vendor}>
                            <TableCell className="font-medium">
                              V-{600 + vendor}
                            </TableCell>
                            <TableCell>Fresh Produce {vendor}</TableCell>
                            <TableCell>Farmers Market 1</TableCell>
                            <TableCell>Food</TableCell>
                            <TableCell className="flex items-center">
                              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                              4.{vendor}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(`V-${600 + vendor}`, "vendor")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`V-${600 + vendor}`, "vendor")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                    <CardDescription>Moderate user reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Review ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((review) => (
                          <TableRow key={review}>
                            <TableCell className="font-medium">
                              REV-{700 + review}
                            </TableCell>
                            <TableCell>User{review}</TableCell>
                            <TableCell>
                              Fresh Produce {(review % 4) + 1}
                            </TableCell>
                            <TableCell className="flex items-center">
                              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {(review % 5) + 1}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  review % 2 === 0
                                    ? "bg-green-50 text-green-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }
                              >
                                {review % 2 === 0 ? "Approved" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {review % 2 !== 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => handleApproveReview(`REV-${700 + review}`)}
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" /> Approve
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(`REV-${700 + review}`, "review")}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add New Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "route" && "Add New Route"}
              {dialogType === "event" && "Add New Event"}
              {dialogType === "market" && "Add New Market"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new {dialogType}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {dialogType === "route" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="name"
                    className="text-right text-sm font-medium"
                  >
                    Route Name
                  </label>
                  <Input
                    id="name"
                    className="col-span-3"
                    placeholder="Downtown Express"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="color"
                    className="text-right text-sm font-medium"
                  >
                    Route Color
                  </label>
                  <Input
                    id="color"
                    className="col-span-3"
                    placeholder="#FF5733"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="description"
                    className="text-right text-sm font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    placeholder="Route description"
                  />
                </div>
              </>
            )}

            {dialogType === "event" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="title"
                    className="text-right text-sm font-medium"
                  >
                    Event Title
                  </label>
                  <Input
                    id="title"
                    className="col-span-3"
                    placeholder="Summer Festival"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="date"
                    className="text-right text-sm font-medium"
                  >
                    Date
                  </label>
                  <Input id="date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="location"
                    className="text-right text-sm font-medium"
                  >
                    Location
                  </label>
                  <Input
                    id="location"
                    className="col-span-3"
                    placeholder="City Park"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="event-description"
                    className="text-right text-sm font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="event-description"
                    className="col-span-3"
                    placeholder="Event description"
                  />
                </div>
              </>
            )}

            {dialogType === "market" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="market-name"
                    className="text-right text-sm font-medium"
                  >
                    Market Name
                  </label>
                  <Input
                    id="market-name"
                    className="col-span-3"
                    placeholder="Farmers Market"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="market-location"
                    className="text-right text-sm font-medium"
                  >
                    Location
                  </label>
                  <Input
                    id="market-location"
                    className="col-span-3"
                    placeholder="City Center"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="operating-hours"
                    className="text-right text-sm font-medium"
                  >
                    Operating Hours
                  </label>
                  <Input
                    id="operating-hours"
                    className="col-span-3"
                    placeholder="9:00 AM - 5:00 PM"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="market-description"
                    className="text-right text-sm font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="market-description"
                    className="col-span-3"
                    placeholder="Market description"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
