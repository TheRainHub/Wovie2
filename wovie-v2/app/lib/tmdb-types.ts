export interface TMDBMovieListResponse {
    page: number;
    total_pages: number;
    results: TMDBMovie[];
}

export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    release_date: string | null;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    genre_ids: number[];
}

export interface TMDBMovieDetails extends TMDBMovie {
    runtime: number | null;
    genres: {id: number; name: string}[];
    videos: {results: TMDBVideo[]};
    credits: {cast: TMDBCastMember[]};
}

export interface TMDBVideo {
    key: string;  //YouTube video ID
    site: string; //YouTube
    type: string; //trailer
}

export interface TMDBCastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface TMDBGenresResponse {
    genres: { id: number; name: string }[];
}
