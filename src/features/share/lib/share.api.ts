import axiosInstance from "@src/shared/api/axios";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type { SharePostFormData } from "../schema/share.schema";
import type { AllSharesResponse, ShareByContentResponse, ShareCreateResponse, UserSharesResponse } from "../schema/share.types";

export const shareContent = async (
  shareData: SharePostFormData
): Promise<ShareCreateResponse> => {
  const formData = objectToFormData(shareData);
  const response  = await axiosInstance.post<ShareCreateResponse>("/share/", formData);
  return response.data;
};

export const getUserShares = async (
  account_uuid: string,
  page: number,
  limit: number,
  content_type?: number
): Promise<UserSharesResponse> => {
  const response = await axiosInstance.get<UserSharesResponse>("/share/user", {
    params: { account_uuid, page, limit, content_type },
  });
  return response.data;

  
};

export const getAllSharesWithComments = async (
  page: number,
  limit: number,
  content_type?: number
): Promise<AllSharesResponse> => {
  const response = await axiosInstance.get<AllSharesResponse>(
    "/share/all_with_comments",
    {
      params: { page, limit, content_type },
    }
  );
  return response.data;
};

export const getSharesByContent = async (
  content_type: number,
  content_id: number,
  page: number,
  limit: number
): Promise<ShareByContentResponse> => {
  const response = await axiosInstance.get<ShareByContentResponse>(
    `/share/content/${content_type}/${content_id}`,
    { params: { page, limit } }
  );
  return response.data;
};
