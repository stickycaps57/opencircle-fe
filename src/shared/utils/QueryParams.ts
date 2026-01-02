export interface UserQueryParams {
  page?: number;
  per_page?: number;
  uid: string;
}

export interface ContentCommentQueryParams {
  postId?: number;
  eventId?: number;
  limit?: number;
  offset?: number;
}
