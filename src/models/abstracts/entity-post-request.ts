import { EntityPutRequest } from './entity-put-request';

export interface EntityPostRequest extends EntityPutRequest {
    updatedProperties: string[];
}