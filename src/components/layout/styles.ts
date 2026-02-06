import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#FFF',
  },
  headerContent: {
    paddingHorizontal: 35,
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    padding: 35,
    paddingTop: 10
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    width: 70
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Ajuste a cor conforme seu tema
    marginBottom: 5, // Pequeno ajuste de alinhamento vertical
    paddingHorizontal: 10 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // Transparente para ver o fundo
  },
  menuDropdown: {
    position: 'absolute',
    top: 60, // Ajuste baseado na altura do seu header
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
})