"use client"
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Calendar, 
  Clock, 
  Percent, 
  Settings, 
  DollarSign, 
  Gift, 
  Share2, 
  Key, 
  ShieldCheck, 
  SendHorizonal, 
  Timer, 
  CreditCard, 
  Wallet, 
  BarChart2, 
  Layout, 
  Users, 
  Paintbrush, 
  Mail, 
  ActivitySquare,
  Menu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const SidebarTab = ({ icon: Icon, label, isActive, onClick }:any) => (
  <div 
    className={cn(
      "flex items-center px-4 py-2 text-sm cursor-pointer",
      isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
    )}
    onClick={onClick}
  >
    <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-white" : "text-gray-500")} />
    <span>{label}</span>
  </div>
);

const GeneralSettingsSection = () => (
  <>
    <h1 className="text-3xl font-semibold mb-6">General Settings</h1>
    <p className="text-gray-600 mb-8">Global settings of the application that you can manage easily.</p>
    
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Timezone and Format</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Globe className="text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Time Zone</p>
              <p className="text-xs text-gray-500">Set timezone on application.</p>
            </div>
            <Select defaultValue="(UTC+06:00) Dhaka" className="w-full sm:w-auto">
              <option>(UTC+06:00) Dhaka</option>
            </Select>
          </div>
          {/* Similar structure for Date Format and Time Format */}
        </div>
      </CardContent>
    </Card>

    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Decimal Option</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ... (Decimal Option content with responsive adjustments) ... */}
      </CardContent>
    </Card>

    <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">Update</Button>
  </>
);

const ManageCurrenciesSection = () => (
  <>
    <h1 className="text-3xl font-semibold mb-6">Manage Currencies</h1>
    <p className="text-gray-600 mb-8">Configure and manage the currencies used in your application.</p>
    {/* Add content for managing currencies */}
  </>
);

const RewardsProgramSection = () => (
  <>
    <h1 className="text-3xl font-semibold mb-6">Rewards Program</h1>
    <p className="text-gray-600 mb-8">Set up and manage your application's rewards program.</p>
    {/* Add content for rewards program */}
  </>
);
const Api = () => (
    <>
      <h1 className="text-3xl font-semibold mb-6">Rewards Program</h1>
      <p className="text-gray-600 mb-8">Set up and manage your application's rewards program.</p>
      {/* Add content for rewards program */}
    </>
  );

const ApplicationSettings = () => {
  const [activeTab, setActiveTab] = useState("General Settings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { icon: Settings, label: "General Settings", category: "GLOBAL SETTINGS" },
    { icon: DollarSign, label: "Manage Currencies", category: "GLOBAL SETTINGS" },
    { icon: Gift, label: "Rewards Program", category: "GLOBAL SETTINGS" },
    { icon: Key, label: "Third-Party API", category: "GLOBAL SETTINGS" },
    { icon: ShieldCheck, label: "System Component", category: "MANAGE COMPONENTS" },
    { icon: Users, label: "Basic KYC", category: "MANAGE COMPONENTS" },
    { icon: SendHorizonal, label: "Fund Transfer", category: "MANAGE COMPONENTS" },
    { icon: Timer, label: "Cron Service", category: "MANAGE COMPONENTS" },
    { icon: CreditCard, label: "Deposit & Withdraw", category: "PAYMENT OPTIONS" },
    { icon: Wallet, label: "Payment Method", category: "PAYMENT OPTIONS" },
    { icon: SendHorizonal, label: "Withdraw Method", category: "PAYMENT OPTIONS" },
    { icon: BarChart2, label: "Investment Apps", category: "PAYMENT OPTIONS" },
    { icon: Layout, label: "Site Information", category: "WEBSITE SETTINGS" },
    { icon: Users, label: "User Dashboard", category: "WEBSITE SETTINGS" },
    { icon: Paintbrush, label: "Brands & Theming", category: "WEBSITE SETTINGS" },
    { icon: Settings, label: "Miscellaneous", category: "WEBSITE SETTINGS" },
    { icon: Mail, label: "Email Configuration", category: "WEBSITE SETTINGS" },
    { icon: ActivitySquare, label: "System Status", category: "WEBSITE SETTINGS" },
    // ... (other tabs) ...
  ];

  const groupedTabs = tabs.reduce((acc:any, tab) => {
    if (!acc[tab.category]) {
      acc[tab.category] = [];
    }
    acc[tab.category].push(tab);
    return acc;
  }, {});

  const renderActiveSection = () => {
    switch (activeTab) {
      case "General Settings":
        return <GeneralSettingsSection />;
      case "Manage Currencies":
        return <ManageCurrenciesSection />;
      case "Rewards Program":
        return <RewardsProgramSection />;
     case "Third-Party API":
        return <Api />;
      // ... Add cases for other tabs ...
      default:
        return <p>Select a tab to view settings.</p>;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={cn(
        "w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto fixed md:relative transition-transform duration-300 ease-in-out z-10",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Application Settings</h2>
          {Object.entries(groupedTabs).map(([category, categoryTabs]:any) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 mt-4 mb-2">{category}</h3>
              {categoryTabs.map((tab:any) => (
                <SidebarTab 
                  key={tab.label}
                  icon={tab.icon} 
                  label={tab.label}
                  isActive={activeTab === tab.label}
                  onClick={() => {
                    setActiveTab(tab.label);
                    setIsSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default ApplicationSettings;