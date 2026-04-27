import React, { useState } from 'react'
import { useDataContext } from '../DataContext'
import { extractAudioMetadata } from '../service/MetadataService'
import s from './SongSelector.module.css'

interface SongSelectorProps {
    onFileUploaded: (metadata: AudioMetadata) => void
}

const SongSelector: React.FC<SongSelectorProps> = ({ onFileUploaded }) => {
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
                setFileName(name)
                setCurrentTime(0)

                const src = URL.createObjectURL(file)
                setTimeout(() => {
                    setAudioSrc(src)
                }, 0)

                const metadata = await extractAudioMetadata(file)
                onFileUploaded(metadata)
            } catch (err) {
                setError('Failed to extract metadata')
                console.error(err)
            }
        }
    }

    return (
        <div className={s.songSelectorContainer}>
            <input type="file" accept="audio/*" className={s.fileInput} onChange={onFileChange} />
            <p>
                {error && <strong className="error">{error}</strong>}
                {!error && <small className={s.message}>mp3/m4a/ogg</small>}
            </p>
        </div>
    )
}

export default SongSelector
