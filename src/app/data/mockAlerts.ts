import { format, subMinutes, subHours, subDays } from 'date-fns';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Open' | 'Investigating' | 'Resolved' | 'False Positive';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  description: string;
  source: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  region: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  riskScore: number; // 0-100
  service: string;
  status: AlertStatus;
  timestamp: string;
  assignee?: string;
  timeline: TimelineEvent[];
  impactedResources: Resource[];
  recommendation: string;
}

const now = new Date();

export const mockAlerts: Alert[] = [
  {
    id: 'AL-2024-001',
    title: 'S3 Bucket Publicly Accessible',
    description: 'The S3 bucket "finance-backup-logs" has been configured with public read access, potentially exposing sensitive data.',
    severity: 'Critical',
    riskScore: 95,
    service: 'Amazon S3',
    status: 'Open',
    timestamp: format(subMinutes(now, 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Unassigned',
    impactedResources: [
      { id: 'arn:aws:s3:::finance-backup-logs', name: 'finance-backup-logs', type: 'S3 Bucket', region: 'us-east-1' }
    ],
    timeline: [
      { id: '1', timestamp: format(subMinutes(now, 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Bucket policy updated by user "deploy-bot"', source: 'CloudTrail' },
      { id: '2', timestamp: format(subMinutes(now, 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Public access block disabled', source: 'Config' },
      { id: '3', timestamp: format(subMinutes(now, 14), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Alert triggered by GuardDuty', source: 'GuardDuty' }
    ],
    recommendation: 'Immediately enable "Block Public Access" on the bucket and review the bucket policy to restrict permissions.'
  },
  {
    id: 'AL-2024-002',
    title: 'Root Account Login Detected',
    description: 'A successful login to the AWS root account was detected from an unrecognized IP address (192.168.1.5).',
    severity: 'Critical',
    riskScore: 98,
    service: 'IAM',
    status: 'Investigating',
    timestamp: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Sarah Connor',
    impactedResources: [
      { id: 'arn:aws:iam::123456789012:root', name: 'Root Account', type: 'IAM User', region: 'Global' }
    ],
    timeline: [
      { id: '1', timestamp: format(subHours(now, 2, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Console login attempt from IP 192.168.1.5', source: 'CloudTrail' },
      { id: '2', timestamp: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'MFA authentication successful', source: 'CloudTrail' },
      { id: '3', timestamp: format(subHours(now, 1, 55), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Billing dashboard accessed', source: 'CloudTrail' }
    ],
    recommendation: 'Verify if this was a legitimate login. If not, rotate root credentials immediately and review all subsequent actions.'
  },
  {
    id: 'AL-2024-003',
    title: 'Security Group Port 22 Open to World',
    description: 'Security Group "web-server-sg" allows inbound traffic on port 22 (SSH) from 0.0.0.0/0.',
    severity: 'High',
    riskScore: 88,
    service: 'EC2',
    status: 'Open',
    timestamp: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Unassigned',
    impactedResources: [
      { id: 'sg-0123456789abcdef0', name: 'web-server-sg', type: 'Security Group', region: 'us-west-2' }
    ],
    timeline: [
      { id: '1', timestamp: format(subHours(now, 5, 10), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Security Group rule modified', source: 'CloudTrail' },
      { id: '2', timestamp: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Compliance check failed', source: 'Security Hub' }
    ],
    recommendation: 'Restrict SSH access to specific IP addresses or use Session Manager instead of direct SSH access.'
  },
  {
    id: 'AL-2024-004',
    title: 'IAM User with AdministratorAccess',
    description: 'User "jdoe" was attached the "AdministratorAccess" policy directly, violating least privilege principles.',
    severity: 'Medium',
    riskScore: 65,
    service: 'IAM',
    status: 'Open',
    timestamp: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Unassigned',
    impactedResources: [
      { id: 'arn:aws:iam::123456789012:user/jdoe', name: 'jdoe', type: 'IAM User', region: 'Global' }
    ],
    timeline: [
      { id: '1', timestamp: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Policy attached to user', source: 'CloudTrail' }
    ],
    recommendation: 'Detach the AdministratorAccess policy and attach a more restrictive policy based on the user\'s role.'
  },
  {
    id: 'AL-2024-005',
    title: 'Unusual Data Exfiltration Volume',
    description: 'An EC2 instance has transferred 50GB of data to an external IP address in the last hour, which is 500% above normal baseline.',
    severity: 'Critical',
    riskScore: 92,
    service: 'EC2',
    status: 'Open',
    timestamp: format(subMinutes(now, 45), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Unassigned',
    impactedResources: [
      { id: 'i-0abcdef1234567890', name: 'prod-db-replica', type: 'EC2 Instance', region: 'eu-central-1' }
    ],
    timeline: [
      { id: '1', timestamp: format(subHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Outbound traffic spike detected', source: 'VPC Flow Logs' },
      { id: '2', timestamp: format(subMinutes(now, 45), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Anomaly threshold breached', source: 'GuardDuty' }
    ],
    recommendation: 'Isolate the instance immediately using a restrictive security group and analyze the destination IP.'
  },
  {
    id: 'AL-2024-006',
    title: 'RDS Snapshot Shared Publicly',
    description: 'A manual RDS snapshot "prod-backup-2024" was modified to be public.',
    severity: 'High',
    riskScore: 85,
    service: 'RDS',
    status: 'Resolved',
    timestamp: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Mike Ross',
    impactedResources: [
      { id: 'arn:aws:rds:us-east-1:123456789012:snapshot:prod-backup-2024', name: 'prod-backup-2024', type: 'RDS Snapshot', region: 'us-east-1' }
    ],
    timeline: [
      { id: '1', timestamp: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Snapshot attributes modified', source: 'CloudTrail' },
      { id: '2', timestamp: format(subDays(now, 1, 23), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Permissions reverted by remediation lambda', source: 'Lambda' }
    ],
    recommendation: 'Ensure snapshots are encrypted and policies prevent public sharing.'
  },
  {
    id: 'AL-2024-007',
    title: 'CloudTrail Logging Disabled',
    description: 'CloudTrail logging was disabled for the main trail in region us-west-1.',
    severity: 'Medium',
    riskScore: 60,
    service: 'CloudTrail',
    status: 'Open',
    timestamp: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Unassigned',
    impactedResources: [
      { id: 'arn:aws:cloudtrail:us-west-1:123456789012:trail/main-trail', name: 'main-trail', type: 'CloudTrail', region: 'us-west-1' }
    ],
    timeline: [
      { id: '1', timestamp: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'StopLogging called', source: 'CloudTrail' }
    ],
    recommendation: 'Re-enable CloudTrail logging immediately to maintain audit trails.'
  },
  {
    id: 'AL-2024-008',
    title: 'Lambda Function with Excessive Timeout',
    description: 'Lambda function configured with max timeout (15 mins) and high memory, potential for denial of wallet attack.',
    severity: 'Low',
    riskScore: 30,
    service: 'Lambda',
    status: 'False Positive',
    timestamp: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    assignee: 'Jane Doe',
    impactedResources: [
      { id: 'arn:aws:lambda:us-east-1:123456789012:function:image-processor', name: 'image-processor', type: 'Lambda Function', region: 'us-east-1' }
    ],
    timeline: [
      { id: '1', timestamp: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"), description: 'Function configuration updated', source: 'CloudTrail' }
    ],
    recommendation: 'Review function requirements and lower timeout if possible.'
  }
];
