import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4252e5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 4,
    zIndex: 2000, // Increase z-index for the entire header
  },
  logo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: 'relative',
    zIndex: 2000, // Increased z-index to ensure it's above other elements
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  profileName: {
    color: "white",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    zIndex: 1, // Lower z-index for the scrollView
  },
  welcomeBanner: {
    backgroundColor: "#52c4eb",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1, // Ensure this is lower than the profile dropdown
  },
  welcomeTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    flex: 0.48,
    alignItems: "center",
    margin: 20,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4252e5",
    marginBottom: 5,
  },
  statLabel: {
    color: "#777",
    fontSize: 14,
  },
  sectionContainer: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    color: "#4252e5",
    fontWeight: "500",
  },
  courseItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  professorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  professorName: {
    marginLeft: 5,
    color: "#777",
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#52c4eb",
  },
  assignmentItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  courseTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  courseTagText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  assignmentDueDate: {
    color: "#777",
    fontSize: 14,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  assignmentDescription: {
    color: "#666",
    marginBottom: 10,
  },
  assignmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#ffe5ed",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: "#ff5694",
    fontSize: 12,
    fontWeight: "500",
  },
  actionButton: {
    // No background to keep it clean
  },
  actionButtonText: {
    color: "#4252e5",
    fontWeight: "500",
  },
  navigationBar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 3,
    color: "#777",
  },
  navActive: {
    color: "#5c51f3",
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDropdown: {
    position: 'absolute',
    top: 45, // Slightly increased to ensure it's below the profile pic
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 3000, // Increased z-index to be higher than any other element
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  profileMenuItemText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});


export default styles;