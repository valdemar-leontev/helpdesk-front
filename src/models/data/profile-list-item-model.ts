import { ProfileModel } from './profile-model';
import { EntityModel } from '../abstracts/entity-model';

export interface ProfileListItemModel extends ProfileModel {
    positionName: string | null;

    subdivisionName: string | null;

    hasProfile: boolean;

    isHead: boolean;
}

export interface MinimalProfileModel extends EntityModel {
    firstName: string;

    lastName: string;

    subdivisionName: string | null;
}