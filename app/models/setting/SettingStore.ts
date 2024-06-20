import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../../services/api"
import { SettingModel } from "../setting/Setting"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const SettingStoreModel = types
  .model("SettingStore")
  .props({
    settings: types.array(SettingModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchSetting() {
      const response = await api.getSetting()
      if (response.kind === "ok") {
        store.setProp("settings", response.settings)
      } else {
        console.error(`Error fetching setting: ${JSON.stringify(response)}`)
      }
    },
  }))
  .views(() => ({}))
  .actions(() => ({}))

export interface SettingStore extends Instance<typeof SettingStoreModel> {}
export interface SettingStoreSnapshot extends SnapshotOut<typeof SettingStoreModel> {}
