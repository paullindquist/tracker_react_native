import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
// FIXME: Remove all the episode stuff!
import { EpisodeStoreModel } from "./EpisodeStore"
import { SubjectStoreModel } from "./subject/SubjectStore"
import { UserStoreModel } from "./user/UserStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  subjectStore: types.optional(SubjectStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
