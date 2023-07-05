import { EntityTypeInfo } from './entity-type-info';

export interface EntityGetRequest extends EntityTypeInfo {
    includes?: string | null;

    filter?: string | null;
}
