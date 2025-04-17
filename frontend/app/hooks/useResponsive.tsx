import { useWindowDimensions } from "react-native"

export function useIsSmallDevice() {
    const { width } = useWindowDimensions()
    return {
        width,
        isSmallDevice: width < 768, // Increased breakpoint for better tablet/desktop detection
    }
}
