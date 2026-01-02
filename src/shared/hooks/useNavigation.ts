import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();

  const navigateToMember = useCallback(
    (accountUuid: string, options?: NavigateOptions) => {
      navigate(`/member/${accountUuid}`, options);
    },
    [navigate]
  );

  const navigateToOrganization = useCallback(
    (organizationId: number | string, options?: NavigateOptions) => {
      navigate(`/organization/${organizationId}`, options);
    },
    [navigate]
  );

  const onMemberClick = useCallback(
    (accountUuid: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/member/${accountUuid}`);
    },
    [navigate]
  );

  const onOrganizationClick = useCallback(
    (organizationId: number | string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/organization/${organizationId}`);
    },
    [navigate]
  );

  return {
    navigateToMember,
    navigateToOrganization,
    onMemberClick,
    onOrganizationClick,
  };
}