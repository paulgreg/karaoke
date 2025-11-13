import { useDataContext } from '../DataContext'
import s from './AudioPlayer.module.css'

const AudioPlayer = () => {
    const { audioSrc, setCurrentTime } = useDataContext()

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        setCurrentTime(e.currentTarget.currentTime)
    }
    return (
        <div>
            {audioSrc && (
                <audio className={s.audioPlayer} controls onTimeUpdate={handleTimeUpdate}>
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}{' '}
        </div>
    )
}

export default AudioPlayer
