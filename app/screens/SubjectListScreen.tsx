import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import { Card, EmptyState, ListView, Screen, Text, Button } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { Subject } from "../models/subject/Subject"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

export const SubjectListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function SubjectListScreen(_props) {
    const { subjectStore } = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        await subjectStore.fetchSubjects()
        setIsLoading(false)
      })()
    }, [subjectStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([subjectStore.fetchSubjects(), delay(750)])
      setRefreshing(false)
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ListView<Subject>
          contentContainerStyle={$listContentContainer}
          data={subjectStore.subjectsForList.slice()}
          refreshing={refreshing}
          estimatedItemSize={177}
          onRefresh={manualRefresh}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx={"demoPodcastListScreen.noFavoritesEmptyState.heading"}
                contentTx={"demoPodcastListScreen.noFavoritesEmptyState.content"}
                button={"Refresh!!"}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="subjectListScreen.title" />
            </View>
          }
          renderItem={({ item }) => <SubjectCard subject={item} />}
        />
      </Screen>
    )
  },
)

const SubjectCard = observer(function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      HeadingComponent={
        <View>
          <Text size="sm">{subject.name_first}</Text>
          <Text>{subject.name_last}</Text>
        </View>
      }
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
