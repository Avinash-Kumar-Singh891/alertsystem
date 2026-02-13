# Cloud Security Alert Management System

A React-based web application designed for rapid triage, investigation, and resolution of cloud security alerts. This system helps security teams prioritize risks, investigate root causes via a timeline view, and close the loop with remediation actions.
Live demo - https://plug-public-95354445.figma.site

## 🚀 Features

### 1. Alert Overview (Dashboard)
- **Risk-Based Prioritization**: Alerts are automatically sorted by a calculated risk score (0-100) to focus attention on critical issues.
- **Advanced Filtering**: Filter alerts by Severity (Critical, High, Medium, Low) and Status (Open, Investigating, Resolved).
- **Search**: Real-time search by alert title or description.
- **Visual Indicators**: Color-coded badges and progress bars for immediate risk assessment.

### 2. Investigation Detail View
- **Contextual Timeline**: Chronological view of events leading up to the alert (e.g., CloudTrail logs, configuration changes).
- **Impacted Resources**: Detailed list of affected cloud resources (S3 Buckets, EC2 Instances, IAM Users) with region and type.
- **Remediation Guidance**: Step-by-step recommendations for resolving the security finding.
- **Assignee Management**: Track ownership of specific alerts.

### 3. Resolution & Action Workflow
- **Structured Resolution**: Dedicated screen for taking action on alerts.
- **Action Types**: Support for Remediation (apply fix), Quarantine (isolate resource), or Dismissal (false positive).
- **Audit Logging**: Mandatory notes field to document the rationale behind resolution decisions.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**:
  - `date-fns` for date formatting and relative time calculations.
  - `clsx` and `tailwind-merge` for dynamic class composition.
  - `sonner` for toast notifications.

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/           # Reusable UI components (RiskBadge, StatusBadge)
│   │   └── Layout.tsx    # Main app shell with Sidebar and Header
│   ├── data/
│   │   └── mockAlerts.ts # Mock data for scenarios (S3, IAM, Network)
│   ├── pages/
│   │   ├── AlertOverview.tsx   # Main dashboard
│   │   ├── AlertDetail.tsx     # Investigation view
│   │   └── AlertResolution.tsx # Action workflow
│   └── App.tsx           # Router configuration
├── styles/
│   └── theme.css         # Global styles and Tailwind directives
└── main.tsx              # Entry point
```

## ⚡ Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## 🛡️ Supported Scenarios (Mock Data)

The application comes pre-loaded with realistic cloud security scenarios:
- S3 Bucket Public Access
- Root Account Login Detection
- Security Group Open Port 22 (SSH)
- IAM Privilege Escalation (AdministratorAccess)
- Unusual Data Exfiltration (EC2)
- Public RDS Snapshots
