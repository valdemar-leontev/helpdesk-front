import { useAuthHttpRequest } from './use-auth-http-request';
import { useCallback, useMemo } from 'react';
import { NotificationModel } from '../../models/data/notification-model';
import { NotificationListDeletedModes } from '../../models/enums/notification-list-deleted-modes';

export type AppDataContextNotificationEndpointsModel = {
  getUserNotificationsAsync: () => Promise<NotificationModel[] | null>;

  postNotificationAsync: (notificationId: number) => Promise<NotificationModel | null>;

  getNotificationCountAsync: () => Promise<number>;

  deleteNotificationListAsync: (mode: NotificationListDeletedModes) => Promise<NotificationModel[] | null>;
}

export const useNotificationData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/notifications';
  }, []);

  const getUserNotificationsAsync = useCallback(async (suppressLoader: boolean = true) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/list`,
    }, suppressLoader);

    return response ? response.data as NotificationModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const postNotificationAsync = useCallback(async (notificationId: number) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/${notificationId}`,
    });

    return response ? response.data as NotificationModel : null;
  }, [authHttpRequest, baseRoute]);

  const getNotificationCountAsync = useCallback(async (suppressLoader: boolean = true) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/count`,
    }, suppressLoader);

    return response ? response.data as number : 0;
  }, [authHttpRequest, baseRoute]);

  const deleteNotificationListAsync = useCallback(async (mode: NotificationListDeletedModes) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}?mode=${mode}`,
    });

    return response ? response.data as NotificationModel[] : null;
  }, [authHttpRequest, baseRoute]);

  return {
    getUserNotificationsAsync,
    postNotificationAsync,
    getNotificationCountAsync,
    deleteNotificationListAsync
  };
};