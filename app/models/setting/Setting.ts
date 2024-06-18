import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * This represents a user's setting
 */
export const SettingModel = types
  .model("Setting")
  .props({})
  .actions(withSetPropAction)
  .views(() => ({}))

export interface Setting extends Instance<typeof SettingModel> {}
export interface SettingSnapshotOut extends SnapshotOut<typeof SettingModel> {}
export interface SettingSnapshotIn extends SnapshotIn<typeof SettingModel> {}
