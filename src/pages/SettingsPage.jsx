import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const handleNotImplemented = () => {
    toast({
      title: "🚧 Feature Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
          
          <div className="space-y-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription className="text-white/70">Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-sm text-white/60">Receive email summaries and alerts.</span>
                  </Label>
                  <Switch id="email-notifications" onClick={handleNotImplemented} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                    <span>Push Notifications</span>
                    <span className="font-normal text-sm text-white/60">Get real-time alerts on your devices.</span>
                  </Label>
                  <Switch id="push-notifications" disabled />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription className="text-white/70">Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>Dark Mode</span>
                    <span className="font-normal text-sm text-white/60">Currently enabled. Light mode coming soon!</span>
                  </Label>
                  <Switch id="dark-mode" checked disabled />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription className="text-white/70">Export or manage your financial data.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={handleNotImplemented}>Export Data as CSV</Button>
                <Button variant="destructive" onClick={handleNotImplemented}>Delete All Data</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;