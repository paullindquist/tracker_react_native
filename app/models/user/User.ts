import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const UserModel = types
  .model("User")
  .props({
    id: types.number,
    name: types.string,
    email: types.string,
    email_verified_at: types.maybeNull(types.string),
    created_at: types.string,
    updated_at: types.string,
  })
  .actions(withSetPropAction)
  .views(() => ({}))

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
