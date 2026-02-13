import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { mockAlerts, type Severity, type AlertStatus } from '../data/mockAlerts';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertCircle, Shield, Clock, ChevronRight } from 'lucide-react';

export function AlertOverview() {
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'All'>('All');
  const [accountFilter, setAccountFilter] = useState<string>('All');

  // Get unique cloud accounts for filter
  const cloudAccounts = useMemo(() => {
    const accounts = new Set(mockAlerts.map(alert => alert.cloudAccount));
    return Array.from(accounts);
  }, []);

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    let filtered = mockAlerts.filter(alert => {
      if (severityFilter !== 'All' && alert.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && alert.status !== statusFilter) return false;
      if (accountFilter !== 'All' && alert.cloudAccount !== accountFilter) return false;
      return true;
    });

    // Sort by risk score (high to low), then by timestamp (recent first)
    return filtered.sort((a, b) => {
      if (b.riskScore !== a.riskScore) {
        return b.riskScore - a.riskScore;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [severityFilter, statusFilter, accountFilter]);

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'Open':
        return 'destructive';
      case 'In Progress':
        return 'default';
      case 'Resolved':
        return 'secondary';
      case 'False Positive':
        return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-semibold">Cloud Security Alerts</h1>
          </div>
          <p className="text-gray-600">
            Rapid scanning and prioritization for security incidents
          </p>
        </div>
      </header>

      <div className="px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Severity
              </label>
              <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as Severity | 'All')}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AlertStatus | 'All')}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="False Positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Cloud Account
              </label>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Accounts</SelectItem>
                  {cloudAccounts.map(account => (
                    <SelectItem key={account} value={account}>{account}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{filteredAlerts.length} alerts match your filters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>{filteredAlerts.filter(a => a.severity === 'High').length} high severity</span>
            </div>
          </div>
        </div>

        {/* Alert Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Risk</TableHead>
                <TableHead>Alert Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Affected Resource</TableHead>
                <TableHead>Cloud Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                    No alerts match your filter criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                            alert.riskScore >= 80
                              ? 'bg-red-100 text-red-700'
                              : alert.riskScore >= 60
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {alert.riskScore}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{alert.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{alert.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {alert.affectedResource}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {alert.cloudAccount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/alert/${alert.id}`}>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Design Notes */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Design Note:</strong> This screen optimizes for rapid scanning and prioritization.
            Risk-based ordering reduces cognitive load and alert fatigue. Filters are limited to high-impact
            dimensions to avoid complexity.
          </p>
        </div>
      </div>
    </div>
  );
}
