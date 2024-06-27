import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../../services/api"
import { UserModel } from "../user/User"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const UserStoreModel = types
  .model("UserStore")
  .props({ user: types.maybe(UserModel) })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchUser() {
      const response = await api.getUser()
      if (response.kind === "ok") {
        console.log("USER: ", response)
        store.setProp("user", response.user)
      } else {
        console.error(`Error fetching user: ${JSON.stringify(response)}`)
      }
    },
  }))
  .views(() => ({}))
  .actions(() => ({}))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
