import {
  autoDetectRenderer,
} from 'pixi.js'
import Victor from 'victor'
import Creature from './creature.class'
import Morsel from './morsel.class'
import ecosystem from './ecosystem.class'
import { stage } from './stage.instance'

import mockDna from '../__MOCKS__/creature.mock'

window.ecosystem = ecosystem

const renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: false})

document.body.appendChild(renderer.view)

function init() {
  // for (var i = 0; i < 1; i++) {
  //   const creature = new Creature(
  //     {
  //       x: Math.random() * window.innerWidth,
  //       y: Math.random() * window.innerHeight,
  //     },
  //     new Victor(1,1),
  //     false
  //   )
  //   ecosystem.addCreature({creature})
  // }
  window.addEventListener('click', crtrs)
}
function crtrs(e) {
  console.log(e.altKey)
  if (e.altKey) {
    for (var i = 0; i < 1; i++) {
      const morsel = new Morsel(
        {
          x: e.clientX,
          y: e.clientY,
        },
        500,
        10,
        0.9
      )
      // console.log(morsel.morselShape.x, morsel.morselShape.y)
      ecosystem.addMorsel({morsel})
    }
  } else {
    for (var i = 0; i < 1; i++) {
      const creature = new Creature(
        {
          x: e.clientX,
          y: e.clientY,
        },
        {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
        },
        mockDna
      )
      // console.log(morsel.morselShape.x, morsel.morselShape.y)
      ecosystem.addCreature({creature})
    }
  }
}

let frame = 0

function animate() {
  frame++
  if (ecosystem && frame % ecosystem.purgeEvery === 0) {
    console.log(ecosystem.purgeEvery)
    this.purgeCreatures(stage)
  }
  if (ecosystem) ecosystem.update(frame)
  window.requestAnimationFrame(animate)
  renderer.render(stage)
}

init()
animate()