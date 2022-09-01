/* eslint-disable camelcase */
import { OrgUnit } from '../../../orgUnits/types/orgUnit';

type FileContent = {
    name?: string;
    age_type: '0' | '1';
    birth_date?: string;
    age?: string;
    program?: string;
    gender?: string;
    vaccination_number?: string;
    end?: string;
};

type Attributes = {
    name: string;
    file_content: FileContent;
    latitude: number;
    longitude: number;
    org_unit: OrgUnit;
};

export type Beneficiary = {
    id: number;
    uuid: string;
    name: string;
    created_at: number;
    updated_at: number;
    attributes: Attributes;
    entity_type: number;
    entity_type_name: string;
    submitter: string;
    instances: Record<string, any>[];
};
