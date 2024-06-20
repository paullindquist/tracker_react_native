import React, { useState } from "react"
import { View, Text, TextInput, Button } from "react-native"
import { api } from "../../services/api"

const CreateSubject: React.FC = () => {
  const [nameFirst, setNameFirst] = useState("")
  const [nameLast, setNameLast] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (nameFirst.trim() === "") {
      setError("Please enter a first name")
    } else {
      // Form is valid, continue with submission logic
      const subject = {
        name_first: nameFirst,
        name_last: nameLast,
        image_href: imageUrl,
      }
      const created = await api.createSubject(subject)
      if (created.kind === "ok") {
        console.log("Subject created successfully")
      } else {
        console.log(created)
        setError("Error creating subject")
      }
    }
  }

  return (
    <View>
      <Text>{error}</Text>
      <Text>First Name:</Text>
      <TextInput value={nameFirst} onChangeText={(newNameFirst) => setNameFirst(newNameFirst)} />
      <Text>Second Name:</Text>
      <TextInput value={nameLast} onChangeText={(newNameLast) => setNameLast(newNameLast)} />
      <Text>Image URL:</Text>
      <TextInput value={imageUrl} onChangeText={(newImageUrl) => setImageUrl(newImageUrl)} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  )
}
export default CreateSubject
