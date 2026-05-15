import { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  handleFirestoreError, 
  OperationType,
  signOut
} from '../lib/firebase';
import { 
  LogOut, 
  Trash2, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Clock, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface Lead {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  message: string;
  createdAt: any;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedLeads: Lead[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(fetchedLeads);
      setError(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'leads');
      setError('Failed to fetch leads. Make sure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await deleteDoc(doc(db, 'leads', id));
      setLeads(leads.filter(lead => lead.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `leads/${id}`);
      alert('Failed to delete lead.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-brand-cream overflow-y-auto">
      <header className="sticky top-0 bg-brand-navy text-white py-6 px-4 shadow-xl z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-brand-cream/60 text-sm">{auth.currentUser?.email}</span>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-sm font-bold"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-brand-navy">Client Inquiries</h2>
            <p className="text-brand-navy/60">Manage your leads from the contact form.</p>
          </div>
          <button 
            onClick={fetchLeads}
            disabled={loading}
            className="text-brand-gold font-bold hover:underline disabled:opacity-50"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
            <p className="text-brand-navy/60">Loading leads...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <p className="font-bold mb-2">Access Denied</p>
            <p>{error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-brand-navy/5 border border-brand-navy/10 p-12 rounded-3xl text-center">
            <p className="text-xl text-brand-navy/40">No inquiries yet. Keep up the good work!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {leads.map((lead) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={lead.id} 
                className="bg-white border border-brand-navy/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="flex items-center gap-2 text-brand-navy font-bold text-lg">
                        <User size={20} className="text-brand-gold" />
                        {lead.name}
                      </div>
                      <div className="flex items-center gap-2 text-brand-navy/70">
                        <Building size={18} />
                        {lead.businessName}
                      </div>
                      <div className="flex items-center gap-2 text-brand-navy/50 text-sm">
                        <Clock size={16} />
                        {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'Just now'}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-6">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-brand-gold hover:underline font-medium">
                        <Phone size={18} />
                        {lead.phone}
                      </a>
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-brand-gold hover:underline font-medium">
                        <Mail size={18} />
                        {lead.email}
                      </a>
                    </div>

                    <div className="bg-brand-cream/50 p-4 rounded-xl border border-brand-navy/5">
                      <p className="text-brand-navy/80 whitespace-pre-wrap leading-relaxed">
                        {lead.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2">
                    <button 
                      onClick={() => handleDelete(lead.id)}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete inquiry"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
