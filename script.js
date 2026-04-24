const gifStages = [
    "https://tenor.com/view/cute-gif-4784938373231258767.gif",    // 0 normal
    "https://tenor.com/view/cat-love-peach-and-goma-gif-20458650.gif",  // 1 confused
    "https://tenor.com/view/goma-sad-gif-411134658282219592.gif",             // 2 pleading
    "https://tenor.com/view/peach-cat-tired-cute-adorable-gif-16367739.gif",             // 3 sad
    "https://tenor.com/view/もちねこ-ごまぴーち-mochi-gif-1724202099732386693.gif",       // 4 sadder
    "https://tenor.com/view/peach-goma-peach-and-goma-peach-cat-goma-cry-gif-26865010.gif",             // 5 devastated
    "https://tenor.com/view/crying-gif-10704312894451489263.gif",               // 6 very devastated
    "https://tenor.com/view/peach-and-goma-goma-crying-cry-tears-gif-26864910.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you sure? 🤔",
    "Hmm… think again 😌",
    "You sure you wanna do that? 👀",
    "If you say no, I will be really sad...", 
    "I will be very sad... 😢",
    "Please??? 😭",
    "I’m still waiting… let’s not end it like this😢",
]

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.25}px`
    const padY = Math.min(8 + noClickCount * 3, 20)
    const padX = Math.min(18 + noClickCount * 4, 50)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.90, 9)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
