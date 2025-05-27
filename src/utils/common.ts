export const nextFrame = () =>
  new Promise(resolve => {
    requestAnimationFrame(resolve)
  })

export const sleep = (timeout = 0) =>
  new Promise(resolve => setTimeout(resolve, timeout))

type UuidInput = ConstructorParameters<typeof Realm.BSON.UUID>[0]
export const uuidStr = (input?: UuidInput) =>
  new Realm.BSON.UUID(input).toHexString()
export const uuid = (input?: UuidInput) => new Realm.BSON.UUID(input)
