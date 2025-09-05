import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { AuthModal } from './components/AuthModal';
import { ProductForm } from './components/ProductForm';
import { PurchaseModal } from './components/PurchaseModal';
import { LandingPage } from './components/LandingPage';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { 
  Leaf, 
  QrCode, 
  TrendingUp, 
  Shield, 
  Users, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Truck, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Scan,
  BarChart3,
  Package,
  Store,
  User,
  Home,
  Plus,
  LogOut,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';

// Mock data for demonstration
const mockProducts = [
  {
    id: "PR001",
    name: "Organic Tomatoes",
    farmer: "Raj Kumar",
    farmerId: "farmer_001",
    userId: "farmer_001",
    addedByType: "farmer",
    addedByName: "Raj Kumar",
    location: "Bhubaneswar, Odisha",
    harvestDate: "2025-08-25",
    price: 45,
    quality: "Grade A",
    status: "In Transit",
    currentLocation: "Distribution Center - Cuttack",
    blockchainHash: "0x1a2b3c4d5e6f...",
    qrCode: "QR_TOM_001",
    supplyChain: [
      { stage: "Farm", location: "Bhubaneswar", date: "2025-08-25", status: "completed" },
      { stage: "Collection", location: "Local Collection Center", date: "2025-08-26", status: "completed" },
      { stage: "Distribution", location: "Cuttack Distribution Center", date: "2025-08-27", status: "current" },
      { stage: "Retail", location: "City Market", date: "2025-08-28", status: "pending" },
      { stage: "Consumer", location: "Final Delivery", date: "2025-08-29", status: "pending" }
    ]
  },
  {
    id: "PR002",
    name: "Basmati Rice",
    farmer: "Priya Devi",
    farmerId: "farmer_002",
    userId: "farmer_002",
    addedByType: "farmer",
    addedByName: "Priya Devi",
    location: "Sambalpur, Odisha",
    harvestDate: "2025-08-20",
    price: 80,
    quality: "Premium",
    status: "Ready for Pickup",
    currentLocation: "Farm Storage",
    blockchainHash: "0x2b3c4d5e6f7a...",
    qrCode: "QR_RICE_002",
    supplyChain: [
      { stage: "Farm", location: "Sambalpur", date: "2025-08-20", status: "completed" },
      { stage: "Collection", location: "Awaiting Pickup", date: "2025-08-30", status: "pending" },
      { stage: "Distribution", location: "", date: "", status: "pending" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  {
    id: "PR003",
    name: "Green Vegetables Mix",
    farmer: "Suresh Patel",
    farmerId: "farmer_003",
    userId: "farmer_003",
    addedByType: "farmer",
    addedByName: "Suresh Patel",
    location: "Berhampur, Odisha",
    harvestDate: "2025-08-28",
    price: 35,
    quality: "Grade A",
    status: "Delivered",
    currentLocation: "Retail Store - City Mall",
    blockchainHash: "0x3c4d5e6f7a8b...",
    qrCode: "QR_VEG_003",
    supplyChain: [
      { stage: "Farm", location: "Berhampur", date: "2025-08-28", status: "completed" },
      { stage: "Collection", location: "Local Hub", date: "2025-08-28", status: "completed" },
      { stage: "Distribution", location: "Regional Center", date: "2025-08-29", status: "completed" },
      { stage: "Retail", location: "City Mall", date: "2025-08-30", status: "completed" },
      { stage: "Consumer", location: "Available for Purchase", date: "2025-08-30", status: "current" }
    ]
  },
  {
    id: "PR004",
    name: "Wheat",
    farmerName: "Aman",
    farmerId: "wholesaler_001",
    userId: "wholesaler_001",
    addedByType: "wholesaler",
    addedByName: "Aman",
    location: "Sultanpur",
    harvestDate: "2025-03-10",
    price: 36.5,
    quality: "gradeA",
    status: "Available",
    currentLocation: "Wholesale Market",
    blockchainHash: "0x4e5f6a7b8c9d...",
    qrCode: "QR_WHEAT_004",
    supplyChain: [
      { stage: "Wholesale", location: "Sultanpur", date: "2025-03-10", status: "completed" },
      { stage: "Distribution", location: "Regional Center", date: "2025-03-11", status: "current" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  {
    id: "PR005",
    name: "Watermelon",
    farmerName: "Sanjana",
    farmerId: "wholesaler_002", 
    userId: "wholesaler_002",
    addedByType: "wholesaler",
    addedByName: "Sanjana",
    location: "Varanasi",
    harvestDate: "2025-09-02",
    price: 80,
    quality: "gradeA",
    status: "Sold",
    currentLocation: "Consumer Delivery",
    blockchainHash: "0x5f6a7b8c9d0e...",
    qrCode: "QR_WATERMELON_005",
    supplyChain: [
      { stage: "Wholesale", location: "Varanasi", date: "2025-09-02", status: "completed" },
      { stage: "Distribution", location: "Regional Hub", date: "2025-09-03", status: "completed" },
      { stage: "Retail", location: "Local Market", date: "2025-09-04", status: "completed" },
      { stage: "Consumer", location: "Delivered", date: "2025-09-05", status: "completed" }
    ]
  },
  // Sanjeev's Wholesale Products
  {
    id: "PR007",
    name: "Rice",
    farmerName: "Sanjeev",
    farmerId: "wholesaler_sanjeev",
    userId: "wholesaler_sanjeev",
    addedByType: "wholesaler",
    addedByName: "Sanjeev",
    location: "Prayagraj",
    harvestDate: "2025-09-06",
    price: 55,
    quality: "gradeA",
    status: "Available",
    currentLocation: "Wholesale Hub",
    blockchainHash: "0x7a8b9c0d1e2f...",
    qrCode: "QR_RICE_007",
    supplyChain: [
      { stage: "Wholesale", location: "Prayagraj", date: "2025-09-06", status: "completed" },
      { stage: "Distribution", location: "Regional Center", date: "2025-09-07", status: "current" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  {
    id: "PR008",
    name: "Potatoes", 
    farmerName: "Sanjeev",
    farmerId: "wholesaler_sanjeev",
    userId: "wholesaler_sanjeev",
    addedByType: "wholesaler",
    addedByName: "Sanjeev",
    location: "Gaur City",
    harvestDate: "2025-09-05",
    price: 70,
    quality: "gradeA",
    status: "Available",
    currentLocation: "Wholesale Market",
    blockchainHash: "0x8b9c0d1e2f3a...",
    qrCode: "QR_POTATOES_008",
    supplyChain: [
      { stage: "Wholesale", location: "Gaur City", date: "2025-09-05", status: "completed" },
      { stage: "Distribution", location: "Distribution Center", date: "2025-09-06", status: "current" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  // Additional products for other users to test filtering
  {
    id: "PR009",
    name: "Tomatoes",
    farmerName: "Gupta",
    farmerId: "wholesaler_gupta",
    userId: "wholesaler_gupta",
    addedByType: "wholesaler", 
    addedByName: "Gupta",
    location: "Rampur",
    harvestDate: "2025-09-04",
    price: 40,
    quality: "gradeA",
    status: "Available",
    currentLocation: "Wholesale Center",
    blockchainHash: "0x9c0d1e2f3a4b...",
    qrCode: "QR_TOMATOES_009",
    supplyChain: [
      { stage: "Wholesale", location: "Rampur", date: "2025-09-04", status: "completed" },
      { stage: "Distribution", location: "Regional Hub", date: "2025-09-05", status: "current" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  {
    id: "PR010",
    name: "Wheat",
    farmerName: "Komal",
    farmerId: "retailer_komal",
    userId: "retailer_komal",
    addedByType: "retailer",
    addedByName: "Komal",
    location: "Ghazipur",
    harvestDate: "2025-09-03",
    price: 40,
    quality: "gradeA+",
    status: "Available",
    currentLocation: "Retail Store",
    blockchainHash: "0x0d1e2f3a4b5c...",
    qrCode: "QR_WHEAT_010",
    supplyChain: [
      { stage: "Retail", location: "Ghazipur", date: "2025-09-03", status: "completed" },
      { stage: "Distribution", location: "Local Network", date: "2025-09-03", status: "completed" },
      { stage: "Consumer", location: "Ready for Purchase", date: "2025-09-04", status: "current" }
    ]
  },
  {
    id: "PR011",
    name: "Ragu Special Mix",
    farmerName: "Ragu",
    farmerId: "retailer_ragu",
    userId: "retailer_ragu", 
    addedByType: "retailer",
    addedByName: "Ragu",
    location: "Sultanpur",
    harvestDate: "2025-09-02",
    price: 85,
    quality: "Premium",
    status: "Sold",
    currentLocation: "Consumer Home",
    blockchainHash: "0x1e2f3a4b5c6d...",
    qrCode: "QR_RAGU_011",
    supplyChain: [
      { stage: "Retail", location: "Sultanpur", date: "2025-09-02", status: "completed" },
      { stage: "Distribution", location: "Local Delivery", date: "2025-09-02", status: "completed" },
      { stage: "Consumer", location: "Home Delivery", date: "2025-09-03", status: "completed" }
    ]
  },
  // Shyam's Wholesale Products
  {
    id: "PR012",
    name: "Onions",
    farmerName: "Shyam",
    farmerId: "wholesaler_shyam",
    userId: "wholesaler_shyam",
    addedByType: "wholesaler",
    addedByName: "Shyam",
    location: "Nashik",
    harvestDate: "2025-09-07",
    price: 60,
    quality: "gradeA",
    status: "Available",
    currentLocation: "Wholesale Hub",
    blockchainHash: "0x2f3a4b5c6d7e...",
    qrCode: "QR_ONIONS_012",
    supplyChain: [
      { stage: "Wholesale", location: "Nashik", date: "2025-09-07", status: "completed" },
      { stage: "Distribution", location: "Regional Center", date: "2025-09-08", status: "current" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  {
    id: "PR013",
    name: "Mustard Seeds",
    farmerName: "Shyam",
    farmerId: "wholesaler_shyam",
    userId: "wholesaler_shyam",
    addedByType: "wholesaler",
    addedByName: "Shyam", 
    location: "Rajasthan",
    harvestDate: "2025-09-06",
    price: 120,
    quality: "Premium",
    status: "Available",
    currentLocation: "Wholesale Market",
    blockchainHash: "0x3a4b5c6d7e8f...",
    qrCode: "QR_MUSTARD_013",
    supplyChain: [
      { stage: "Wholesale", location: "Rajasthan", date: "2025-09-06", status: "completed" },
      { stage: "Distribution", location: "Distribution Center", date: "2025-09-07", status: "current" },
      { stage: "Retail", location: "", date: "", status: "pending" },
      { stage: "Consumer", location: "", date: "", status: "pending" }
    ]
  },
  {
    id: "PR006",
    name: "Chana",
    farmerName: "Shubham Yadav",
    farmerId: "retailer_001",
    userId: "retailer_001", 
    addedByType: "retailer",
    addedByName: "Shubham Yadav",
    location: "Ghazipur",
    harvestDate: "2025-09-01",
    price: 80,
    quality: "Grade A+",
    status: "Sold",
    currentLocation: "Consumer Home",
    blockchainHash: "0x6a7b8c9d0e1f...",
    qrCode: "QR_CHANA_006",
    supplyChain: [
      { stage: "Retail", location: "Ghazipur", date: "2025-09-01", status: "completed" },
      { stage: "Distribution", location: "Local Network", date: "2025-09-01", status: "completed" },
      { stage: "Consumer", location: "Home Delivery", date: "2025-09-02", status: "completed" }
    ]
  }
];

function MainApp() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userType, setUserType] = useState('consumer');
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [qrUploadOpen, setQrUploadOpen] = useState(false);
  const [userQRCodes, setUserQRCodes] = useState({}); // Store QR codes per user
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [products, setProducts] = useState(mockProducts);
  const [userUploads, setUserUploads] = useState([]); // Track real user uploads separately
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [purchases, setPurchases] = useState([]);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
        await fetchProducts();
        await fetchAnalytics(session.access_token);
        await fetchPurchases(session.access_token);
      }
    };
    checkSession();
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2a067818/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserProfile(result.user);
        setUserType(result.user.userType);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2a067818/products?limit=20`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.products.length > 0) {
          setProducts(result.products);
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (accessToken) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2a067818/analytics`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAnalytics(result.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchPurchases = async (accessToken) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2a067818/purchases`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setPurchases(result.purchases);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setAccessToken(null);
    setUserType('consumer');
    setAnalytics(null);
    // Reset to mock data
    setProducts(mockProducts);
    // Clear user uploads
    setUserUploads([]);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    // Refresh data after authentication
    if (authenticatedUser) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setAccessToken(session.access_token);
          fetchUserProfile(session.access_token);
          fetchProducts();
          fetchAnalytics(session.access_token);
          fetchPurchases(session.access_token);
        }
      });
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    // Also add to user uploads tracking for uploads section
    setUserUploads(prev => [newProduct, ...prev]);
    // Refresh analytics if user is authenticated
    if (accessToken) {
      fetchAnalytics(accessToken);
    }
  };

  const handlePurchaseSuccess = (purchase) => {
    // Refresh products to show updated quantities/status
    fetchProducts();
    // Refresh analytics and purchases if user is authenticated
    if (accessToken) {
      fetchAnalytics(accessToken);
      fetchPurchases(accessToken);
    }
    setPurchaseModalOpen(false);
    setSelectedProductForPurchase(null);
  };

  const handleBuyProduct = (product) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedProductForPurchase(product);
    setPurchaseModalOpen(true);
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2a067818/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on user role and supply chain hierarchy
  const getFilteredProductsByUserRole = () => {
    let roleFilteredProducts = products;
    
    if (userProfile) {
      switch (userProfile.userType) {
        case 'consumer':
          // Consumers can only see products uploaded by retailers
          roleFilteredProducts = products.filter(product => product.addedByType === 'retailer');
          break;
        case 'retailer':
          // Retailers can only see products uploaded by wholesalers
          roleFilteredProducts = products.filter(product => product.addedByType === 'wholesaler');
          break;
        case 'wholesaler':
          // Wholesalers can only see products uploaded by farmers
          roleFilteredProducts = products.filter(product => product.addedByType === 'farmer');
          break;
        case 'farmer':
          // Farmers can only see their own uploaded products (from userUploads array)
          // NOT mock data - only real form submissions that belong to them
          roleFilteredProducts = userUploads.filter(product => 
            (product.userId === userProfile.userId) || 
            (product.farmerId === userProfile.userId) ||
            (product.addedByName === userProfile.name && product.addedByType === 'farmer')
          );
          break;
        default:
          roleFilteredProducts = products;
      }
    }
    
    // Apply search filter to role-filtered products
    return roleFilteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.farmer || product.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredProducts = getFilteredProductsByUserRole();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'farmer': return <Leaf className="size-4" />;
      case 'wholesaler': return <Truck className="size-4" />;
      case 'retailer': return <Store className="size-4" />;
      case 'consumer': return <User className="size-4" />;
      default: return <User className="size-4" />;
    }
  };

  // Show landing page if user is not authenticated
  if (!user) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main application if user is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-1">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <Leaf className="size-6" />
              </div>
              <div className="ml-1">
                <h1 className="text-xl font-semibold text-gray-900 leading-tight">{t('smartbhoomi')}</h1>
                <p className="text-xs text-gray-500 leading-tight">{t('tagline')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              {user && userProfile && (
                <div className="flex items-center gap-2">
                  {getUserTypeIcon(userProfile.userType)}
                  <span className="text-sm">
                    {userProfile.name} ({userProfile.userType})
                  </span>
                </div>
              )}

              {!user && (
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">
                      <div className="flex items-center gap-2">
                        <Leaf className="size-4" />
                        {t('farmer')}
                      </div>
                    </SelectItem>
                    <SelectItem value="wholesaler">
                      <div className="flex items-center gap-2">
                        <Truck className="size-4" />
                        {t('wholesaler')}
                      </div>
                    </SelectItem>
                    <SelectItem value="retailer">
                      <div className="flex items-center gap-2">
                        <Store className="size-4" />
                        {t('retailer')}
                      </div>
                    </SelectItem>
                    <SelectItem value="consumer">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        {t('consumer')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}

              {userProfile && ['farmer', 'wholesaler', 'retailer'].includes(userProfile.userType) && (
                <Button size="sm" onClick={() => setProductFormOpen(true)}>
                  <Plus className="size-4 mr-2" />
                  {userProfile.userType === 'farmer' ? t('addproduct') : t('addtoinventory')}
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={() => fetchProducts()}>
                <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {t('refresh')}
              </Button>
              
              {/* Upload QR Dialog - Only for Non-Consumer Users */}
              {!((!userProfile && userType === 'consumer') || (userProfile && userProfile.userType === 'consumer')) && (
                <Dialog open={qrUploadOpen} onOpenChange={setQrUploadOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <QrCode className="size-4 mr-2" />
                      {t('uploadqr')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Product QR Code</DialogTitle>
                      <DialogDescription>
                        Upload a QR code image to track the product journey
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-6">
                      <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {userProfile && userQRCodes[userProfile.userId] ? (
                          <img src={userQRCodes[userProfile.userId]} alt="Uploaded QR" className="w-full h-full object-contain" />
                        ) : (
                          <QrCode className="size-16 text-gray-400" />
                        )}
                      </div>
                      <div className="w-full">
                        <label 
                          htmlFor="qr-upload"
                          className="flex flex-col items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-gray-600">
                            <QrCode className="size-4" />
                            <span className="text-sm font-medium">
                              {userProfile && userQRCodes[userProfile.userId] ? 'Change QR Code' : 'Choose QR Code Image'}
                            </span>
                          </div>
                          <input
                            id="qr-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && userProfile) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  // Store QR code for current user
                                  setUserQRCodes(prev => ({
                                    ...prev,
                                    [userProfile.userId]: e.target?.result
                                  }));
                                  // Simulate QR processing - load sample product for demo
                                  setSelectedProduct(mockProducts[0]);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Select QR code image from your device
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {!user ? (
                <Button onClick={() => setAuthModalOpen(true)}>
                  {t('signin')}
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="size-4 mr-2" />
                  {t('signout')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1716248899980-cd202c37a0f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhZ3JpY3VsdHVyZSUyMGZhcm0lMjBmaWVsZHxlbnwxfHx8fDE3NTY1NDg1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Agricultural field"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
            <div className="max-w-2xl mx-auto text-center text-white px-6">
              <h2 className="text-3xl mb-4">{t('transparentSupplyChain')}</h2>
              <p className="text-lg mb-6">{t('trackProduce')}</p>
              <div className="flex justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Shield className="size-3 mr-1" />
                  {t('secure')}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <CheckCircle className="size-3 mr-1" />
                  {t('verified')}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <TrendingUp className="size-3 mr-1" />
                  {t('fairPricing')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('activeProducts')}</p>
                  <p className="text-2xl">{analytics?.overview.totalProducts || products.length}</p>
                </div>
                <Package className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('verifiedFarmers')}</p>
                  <p className="text-2xl">{analytics?.overview.totalFarmers || 324}</p>
                </div>
                <Users className="size-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('priceTransparency')}</p>
                  <p className="text-2xl">{analytics?.pricing.priceTransparency || 94}%</p>
                </div>
                <BarChart3 className="size-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('supplyChainEfficiency')}</p>
                  <p className="text-2xl">{analytics?.supplyChain.efficiency || 85}%</p>
                </div>
                <Truck className="size-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${user ? (userProfile && ['wholesaler', 'retailer'].includes(userProfile.userType) ? 'grid-cols-6' : 'grid-cols-5') : 'grid-cols-4'}`}>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="size-4" />
              {t('products')}
            </TabsTrigger>
            {userProfile && ['wholesaler', 'retailer'].includes(userProfile.userType) && (
              <TabsTrigger value="uploads" className="flex items-center gap-2">
                <Plus className="size-4" />
                Uploads
              </TabsTrigger>
            )}
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <MapPin className="size-4" />
              {t('tracking')}
            </TabsTrigger>
            {user && (
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <ShoppingCart className="size-4" />
                {userProfile?.userType === 'farmer' ? t('sales') : t('purchases')}
              </TabsTrigger>
            )}
            <TabsTrigger value="blockchain" className="flex items-center gap-2">
              <Shield className="size-4" />
              {t('blockchain')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              {t('analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Uploads Tab - Only for Wholesaler and Retailer */}
          {userProfile && ['wholesaler', 'retailer'].includes(userProfile.userType) && (
            <TabsContent value="uploads" className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                  <Input
                    placeholder={`Search uploaded products...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={performSearch} disabled={loading}>
                  <Search className="size-4 mr-2" />
                  {loading ? t('searching') : t('search')}
                </Button>
              </div>

              {(() => {
                // UPLOADS SECTION: ONLY show products from userUploads array (real form submissions only)
                // This ensures uploads section starts completely empty and only shows actual user uploads
                const uploadedProducts = userUploads.filter(product => {
                  // ✅ ONLY CURRENT USER: Only current user's uploads
                  const isCurrentUserUploader = 
                    (product.userId === userProfile.userId) || 
                    (product.farmerId === userProfile.userId);
                  
                  const typeMatches = product.addedByType === userProfile.userType;
                  
                  return isCurrentUserUploader && typeMatches;
                }).filter(product => 
                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (product.farmer || product.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.id.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">
                        <Plus className="size-5 inline mr-2" />
                        My Uploaded Products
                      </h3>
                      <p className="text-sm text-green-700">
                        Only products you have personally uploaded via "Add to Inventory" button. Total: {uploadedProducts.length}
                      </p>
                      <div className="mt-2 text-xs text-green-600 bg-green-100 rounded px-2 py-1 inline-block">
                        ✅ Form uploads only • ❌ Zero demo data • ❌ Personal uploads only
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uploadedProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <CardDescription>ID: {product.id}</CardDescription>
                              </div>
                              <Badge variant={product.status === 'Delivered' ? 'default' : 'secondary'}>
                                {product.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex gap-3">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="size-4" />
                                  <span>{product.farmer || product.farmerName || product.addedByName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {product.addedByType || 'farmer'}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="size-4" />
                                  <span>{product.location}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="size-4" />
                                  <span>{product.harvestDate}</span>
                                </div>
                                
                                {/* Pricing Information */}
                                <div className="space-y-1 pt-2">
                                  {product.originalPrice && product.handlingCharge > 0 ? (
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-500">
                                        Farmer Price: ₹{product.originalPrice}/kg
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Handling: +₹{product.handlingCharge}/kg
                                      </div>
                                      <div className="flex items-center gap-1 text-lg font-medium">
                                        <IndianRupee className="size-4" />
                                        <span>{product.price}/kg</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-lg">
                                      <IndianRupee className="size-4" />
                                      <span>{product.price}/kg</span>
                                    </div>
                                  )}
                                  <Badge variant="outline">{product.quality}</Badge>
                                </div>
                              </div>
                              
                              {/* Product Image */}
                              {product.imageUrl && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setActiveTab('tracking');
                                }}
                              >
                                {t('trackJourney')}
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <QrCode className="size-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Product QR Code</DialogTitle>
                                    <DialogDescription>
                                      QR Code for {product.name} (ID: {product.id})
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center gap-4 py-6">
                                    <div className="w-64 h-64 bg-white border rounded-lg flex items-center justify-center p-4">
                                      {(() => {
                                        // Check if current user has QR and this product belongs to them
                                        const productOwnerId = product.userId || product.farmerId;
                                        const currentUserId = userProfile?.userId;
                                        const hasUserQR = userProfile && userQRCodes[userProfile.userId];
                                        const isProductOwner = productOwnerId === currentUserId;
                                        
                                        if (hasUserQR && isProductOwner) {
                                          return <img src={userQRCodes[userProfile.userId]} alt="Product QR Code" className="w-full h-full object-contain" />;
                                        } else {
                                          return (
                                            <div className="text-center">
                                              <QrCode className="size-32 mx-auto mb-4 text-gray-400" />
                                              <div className="space-y-2 text-sm">
                                                <div className="font-mono bg-gray-100 p-2 rounded">
                                                  {product.qrCode || `QR_${product.id}`}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                  Scan to track this product
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      })()}
                                    </div>
                                    <div className="text-center space-y-1">
                                      <p className="font-medium">{product.name}</p>
                                      <p className="text-sm text-gray-600">ID: {product.id}</p>
                                      <p className="text-sm text-gray-600">
                                        Current Status: {product.status}
                                      </p>
                                      {(() => {
                                        const productOwnerId = product.userId || product.farmerId;
                                        const currentUserId = userProfile?.userId;
                                        const hasUserQR = userProfile && userQRCodes[userProfile.userId];
                                        const isProductOwner = productOwnerId === currentUserId;
                                        
                                        if (hasUserQR && isProductOwner) {
                                          return (
                                            <p className="text-xs text-blue-600 mt-2">
                                              QR uploaded by: {userProfile.name} ({userProfile.userType})
                                            </p>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {uploadedProducts.length === 0 && (
                      <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="size-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Building Your Inventory</h3>
                          <p className="text-gray-600 mb-6">
                            This section will show products you upload via the "Add to Inventory" form. Currently empty - ready for your first upload!
                          </p>
                          
                          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-left">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Plus className="size-4 text-green-600" />
                              </div>
                              <h4 className="font-semibold text-green-900">Quick Start Guide</h4>
                            </div>
                            <div className="space-y-3 text-sm text-green-800">
                              <div className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium text-green-700 mt-0.5">1</span>
                                <span>Click "Add to Inventory" button above</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium text-green-700 mt-0.5">2</span>
                                <span>Fill product details (name, price, location)</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium text-green-700 mt-0.5">3</span>
                                <span>Upload product image (optional)</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium text-green-700 mt-0.5">4</span>
                                <span>Submit - your product will appear here instantly!</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => setProductFormOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                          >
                            <Plus className="size-5 mr-2" />
                            Upload Your First Product
                          </Button>
                          
                          <p className="text-xs text-gray-500 mt-4">
                            Only your uploaded products will appear here • Demo products won't show
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </TabsContent>
          )}

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={performSearch} disabled={loading}>
                <Search className="size-4 mr-2" />
                {loading ? t('searching') : t('search')}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>ID: {product.id}</CardDescription>
                      </div>
                      <Badge variant={product.status === 'Delivered' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="size-4" />
                          <span>{product.farmer || product.farmerName || product.addedByName}</span>
                          <Badge variant="outline" className="text-xs">
                            {product.addedByType || 'farmer'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="size-4" />
                          <span>{product.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="size-4" />
                          <span>{product.harvestDate}</span>
                        </div>
                        
                        {/* Pricing Information */}
                        <div className="space-y-1 pt-2">
                          {product.originalPrice && product.handlingCharge > 0 ? (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-500">
                                Farmer Price: ₹{product.originalPrice}/kg
                              </div>
                              <div className="text-xs text-gray-500">
                                Handling: +₹{product.handlingCharge}/kg
                              </div>
                              <div className="flex items-center gap-1 text-lg font-medium">
                                <IndianRupee className="size-4" />
                                <span>{product.price}/kg</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-lg">
                              <IndianRupee className="size-4" />
                              <span>{product.price}/kg</span>
                            </div>
                          )}
                          <Badge variant="outline">{product.quality}</Badge>
                        </div>
                      </div>
                      
                      {/* Product Image */}
                      {product.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedProduct(product);
                          setActiveTab('tracking');
                        }}
                      >
                        {t('trackJourney')}
                      </Button>
                      {userProfile && userProfile.userType !== 'farmer' && product.status !== 'Sold' && product.status !== 'Delivered' && (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleBuyProduct(product)}
                        >
                          <ShoppingCart className="size-4 mr-1" />
                          {t('buy')}
                        </Button>
                      )}
                      {!userProfile && product.status !== 'Sold' && product.status !== 'Delivered' && (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleBuyProduct(product)}
                        >
                          <ShoppingCart className="size-4 mr-1" />
                          {t('buy')}
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <QrCode className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Product QR Code</DialogTitle>
                            <DialogDescription>
                              QR Code for {product.name} (ID: {product.id})
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-center gap-4 py-6">
                            <div className="w-64 h-64 bg-white border rounded-lg flex items-center justify-center p-4">
                              {(() => {
                                // Check if current user has QR and this product belongs to them
                                const productOwnerId = product.userId || product.farmerId;
                                const currentUserId = userProfile?.userId;
                                const hasUserQR = userProfile && userQRCodes[userProfile.userId];
                                const isProductOwner = productOwnerId === currentUserId;
                                
                                if (hasUserQR && isProductOwner) {
                                  return <img src={userQRCodes[userProfile.userId]} alt="Product QR Code" className="w-full h-full object-contain" />;
                                } else {
                                  return (
                                    <div className="text-center">
                                      <QrCode className="size-32 mx-auto mb-4 text-gray-400" />
                                      <div className="space-y-2 text-sm">
                                        <div className="font-mono bg-gray-100 p-2 rounded">
                                          {product.qrCode || `QR_${product.id}`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Scan to track this product
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                            <div className="text-center space-y-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">ID: {product.id}</p>
                              <p className="text-sm text-gray-600">
                                Current Status: {product.status}
                              </p>
                              {(() => {
                                const productOwnerId = product.userId || product.farmerId;
                                const currentUserId = userProfile?.userId;
                                const hasUserQR = userProfile && userQRCodes[userProfile.userId];
                                const isProductOwner = productOwnerId === currentUserId;
                                
                                if (hasUserQR && isProductOwner) {
                                  return (
                                    <p className="text-xs text-blue-600 mt-2">
                                      QR uploaded by: {userProfile.name} ({userProfile.userType})
                                    </p>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Purchases Tab */}
          {user && (
            <TabsContent value="purchases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="size-5" />
                    {userProfile?.userType === 'farmer' ? 'My Sales History' : 'My Purchase History'}
                  </CardTitle>
                  <CardDescription>
                    {userProfile?.userType === 'farmer' 
                      ? 'Track your product sales and customer orders'
                      : 'View your purchased products and delivery status'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchases.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="size-12 text-gray-400 mx-auto mb-4" />
                      <h3>No {userProfile?.userType === 'farmer' ? 'Sales' : 'Purchases'} Yet</h3>
                      <p className="text-gray-600 mb-4">
                        {userProfile?.userType === 'farmer' 
                          ? 'Your sold products will appear here'
                          : 'Your purchased products will appear here'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{purchase.productName}</h4>
                              <p className="text-sm text-gray-600">Order ID: {purchase.id}</p>
                            </div>
                            <Badge variant={purchase.status === 'Delivered' ? 'default' : 'secondary'}>
                              {purchase.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">
                                {userProfile?.userType === 'farmer' ? 'Buyer:' : 'Seller:'}
                              </span>
                              <p className="font-medium">
                                {userProfile?.userType === 'farmer' ? purchase.buyerName : purchase.sellerName}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Quantity:</span>
                              <p className="font-medium">{purchase.quantity} kg</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Total Amount:</span>
                              <p className="font-medium flex items-center gap-1">
                                <IndianRupee className="size-3" />
                                {purchase.totalPrice}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <p className="font-medium">
                                {new Date(purchase.purchaseDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {userProfile?.userType !== 'farmer' && (
                            <div className="pt-2 border-t">
                              <span className="text-gray-600 text-sm">Delivery Address:</span>
                              <p className="text-sm">{purchase.deliveryAddress}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            {selectedProduct ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    Supply Chain Journey: {selectedProduct.name}
                  </CardTitle>
                  <CardDescription>
                    Track the complete journey from farm to consumer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Complete Product Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Complete Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 font-medium">Product Information:</span>
                          <div className="mt-1 space-y-1">
                            <p><strong>Name:</strong> {selectedProduct.name}</p>
                            <p><strong>ID:</strong> {selectedProduct.id}</p>
                            <p><strong>Quality Grade:</strong> {selectedProduct.quality}</p>
                            <p><strong>Status:</strong> <Badge variant="outline">{selectedProduct.status}</Badge></p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 font-medium">Source Information:</span>
                          <div className="mt-1 space-y-1">
                            <p><strong>{selectedProduct.addedByType === 'farmer' ? 'Farmer' : 'Added by'}:</strong> {selectedProduct.farmer || selectedProduct.farmerName || selectedProduct.addedByName}</p>
                            {selectedProduct.addedByType && selectedProduct.addedByType !== 'farmer' && (
                              <p><strong>Supplier Type:</strong> <span className="capitalize">{selectedProduct.addedByType}</span></p>
                            )}
                            <p><strong>Origin Location:</strong> {selectedProduct.location}</p>
                            <p><strong>Harvest/Upload Date:</strong> {selectedProduct.harvestDate}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 font-medium">Current Status:</span>
                          <div className="mt-1 space-y-1">
                            <p><strong>Current Location:</strong> {selectedProduct.currentLocation}</p>
                            <p><strong>Blockchain Hash:</strong> <span className="font-mono text-xs break-all">{selectedProduct.blockchainHash}</span></p>
                            <div>
                              <strong>Pricing:</strong>
                              {selectedProduct.originalPrice && selectedProduct.handlingCharge > 0 ? (
                                <div className="mt-1 space-y-1">
                                  <div className="text-xs">Farmer Price: ₹{selectedProduct.originalPrice}/kg</div>
                                  <div className="text-xs">Handling Charge: +₹{selectedProduct.handlingCharge}/kg</div>
                                  <div className="font-semibold">Final Price: ₹{selectedProduct.price}/kg</div>
                                </div>
                              ) : (
                                <span className="ml-1">₹{selectedProduct.price}/kg</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Upload/Addition Details */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Upload Timeline</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Product uploaded on:</strong> {selectedProduct.harvestDate}</p>
                        <p><strong>Uploaded by:</strong> {selectedProduct.farmer || selectedProduct.farmerName || selectedProduct.addedByName} 
                          {selectedProduct.addedByType && selectedProduct.addedByType !== 'farmer' && (
                            <span className="ml-1 text-gray-600">({selectedProduct.addedByType})</span>
                          )}
                        </p>
                        <p><strong>Source location:</strong> {selectedProduct.location}</p>
                        <p><strong>Initial status:</strong> Ready for distribution</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    {selectedProduct.imageUrl && (
                      <div className="space-y-4">
                        <h3>Product Image</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <h3>Supply Chain Progress</h3>
                      <div className="space-y-4">
                        {selectedProduct.supplyChain.map((step, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`size-3 rounded-full ${getStatusColor(step.status)}`}></div>
                            <div className="flex-1">
                              <p className="font-medium">{step.stage}</p>
                              {step.location && (
                                <p className="text-sm text-gray-600">{step.location}</p>
                              )}
                              {step.date && (
                                <p className="text-xs text-gray-500">{step.date}</p>
                              )}
                            </div>
                            {step.status === 'completed' && (
                              <CheckCircle className="size-4 text-green-600" />
                            )}
                            {step.status === 'current' && (
                              <div className="size-4 bg-blue-600 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Journey Progress</span>
                      <span className="text-sm text-gray-600">
                        {selectedProduct.supplyChain.filter(s => s.status === 'completed').length} / {selectedProduct.supplyChain.length} steps
                      </span>
                    </div>
                    <Progress 
                      value={(selectedProduct.supplyChain.filter(s => s.status === 'completed').length / selectedProduct.supplyChain.length) * 100} 
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="size-12 text-gray-400 mx-auto mb-4" />
                  <h3>No Product Selected</h3>
                  <p className="text-gray-600 mb-4">Select a product from the Products tab to track its supply chain journey</p>
                  <Button onClick={() => setSelectedProduct(mockProducts[0])}>
                    View Sample Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    Blockchain Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Network</span>
                    <Badge variant="outline">Hyperledger Fabric</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <div className="flex items-center gap-2">
                      <div className="size-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Block Height</span>
                    <span>15,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Transaction Count</span>
                    <span>89,432</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Smart Contracts</span>
                    <span>12 Active</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { hash: "0x1a2b3c...", type: "Product Registration", time: "2 min ago" },
                      { hash: "0x2b3c4d...", type: "Quality Verification", time: "5 min ago" },
                      { hash: "0x3c4d5e...", type: "Location Update", time: "12 min ago" },
                      { hash: "0x4d5e6f...", type: "Price Update", time: "18 min ago" },
                    ].map((tx, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-mono text-sm">{tx.hash}</p>
                          <p className="text-xs text-gray-600">{tx.type}</p>
                        </div>
                        <span className="text-xs text-gray-500">{tx.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Details</CardTitle>
                <CardDescription>
                  Automated verification and tracking contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4>Product Registration</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Automatically registers new products when farmers submit harvest data
                    </p>
                    <Badge variant="outline" className="mt-2">Active</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4>Quality Verification</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Validates product quality at each supply chain stage
                    </p>
                    <Badge variant="outline" className="mt-2">Active</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4>Price Transparency</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Ensures fair pricing and prevents exploitation
                    </p>
                    <Badge variant="outline" className="mt-2">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Trends</CardTitle>
                  <CardDescription>Average prices over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { product: "Tomatoes", trend: "+12%", price: 45, color: "text-green-600" },
                      { product: "Rice", trend: "-3%", price: 80, color: "text-red-600" },
                      { product: "Vegetables", trend: "+8%", price: 35, color: "text-green-600" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{item.product}</span>
                        <div className="flex items-center gap-2">
                          <span>₹{item.price}/kg</span>
                          <span className={`text-sm ${item.color}`}>{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Farm to Consumer</span>
                        <span>3.2 days avg</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Retention</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Price Transparency</span>
                        <span>97%</span>
                      </div>
                      <Progress value={97} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Active products by region in Odisha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { region: "Bhubaneswar", count: 324, percentage: 35 },
                    { region: "Cuttack", count: 256, percentage: 28 },
                    { region: "Sambalpur", count: 189, percentage: 20 },
                    { region: "Berhampur", count: 156, percentage: 17 },
                  ].map((region, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-semibold">{region.count}</p>
                      <p className="text-sm text-gray-600">{region.region}</p>
                      <Progress value={region.percentage} className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Product Form Modal */}
      {userProfile && (
        <ProductForm
          isOpen={productFormOpen}
          onOpenChange={setProductFormOpen}
          onProductCreated={handleProductCreated}
          accessToken={accessToken}
          userProfile={userProfile}
        />
      )}

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        product={selectedProductForPurchase}
        onPurchaseSuccess={handlePurchaseSuccess}
        accessToken={accessToken}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}