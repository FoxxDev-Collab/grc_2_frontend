// src/services/api/report/ReportGenerationApi.js
import { BaseApiService, delay } from '../BaseApiService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class ReportGenerationApi extends BaseApiService {
  constructor() {
    // Using the same pattern as other APIs
    super('/reports', 'reports');
  }

  async generateExecutiveReport(data) {
    await delay(1000); // Simulate processing time

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.text('Executive Security Report', pageWidth / 2, 20, { align: 'center' });
    
    // Client Info
    doc.setFontSize(12);
    doc.text(`Client: ${data.client.name}`, 20, 40);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
    
    // Overall Score
    doc.setFontSize(16);
    doc.text('Overall Security Score', pageWidth / 2, 70, { align: 'center' });
    doc.setFontSize(24);
    doc.text(`${data.overallScore}%`, pageWidth / 2, 85, { align: 'center' });
    
    // Summary Section
    doc.setFontSize(14);
    doc.text('Security Summary', 20, 105);
    doc.setFontSize(10);
    doc.autoTable({
      startY: 110,
      head: [['Category', 'Metric', 'Value']],
      body: [
        ['Assessments', 'Average Score', `${data.summary.assessments.averageScore}%`],
        ['', 'Total Assessments', data.summary.assessments.total],
        ['Findings', 'Open Findings', data.summary.findings.open],
        ['', 'Critical Findings', data.summary.findings.critical],
        ['', 'Total Findings', data.summary.findings.total],
        ['Risks', 'Active Risks', data.summary.risks.active],
        ['', 'High Impact Risks', data.summary.risks.critical],
        ['', 'Total Risks', data.summary.risks.total]
      ]
    });

    // Systems Overview
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Systems Overview', 20, 20);
    doc.setFontSize(10);
    
    const systemsData = data.systems.map(system => [
      system.name,
      system.type,
      system.category,
      system.securityLevel,
      `${system.compliance.nist || 0}%`
    ]);

    doc.autoTable({
      startY: 30,
      head: [['System Name', 'Type', 'Category', 'Security Level', 'NIST Compliance']],
      body: systemsData
    });

    // Risk Analysis
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Risk Analysis', 20, 20);
    doc.setFontSize(10);

    const riskData = data.risks.map(risk => [
      risk.name,
      risk.category,
      risk.impact,
      risk.likelihood,
      risk.status
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Risk Name', 'Category', 'Impact', 'Likelihood', 'Status']],
      body: riskData
    });

    // Recent Activity
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Recent Activity', 20, 20);
    doc.setFontSize(10);

    const activityData = data.recentActivity.map(activity => [
      activity.type,
      activity.title,
      new Date(activity.date).toLocaleDateString(),
      activity.status
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Type', 'Title', 'Date', 'Status']],
      body: activityData
    });

    // Recommendations
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Recommendations', 20, 20);
    doc.setFontSize(10);

    // Generate recommendations based on data
    const recommendations = [
      data.summary.findings.critical > 0 && {
        priority: 'High',
        area: 'Security Findings',
        recommendation: `Address ${data.summary.findings.critical} critical security findings`
      },
      data.summary.risks.active > 0 && {
        priority: 'High',
        area: 'Risk Management',
        recommendation: `Mitigate ${data.summary.risks.active} active security risks`
      },
      data.summary.assessments.averageScore < 80 && {
        priority: 'Medium',
        area: 'Security Assessments',
        recommendation: 'Improve security assessment scores through remediation efforts'
      }
    ].filter(Boolean);

    doc.autoTable({
      startY: 30,
      head: [['Priority', 'Area', 'Recommendation']],
      body: recommendations.map(r => [r.priority, r.area, r.recommendation])
    });

    return doc;
  }
}

export default new ReportGenerationApi();