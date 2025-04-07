"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Alert } from "react-native"
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { format } from "date-fns"
import { Platform } from "react-native"
import { APP_CONFIG } from "@/app-config"

interface FileItem {
    _id: string
    length: number
    chunkSize: number
    uploadDate: string
    filename: string
}

export default function FileManagement() {
    const [files, setFiles] = useState<FileItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({})
    const [error, setError] = useState<string | null>(null)

    const API_BASE_URL = APP_CONFIG.API_BASE_URL;
    

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`${API_BASE_URL}/assignment/files`)

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`)
            }

            const data = await response.json()
            setFiles(data)
        } catch (err) {
            console.error("Error fetching files:", err)
            setError("Failed to load files. Please try again later.")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchFiles()
    }

    const getFileIcon = (filename: string) => {
        const extension = filename.split(".").pop()?.toLowerCase()

        switch (extension) {
            case "pdf":
                return <MaterialIcons name="picture-as-pdf" size={24} color="#F40F02" />
            case "doc":
            case "docx":
                return <MaterialIcons name="description" size={24} color="#2B579A" />
            case "xls":
            case "xlsx":
                return <MaterialIcons name="table-chart" size={24} color="#217346" />
            case "ppt":
            case "pptx":
                return <MaterialIcons name="slideshow" size={24} color="#D24726" />
            case "jpg":
            case "jpeg":
            case "png":
                return <MaterialIcons name="image" size={24} color="#5C51F3" />
            default:
                return <MaterialIcons name="insert-drive-file" size={24} color="#5C51F3" />
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"

        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return format(date, "MMM dd, yyyy h:mm a")
        } catch (err) {
            return dateString
        }
    }



    const downloadFile = async (file: FileItem) => {
        try {
            setSelectedFile(file)
            setDownloadProgress({ ...downloadProgress, [file._id]: 0 })

            const fileUri = `${FileSystem.documentDirectory}${file.filename}`

            // Platform check for web
            if (Platform.OS === 'web') {
                // For web, directly initiate download without checking if file exists
                const response = await fetch(`${API_BASE_URL}/assignment/download/${file.filename}`)

                if (!response.ok) {
                    throw new Error(`Failed to download: ${response.status}`)
                }

                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)

                // Create a link element to trigger download
                const a = document.createElement('a')
                a.href = url
                a.download = file.filename
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)

                setDownloadProgress({ ...downloadProgress, [file._id]: 1 }) // Set to 100%
            } else {
                // Native platform flow
                // Check if file already exists
                const fileInfo = await FileSystem.getInfoAsync(fileUri)
                if (fileInfo.exists) {
                    openFile(fileUri, file.filename)
                    return
                }

                // Download the file
                const downloadResumable = FileSystem.createDownloadResumable(
                    `${API_BASE_URL}/assignment/download/${file.filename}`,
                    fileUri,
                    {},
                    (downloadProgress) => {
                        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
                        setDownloadProgress({ ...downloadProgress, [file._id]: progress })
                    },
                )

                const result = await downloadResumable.downloadAsync()

                if (result && result.uri) {
                    openFile(result.uri, file.filename)
                }
            }
        } catch (err) {
            console.error("Error downloading file:", err)
            Alert.alert("Download Error", "Failed to download the file. Please try again.")
        } finally {
            setDownloadProgress({ ...downloadProgress, [file._id]: 0 })
            setSelectedFile(null)
        }
    }


    
    const openFile = async (fileUri: string, filename: string) => {
        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    UTI: getUTIForFile(filename),
                    mimeType: getMimeTypeForFile(filename),
                    dialogTitle: `Open ${filename}`,
                })
            } else {
                Alert.alert("Sharing not available", "Sharing is not available on this device")
            }
        } catch (err) {
            console.error("Error opening file:", err)
            Alert.alert("Error", "Could not open the file")
        }
    }

    const getUTIForFile = (filename: string) => {
        const extension = filename.split(".").pop()?.toLowerCase()

        switch (extension) {
            case "pdf":
                return "com.adobe.pdf"
            case "doc":
                return "com.microsoft.word.doc"
            case "docx":
                return "org.openxmlformats.wordprocessingml.document"
            case "xls":
                return "com.microsoft.excel.xls"
            case "xlsx":
                return "org.openxmlformats.spreadsheetml.sheet"
            case "ppt":
                return "com.microsoft.powerpoint.ppt"
            case "pptx":
                return "org.openxmlformats.presentationml.presentation"
            default:
                return "public.item"
        }
    }

    const getMimeTypeForFile = (filename: string) => {
        const extension = filename.split(".").pop()?.toLowerCase()

        switch (extension) {
            case "pdf":
                return "application/pdf"
            case "doc":
                return "application/msword"
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            case "xls":
                return "application/vnd.ms-excel"
            case "xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            case "ppt":
                return "application/vnd.ms-powerpoint"
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            case "jpg":
            case "jpeg":
                return "image/jpeg"
            case "png":
                return "image/png"
            default:
                return "application/octet-stream"
        }
    }

    const renderFileItem = ({ item }: { item: FileItem }) => {
        const isDownloading = selectedFile?._id === item._id
        const progress = downloadProgress[item._id] || 0

        return (
            <TouchableOpacity style={styles.fileItem} onPress={() => downloadFile(item)} disabled={isDownloading}>
                <View style={styles.fileIconContainer}>{getFileIcon(item.filename)}</View>
                <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{item.filename}</Text>
                    <View style={styles.fileMetadata}>
                        <Text style={styles.fileSize}>{formatFileSize(item.length)}</Text>
                        <Text style={styles.fileDate}>{formatDate(item.uploadDate)}</Text>
                    </View>
                    {isDownloading && (
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.downloadButton} onPress={() => downloadFile(item)} disabled={isDownloading}>
                    {isDownloading ? (
                        <ActivityIndicator size="small" color="#5C51F3" />
                    ) : (
                        <MaterialIcons name="file-download" size={24} color="#5C51F3" />
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            {error && (
                <View style={styles.errorContainer}>
                    <AntDesign name="exclamationcircle" size={24} color="#FF5694" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchFiles}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5C51F3" />
                    <Text style={styles.loadingText}>Loading files...</Text>
                </View>
            ) : (
                <>
                    {files.length === 0 && !error ? (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="folder-open" size={64} color="#CCCCCC" />
                            <Text style={styles.emptyText}>No files found</Text>
                            <Text style={styles.emptySubtext}>Student submissions will appear here</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={files}
                            renderItem={renderFileItem}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.fileList}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666666",
    },
    errorContainer: {
        padding: 16,
        backgroundColor: "#FFF0F3",
        borderRadius: 8,
        margin: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    errorText: {
        color: "#FF5694",
        marginLeft: 8,
        flex: 1,
    },
    retryButton: {
        backgroundColor: "#FF5694",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#666666",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999999",
        marginTop: 8,
    },
    fileList: {
        padding: 16,
    },
    fileItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    fileIconContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#EEEEEE",
    },
    fileDetails: {
        flex: 1,
    },
    fileName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333333",
        marginBottom: 4,
    },
    fileMetadata: {
        flexDirection: "row",
        alignItems: "center",
    },
    fileSize: {
        fontSize: 12,
        color: "#666666",
        marginRight: 8,
    },
    fileDate: {
        fontSize: 12,
        color: "#666666",
    },
    progressContainer: {
        height: 4,
        backgroundColor: "#EEEEEE",
        borderRadius: 2,
        marginTop: 8,
        overflow: "hidden",
        position: "relative",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#5C51F3",
        borderRadius: 2,
    },
    progressText: {
        position: "absolute",
        right: 0,
        top: 6,
        fontSize: 10,
        color: "#666666",
    },
    downloadButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
})

