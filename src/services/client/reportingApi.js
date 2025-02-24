import { delay } from '../apiHelpers';
import auditApi from './auditApi';
import riskAssessmentApi from './riskAssessmentApi';
import securityAssessmentsApi from './securityAssessmentsApi';

const reportingApi = {
  // Get executive dashboard data
  getExecutiveDashboard: async (clientId) => {
    await delay(600);
    const [
      findings,
      risks,
      assessments,
      findingMetrics,
      riskStats
    ] = await Promise.all([
      auditApi.getFindings(clientId),
      riskAssessmentApi.getRisks(clientId),
      securityAssessmentsApi.getAssessments(clientId),
      auditApi.getFindingMetrics(clientId),
      riskAssessmentApi.getRiskStats(clientId)
    ]);

    // Calculate assessment statistics
    const assessmentStats = calculateAssessmentStats(assessments);

    // Calculate overall security score
    const weights = {
      assessmentScore: 0.3,
      findingScore: 0.4,
      riskScore: 0.3
    };

    const assessmentScore = assessmentStats.averageScore;
    const findingScore = calculateFindingScore(findingMetrics);
    const riskScore = calculateRiskScore(riskStats);

    const overallScore = Math.round(
      (assessmentScore * weights.assessmentScore) +
      (findingScore * weights.findingScore) +
      (riskScore * weights.riskScore)
    );

    // Ensure trends data exists with defaults
    const findingTrends = findingMetrics.trends || {
      newFindings: { last30Days: 0, last90Days: 0 },
      closedFindings: { last30Days: 0, last90Days: 0 }
    };

    const riskTrends = riskStats.trends || {
      new: { last30Days: 0, last90Days: 0 },
      mitigated: { last30Days: 0, last90Days: 0 }
    };

    return {
      overallScore,
      summary: {
        assessments: {
          total: assessmentStats.total,
          averageScore: assessmentStats.averageScore,
          lastAssessment: assessmentStats.lastAssessment,
          trend: assessmentStats.scoreHistory
        },
        findings: {
          total: findingMetrics.total,
          open: findingMetrics.byStatus.open,
          critical: findingMetrics.bySeverity.critical + findingMetrics.bySeverity.high,
          trend: findingTrends
        },
        risks: {
          total: riskStats.total,
          active: riskStats.byStatus.active,
          critical: riskStats.byImpact.high,
          trend: riskTrends
        }
      },
      compliance: {
        accessControl: calculateControlCoverage(findings, risks, assessments, 'Access Control'),
        dataProtection: calculateControlCoverage(findings, risks, assessments, 'Data Protection'),
        vulnerabilityManagement: calculateControlCoverage(findings, risks, assessments, 'Vulnerability Management'),
        incidentResponse: calculateControlCoverage(findings, risks, assessments, 'Incident Response')
      },
      trends: {
        last30Days: {
          newFindings: findingTrends.newFindings.last30Days,
          resolvedFindings: findingTrends.closedFindings.last30Days,
          newRisks: riskTrends.new.last30Days,
          mitigatedRisks: riskTrends.mitigated.last30Days,
          assessmentsCompleted: assessmentStats.completedLast30Days
        },
        last90Days: {
          newFindings: findingTrends.newFindings.last90Days,
          resolvedFindings: findingTrends.closedFindings.last90Days,
          newRisks: riskTrends.new.last90Days,
          mitigatedRisks: riskTrends.mitigated.last90Days
        }
      },
      topRisks: risks
        .filter(r => r.status === 'active')
        .sort((a, b) => calculateRiskPriority(b) - calculateRiskPriority(a))
        .slice(0, 5),
      recentActivity: generateRecentActivity(findings, risks, assessments)
    };
  },

  // Get compliance report
  getComplianceReport: async (clientId, framework = 'general') => {
    await delay(600);
    const [findings, risks, assessments] = await Promise.all([
      auditApi.getFindings(clientId),
      riskAssessmentApi.getRisks(clientId),
      securityAssessmentsApi.getAssessments(clientId)
    ]);

    const controls = {
      'Access Control': {
        findings: findings.filter(f => mapCategoryToControl(f.category) === 'Access Control'),
        risks: risks.filter(r => r.category === 'Access Control'),
        assessments: getAssessmentsByCategory(assessments, 'Access Control')
      },
      'Data Protection': {
        findings: findings.filter(f => mapCategoryToControl(f.category) === 'Data Protection'),
        risks: risks.filter(r => r.category === 'Data Protection'),
        assessments: getAssessmentsByCategory(assessments, 'Data Protection')
      },
      'Vulnerability Management': {
        findings: findings.filter(f => mapCategoryToControl(f.category) === 'Vulnerability Management'),
        risks: risks.filter(r => r.category === 'Vulnerability Management'),
        assessments: getAssessmentsByCategory(assessments, 'Vulnerability Management')
      },
      'Incident Response': {
        findings: findings.filter(f => mapCategoryToControl(f.category) === 'Incident Response'),
        risks: risks.filter(r => r.category === 'Incident Response'),
        assessments: getAssessmentsByCategory(assessments, 'Incident Response')
      }
    };

    return {
      framework,
      controls: Object.entries(controls).map(([category, data]) => ({
        category,
        status: calculateControlStatus(data),
        findings: data.findings.length,
        risks: data.risks.length,
        score: calculateControlScore(data),
        gaps: identifyControlGaps(data),
        recommendations: generateControlRecommendations(data)
      }))
    };
  },

  // Get trend analysis
  getTrendAnalysis: async (clientId, period = 90) => {
    await delay(600);
    const [findings, risks, assessments] = await Promise.all([
      auditApi.getFindings(clientId),
      riskAssessmentApi.getRisks(clientId),
      securityAssessmentsApi.getAssessments(clientId)
    ]);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const timelineData = generateTimeline(findings, risks, assessments, startDate);
    const trends = analyzeTrends(timelineData);

    return {
      period,
      timeline: timelineData,
      trends,
      projections: generateProjections(trends)
    };
  }
};

// Helper functions
const calculateAssessmentStats = (assessments) => {
  if (!Array.isArray(assessments)) {
    return {
      total: 0,
      averageScore: 0,
      lastAssessment: null,
      scoreHistory: [],
      completedLast30Days: 0
    };
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedAssessments = assessments.filter(a => a.status === 'completed');
  const sortedAssessments = [...assessments].sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    total: assessments.length,
    averageScore: calculateAverageScore(completedAssessments),
    lastAssessment: sortedAssessments[0] || null,
    scoreHistory: sortedAssessments.map(a => ({
      date: a.date,
      score: a.score || 0,
      type: a.type,
      findings: (a.generatedFindings || []).length
    })),
    completedLast30Days: completedAssessments.filter(
      a => new Date(a.date) >= thirtyDaysAgo
    ).length
  };
};

const calculateFindingScore = (metrics) => {
  const totalFindings = metrics.total;
  if (totalFindings === 0) return 100;

  const weights = {
    critical: 1,
    high: 0.8,
    medium: 0.5,
    low: 0.2
  };

  const weightedOpen = 
    (metrics.bySeverity.critical * weights.critical) +
    (metrics.bySeverity.high * weights.high) +
    (metrics.bySeverity.medium * weights.medium) +
    (metrics.bySeverity.low * weights.low);

  return Math.round(100 - (weightedOpen / totalFindings) * 100);
};

const calculateRiskScore = (stats) => {
  const totalRisks = stats.total;
  if (totalRisks === 0) return 100;

  const weights = {
    high: 1,
    medium: 0.6,
    low: 0.3
  };

  const weightedRisks = 
    (stats.byImpact.high * weights.high) +
    (stats.byImpact.medium * weights.medium) +
    (stats.byImpact.low * weights.low);

  return Math.round(100 - (weightedRisks / totalRisks) * 100);
};

const mapCategoryToControl = (category) => {
  const categoryMap = {
    'System Security': 'Vulnerability Management',
    'Data Protection': 'Data Protection',
    'Access Control': 'Access Control',
    'Audit and Accountability': 'Access Control',
    'Configuration Management': 'Vulnerability Management',
    'System and Information Integrity': 'Vulnerability Management',
    'Incident Response': 'Incident Response'
  };
  return categoryMap[category] || category;
};

const calculateControlCoverage = (findings, risks, assessments, category) => {
  const relevantFindings = findings.filter(f => 
    mapCategoryToControl(f.category) === category
  );
  const relevantRisks = risks.filter(r => r.category === category);
  const relevantAssessments = getAssessmentsByCategory(assessments, category);

  const coverage = {
    findings: {
      total: relevantFindings.length,
      open: relevantFindings.filter(f => f.status === 'open').length,
      inProgress: relevantFindings.filter(f => f.status === 'in_progress').length,
      closed: relevantFindings.filter(f => f.status === 'closed').length
    },
    risks: {
      total: relevantRisks.length,
      active: relevantRisks.filter(r => r.status === 'active').length,
      mitigated: relevantRisks.filter(r => r.status === 'mitigated').length
    },
    assessments: {
      total: relevantAssessments.length,
      averageScore: calculateAverageScore(relevantAssessments)
    }
  };

  return {
    ...coverage,
    score: calculateCoverageScore(coverage)
  };
};

const calculateRiskPriority = (risk) => {
  const impactWeights = { high: 3, medium: 2, low: 1 };
  const likelihoodWeights = { high: 3, medium: 2, low: 1 };
  return impactWeights[risk.impact] * likelihoodWeights[risk.likelihood];
};

const getAssessmentsByCategory = (assessments, category) => {
  return (assessments || []).filter(a => {
    if (!a.answers) return false;

    if (a.type === 'advanced') {
      // For advanced assessments, check specific sections
      switch (category) {
        case 'Access Control':
          return a.answers.ac1 || a.answers.ac2 || a.answers.ac3;
        case 'Data Protection':
          return a.answers.dp1 || a.answers.dp2 || a.answers.dp3;
        case 'Incident Response':
          return a.answers.ir1 || a.answers.ir2 || a.answers.ir3;
        default:
          return false;
      }
    } else {
      // For basic assessments, map question numbers to categories
      const categoryQuestions = {
        'Access Control': [3, 4, 11],
        'Data Protection': [7, 8],
        'Incident Response': [9, 10],
      };
      
      const relevantQuestions = categoryQuestions[category] || [];
      return relevantQuestions.some(q => a.answers[q] === 'yes');
    }
  });
};

const calculateAverageScore = (assessments) => {
  if (!Array.isArray(assessments) || assessments.length === 0) return 0;
  return Math.round(
    assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length
  );
};

const calculateCoverageScore = (coverage) => {
  const weights = {
    findings: 0.4,
    risks: 0.3,
    assessments: 0.3
  };

  const findingScore = coverage.findings.total === 0 ? 100 :
    Math.round((coverage.findings.closed / coverage.findings.total) * 100);

  const riskScore = coverage.risks.total === 0 ? 100 :
    Math.round((coverage.risks.mitigated / coverage.risks.total) * 100);

  const assessmentScore = coverage.assessments.averageScore;

  return Math.round(
    (findingScore * weights.findings) +
    (riskScore * weights.risks) +
    (assessmentScore * weights.assessments)
  );
};

const calculateControlStatus = (data) => {
  const score = calculateControlScore(data);
  if (score >= 80) return 'effective';
  if (score >= 60) return 'needs_improvement';
  return 'ineffective';
};

const calculateControlScore = (data) => {
  const weights = {
    findings: 0.4,
    risks: 0.3,
    assessments: 0.3
  };

  const findingScore = data.findings.length === 0 ? 100 :
    100 - (data.findings.filter(f => f.status === 'open').length / data.findings.length * 100);

  const riskScore = data.risks.length === 0 ? 100 :
    100 - (data.risks.filter(r => r.status === 'active').length / data.risks.length * 100);

  const assessmentScore = data.assessments.length === 0 ? 0 :
    data.assessments.reduce((sum, a) => sum + (a.score || 0), 0) / data.assessments.length;

  return Math.round(
    (findingScore * weights.findings) +
    (riskScore * weights.risks) +
    (assessmentScore * weights.assessments)
  );
};

const identifyControlGaps = (data) => {
  const gaps = [];

  // Check for critical findings
  const criticalFindings = data.findings.filter(f => 
    f.status === 'open' && (f.severity === 'critical' || f.severity === 'high')
  );
  if (criticalFindings.length > 0) {
    gaps.push({
      type: 'critical_findings',
      count: criticalFindings.length,
      description: 'Open critical/high findings require immediate attention'
    });
  }

  // Check for active high-impact risks
  const highRisks = data.risks.filter(r => 
    r.status === 'active' && r.impact === 'high'
  );
  if (highRisks.length > 0) {
    gaps.push({
      type: 'high_risks',
      count: highRisks.length,
      description: 'Active high-impact risks need mitigation'
    });
  }

  // Check assessment scores
  const lowScoreAssessments = data.assessments.filter(a => 
    (a.score || 0) < 70
  );
  if (lowScoreAssessments.length > 0) {
    gaps.push({
      type: 'low_scores',
      count: lowScoreAssessments.length,
      description: 'Assessments indicate control weaknesses'
    });
  }

  return gaps;
};

const generateControlRecommendations = (data) => {
  const recommendations = [];

  // Analyze findings
  const openFindings = data.findings.filter(f => f.status === 'open');
  if (openFindings.length > 0) {
    const criticalCount = openFindings.filter(f => 
      f.severity === 'critical' || f.severity === 'high'
    ).length;
    
    if (criticalCount > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Address critical findings',
        description: `Remediate ${criticalCount} critical/high findings`
      });
    }
  }

  // Analyze risks
  const activeRisks = data.risks.filter(r => r.status === 'active');
  if (activeRisks.length > 0) {
    const highRiskCount = activeRisks.filter(r => r.impact === 'high').length;
    
    if (highRiskCount > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Mitigate high-impact risks',
        description: `Implement controls for ${highRiskCount} high-impact risks`
      });
    }
  }

  // Analyze assessments
  const recentAssessments = data.assessments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const averageScore = calculateAverageScore(recentAssessments);
  if (averageScore < 70) {
    recommendations.push({
      priority: 'medium',
      action: 'Improve control effectiveness',
      description: 'Recent assessments indicate need for control improvements'
    });
  }

  return recommendations;
};

const generateTimeline = (findings, risks, assessments, startDate) => {
  const timeline = [];
  const endDate = new Date();

  // Generate daily data points
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    
    const dayFindings = findings.filter(f => 
      f.createdDate.split('T')[0] === date
    );
    
    const dayRisks = risks.filter(r => 
      r.lastAssessed.split('T')[0] === date
    );
    
    const dayAssessments = assessments.filter(a => 
      a.date.split('T')[0] === date
    );

    if (dayFindings.length > 0 || dayRisks.length > 0 || dayAssessments.length > 0) {
      timeline.push({
        date,
        findings: {
          new: dayFindings.length,
          closed: dayFindings.filter(f => f.status === 'closed').length
        },
        risks: {
          new: dayRisks.length,
          mitigated: dayRisks.filter(r => r.status === 'mitigated').length
        },
        assessments: {
          completed: dayAssessments.filter(a => a.status === 'completed').length,
          averageScore: calculateAverageScore(dayAssessments)
        }
      });
    }
  }

  return timeline;
};

const analyzeTrends = (timeline) => {
  const findingsTrend = calculateTrendLine(timeline.map(t => ({
    x: new Date(t.date).getTime(),
    y: t.findings.new - t.findings.closed
  })));

  const risksTrend = calculateTrendLine(timeline.map(t => ({
    x: new Date(t.date).getTime(),
    y: t.risks.new - t.risks.mitigated
  })));

  const assessmentsTrend = calculateTrendLine(timeline.map(t => ({
    x: new Date(t.date).getTime(),
    y: t.assessments.averageScore
  })));

  return {
    findings: findingsTrend,
    risks: risksTrend,
    assessments: assessmentsTrend
  };
};

const calculateTrendLine = (points) => {
  if (points.length < 2) return { slope: 0, direction: 'stable' };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  points.forEach(point => {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  });

  const n = points.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  return {
    slope,
    direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable'
  };
};

const generateProjections = (trends) => {
  return {
    findings: {
      direction: trends.findings.direction,
      impact: trends.findings.slope > 0.5 ? 'high' : 
        trends.findings.slope > 0.2 ? 'medium' : 'low'
    },
    risks: {
      direction: trends.risks.direction,
      impact: trends.risks.slope > 0.5 ? 'high' : 
        trends.risks.slope > 0.2 ? 'medium' : 'low'
    },
    assessments: {
      direction: trends.assessments.direction,
      impact: Math.abs(trends.assessments.slope) > 5 ? 'high' : 
        Math.abs(trends.assessments.slope) > 2 ? 'medium' : 'low'
    }
  };
};

const generateRecentActivity = (findings, risks, assessments) => {
  if (!Array.isArray(findings)) findings = [];
  if (!Array.isArray(risks)) risks = [];
  if (!Array.isArray(assessments)) assessments = [];

  const activities = [
    ...findings.map(f => ({
      type: 'finding',
      date: f.createdDate,
      title: f.title,
      severity: f.severity,
      status: f.status
    })),
    ...risks.map(r => ({
      type: 'risk',
      date: r.lastAssessed,
      title: r.name,
      severity: r.impact,
      status: r.status
    })),
    ...assessments.map(a => ({
      type: 'assessment',
      date: a.date,
      title: a.name,
      score: a.score,
      status: a.status
    }))
  ];

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
};

export default reportingApi;