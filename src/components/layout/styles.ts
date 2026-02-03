import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#FFF',
  },
  headerContent: {
    paddingTop: 20,
    paddingHorizontal: 35,
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    padding: 35,
    paddingTop: 10
  },
  btnsContainer:{
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
    width: 120
  },
})