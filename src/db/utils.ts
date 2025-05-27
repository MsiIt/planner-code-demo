export class ModelRepository {
  realm: Realm

  constructor(realm: Realm) {
    this.realm = realm
  }
}

export const timestamp = () => new Date().toISOString()
export const timestampField = { type: 'string', default: timestamp }
