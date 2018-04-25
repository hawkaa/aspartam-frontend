import _ from 'lodash';
import './style.css';
import pentagon_big from './pentagon-big.svg';
import polygons from './polygons.json'
import printMe from './print.js';

function component() {
    var element = document.createElement('div');


    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    var img = new Image();
    img.src = pentagon_big;

    element.appendChild(img);

    const btn = document.createElement('button');
    btn.innerHTML = 'Click me';
    btn.onclick = printMe;

    element.appendChild(btn);



    return element;
}

document.body.appendChild(component());
console.log(polygons);