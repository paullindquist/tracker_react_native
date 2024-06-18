import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../../services/api"
import { Subject, SubjectModel } from "../subject/Subject"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const SubjectStoreModel = types
  .model("SubjectStore")
  .props({
    subjects: types.array(SubjectModel),
    favorites: types.array(types.reference(SubjectModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchSubjects() {
      console.log("ATTEMPTING TO FETCH SUBJECTS, but it's commented out")
      /*
      const response = await api.getSubjects()
      if (response.kind === "ok") {
        console.log("SUBJECTS: ", response)
        store.setProp("subjects", response.subjects)
      } else {
        console.error(`Error fetching subjects!!!!: ${JSON.stringify(response)}`)
      }
      */
    },
    addFavorite(subject: Subject) {
      store.favorites.push(subject)
    },
    removeFavorite(subject: Subject) {
      store.favorites.remove(subject)
    },
  }))
  .views((store) => ({
    get subjectsForList() {
      return store.favoritesOnly ? store.favorites : store.subjects
    },

    hasFavorite(subject: Subject) {
      return store.favorites.includes(subject)
    },
  }))
  .actions((store) => ({
    toggleFavorite(subject: Subject) {
      if (store.hasFavorite(subject)) {
        store.removeFavorite(subject)
      } else {
        store.addFavorite(subject)
      }
    },
  }))

export interface SubjectStore extends Instance<typeof SubjectStoreModel> {}
export interface SubjectStoreSnapshot extends SnapshotOut<typeof SubjectStoreModel> {}
