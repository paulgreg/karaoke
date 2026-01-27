type StoreItemType = {
    artist: string
    song: string
}
type StoreType = Record<string, StoreItemType>

const KEY = 'karaoke-names'

export const saveArtistAndSongNames = (fileName: string, artist: string, song: string) => {
    const data: StoreType = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    data[fileName] = { artist: artist.trim(), song: song.trim() }
    localStorage.setItem(KEY, JSON.stringify(data))
}

export const fetchArtistAndSongNames = (fileName: string): StoreItemType | undefined => {
    const data: StoreType = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return data[fileName]
}
