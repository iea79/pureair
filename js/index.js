import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import imageFrames from "../images/frames/*.png";
import imageFramesBack from "../images/frames-back/*.png";
import virusFrames from "../images/virus/*.png";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
    // markers: true
});
const now = new Date().getMilliseconds();

const winWidth = window.innerWidth;

const imgBox = document.querySelector('.img-box');

const svgImage = document.querySelectorAll('image');

svgImage.forEach(img => {
    let oneImg = document.createElement('img');
    oneImg.src = img.href.baseVal;
    imgBox.append(oneImg);
});

window.addEventListener('load', function() {
    console.log('window loaded');
    // const loadTime = now - window.performance.timing.loadEventEnd;
    // console.log(loadTime);
    document.querySelector(".preloader__container__percent").innerHTML = "100%";
    setTimeout(()=>{
        document.body.classList.remove("loading");
        gsap.to(".loader", 0.3, { delay: 0.5, y: "-100%" });
    }, 500);
});


const imgs = document.images;

let pagePercentLoaded = 0;
const loaderTimer = setInterval(function() {
    pagePercentLoaded++;
    document.querySelector(".preloader__container__percent").innerHTML = pagePercentLoaded + "%";
    if(pagePercentLoaded == 100){
        clearInterval(loaderTimer);
    }
}, 50);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const canvas = document.querySelector("#canvas-windows");
const context = canvas.getContext("2d");

const canvasSingle = document.querySelector("#canvas-windows");
const contextSingle = canvasSingle.getContext("2d");

const canvasBack = document.querySelector("#canvas-windows-back");
const contextBack = canvasBack.getContext("2d");

const virusCanvas = document.querySelector("#canvas-viruses");
const virusContext = virusCanvas.getContext("2d");

const sun = document.getElementById('sun');

canvas.width = canvasBack.width = canvasSingle.width = virusCanvas.width = 1024;
canvas.height = canvasBack.height = canvasSingle.height = virusCanvas.height = 1024;

const frameCountAll = 101;
const frameCountOne = 100;
const frameCountBack = 44;
const virusFramesCount = 111;

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
    img.src = imageFrames[i+1];
    images.push(img);
}

for (let i = 0; i < frameCountBack; i++) {
    const img = new Image();
    img.src = imageFramesBack[i+1];
    imagesBack.push(img);
}

for (let i = 0; i < virusFramesCount; i++) {
    const img = new Image();
    img.src = virusFrames[i];
    viruses.push(img);
}


let tl = new gsap.timeline({
    scrollTrigger: {
        trigger: ".one",
        start: "top top",
        end: "100%",
        scrub: true,
        pin:true,
        // onLeave: () => console.log('onLeave')
    }
});
if (winWidth < 480) {
    tl.to(canvas, {scale: 0.6,duration: 1});
} else {
    tl.to(canvas, {scale: 1,duration: 1});
}


gsap.to(frames, {
    frame: frameCountAll - 1,
    snap: "frame",
    scrollTrigger: {
        trigger: ".one",
        start: "top top",
        end: "150%",
        scrub: true,
        onUpdate: (self) => {
            renderOne();
        },
        onLeave: () => {
            clearCanvas(context);
        }
    },
});

gsap.to(frames, {
    frame: frameCountOne,
    snap: "frame",
    scrollTrigger: {
        trigger: ".two",
        start: "top top",
        end: "260%",
        scrub: true,
        onUpdate: renderSingle,
        onLeave: () => {
            clearCanvas(context);
        }
    },
});

gsap.to(frames, {
    frame: virusFramesCount - 1,
    snap: "frame",
    opacity:1,
    scrollTrigger: {
        trigger: ".two",
        start: "top top",
        end: "350%",
        scrub: true,
        onLeaveBack: () => {
            clearCanvas(virusContext);
        },
        onUpdate: renderViruses
    },
});

gsap.to(frames, {
    frame: frameCountBack - 1,
    snap: "frame",
    scale: 1,
    scrollTrigger: {
        trigger: ".five",
        start: "top top",
        end: "100%",
        scrub: true,
        onEnter: () => {
            clearCanvas(contextBack);
        },
        onUpdate: (self) => {
            renderBack();
            // console.dir(self);
        },
        onLeaveBack: () => {
            clearCanvas(contextBack);
            // console.log('onLeaveBack');
        },

    },
});

gsap.to(sun, {
    scrollTrigger: {
        trigger: ".four",
        start: "bottom bottom",
        end: "100%",
        scrub: true,
        pin:true,
        onLeaveBack: () => {
        },
        onUpdate: () => {
        }
    },
    x: '100%',
    rotation: 180,
    opacity: 1
});

gsap.to(".text", {
    opacity: 1,

    scrollTrigger: {
        trigger: ".two",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: true
    }
});

gsap.to(".five", {
    opacity: 1,

    scrollTrigger: {
        trigger: ".five",
        start: "top top",
        end: "200%",
        scrub: true,
        pin: true
    }
});

let formOffset = '100%';

if (winWidth < 480) {
    formOffset = '50%';
}

gsap.to(".contact-form", {
    opacity: 1,
    x: formOffset,

    scrollTrigger: {
        trigger: ".five-form",
        start: "top top",
        end: "50%",
        scrub: true,
        pin: true
    }
});

let tlb = new gsap.timeline({
    scrollTrigger: {
        trigger: ".five-box",
        start: "top top",
        end: "50%",
        scrub: true,
        pin:true,
    }
});

tlb.to(canvasBack, {scale: 0.4,duration: 2});

function renderOne() {
    clearCanvas(context);
    context.drawImage(images[frames.frame], 0, 0);
}

function renderSingle() {
    clearCanvas(contextSingle);
    contextSingle.drawImage(images[frameCountOne], 0, 0);
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

// Rect cursor
let svgElement = document.querySelector('.one .svg-screen__room');
let svgElementLast = document.querySelector('.five .svg-screen__room');
let maskedElement = document.getElementById('mask-circle');
let circleFeedback = document.getElementById('circle-shadow');
let maskedElement2 = document.getElementById('mask-circle-2');
let circleFeedback2 = document.getElementById('circle-shadow-2');
let svgPoint = svgElement.createSVGPoint();
let firstScreen = document.querySelector('.scene.one');
let lastScreen = document.querySelector('.scene.five');

function cursorPoint(e, svg) {
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    return svgPoint.matrixTransform(svg.getScreenCTM().inverse());
}

function update(svgCoords) {
    maskedElement.setAttribute('cx', svgCoords.x);
    maskedElement.setAttribute('cy', svgCoords.y);
    circleFeedback.setAttribute('cx', svgCoords.x);
    circleFeedback.setAttribute('cy', svgCoords.y);
    // document.body.style.cursor = 'none';
}

function updateLast(svgCoords) {
    maskedElement2.setAttribute('cx', svgCoords.x);
    maskedElement2.setAttribute('cy', svgCoords.y);
    circleFeedback2.setAttribute('cx', svgCoords.x);
    circleFeedback2.setAttribute('cy', svgCoords.y);
    // document.body.style.cursor = 'none';
}

window.addEventListener('mousemove', function(e) {
    update(cursorPoint(e, svgElement));
    updateLast(cursorPoint(e, svgElementLast));
}, false);

document.addEventListener('touchmove', function(e) {
    // e.preventDefault();
    var touch = e.targetTouches[0];
    if (touch) {
        update(cursorPoint(touch, svgElement));
        updateLast(cursorPoint(touch, svgElementLast));
    }
}, false);
