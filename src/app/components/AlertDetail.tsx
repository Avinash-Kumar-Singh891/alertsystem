import { useParams, Link } from 'react-router';
import { mockAlerts } from '../data/mockAlerts';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, AlertTriangle, Activity, User, Settings, Clock } from 'lucide-react';

export function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  const alert = mockAlerts.find(a => a.id === id);

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'config_change':
        return <Settings className="w-4 h-4" />;
      case 'user_action':
        return <User className="w-4 h-4" />;
      case 'system_event':
        return <Activity className="w-4 h-4" />;
      case 'access_attempt':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-8 py-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold">{alert.name}</h1>
                <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
              </div>
              <p className="text-gray-600">Alert ID: {alert.id}</p>
            </div>
            <Link to={`/alert/${alert.id}/resolve`}>
              <Button size="lg">Resolve Alert</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alert Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
                <CardDescription>Detailed information about this security incident</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-900">{alert.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Affected Resource</h3>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
                      {alert.affectedResource}
                    </code>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Cloud Account</h3>
                    <p className="text-gray-900">{alert.cloudAccount}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Alert Type</h3>
                    <Badge variant="outline">{alert.type}</Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Risk Score</h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-lg font-semibold ${
                          alert.riskScore >= 80
                            ? 'bg-red-100 text-red-700'
                            : alert.riskScore >= 60
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {alert.riskScore}/100
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">{alert.impact}</p>
              </CardContent>
            </Card>

            {/* Investigation Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Investigation Timeline</CardTitle>
                <CardDescription>Recent events and configuration changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alert.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {getEventIcon(event.type)}
                        </div>
                        {index < alert.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-gray-900">{event.description}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatFullTimestamp(event.timestamp)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {event.type.replace('_', ' ')}
                          </Badge>
                          {event.actor && (
                            <span className="text-gray-600">by {event.actor}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Metadata & Actions */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Status</h4>
                  <Badge variant={alert.status === 'Open' ? 'destructive' : 'default'}>
                    {alert.status}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Detected</h4>
                  <p className="text-sm">{formatFullTimestamp(alert.timestamp)}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Severity</h4>
                  <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Actions</CardTitle>
                <CardDescription>Steps to remediate this alert</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {alert.recommendedActions.map((action, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-900 flex-1">{action}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Design Notes */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Design Note:</strong> This view centralizes context that is otherwise scattered across tools.
            Timeline format supports faster root cause analysis. Impact summary helps validate severity before remediation.
          </p>
        </div>
      </div>
    </div>
  );
}
