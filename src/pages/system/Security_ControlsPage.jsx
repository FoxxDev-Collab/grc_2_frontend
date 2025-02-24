import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Security_ControlsPage = () => {
  const navigate = useNavigate();
  const { clientId, systemId } = useParams();

  useEffect(() => {
    // Redirect to the Overview page
    navigate(`/client/${clientId}/systems/${systemId}/security-controls/overview`);
  }, [navigate, clientId, systemId]);

  return null;
};

export default Security_ControlsPage;