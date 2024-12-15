export function getArtworks(
    page: number,
    cancelSignal?: AbortSignal
): Promise<Response> {
    return fetch(`https://api.artic.edu/api/v1/artworks?page=${page || 1}`, {
        signal: cancelSignal,
    });
}
