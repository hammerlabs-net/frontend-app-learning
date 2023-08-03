import { getConfig, getAuthenticatedHttpClient, getAuthenticatedUser } from '../../../../data/api';

export const getBookmarksBaseUrl = () => `${getConfig().LMS_BASE_URL}/api/bookmarks/v1/bookmarks/`;

export async function createBookmark(usageId) {
  return getAuthenticatedHttpClient().post(getBookmarksBaseUrl(), { usage_id: usageId });
}

export async function deleteBookmark(usageId) {
  const { username } = getAuthenticatedUser();
  return getAuthenticatedHttpClient().delete(`${getBookmarksBaseUrl()}${username},${usageId}/`);
}
