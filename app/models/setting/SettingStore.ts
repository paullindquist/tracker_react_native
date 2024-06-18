import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../../services/api"
// import { Setting, SettingModel } from "../setting/Setting"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const SettingStoreModel = types
  .model("SettingStore")
  .props({})
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchSetting() {
      const response = await api.getSetting()
      if (response.kind === "ok") {
        console.log("USER: ", response)
        store.setProp("setting", response)
      } else {
        console.error(`Error fetching user: ${JSON.stringify(response)}`)
      }
    },
  }))
  .views(() => ({}))
  .actions(() => ({}))

export interface SettingStore extends Instance<typeof SettingStoreModel> {}
export interface SettingStoreSnapshot extends SnapshotOut<typeof SettingStoreModel> {}
