export const isIOSorSafari = () => {
    if (typeof window !== 'undefined') {

        const userAgent = navigator.userAgent || navigator.vendor;

        // Check for iOS devices
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);

        // Check for Safari (including on macOS)
        const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

        return isIOS || isSafari;
    }
};
