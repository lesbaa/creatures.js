import Creature from './creature.class'

import {
  Application,
  Container,
  autoDetectRenderer,
} from 'pixi.js'

const ecosystem = [];

const stage = new Container()
const renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: false});

document.body.appendChild(renderer.view);

function init() {

}

function animate() {
	window.requestAnimationFrame(animate);
	renderer.render(stage);
}

init();
animate();