import { Stack } from 'expo-router'
import React from 'react'

const adminStack = () => {
  return (
    <Stack initialRouteName='main'>
      <Stack.Screen name='main' options={{title:'Admin'}}/>
      <Stack.Screen name='index' options={{title:'Categories'}}/>
      <Stack.Screen name='manageCategories' options={{title:'Manage Categories'}}/>
      <Stack.Screen name='manageSupportingMaterial' options={{title:'Manage Supporting Material'}}/>
    </Stack>
  )
}

export default adminStack