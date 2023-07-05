import { EntityModel } from '../abstracts/entity-model';

export interface NotificationModel extends EntityModel {
    recipientUserId: number;

    message: string;

    isRead: boolean;

    creationDate: Date;

    requirementId: number | null;

    isDeleted: boolean;
}
