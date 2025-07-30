import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AddBudgetDialog = ({ isOpen, setIsOpen, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ category: '', budget: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.budget) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('budgets').insert({
      ...formData,
      budget: parseFloat(formData.budget),
      user_id: user.id,
      color: `bg-${['emerald', 'blue', 'purple', 'pink', 'orange', 'cyan'][Math.floor(Math.random() * 6)]}-500`
    });

    if (error) {
      toast({ title: "Error creating budget", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Budget Created!", description: `Budget for ${formData.category} has been set.` });
      setFormData({ category: '', budget: '' });
      setIsOpen(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Category</Label>
            <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="e.g., Food, Transport" />
          </div>
          <div>
            <Label className="text-white">Monthly Budget</Label>
            <Input type="number" step="0.01" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="0.00" />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={loading}>
            {loading ? 'Creating...' : 'Create Budget'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetDialog;