import { EntityModel } from '../abstracts/entity-model';

export interface ProfileModel extends EntityModel {
  userName: string;

  firstName: string;

  lastName: string;

  email: string;

  subdivisionId: number | null;

  positionId: number | null;

  userId: number;
}
