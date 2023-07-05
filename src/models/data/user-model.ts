import { EntityModel } from '../abstracts/entity-model';

export interface UserModel extends EntityModel {
    name: string;

    email: string;

    password: string;
}
