export function extractPath(): string | null {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/(livsmart|worksmart|ebco|shop-now)(.*)/);
    if (match) {
        return `/${match[1]}${match[2]}`;
    } else {
        return null;
    }
}