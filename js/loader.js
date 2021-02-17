import {gsap} from 'gsap';

exports.Loader = () => {
    let progressCounter = 0;

    showProgress(30);

    const loader = document.querySelector('.loader');
    const counter = document.querySelector('.loader__percent');


    window.addEventListener('load', () => {
        showProgress(10, 'clear');
        showProgress(10);
    });

    function showProgress(interval, clear) {
        const progress = setInterval(() => {
            // console.log('Start percent');
            progressCounter++;
            counter.innerHTML = `${progressCounter}%`;
            if (clear) {
                clearInterval(progress);
                // console.log('Page loaded');
            }
            if (progressCounter >= 100) {
                clearInterval(progress);
                document.body.classList.remove('loading');
                gsap.to(loader, {y: '-100%', duration: 0.5});
            }
        }, interval);
    }
};

// function imgLoader() {
//     const imgBox = document.querySelector('.img-box');
//
//     const svgImage = document.querySelectorAll('image');
//
//     svgImage.forEach(img => {
//         let oneImg = document.createElement('img');
//         oneImg.src = img.href.baseVal;
//         imgBox.append(oneImg);
//     });
//
//     // window.addEventListener('load', function() {
//     //     document.querySelector(".loader__percent").innerHTML = "100%";
//     //     setTimeout( () => {
//     //         document.body.classList.remove("loading");
//     //         gsap.to(".loader", 0.3, { delay: 0.5, y: "-100%" });
//     //         setVhProp();
//     //     }, 500);
//     // });
//     //
//     // let pagePercentLoaded = 0;
//     // const loaderTimer = setInterval(function() {
//     //     pagePercentLoaded++;
//     //     document.querySelector(".loader__percent").innerHTML = pagePercentLoaded + "%";
//     //     if(pagePercentLoaded == 100){
//     //         clearInterval(loaderTimer);
//     //     }
//     // }, 50);
//
//     // window.addEventListener('resize', () => {
//     //     setVhProp();
//     // });
//     //
//     // function setVhProp() {
//     //     if (isTouch()) {
//     //         // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
//     //         const vh = window.innerHeight * 0.01;
//     //         // Then we set the value in the --vh custom property to the root of the document
//     //         document.documentElement.style.setProperty('--vh', `${vh}px`);
//     //     }
//     // }
//
// }
// loader();
