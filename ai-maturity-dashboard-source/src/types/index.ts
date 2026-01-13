export interface Division {
    id: string;
    name: string;
    type: 'COMPANY' | 'DIVISION';
    children?: Division[];
}

export const ORGANIZATION_DATA: Division = {
    id: 'amdocs',
    name: 'Amdocs',
    type: 'COMPANY',
    children: [
        { id: 'tech', name: 'Technology Division', type: 'DIVISION' },
        { id: 'business', name: 'Business Division', type: 'DIVISION' },
        { id: 'ops', name: 'Operations Division', type: 'DIVISION' },
    ]
};
