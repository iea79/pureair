exports.Cursor = () => {
    const svgElement = document.querySelector('.one .svg-screen__room');
    const svgElementLast = document.querySelector('.six .svg-screen__room');
    const mask = document.getElementById('mask');
    const maskedElement = document.getElementById('mask-circle');
    const circleFeedback = document.getElementById('circle-shadow');
    const maskedElement2 = document.getElementById('mask-circle-2');
    const circleFeedback2 = document.getElementById('circle-shadow-2');
    const isTouch = function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }

    let svgPoint = svgElement.createSVGPoint();
    let svgPoint2 = svgElementLast.createSVGPoint();
    let enterFirstScreen = true;
    let enterLastScreen = false;

    if (isTouch()) {
        mask.remove();
    }

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
    }

    function update2(svgCoords) {
        maskedElement2.setAttribute('cx', svgCoords.x);
        maskedElement2.setAttribute('cy', svgCoords.y);
        circleFeedback2.setAttribute('cx', svgCoords.x);
        circleFeedback2.setAttribute('cy', svgCoords.y);
    }

    window.addEventListener('mousemove', function(e) {
      update(cursorPoint(e, svgElement));
      update2(cursorPoint(e, svgElementLast));
    }, false);

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        if (touch) {
            update(cursorPoint(touch, svgElement));
            update2(cursorPoint(touch, svgElementLast));
        }
    }, false);

};
