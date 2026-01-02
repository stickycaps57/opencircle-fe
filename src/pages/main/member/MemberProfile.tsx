import MemberProfileInterface from "@src/features/main/member/profile/ui/MemberProfileInterface";
import { useParams } from "react-router-dom";

export default function MemberProfile() {
  const { accountUuid } = useParams<{ accountUuid?: string }>();
  return <MemberProfileInterface accountUuid={accountUuid} />;
}
