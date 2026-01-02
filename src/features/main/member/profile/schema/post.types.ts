import type { ContentComment } from "@src/features/comments/schema/comment.types";

// Type definition for image data
export type PostImage = {
  id: number;
  directory: string;
  filename: string;
  image?: string;
};

// Type definition for user profile picture
export type ProfilePicture = {
  id: number;
  directory: string;
  filename: string;
};

// Type definition for post author
export type Author = {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  organization_name: string;
  profile_picture: ProfilePicture | null;
  logo: ProfilePicture | null;
};

// Type definition for comment account
export type CommentAccount = {
  id: number;
  uuid: string;
  email: string;
};

// Type definition for comment user
export type CommentUser = {
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  profile_picture: ProfilePicture | null;
};

// Type definition for latest comment
export type LatestComment = {
  comment_id: number;
  message: string;
  created_date: string;
  account: CommentAccount;
  user: CommentUser;
};

// Comment type is now imported from @src/features/comments/schema/comment.types

export interface PostData {
  id: number;
  author: Author;
  images: PostImage[];
  description: string;
  created_date: string;
  last_modified_date: string;
  total_comments: number;
  comments: ContentComment[];
}

// Interface for all member posts data
export interface AllMemberPostData {
  id: number;
  author_id: number;
  author_uuid: string;
  author_email: string;
  author_first_name: string;
  author_last_name: string;
  author_bio: string;
  author_profile_picture: ProfilePicture | null;
  author_logo: ProfilePicture | null;
  author_organization_name: string;
  author_organization_id: number;
  images: PostImage[];
  description: string;
  created_date: string;
  user_membership_status_with_organizer: string;
  user_rsvp: string;
  latest_comments: ContentComment[];
  total_comments: number;
  logo: ProfilePicture | null;
  profile_picture: ProfilePicture | null;
}

// Type definition for paginated member posts response
export type MemberPostsResponse = {
  page: number;
  page_size: number;
  posts: PostData[];
  total: number;
};

// Type definition for paginated all member posts response
export type AllMemberPostsResponse = {
  page: number;
  page_size: number;
  posts: AllMemberPostData[];
  total: number;
};

// Generic type definition for paginated posts response (deprecated - use MemberPostsResponse or AllMemberPostsResponse instead)
export type PostsResponse = {
  page: number;
  page_size: number;
  posts: PostData[] | AllMemberPostData[];
  total: number;
};

// Interface for the infinite query response structure
export interface InfinitePostsResponse<T = PostData> {
  pages: (T extends PostData ? MemberPostsResponse : AllMemberPostsResponse)[];
  pageParams: number[];
}
