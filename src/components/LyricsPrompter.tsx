import type { FindLyricsResponse } from 'lrclib-api'

type LyricsPrompterProps = {
    metadata?: FindLyricsResponse
    currentTime?: number
}

const timecodedLyricsRegEx = /\[(\d{2}):(\d{2}\.\d{2})\]\s*(.+)/

const LyricsPrompter: React.FC<LyricsPrompterProps> = ({ metadata, currentTime }) => {
    const decodedLyrics = metadata?.syncedLyrics?.length
        ? metadata.syncedLyrics.split('\n').map((s) => {
              const match = s.match(timecodedLyricsRegEx)
              if (match) {
                  const minuteStr = match[1]
                  const secondStr = match[2]
                  const lyric = match[3].trim()

                  const min = Number.parseInt(minuteStr, 10) * 60
                  const sec = Number.parseFloat(secondStr)

                  return { timecode: min + sec, lyric }
              } else {
                  return { timecode: 0, lyric: 'error' }
              }
          })
        : []

    const currentLyric = decodedLyrics.find(({ timecode }) => timecode + 3 >= (currentTime ?? 0))

    if (!metadata) return <></>

    if (currentLyric?.lyric) {
        return <strong className="currentLyric">{currentLyric?.lyric}</strong>
    }

    if (metadata?.plainLyrics) {
        return <code style={{ whiteSpace: 'break-spaces' }}>{metadata.plainLyrics}</code>
    }

    return <></>
}

export default LyricsPrompter
