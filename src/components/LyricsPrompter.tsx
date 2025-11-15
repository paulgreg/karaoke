import { useEffect, useState } from 'react'
import { useDataContext } from '../DataContext'
import s from './LyricsPrompter.module.css'

const LyricsPrompter = () => {
    const { plainLyrics, syncLyrics, currentTime = 0 } = useDataContext()
    const [idx, setIdx] = useState(0)

    useEffect(() => {
        if (!syncLyrics?.length) return
        const i = syncLyrics.findIndex(({ timecode }) => Math.floor(currentTime) === Math.floor(timecode))
        if (i !== -1) {
            setTimeout(() => {
                setIdx(i)
            }, 0)
        }
    }, [currentTime, syncLyrics])

    if (syncLyrics?.length) {
        const currentLyric = syncLyrics[idx]
        return (
            <div className={s.lyricsContainer}>
                {currentLyric?.time && <time className={s.time}>at {currentLyric?.time}</time>}
                <strong className={s.currentLyric}>{currentLyric?.lyric ?? ''}</strong>
            </div>
        )
    }

    if (!syncLyrics?.length && plainLyrics) {
        return (
            <div className={s.lyricsContainer}>
                <code className={s.plainLyrics}>{plainLyrics}</code>
            </div>
        )
    }

    return <div className={s.lyricsContainer}></div>
}

export default LyricsPrompter
