import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Activity, Server, MapPin, ExternalLink, CheckCircle } from 'lucide-react';
import { mockAlerts, Alert } from '../data/mockAlerts';
import { RiskBadge } from '../components/ui/RiskBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';

export const AlertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alert = mockAlerts.find((a) => a.id === id);

  if (!alert) {
    return <div className="p-8 text-center text-red-600">Alert not found</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Overview
        </Link>
        <span>/</span>
        <span>Alerts</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{alert.id}</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {alert.title}
              <StatusBadge status={alert.status} />
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Clock size={16} /> Detected: {format(new Date(alert.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
              <span className="flex items-center gap-1"><Shield size={16} /> Service: {alert.service}</span>
              <span className="flex items-center gap-1"><Activity size={16} /> ID: {alert.id}</span>
            </div>
          </div>
          <div className="text-right">
            <RiskBadge severity={alert.severity} score={alert.riskScore} className="mb-2 justify-end" />
            <div className="text-xs text-gray-400">Automated Analysis Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context & Resources */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Alert Description
            </h2>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
              {alert.description}
            </p>
          </div>

          {/* Impacted Resources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Server size={20} className="text-purple-600" />
              Impacted Resources
            </h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alert.impactedResources.map((res) => (
                    <tr key={res.id}>
                      <td className="px-4 py-3 text-sm text-blue-600 font-mono flex items-center gap-2">
                        {res.name}
                        <ExternalLink size={12} className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{res.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={14} /> {res.region}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500" />
              Remediation Recommendation
            </h2>
            <p className="text-gray-700 mb-4">
              {alert.recommendation}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate(`/alerts/${alert.id}/resolve`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
              >
                Proceed to Resolution
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View Runbook
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Metadata */}
        <div className="lg:col-span-1 space-y-6">
          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Investigation Timeline</h2>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
              {alert.timeline.map((event, idx) => (
                <div key={event.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                  <div className="text-xs text-gray-400 font-mono mb-1">
                    {format(new Date(event.timestamp), 'HH:mm:ss')} UTC
                  </div>
                  <p className="text-sm font-medium text-gray-900">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Source: {event.source}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm text-blue-600 font-medium hover:text-blue-800 text-center">
              Load more logs
            </button>
          </div>

          {/* Assignee */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignee</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                {alert.assignee ? alert.assignee.charAt(0) : '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{alert.assignee || 'Unassigned'}</p>
                <button className="text-xs text-blue-600 hover:underline">
                  {alert.assignee ? 'Reassign' : 'Assign to me'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
