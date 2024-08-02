const slider = document.getElementById('slider');
const totalItems = 9;
const centerIndex = Math.floor(totalItems / 2);

for (let i = 0; i < totalItems; i++) {
    const sliderItem = document.createElement('div');
    sliderItem.classList.add('slider-item');
    sliderItem.innerHTML = countries[i].flag;
    slider.appendChild(sliderItem);
}

function updateSlider() {
    const items = document.querySelectorAll('.slider-item');
    items.forEach((item, index) => {
        const offset = Math.abs(centerIndex - index);
        const scale = 1 - offset * 0.2;
        const opacity = 1 - offset * 0.2;
        item.style.transform = `scale(${scale})`;
        item.style.opacity = opacity;
    });
}

updateSlider();

function slide() {
    countries.push(countries.shift());
    const items = document.querySelectorAll('.slider-item');
    for (let i = 0; i < totalItems; i++) {
        items[i].innerHTML = countries[i].flag;
    }
    updateSlider();
}

setInterval(slide, 2000);