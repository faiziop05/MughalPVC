import { Stack } from 'expo-router'
import React from 'react'

const HomeStack = () => {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name='index' options={{title:'Home'}}/>
      <Stack.Screen name='newMeasure' options={{title:'New Measurement'}}/>
    </Stack>
  )
}

export default HomeStack