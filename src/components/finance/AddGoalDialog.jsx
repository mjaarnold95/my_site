import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AddGoalDialog = ({ isOpen, setIsOpen, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', target: '', deadline: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.target || !formData.deadline) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('goals').insert({
      ...formData,
      target: parseFloat(formData.target),
      user_id: user.id
    });

    if (error) {
      toast({ title: "Error creating goal", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Goal Created!", description: `Your goal "${formData.title}" has been set.` });
      setFormData({ title: '', target: '', deadline: '' });
      setIsOpen(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Create Financial Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Goal Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="e.g., Emergency Fund" />
          </div>
          <div>
            <Label className="text-white">Target Amount</Label>
            <Input type="number" step="0.01" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="0.00" />
          </div>
          <div>
            <Label className="text-white">Deadline</Label>
            <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled={loading}>
            {loading ? 'Creating...' : 'Create Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;