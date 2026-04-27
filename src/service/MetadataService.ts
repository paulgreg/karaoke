import { parseBlob } from 'music-metadata'

export const extractAudioMetadata = async (file: File): Promise<AudioMetadata> => {
    try {
        const metadata = await parseBlob(file)

        return {
            artist: metadata.common.artist,
            title: metadata.common.title,
        }
    } catch (error) {
        console.error('Error extracting metadata:', error)
        return { artist: undefined, title: undefined }
    }
}
