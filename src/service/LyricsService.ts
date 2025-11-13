import { Client, type FindLyricsResponse } from 'lrclib-api'

const client = new Client()

export const fetchLyrics = async (artist_name: string, track_name: string): Promise<FindLyricsResponse | null> => {
    const query = {
        track_name,
        artist_name,
    }
    const metadata = await client.findLyrics(query)
    return metadata
}
