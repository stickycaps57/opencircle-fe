export interface CommentProfilePicture {
  id: number;
  directory: string;
  filename: string;
}

export interface CommentAccount {
  id: number;
  uuid: string;
  email: string;
}

export interface CommentUser {
  first_name: string;
  last_name: string;
  bio?: string;
  profile_picture: CommentProfilePicture;
}

export interface CommentOrganization {
  name: string;
  category: string;
  logo: CommentProfilePicture;
}

export interface ContentComment {
  comment_id: number;
  message: string;
  created_date: string;
  account: CommentAccount;
  role: "member" | "organization";
  user?: CommentUser;
  organization?: CommentOrganization;
}

export interface DefaultComment {
  id: number;
  author: number;
  message: string;
  created_date: string;
  last_modified_date: string;
  account_uuid: string;
  account_email: string;
  role: string;
  user_first_name: string;
  user_last_name: string;
  user_bio: string;
  profile_picture: CommentProfilePicture;
  logo: CommentProfilePicture;
  organization_logo: CommentProfilePicture;
  organization_name: string;
  organization_description: string;
}

export interface CommentsSectionProps {
  comments?: ContentComment[];
  totalComments?: number;
  currentUserAvatar?: string;
  onViewMoreComments?: () => void;
  onViewParticipants?: () => void;
  contentId: number;
  contentType: "post" | "event";
  participantsCount?: number;
  participantPendingCount?: number;
  sharesCount?: number;
}

// Interface for the response from posting a comment
export interface PostCommentResponse {
  id: string;
  content: string;
  post_id: number;
  author: string;
  avatar: string;
  timestamp: string;
  // Add other fields as needed based on your API response
}

// Interface for the paginated comments response
export interface CommentsResponse {
  total: number;
  limit: number;
  offset: number;
  comments: DefaultComment[];
}

// Interface for the infinite query response structure
export interface InfiniteCommentsResponse {
  pages: CommentsResponse[];
  pageParams: number[];
}

// Interface for the response from deleting a comment
export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}

// Interface for the response from editing a comment
export interface EditCommentResponse {
  success: boolean;
  message: string;
  comment: ContentComment;
}
