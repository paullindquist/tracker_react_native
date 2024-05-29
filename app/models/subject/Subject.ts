import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { formatDate } from "../../utils/formatDate"
import { translate } from "../../i18n"

/**
 * This represents a subject
 */
export const SubjectModel = types
  .model("Subject")
  .props({
    guid: types.identifier,
    name_first: "",
    name_last: "",
    dob: "",
  })
  .actions(withSetPropAction)
  .views((subject) => ({
    get parsedTitleAndSubtitle() {
      return { title: subject.name_first, subtitle: subject.name_last }
    },
    get datePublished() {
      try {
        const formatted = formatDate(subject.dob)
        return {
          textLabel: formatted,
          accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {
            date: formatted,
          }),
        }
      } catch (error) {
        return { textLabel: "", accessibilityLabel: "" }
      }
    },
  }))

export interface Subject extends Instance<typeof SubjectModel> {}
export interface SubjectSnapshotOut extends SnapshotOut<typeof SubjectModel> {}
export interface SubjectSnapshotIn extends SnapshotIn<typeof SubjectModel> {}
