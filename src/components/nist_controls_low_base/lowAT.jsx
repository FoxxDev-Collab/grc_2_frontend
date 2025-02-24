import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const lowATControls = [
  {
    identifier: 'AT-1',
    name: 'Policy and Procedures',
    controlText: `a. Develop, document, and disseminate to [Assignment: organization-defined personnel or roles]:

1. [Selection (one or more): Organization-level; Mission/business process-level; System-level] awareness and training policy that:

(a) Addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and
(b) Is consistent with applicable laws, executive orders, directives, regulations, policies, standards, and guidelines; and

2. Procedures to facilitate the implementation of the awareness and training policy and the associated awareness and training controls;

b. Designate an [Assignment: organization-defined official] to manage the development, documentation, and dissemination of the awareness and training policy and procedures; and

c. Review and update the current awareness and training:

1. Policy [Assignment: organization-defined frequency] and following [Assignment: organization-defined events]; and
2. Procedures [Assignment: organization-defined frequency] and following [Assignment: organization-defined events].`,
    discussion: `Awareness and training policy and procedures address the controls in the AT family that are implemented within systems and organizations. The risk management strategy is an important factor in establishing such policies and procedures. Policies and procedures contribute to security and privacy assurance. Therefore, it is important that security and privacy programs collaborate on the development of awareness and training policy and procedures.`
  },
  {
    identifier: 'AT-2',
    name: 'Literacy Training and Awareness',
    controlText: `a. Provide security and privacy literacy training to system users (including managers, senior executives, and contractors):

1. As part of initial training for new users and [Assignment: organization-defined frequency] thereafter; and
2. When required by system changes or following [Assignment: organization-defined events];

b. Employ the following techniques to increase the security and privacy awareness of system users [Assignment: organization-defined awareness techniques];

c. Update literacy training and awareness content [Assignment: organization-defined frequency] and following [Assignment: organization-defined events]; and

d. Incorporate lessons learned from internal or external security incidents or breaches into literacy training and awareness techniques.`,
    discussion: `Organizations provide basic and advanced levels of literacy training to system users, including measures to test the knowledge level of users. Organizations determine the content of literacy training and awareness based on specific organizational requirements, the systems to which personnel have authorized access, and work environments.`
  },
  {
    identifier: 'AT-2(2)',
    name: 'Literacy Training and Awareness | Insider Threat',
    controlText: `Provide literacy training on recognizing and reporting potential indicators of insider threat.`,
    discussion: `Potential indicators and possible precursors of insider threat can include behaviors such as inordinate, long-term job dissatisfaction; attempts to gain access to information not required for job performance; unexplained access to financial resources; bullying or harassment of fellow employees; workplace violence; and other serious violations of policies, procedures, directives, regulations, rules, or practices.`
  },
  {
    identifier: 'AT-3',
    name: 'Role-based Training',
    controlText: `a. Provide role-based security and privacy training to personnel with the following roles and responsibilities: [Assignment: organization-defined roles and responsibilities]:

1. Before authorizing access to the system, information, or performing assigned duties, and [Assignment: organization-defined frequency] thereafter; and
2. When required by system changes;

b. Update role-based training content [Assignment: organization-defined frequency] and following [Assignment: organization-defined events]; and

c. Incorporate lessons learned from internal or external security incidents or breaches into role-based training.`,
    discussion: `Organizations determine the content of training based on the assigned roles and responsibilities of individuals as well as the security and privacy requirements of organizations and the systems to which personnel have authorized access, including technical training specifically tailored for assigned duties.`
  },
  {
    identifier: 'AT-4',
    name: 'Training Records',
    controlText: `a. Document and monitor information security and privacy training activities, including security and privacy awareness training and specific role-based security and privacy training; and

b. Retain individual training records for [Assignment: organization-defined time period].`,
    discussion: `Documentation for specialized training may be maintained by individual supervisors at the discretion of the organization. The National Archives and Records Administration provides guidance on records retention for federal agencies.`
  }
];

const LowAT = () => {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Awareness and Training (AT) - Low Baseline
        </Typography>
        <Typography variant="body1" paragraph>
          The Awareness and Training family provides controls for ensuring that organizational personnel are adequately trained to carry out their assigned information security-related duties and responsibilities.
        </Typography>
      </Paper>

      {lowATControls.map((control) => (
        <Accordion key={control.identifier} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <strong>{control.identifier}</strong> - {control.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="h6" gutterBottom>
                Control Description
              </Typography>
              <Typography
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  mb: 2,
                }}
              >
                {control.controlText}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Discussion
              </Typography>
              <Typography paragraph>
                {control.discussion}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default LowAT;