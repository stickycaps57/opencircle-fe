import OrganizationProfileInterface from "@src/features/main/organization/profile/ui/OrganizationProfileInterface";
import { useParams } from "react-router-dom";

export default function OrganizationProfile() {
  // Get organizationId from URL parameters
  const { organizationId } = useParams<{ organizationId?: string }>();
  
  // Pass organizationId to the interface component
  return <OrganizationProfileInterface organizationId={organizationId} />;
}