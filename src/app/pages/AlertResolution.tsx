import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, XCircle, AlertTriangle, Check, FileText } from 'lucide-react';
import { mockAlerts, AlertStatus } from '../data/mockAlerts';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const AlertResolution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alert = mockAlerts.find((a) => a.id === id);
  const [selectedAction, setSelectedAction] = useState<'remediate' | 'dismiss' | 'quarantine' | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!alert) {
    return <div className="p-8 text-center text-red-600">Alert not found</div>;
  }

  const handleResolution = () => {
    if (!selectedAction) {
      toast.error('Please select an action to proceed.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Alert ${alert.id} resolved successfully.`);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resolve Alert</h1>
        <p className="text-gray-500">Take action on <span className="font-mono text-gray-700">{alert.id}</span></p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Resolution Action</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button
            onClick={() => setSelectedAction('remediate')}
            className={clsx(
              "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
              selectedAction === 'remediate' ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div className={clsx("p-2 rounded-full", selectedAction === 'remediate' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500")}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Apply Remediation</h3>
              <p className="text-sm text-gray-500 mt-1">
                Execute automated fix: {alert.recommendation}
              </p>
            </div>
            {selectedAction === 'remediate' && <Check className="ml-auto text-blue-600" size={24} />}
          </button>

          <button
            onClick={() => setSelectedAction('quarantine')}
            className={clsx(
              "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
              selectedAction === 'quarantine' ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
            )}
          >
            <div className={clsx("p-2 rounded-full", selectedAction === 'quarantine' ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500")}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quarantine Resource</h3>
              <p className="text-sm text-gray-500 mt-1">
                Isolate the affected resource ({alert.impactedResources[0]?.name}) from the network.
              </p>
            </div>
            {selectedAction === 'quarantine' && <Check className="ml-auto text-orange-500" size={24} />}
          </button>

          <button
            onClick={() => setSelectedAction('dismiss')}
            className={clsx(
              "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
              selectedAction === 'dismiss' ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-400"
            )}
          >
            <div className={clsx("p-2 rounded-full", selectedAction === 'dismiss' ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-500")}>
              <XCircle size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Dismiss as False Positive</h3>
              <p className="text-sm text-gray-500 mt-1">
                Mark this alert as resolved without taking action.
              </p>
            </div>
            {selectedAction === 'dismiss' && <Check className="ml-auto text-gray-500" size={24} />}
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resolution Notes
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 text-gray-400">
              <FileText size={18} />
            </div>
            <textarea
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              placeholder="Add details about the investigation and resolution..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
          <button
            onClick={() => navigate(`/alerts/${alert.id}`)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleResolution}
            disabled={!selectedAction || isSubmitting}
            className={clsx(
              "px-6 py-2 rounded-lg text-white font-medium transition-all shadow-sm flex items-center gap-2",
              !selectedAction || isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Resolution'}
          </button>
        </div>
      </div>
    </div>
  );
};
