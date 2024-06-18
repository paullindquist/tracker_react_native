import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { formatDate } from "../../utils/formatDate"
import { translate } from "../../i18n"

/**
 * This represents the logged in user
 */
export const UserModel = types
  .model("User")
  .props({
    guid: types.identifier,
    name_first: "",
    name_last: "",
    dob: "",
  })
  .actions(withSetPropAction)
  .views(() => ({}))

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
