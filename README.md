# GRC System - Governance, Risk, and Compliance Platform

A comprehensive Governance, Risk, and Compliance (GRC) platform designed to help organizations manage security compliance, track Authorization to Operate (ATO) processes, and implement security controls based on NIST frameworks. *THIS IS A CONCEPT* and a huge work in progress at this time.

![client overview](/screenshots/screenshot_1.PNG)

## Overview

This application provides a full-featured GRC solution that enables organizations to:

- Manage multiple client organizations
- Track systems through the ATO process (ATO as a Service, https://foxxcyber.com)
- Implement and monitor security controls
- Manage security assessments and audits
- Track and mitigate security risks
- Create and monitor security initiatives
- Handle security incidents
- Track compliance with security frameworks

## Stages of Development
- Fronten + JSON Server = complete and total API development
-- This ensures the front end is complete before backend dev.
- Decision for backend still pending
-- Nextjs or Golang

### Current Notes
- Fixing "risk" data to ensure flow:
-- "Security Assessments (discover findings)" -> "Audits (manage findings, CRUD, promote to risk)" -> "Security Strategy (CRUD, manage risks, objectives, initiatives).
-- Security strategy = risks -> objectives -> initiatives (Road Map)

## Key Features

### Client Management
- Multi-tenant architecture supporting multiple client organizations
- Client dashboard with security posture overview
- Company structure and stakeholder management
- User management with role-based access control
- TODO: total asset inventory
- TODO: cyber security program/training program

### System Management
- Inventory of systems and components
- Detailed system information tracking
- ATO process tracking
- Security control implementation and monitoring

### ATO Process Management
Complete workflow for Authorization to Operate:
1. **Initial Assessment**
   - System discovery
   - Environment analysis
   - Network boundary definition
   - Stakeholder analysis

2. **System Categorization**
   - Information type classification
   - Impact analysis
   - Security objectives definition

3. **Security Controls**
   - Baseline selection
   - Control details management
   - Implementation tracking

4. **Assessment**
   - Assessment planning
   - Security testing
   - Control assessment
   - Documentation review

5. **Authorization**
   - Risk assessment
   - Authorization package preparation
   - Authorization decision

6. **Continuous Monitoring**
   - Ongoing assessment
   - Change management
   - System maintenance

### Risk Management
- Risk assessment and analysis
- Risk treatment planning
- Risk monitoring
- Integration with security controls

### Security Assessments
- Basic and advanced risk assessments
- Assessment history tracking
- Assessment comparison

### Security Audit
- Findings repository
- Audit evidence management
- Promotion of findings to risks

### Incident Management
- Incident tracking
- Response actions
- Metrics and reporting

### Security Strategy
- Security objectives management
- Initiative tracking
- Security roadmap development

## Architecture

The application is built with a modern React-based frontend using Material-UI components. The architecture includes:

- React functional components with hooks
- React Router for navigation
- REST API integration for data management
- Role-based access control
- Component-based UI architecture
- JSON Server for mocking a complete backend for HTTP requests.

## Technical Stack

- **Frontend**: React, Material-UI
- **State Management**: React Hooks
- **Styling**: Material-UI theming
- **Navigation**: React Router
- **Data Visualization**: Various charting libraries

## Getting Started

### Prerequisites

- Node.js (v20.18)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/grc-system.git
cd grc-system
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

### Mock Data Server

The application includes a mock data server for development:

1. Generate the combined database:
```bash
npm run generate-db
```

2. Start the mock server for JSON HTTP requests:
```bash
npm run mock-server
```

## User Roles

- **System Administrator**: Global administration rights
- **Senior AO**: Authorization Official with approval rights
- **Program Manager**: Client management and program oversight
- **ISSM**: Information System Security Manager
- **System Owner**: Responsible for system security
- **Security Control Assessor**: Evaluates security controls

## Demo Credentials

For demonstration purposes, use:
- Email: senior.ao@example.com
- Password: password123

## Screenshots

![client overview](/screenshots/screenshot_3.PNG)
---
![system management](/screenshots/screenshot_5.PNG)
---
![system overview](/screenshots/screenshot_7.PNG)
---
![system ATO process](/screenshots/screenshot_9.PNG)
---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NIST Special Publication 800-53 for security controls framework
- NIST Risk Management Framework for ATO process guidance