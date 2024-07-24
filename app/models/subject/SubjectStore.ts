import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../../services/api"
import { SubjectModel } from "../subject/Subject"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const SubjectStoreModel = types
  .model("SubjectStore")
  .props({
    subjects: types.array(SubjectModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchSubjects() {
      const response = await api.getSubjects()
      if (response.kind === "ok") {
        store.setProp("subjects", response.subjects)
      } else {
        console.error(`Error fetching subjects!!!!: ${JSON.stringify(response)}`)
      }
    },
    async createSubject() {
      console.log("ATTEMPTING TO create a SUBJECT")
    },
  }))
  .views((store) => ({
    get subjectsForList() {
      console.log("subjectsForList", store.subjects)
      return store.subjects
    },
  }))
  .actions((store) => ({}))

export interface SubjectStore extends Instance<typeof SubjectStoreModel> {}
export interface SubjectStoreSnapshot extends SnapshotOut<typeof SubjectStoreModel> {}
