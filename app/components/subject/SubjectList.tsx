import React, { useEffect } from "react"
import { View, StyleSheet, ActivityIndicator } from "react-native"
import { useStores } from "app/models"
import { Subject } from "app/models/subject/Subject"
import { ListView, Text } from "app/components"
import { delay } from "../../utils/delay"
import { spacing } from "../../theme"

const SubjectList: React.FC = () => {
  const { subjectStore } = useStores()
  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([subjectStore.fetchSubjects(), delay(750)])
    setRefreshing(false)
  }

  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await subjectStore.fetchSubjects()
      setIsLoading(false)
    })()
  }, [subjectStore])

  return (
    <View style={styles.container}>
      <pre>{subjectStore.subjectsForList.length}</pre>
      <ListView<Subject>
        contentContainerStyle={$listContentContainer}
        data={subjectStore.subjectsForList.slice()}
        extraData={"extra data here!!"}
        refreshing={refreshing}
        estimatedItemSize={666}
        onRefresh={manualRefresh}
        ListEmptyComponent={isLoading ? <ActivityIndicator /> : <Text>No dice?</Text>}
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="subjectList.heading" />
          </View>
        }
        renderItem={({ item }) => (
          <Text>
            {item.name_first} -- {item.name_last}
          </Text>
        )}
      />
      <Text>Subject List</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

export default SubjectList
