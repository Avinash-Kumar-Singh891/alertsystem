import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ArrowUpDown, ChevronDown, CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { mockAlerts, Alert, Severity, AlertStatus } from '../data/mockAlerts';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export const AlertOverview: React.FC = () => {
  const navigate = useNavigate();
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = mockAlerts
    .filter((alert) => {
      if (severityFilter !== 'All' && alert.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && alert.status !== statusFilter) return false;
      if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.riskScore - a.riskScore); // Default sort by Risk Score

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'Critical': return <AlertCircle className="text-red-600" size={18} />;
      case 'High': return <AlertTriangle className="text-orange-500" size={18} />;
      case 'Medium': return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'Low': return <CheckCircle className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Overview</h1>
          <p className="text-gray-500 mt-1">Prioritize and investigate security findings across your cloud environment.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <ArrowUpDown size={16} />
            Sort by Risk
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500 mr-2">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select 
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as Severity | 'All')}
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select 
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AlertStatus | 'All')}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
          <option value="False Positive">False Positive</option>
        </select>

        <div className="ml-auto text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filteredAlerts.length}</span> alerts
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <tr 
                key={alert.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/alerts/${alert.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <span className={clsx('text-sm font-medium', {
                      'text-red-700': alert.severity === 'Critical',
                      'text-orange-700': alert.severity === 'High',
                      'text-yellow-700': alert.severity === 'Medium',
                      'text-blue-700': alert.severity === 'Low',
                    })}>
                      {alert.severity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{alert.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={clsx('h-2.5 rounded-full', {
                          'bg-red-600': alert.riskScore >= 90,
                          'bg-orange-500': alert.riskScore >= 70 && alert.riskScore < 90,
                          'bg-yellow-500': alert.riskScore >= 40 && alert.riskScore < 70,
                          'bg-blue-500': alert.riskScore < 40,
                        })} 
                        style={{ width: `${alert.riskScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{alert.riskScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', {
                    'bg-red-100 text-red-800': alert.status === 'Open',
                    'bg-blue-100 text-blue-800': alert.status === 'Investigating',
                    'bg-green-100 text-green-800': alert.status === 'Resolved',
                    'bg-gray-100 text-gray-800': alert.status === 'False Positive',
                  })}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto">
                    Investigate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No alerts found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};
