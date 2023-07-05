import { EntityTypeInfo } from './entity-type-info';

export interface EntityPutRequest extends EntityTypeInfo {
    json?: string;
}