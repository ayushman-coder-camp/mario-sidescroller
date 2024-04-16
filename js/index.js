const scrollBtn = document.querySelector('.scroll-to-top-btn')

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        scrollBtn.classList.add('active')
    } else {
        scrollBtn.classList.remove('active')
    }
})