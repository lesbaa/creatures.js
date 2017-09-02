import {
  Graphics,
  Point,
} from 'pixi.js'
import Victor from 'victor'
import { stage } from './stage.instance'
import ecosystem from './ecosystem.class'

export default class Morsel {
  constructor(pos, points, maxInitSpeed, dampening) {
    this.coonter = 0
    this.id = btoa(Math.random() * Math.random())
    this.dampening = dampening
    this.points = points
    this.pos = new Victor(pos.x, pos.y)
    this.v = new Victor(
      ((Math.random() * 2) - 1) * maxInitSpeed,
      ((Math.random() * 2) - 1) * maxInitSpeed,
    )
    // console.log(this.v, this.pos, this.id)
    this.createMorselGraphic(pos.x, pos.y, points / 40)
    // console.log(pos)
  }

  be = () => {
    if (this.v) {
      this.move()
      this.isMoving = true
    } else {
      this.isMoving = false
    }
  }

  createMorselGraphic = (x, y, rad) => {
    const morselShape = new Graphics()
    morselShape.beginFill(0x00FFAA)
    morselShape.drawCircle(0, 0, rad)
    morselShape.x = x
    morselShape.y = y
    morselShape.endFill()
    this.morselShape = morselShape
  }

  move = () => {
    const { dampening } = this
    this.v.x *= dampening
    this.v.y *= dampening
    this.pos.x += this.v.x
    this.pos.y += this.v.y
    const newX = this.pos.x + this.v.x
    const newY = this.pos.y + this.v.y
    if ( newX > window.innerWidth || newX < 0 ) {
      this.v.invertX()
    }
    if ( newY > window.innerHeight || newY < 0 ) {
      this.v.invertY()
    }
    this.updateGraphic()
    if (this.v.x < 0.5 && this.v.y < 0.5 && this.v.x > -0.5 && this.v.y > -0.5) {
      this.v = false
    }
  }

  updateGraphic = () => {
    this.morselShape.x = this.pos.x
    this.morselShape.y = this.pos.y
  }

  getEaten = () => {
    this.points = 0
    this.pos.x = - 1000
    this.pos.y = - 1000
    this.hasBeenEaten = true
  }

}