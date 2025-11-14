import AudioPlayer from './components/AudioPlayer'
import LyricsPlayer from './components/LyricsPlayer'
import LyricsPrompter from './components/LyricsPrompter'
import SongSelector from './components/SongSelector'
import DataContextProvider from './DataContextProvider'
import s from './App.module.css'

const App = () => (
    <DataContextProvider>
        <header>
            <h1>Karaoke</h1>
        </header>
        <main>
            <div className={s.songContainer}>
                <SongSelector />
                <AudioPlayer />
                <LyricsPlayer />
            </div>
            <LyricsPrompter />
        </main>
        <footer>
            <a href="https://github.com/paulgreg/karaoke">source code</a>
        </footer>
    </DataContextProvider>
)

export default App
