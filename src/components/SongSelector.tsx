import React, { useState } from 'react'
import { useDataContext } from '../DataContext'
import s from './SongSelector.module.css'

const fileRegEx = /^(.+)\.(mp3|m4a|ogg)$/

const SongSelector = () => {
    const { setFileName, setAudioSrc, setCurrentTime } = useDataContext()
    const [error, setError] = useState('')

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setAudioSrc(undefined)
        setError('')

        const files = e.target.files
        if (files?.length) {
            const file = files[0]
            try {
                const { name } = file
                const match = fileRegEx.exec(name)
                if (match) {
                    setFileName(match[1])
                    setCurrentTime(0)

                    const src = URL.createObjectURL(file)
                    setTimeout(() => {
                        setAudioSrc(src)
                    }, 0)
                } else {
                    setError('no match')
                }
            } catch (err) {
                setError('Failed to extract metadata')
                console.error(err)
            }
        }
    }

    return (
        <div className={s.songSelectorContainer}>
            <input type="file" accept=".mp3,.m4a,ogg" className={s.fileInput} onChange={onFileChange} />
            <p>
                {error && <strong className="error">{error}</strong>}
                {!error && <small className={s.message}>mp3/m4a/ogg</small>}
            </p>
        </div>
    )
}

export default SongSelector
