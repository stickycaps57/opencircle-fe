import axiosInstance from "@src/shared/api/axios";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type { PostFormData } from "../schema/post.schema";
import type { PostData, MemberPostsResponse, AllMemberPostsResponse } from "../schema/post.types";
import type { UserQueryParams } from "@src/shared/utils/QueryParams";

// Interface for the response from creating or updating a post
export interface PostResponse {
  id: string;
  description: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  // Add other fields as needed based on your API response
}

export type CreatePostResponse = PostResponse;
export type EditPostResponse = PostResponse;

export const createPost = async (
  postData: PostFormData
): Promise<CreatePostResponse> => {
  try {
    const formData = objectToFormData(postData, ["images"]);

    const response = await axiosInstance.post<CreatePostResponse>(
      "/post",
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Post creation failed:", error);
    throw error;
  }
};

export const updatePost = async (
  postId: number,
  postData: PostFormData
): Promise<EditPostResponse> => {
  try {
    const formData = objectToFormData(postData, ["images"]);

    const response = await axiosInstance.put<EditPostResponse>(
      `/post/${postId}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Post update failed:", error);
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/post/${postId}`);
  } catch (error) {
    console.error("Post deletion failed:", error);
    throw error;
  }
};

export const getPostById = async (postId: number): Promise<PostData> => {
  try {
    const response = await axiosInstance.get<PostData>(
      `/post/single/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch post with ID ${postId}:`, error);
    throw error;
  }
};

export const getMemberPostsWithComments = async (
  params?: UserQueryParams
): Promise<MemberPostsResponse> => {
  try {
    const response = await axiosInstance.get<MemberPostsResponse>(
      `/post/${params?.uid}/with_comments`,
      {
        params: {
          page: params?.page,
          page_size: params?.per_page,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch member posts:", error);
    throw error;
  }
};

// Fetches all member posts with pagination
export const getAllMemberPosts = async (
  page: number = 1,
  pageSize: number = 5
): Promise<AllMemberPostsResponse> => {
  try {
    const response = await axiosInstance.get<AllMemberPostsResponse>(
      "/post/all",
      {
        params: {
          page,
          page_size: pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch all member posts:", error);
    throw error;
  }
};
