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
      console.log("ATTEMPTING TO FETCH SUBJECTS, but it's commented out")
      const response = await api.getSubjects()
      if (response.kind === "ok") {
        console.log("SUBJECTS: ", response)
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
      return store.subjects
    },
  }))
  .actions((store) => ({}))

export interface SubjectStore extends Instance<typeof SubjectStoreModel> {}
export interface SubjectStoreSnapshot extends SnapshotOut<typeof SubjectStoreModel> {}
