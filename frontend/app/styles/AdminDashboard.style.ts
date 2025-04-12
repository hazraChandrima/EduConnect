import { StyleSheet, useWindowDimensions } from "react-native"

const { width } = useWindowDimensions()
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    appContainer: {
        flex: 1,
        flexDirection: "row",
    },
    mainContent: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        // transition: "margin-left 0.3s ease",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#4169E1",
        paddingVertical: 14,
        paddingHorizontal: 20,
        zIndex: 2000,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoutButton: {
        marginRight: 15,
    },
    adminBadge: {
        flexDirection: "row",
        alignItems: "center",
    },
    adminText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "500",
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
    },
    dashboardHeader: {
        backgroundColor: "#40BFFF",
        padding: 20,
        borderRadius: 8,
        margin: 16,
        position: "relative",
        zIndex: 1,
    },
    dashboardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    dashboardSubtitle: {
        fontSize: 16,
        color: "white",
        opacity: 0.9,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        flexWrap: "wrap",
    },
    statCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        width: "30%",
        elevation: 2,
        marginBottom: 10,
        minWidth: 100,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4169E1",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: "#777",
    },
    section: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        margin: 16,
        marginTop: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    serverStatusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    serverStatusTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    viewDetailsLink: {
        color: "#4169E1",
        fontWeight: "500",
    },
    statusItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    statusLabel: {
        fontSize: 16,
        color: "#333",
    },
    statusIndicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    onlineIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#40BFFF",
        marginRight: 8,
    },
    degradedIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FF4081",
        marginRight: 8,
    },
    statusText: {
        fontSize: 16,
        color: "#555",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    activityItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    activityLabel: {
        fontSize: 16,
        color: "#333",
    },
    activityTime: {
        fontSize: 14,
        color: "#777",
    },
    quickActionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    actionCard: {
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        width: "48%",
        marginBottom: 16,
        elevation: 1,
    },
    actionText: {
        marginTop: 12,
        color: "#333",
        fontWeight: "500",
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: "#777",
    },
    activeNavText: {
        color: "#4169E1",
        fontWeight: "500",
    },
    // Tab styles
    tabHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    addButton: {
        backgroundColor: "#4169E1",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    // Search
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        padding: 8,
    },
    // Tabs
    tabsContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "#f0f0f0",
    },
    tabButtonText: {
        color: "#777",
    },
    activeTabButton: {
        backgroundColor: "#4169E1",
    },
    activeTabButtonText: {
        color: "white",
        fontWeight: "500",
    },
    // User items
    userItem: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 2,
        alignItems: "center",
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#4169E1",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    userEmail: {
        color: "#777",
        marginBottom: 4,
    },
    userDepartment: {
        color: "#777",
        fontSize: 14,
    },
    userActions: {
        flexDirection: "row",
    },
    userActionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    // User detail
    userDetailContainer: {
        padding: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backButtonText: {
        color: "#4169E1",
        marginLeft: 8,
        fontWeight: "500",
    },
    userProfile: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 24,
        marginBottom: 16,
        elevation: 2,
    },
    userProfileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#4169E1",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    userProfileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    userProfileId: {
        color: "#777",
        marginBottom: 8,
    },
    userProfileEmail: {
        color: "#777",
        marginBottom: 8,
    },
    userInfoSection: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    userInfoItem: {
        flexDirection: "row",
        marginBottom: 12,
    },
    userInfoLabel: {
        width: 100,
        color: "#777",
        fontSize: 16,
    },
    userInfoValue: {
        flex: 1,
        color: "#333",
        fontSize: 16,
        fontWeight: "500",
    },
    courseTagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    courseTag: {
        backgroundColor: "#E3F2FD",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    courseTagText: {
        color: "#4169E1",
    },
    editButton: {
        backgroundColor: "#4169E1",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    editButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: "#FF4081",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
    emptyListContainer: {
        padding: 24,
        alignItems: "center",
    },
    emptyListText: {
        color: "#777",
        fontSize: 16,
    },
    courseItem: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 2,
        alignItems: "center",
    },
    courseItemIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#40BFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    courseItemInfo: {
        flex: 1,
    },
    courseItemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    courseItemCode: {
        color: "#777",
        marginBottom: 4,
    },
    courseItemDepartment: {
        color: "#777",
        fontSize: 14,
    },
    courseItemActions: {
        flexDirection: "row",
    },
    courseItemActionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    // Course detail
    courseDetailContainer: {
        padding: 16,
    },
    courseHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
    },
    courseHeaderInfo: {
        marginLeft: 16,
    },
    courseHeaderTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    courseHeaderCode: {
        color: "#777",
    },
    courseInfoSection: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    courseInfoItem: {
        flexDirection: "row",
        marginBottom: 12,
    },
    courseInfoLabel: {
        width: 150,
        color: "#777",
        fontSize: 16,
    },
    courseInfoValue: {
        flex: 1,
        color: "#333",
        fontSize: 16,
        fontWeight: "500",
    },
    courseActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    // Settings
    settingsSection: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        margin: 16,
        marginTop: 0,
        elevation: 2,
    },
    settingsSectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    settingsItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    settingsItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingsItemText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 12,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        width: "90%",
        maxHeight: "80%",
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    modalContent: {
        padding: 16,
    },
    inputLabel: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
        marginTop: 12,
    },
    textInput: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },
    roleOptions: {
        flexDirection: "row",
        marginBottom: 16,
    },
    roleOption: {
        flex: 1,
        padding: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
        marginRight: 8,
    },
    roleOptionText: {
        color: "#333",
    },
    selectedRoleOption: {
        backgroundColor: "#4169E1",
        borderColor: "#4169E1",
    },
    selectedRoleOptionText: {
        color: "white",
    },
    pickerContainer: {
        marginBottom: 16,
    },
    professorOption: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#eee",
    },
    professorOptionText: {
        color: "#333",
    },
    selectedProfessorOption: {
        backgroundColor: "#4169E1",
        borderColor: "#4169E1",
    },
    selectedProfessorOptionText: {
        color: "white",
    },
    submitButton: {
        backgroundColor: "#4169E1",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 16,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    // Confirm delete modal
    confirmModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    confirmModalContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        width: "80%",
        elevation: 5,
    },
    confirmModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    confirmModalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    confirmModalContent: {
        padding: 16,
    },
    confirmModalText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
    },
    confirmModalSubtext: {
        fontSize: 14,
        color: "#777",
    },
    confirmModalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    cancelButtonText: {
        color: "#777",
        fontWeight: "500",
    },
    deleteConfirmButton: {
        backgroundColor: "#FF4081",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    deleteConfirmButtonText: {
        color: "white",
        fontWeight: "500",
    },
    // Chart styles
    chartCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        width: "100%",
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    chart: {
        borderRadius: 8,
        marginVertical: 8,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        zIndex: 1000,
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileDropdown: {
        position: "absolute",
        top: 45,
        right: 0,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 3000,
    },
    profileMenuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    profileMenuItemText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },
    studentItem: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        alignItems: "center",
    },
    studentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#4169E1",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    studentEmail: {
        color: "#777",
        fontSize: 14,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
    },
    // Sidebar styles
    sidebar: {
        width: 240,
        backgroundColor: "#2c3e50",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        // transition: "width 0.3s ease",
    },
    sidebarCollapsed: {
        width: 60,
    },
    sidebarHeader: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    sidebarTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    sidebarToggle: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
    sidebarContent: {
        flex: 1,
        paddingTop: 16,
    },
    sidebarFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    sidebarItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 4,
        borderLeftWidth: 3,
        borderLeftColor: "transparent",
    },
    sidebarItemActive: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderLeftColor: "#4169E1",
    },
    sidebarItemText: {
        color: "white",
        marginLeft: 12,
        fontSize: 16,
    },
    sidebarItemTextActive: {
        fontWeight: "bold",
    },
    // Analytics section styles
    analyticsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
        padding: 16,
    },
    chartContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    // chartWrapper: {
    //     width: "100%",
    //     "@media (min-width: 768px)": {
    //         width: "calc(50% - 8px)",
    //     },
    //     "@media (min-width: 1024px)": {
    //         width: "calc(33.333% - 11px)",
    //     },
    // },
    cardStyle : {
        width:  "50%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
})

export default styles
