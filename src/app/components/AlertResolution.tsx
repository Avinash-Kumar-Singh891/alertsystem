import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { mockAlerts, type AlertStatus } from '../data/mockAlerts';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export function AlertResolution() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alert = mockAlerts.find(a => a.id === id);
  
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus>('Resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Alert Not Found</h2>
          <p className="text-gray-600 mb-4">The alert you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Return to Overview</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // In a real application, this would update the alert status in a database
    console.log('Alert resolved:', {
      alertId: alert.id,
      status: selectedStatus,
      notes: resolutionNotes,
      timestamp: new Date().toISOString(),
    });
    
    // Navigate back to overview
    navigate('/');
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'In Progress':
        return <Clock className="w-5 h-5" />;
      case 'False Positive':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusDescription = (status: AlertStatus) => {
    switch (status) {
      case 'Resolved':
        return 'Issue has been fully remediated and verified';
      case 'In Progress':
        return 'Investigation or remediation is underway';
      case 'False Positive':
        return 'Alert was incorrectly triggered or not a security issue';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-8 py-6">
          <Link to={`/alert/${alert.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Alert Details
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">Resolve Alert</h1>
            <Badge variant="outline">{alert.id}</Badge>
          </div>
          <p className="text-gray-600 mt-2">{alert.name}</p>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Alert Context Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Affected Resource</h4>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {alert.affectedResource}
                  </code>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Cloud Account</h4>
                  <p className="text-sm">{alert.cloudAccount}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Severity</h4>
                  <Badge variant={alert.severity === 'High' ? 'destructive' : 'default'}>
                    {alert.severity}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Risk Score</h4>
                  <span className="text-sm font-semibold">{alert.riskScore}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Resolution Status</CardTitle>
              <CardDescription>
                Choose the appropriate status based on your investigation and actions taken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as AlertStatus)}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="Resolved" id="resolved" className="mt-1" />
                    <Label htmlFor="resolved" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon('Resolved')}
                        <span className="font-semibold">Resolved</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getStatusDescription('Resolved')}
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="In Progress" id="in-progress" className="mt-1" />
                    <Label htmlFor="in-progress" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon('In Progress')}
                        <span className="font-semibold">In Progress</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getStatusDescription('In Progress')}
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="False Positive" id="false-positive" className="mt-1" />
                    <Label htmlFor="false-positive" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon('False Positive')}
                        <span className="font-semibold">False Positive</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getStatusDescription('False Positive')}
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Recommended Actions Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Actions</CardTitle>
              <CardDescription>Reference guide for remediation</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {alert.recommendedActions.map((action, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 flex-1">{action}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Resolution Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Resolution Notes (Optional)</CardTitle>
              <CardDescription>
                Document actions taken, findings, or any relevant context for audit purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Example: Removed public read access from S3 bucket ACL. Verified no unauthorized access occurred by reviewing CloudTrail logs from the past 24 hours. Enabled S3 Block Public Access at account level to prevent future occurrences."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                These notes will be stored for audit and compliance purposes
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Link to={`/alert/${alert.id}`}>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} size="lg">
              Submit Resolution
            </Button>
          </div>

          {/* Design Notes */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Design Note:</strong> Resolution tracking improves accountability and audit readiness.
              Recommended actions reduce decision friction for common alert types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
