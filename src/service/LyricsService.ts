import { Client, type FindLyricsResponse } from 'lrclib-api'
import { saveArtistAndSongNames } from './Store'

const client = new Client()

export const fetchLyrics = async (
    fileName: string,
    artist_name: string,
    track_name: string,
    audioMetadata?: AudioMetadata
): Promise<FindLyricsResponse | null> => {
    const query = {
        track_name,
        artist_name,
    }
    const lyricsMetadata = await client.findLyrics(query)
    const isMetaDataDifferent = artist_name !== audioMetadata?.artist || track_name !== audioMetadata?.title

    if (lyricsMetadata && isMetaDataDifferent) {
        saveArtistAndSongNames(fileName, lyricsMetadata.artistName, lyricsMetadata.trackName)
    }

    return lyricsMetadata
}
