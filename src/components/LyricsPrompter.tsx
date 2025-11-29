import { useEffect, useState } from 'react'
import { useDataContext } from '../DataContext'
import s from './LyricsPrompter.module.css'

const LyricsPrompter = () => {
    const { plainLyrics, syncLyrics, currentTime = 0 } = useDataContext()
    const [idx, setIdx] = useState(0)

    useEffect(() => {
        if (!syncLyrics?.length) {
            setTimeout(() => {
                setIdx(0)
            }, 0)
            return
        }
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
                <time className={s.time}>
                    {currentLyric?.lyric && currentLyric?.time && <>at {currentLyric?.time}</>}
                </time>
                <cite className={s.currentLyric}>{currentLyric?.lyric ?? ''}</cite>
                <code className={s.plainLyrics}>{plainLyrics}</code>
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
