import { useState } from 'react'
import { useDataContext } from '../DataContext'
import s from './LyricsPrompter.module.css'

const timecodedLyricsRegEx = /\[(\d{2}):(\d{2}\.\d{2})\]\s*(.+)/

const LyricsPrompter = () => {
    const { metadata, currentTime } = useDataContext()
    const [delay, setDelay] = useState(3)

    const decodedLyrics = metadata?.syncedLyrics?.length
        ? metadata.syncedLyrics.split('\n').map((s) => {
              const match = timecodedLyricsRegEx.exec(s)
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

    const onDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDelay(Number.parseFloat(e.currentTarget.value))
    }

    const currentLyric = decodedLyrics.find(({ timecode }) => timecode + delay >= (currentTime ?? 0))

    if (!metadata) return <></>

    if (decodedLyrics.length) {
        return (
            <div className={s.lyricsContainer}>
                <label>
                    Delay: {delay}s
                    <input type="range" min="1" max="5" step=".1" onChange={onDelayChange} />
                </label>
                <strong className={s.currentLyric}>{currentLyric?.lyric ?? ''}</strong>
            </div>
        )
    }

    if (!decodedLyrics.length && metadata?.plainLyrics) {
        return (
            <div className={s.lyricsContainer}>
                <code className={s.plainLyrics}>{metadata.plainLyrics}</code>
            </div>
        )
    }

    return <div className={s.lyricsContainer}></div>
}

export default LyricsPrompter
