import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import imageFrames from "../images/frames/*.png";
import virusFrames from "../images/virus/*.png";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
    // markers: true
});

const loadTime = window.performance.timing.domContentLoadedEventEnd;
console.log(loadTime);

const body = document.querySelector("body");

let pagePercentLoaded = 0;
const loaderTimer = setInterval(function() {
    pagePercentLoaded++;
    document.querySelector(".preloader__container__percent").innerHTML = pagePercentLoaded + "%";
    if(pagePercentLoaded == 100){
        clearInterval(loaderTimer);
        body.classList.remove("loading");
        gsap.to(".loader", 0.3, { delay: 0.5, y: "-100%" });
    }
}, +loadTime / 10000);

const canvas = document.querySelector("#canvas-window");
const context = canvas.getContext("2d");

const virusCanvas = document.querySelector("#canvas-viruses");
const virusContext = virusCanvas.getContext("2d");

canvas.width = virusCanvas.width = 1024;
canvas.height = virusCanvas.height = 1024;

const frameCountAll = 101;
const frameCountOne = 101;
const virusFramesCount = 111;

const images = [];
const viruses = [];
const frames = {
    frame: 1
};

window.onload = () => {
    clearCanvas(context);
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    context.drawImage(images[1], 0, 0);
};

for (let i = 0; i < frameCountAll; i++) {
    const img = new Image();
    img.src = imageFrames[i+1];
    images.push(img);
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

tl.to(canvas, {scale: 1,duration: 1});
tl.to(".svg-screen", {opacity: 0,duration: 1});

gsap.to(frames, {
    frame: frameCountOne - 1,
    snap: "frame",
    scrollTrigger: {
        trigger: ".one",
        start: "top top",
        end: "150%",
        scrub: true,
        onUpdate: (self) => {
            renderOne();
            // console.dir(self);
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
        end: "150%",
        scrub: true,
        onLeaveBack: () => {
            // console.log('onLeaveBack');
            clearCanvas(virusContext);
        },
        onUpdate: renderViruses // use animation onUpdate instead of scrollTrigger's onUpdate
    },
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

function renderOne() {
    clearCanvas(context);
    context.drawImage(images[frames.frame], 0, 0);
}

function renderViruses() {
    clearCanvas(virusContext);
    virusContext.drawImage(viruses[frames.frame], 0, 0);
}

function clearCanvas(element) {
    element.clearRect(0, 0, canvas.width, canvas.height);
}

// Rect cursor
let svgElement = document.querySelector('.svg-screen__room');
let maskedElement = document.querySelector('#mask-circle');
let circleFeedback = document.querySelector('#circle-shadow');
let svgPoint = svgElement.createSVGPoint();
let firstScreen = document.querySelector('.scene.one');

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

window.addEventListener('mousemove', function(e) {
    update(cursorPoint(e, svgElement));
}, false);

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var touch = e.targetTouches[0];
    if (touch) {
        update(cursorPoint(touch, svgElement));
    }
}, false);
