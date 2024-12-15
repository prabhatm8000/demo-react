export type Artwork = {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
};

export type PaginationType = {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string;
};

export type ArtworkResponse = {
    data: Artwork[];
    pagination: PaginationType;
};
