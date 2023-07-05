export type FileModel = {
    id: number;

    uid: string;

    name: string;

    uploadUserId: number;

    userName?: string;

    requirementName?: string;

    creationDate: Date;

    size: number;
}