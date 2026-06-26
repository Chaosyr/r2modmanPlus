import { Platform } from '../schema/ThunderstoreSchema';

export default class StorePlatformMetadata {

    private readonly _storePlatform: Platform;
    private readonly _storeIdentifier: string | undefined;
    private readonly _storeArchitecture: string | undefined;

    constructor(storePlatform: Platform, storeIdentifier?: string, storeArchitecture?: string) {
        this._storePlatform = storePlatform;
        this._storeIdentifier = storeIdentifier;
        this._storeArchitecture = storeArchitecture;
    }

    get storePlatform(): Platform {
        return this._storePlatform;
    }

    get storeIdentifier(): string | undefined {
        return this._storeIdentifier;
    }

    get storeArchitecture(): string | undefined {
        return this._storeArchitecture;
    }
}
