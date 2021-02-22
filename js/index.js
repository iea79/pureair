import { Loader } from './loader';
import { Cursor } from './cursor';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import imageFrames from "../images/frames/*.png";
import imageFramesBack from "../images/frames-back/*.png";
import virusFrames from "../images/virus/*.png";

new Loader();
new Cursor();

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
    // markers: true
});

const isTouch = function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); };
const isXXsWidth = window.innerWidth < 480;

const canvas = document.querySelector("#canvas-windows");
const context = canvas.getContext("2d");

const canvasBack = document.querySelector("#canvas-windows-back");
const contextBack = canvasBack.getContext("2d");

const virusCanvas = document.querySelector("#canvas-viruses");
const virusContext = virusCanvas.getContext("2d");

const firstSection = document.querySelector('.one');
const secondSection = document.querySelector('.two');
const threeSection = document.querySelector('.three');
const fourSection = document.querySelector('.four');
const fiveSection = document.querySelector('.five');
const sixSection = document.querySelector('.six');

const sun = document.getElementById('sun');

canvas.width = canvasBack.width  = virusCanvas.width = 1920;
canvas.height = canvasBack.height  = virusCanvas.height = 1080;

const frameCountAll = 65;
const frameCountOne = 64;
const frameCountBack = 35;
const virusFramesCount = 101;

const images = [];
const imagesBack = [];
const viruses = [];
const frames = {
    frame: 1
};

window.onload = () => {
    clearCanvas(context);
    context.drawImage(images[1], 0, 0);
};

for (let i = 0; i < frameCountAll; i++) {
    const img = new Image();
    img.src = imageFrames[i + 1];
    images.push(img);
}

console.log(images);

for (let i = 0; i < frameCountBack; i++) {
    const img = new Image();
    img.src = imageFramesBack[i];
    imagesBack.push(img);
}
console.log(imagesBack);

for (let i = 0; i < virusFramesCount; i++) {
    const img = new Image();
    img.src = virusFrames[i];
    viruses.push(img);
}

let tl = new gsap.timeline({
    scrollTrigger: {
        trigger: firstSection,
        start: "top top",
        end: "100%",
        scrub: true,
        pin:true,
    },
    opacity: 0
});
if (isXXsWidth) {
    tl.to(canvas, {scale: 0.6,duration: 1});
} else {
    tl.to(canvas, {scale: 1,duration: 1});
}

tl.to(firstSection, {opacity: 0, duration: 1});

tl.to(frames, {
    frame: frameCountAll - 1,
    snap: "frame",
    scrollTrigger: {
        trigger: firstSection,
        start: "top top",
        end: "200%",
        scrub: true,
        onUpdate: (self) => {
            renderOne();
            canvas.style.display = '';
        },
        onLeave: () => {
            clearCanvas(context);
            canvas.style.display = 'none';
        },
        onEnterBack: () => {
            clearCanvas(virusContext);
        }
    },
});

tl.to(".scene__text--covering", {
    scrollTrigger: {
        trigger: secondSection,
        start: "top top",
        end: "50%",
        scrub: true,
        pin: true,
        onToggle: self => {
            let elem = self.trigger.querySelector('.scene__text--covering');
            if (self.isActive) {
                setActiveClass(elem);
                canvas.parentElement.style.zIndex = -1;
                elem.style.opacity = '1';
            } else {
                removeActiveClass(elem);
                canvas.parentElement.style.zIndex = "";
                elem.style.opacity = '0';
            }
        },
    },
    x: '20%'
});

tl.to(frames, {
    frame: virusFramesCount - 1,
    snap: "frame",
    opacity:1,
    scrollTrigger: {
        trigger: secondSection,
        start: "40%",
        end: "450%",
        scrub: true,
        onLeaveBack: () => {
            clearCanvas(virusContext);
        },
        onUpdate: () => {
            renderViruses();
            clearCanvas(contextBack);
        }
    },
});

let tlf = new gsap.timeline({
    scrollTrigger: {
        trigger: fourSection,
        start: "top top",
        end: "130%",
        scrub: true,
        pin:true,
        onUpdate: () => {
            virusCanvas.parentElement.style.display = 'block';
        },
        onToggle: self => {
            let elem = self.trigger.querySelector('.scene__text--sun');
            let elem2 = self.trigger.querySelector('.scene__text--virus');
            if (self.isActive) {
                virusCanvas.parentElement.style.zIndex = 0;
            } else {
                removeActiveClass(elem);
                removeActiveClass(elem2);
                elem.style.opacity = '0';
                elem2.style.opacity = '0';
                virusCanvas.parentElement.style.zIndex = "";
            }
        },
    },
});

tlf.to(sun, {
    x: '100%',
    rotation: 180,
    opacity: 1,
});

tlf.to(".scene__text--sun", {
    x: '20%',
    onStart: startText,
    onComplete: completeText,
    onUpdate: updateText
});

tlf.to(".scene__text--virus", {
    x: '-20%',
    onStart: startText,
    onComplete: completeText,
    onUpdate: updateText
});

function startText() {
    let elem = this.targets()[0];
    removeActiveClass(elem);
}

function completeText() {
    let elem = this.targets()[0];
    removeActiveClass(elem);
}

function updateText() {
    let elem = this.targets()[0];
    setActiveClass(elem);
    elem.style.opacity = '1';
}

gsap.to(frames, {
    frame: frameCountBack - 1,
    snap: "frame",
    scale: 1,
    scrollTrigger: {
        trigger: sixSection,
        start: "top top",
        end: "100%",
        scrub: true,
        onEnter: () => {
            clearCanvas(virusContext);
        },
        onUpdate: () => {
            renderBack();
        },
        onLeaveBack: () => {
            clearCanvas(virusContext);
        },

    }
});

gsap.to(sixSection, {
    scrollTrigger: {
        trigger: sixSection,
        start: "top top",
        end: "180%",
        scrub: true,
        pin: true,
        onEnterBack: () => {
            document.querySelectorAll('.canvas-wrapper').forEach(item => {
                item.style.display = '';
            });
        },
        onLeaveBack: () => {
            document.querySelectorAll('.canvas-wrapper').forEach(item => {
                item.style.display = '';
            });
        },
        onEnter: () => {
            document.querySelectorAll('.canvas-wrapper').forEach(item => {
                item.style.display = '';
            });
        },
        onUpdate: self => {
            virusCanvas.parentElement.style.display = 'none';
            canvas.style.display = 'none';
            if (self.progress > 0.5) {
                self.trigger.style.opacity = 2 - (self.progress * 2);
                canvasBack.style.opacity = 2 - (self.progress * 2);
            }
        },
        onLeave: self => {
            document.querySelectorAll('.canvas-wrapper').forEach(item => {
                item.style.display = 'none';
            });
            clearCanvas(virusContext);
        }
    },
});

let tlb = new gsap.timeline({
    scrollTrigger: {
        trigger: ".six-box",
        start: "top top",
        end: "50%",
        scrub: true,
        pin:true,
    }
});

tlb.to(canvasBack, {scale: 0.49,duration: 2});

function renderOne() {
    clearCanvas(context);
    context.drawImage(images[frames.frame], 0, 0);
}

function renderBack() {
    clearCanvas(contextBack);
    contextBack.drawImage(imagesBack[frames.frame], 0, 0);
}

function renderViruses() {
    clearCanvas(virusContext);
    virusContext.drawImage(viruses[frames.frame], 0, 0);
}

function clearCanvas(element) {
    element.clearRect(0, 0, canvas.width, canvas.height);
}

function setActiveClass(element) {
    element.classList.add('active');
}

function removeActiveClass(element) {
    element.classList.remove('active');
}


window.addEventListener('resize', () => {
    setVhProp();
});
setVhProp();
//
function setVhProp() {
    let vh = "100vh";
    if (isTouch()) {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        // const vh = window.innerHeight * 0.01;
        const vh = `${window.outerHeight}px`;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', vh);
    }
}
