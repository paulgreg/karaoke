import { Client, type FindLyricsResponse } from 'lrclib-api'
import { saveArtistAndSongNames } from './Store'

const client = new Client()

export const fetchLyrics = async (
    fileName: string,
    artist_name: string,
    track_name: string
): Promise<FindLyricsResponse | null> => {
    const query = {
        track_name,
        artist_name,
    }
    const metadata = await client.findLyrics(query)
    if (metadata) saveArtistAndSongNames(fileName, metadata.artistName, metadata.trackName)
    return metadata
}
