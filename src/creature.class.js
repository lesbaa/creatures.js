import {
  Graphics,
  Point,
  Circle,
} from 'pixi.js'
import Victor from 'victor'
import ecosystem from './ecosystem.class'
import Morsel from './morsel.class'
// creature metoblism types
const HEALTH = 'HEALTH'
const BEING = 'BEING'
const MOVE = 'MOVE'
const ENERGY = 'ENERGY'
const HIT = 'HIT'

// creature modes
const HUNTING = 'HUNTING'
const CHILLING = 'CHILLING'
const BREEDING = 'BREEDING'
const EATING = 'EATING'

export default class Creature {

  constructor(pos, v, dna) {
    this.dna = dna
    this.id = `${dna ? dna : '00'}--${btoa(Math.random()* Math.random() * 100)}`
    this.attributes = dna ?
      this.readDna(dna) :
      testAttributes
    this.createCreatureGraphic()
    this.senseRange = new Circle(pos.x, pos.y, this.attributes.senseRange)
    this.hitRange = new Circle(pos.x, pos.y, this.attributes.hit.range)
    this.canEat = true
    this.pos = pos ?
      new Victor(pos.x || 0, pos.y || 0) :
      new Victor(0, 0)
    this.v = v ?
      new Victor(v.x || 0, v.y || 0) :
      new Victor(0, 0)
    this.scale = new Point(1,1)
    this.currentEnergy = this.attributes.energy.max
    this.currentHealth = this.attributes.health.max
    // remove this
    window[`crtr--${this.id}`] = this
  }

  readDna = (dna) => {
    return JSON.parse(
      atob(dna)
    )
  }

  writeDna = (attrs) => {
    return btoa(
      JSON.stringify(attrs)
    )
  }
  // for every mutation points add up to total, eg if max energy goes up another attribute must go down
  // if energy is 0, health will be depleted instead
  // can only consume up to max energy
  // emits everytime energy is used
  dna = ''

  pos = {
    x: 200,
    y: 200,
  }


  setTarget = ({x, y}, id, targetIsMoving) => {
    this.currentTarget = { id, x, y }
    if (!this.wantsToMoveTo || targetIsMoving) {
      this.wantsToMoveTo = new Victor(x, y)
    }
  }

  removeTarget = (id) => {
    if (this.wantsToMoveTo && this.currentTarget.id === id) {
      this.wantsToMoveTo = false
    }
  }

  be = () => {
    if (this.isDead) return
    const {
      currentEnergy,
      currentHealth,
    } = this
    const {
      beingRate,
      health,
      energy,
    } = this.attributes
    if (currentHealth <= 0 && !this.isDead) this.die()
    if (currentHealth <= health.max && currentHealth > 0) {
      this.metabolise(HEALTH)
    }
    if (currentEnergy > -1 ) {
      this.metabolise(BEING)
    }
    if (currentHealth > 0 && currentEnergy <= 0) {
      this.currentHealth -= beingRate
    }
    if (currentEnergy > energy.max) this.currentEnergy = energy.max
    if (currentHealth > health.max) this.currentHealth = health.max
    this.update()
  }

  metabolise = (type) => {
    const {
      health,
      hit,
      move,
      beingRate,
    } = this.attributes
    if (this.currentEnergy > 0){
      switch (type) {
      case HEALTH:
        this.currentEnergy -= health.cost
        this.currentHealth += 1
        break
      case HIT:
        this.currentEnergy -= hit.cost
        break
      case MOVE:
        this.currentEnergy -= move.cost
        break
      case BEING:
        this.currentEnergy -= beingRate
        break
      default:
        this.currentEnergy -= 1
        return 1
        break
      }
    }
  }

  eat = ({morselId, points}) => {
    if (this.canEat) {
      const {
        health,
      } = this.attributes
      const {
        currentHealth,
      } = this
      let difference = 0
      if (currentHealth + points >= health.max) {
        this.currentHealth = health.max
        difference = currentHealth + points - health.max
        this.currentEnergy += difference
      }
      if (currentHealth + points <= health.max) {
        this.currentHealth += points
      }
      if (currentHealth === health.max) {
        this.currentEnergy += points
      }
      ecosystem.removeMorsel({ morselId })
      // pub to ecosystem that food p has been eaten
    }
  }

  currentHitCharge = 200
  isHitting = false
  hit = ({creatureId, points}) => {
    // use a pub-sub for this
    // ecosystem.hit(creatureId)
  }

  armour = 200
  takeHit = (points) => {
    const armourModifier = 1 - (1 / this.armour)
    this.currentHealth -= (points * armourModifier)
  }

  currentMoveCharge = 200
  isMoving = false

  move = ({ mode }) => {
    if (this.wantsToMoveTo) {
      const x = this.wantsToMoveTo.x - this.pos.x
      const y = this.wantsToMoveTo.y - this.pos.y
      this.v.x = x
      this.v.y = y
    }
    this.v.rotate((Math.random() - 0.5) * 0.4)
    this.v.normalize()
    this.metabolise(MOVE)
    const newX = this.pos.x + this.v.x
    const newY = this.pos.y + this.v.y
    if ( newX > window.innerWidth || newX < 0 ) {
      this.v.invertX()
    }
    if ( newY > window.innerHeight || newY < 0 ) {
      this.v.invertY()
    }
    this.pos.x += this.v.x
    this.pos.y += this.v.y
  }

  createCreatureGraphic = () => {
    const creatureShape = new Graphics()
    creatureShape
      .beginFill(0x00FFAA)
      .lineStyle(1, 0x33DD00, 1)
      .drawPolygon(new Point(0,10), new Point(10,0), new Point(0,-10), new Point(0,10))
      .endFill()
    const { pos } = this
    creatureShape.x = pos.x
    creatureShape.y = pos.y
    this.creatureShape = creatureShape
  }

  // wantsToMoveTo = new Victor (window.innerWidth / 2, window.innerHeight / 2) // vector of point where creature wants to move to

  update = () => {
    const { attributes: { energy } } = this
    let mode = CHILLING
    // console.log('update', this.pos, this.v.x)
    // if (Math.random() > 0.5) this.move()
    if (this.currentEnergy < energy.getsHungryAt) {
      mode = HUNTING
    }

    // look at having a WAITING mode for ambush predators.

    this.move({ mode })
    this.senseRange.x = this.pos.x
    this.senseRange.y = this.pos.y
    this.updateGraphic()
  }

  updateGraphic = () => {
    if (this.deets) {
      this.deets.text = `e: ${this.currentEnergy}\nh: ${this.currentHealth}`
      this.deets.x = this.pos.x + 10
      this.deets.y = this.pos.y + 10
    }
    if (this.creatureSenseRangeOverlay) {
      this.creatureSenseRangeOverlay.x = this.pos.x
      this.creatureSenseRangeOverlay.y = this.pos.y
    }
    if (this.creatureHitRangeOverlay) {
      this.creatureHitRangeOverlay.x = this.pos.x
      this.creatureHitRangeOverlay.y = this.pos.y
    }
    this.creatureShape.x = this.pos.x
    this.creatureShape.y = this.pos.y
    this.creatureShape.rotation = this.v.angle()
    if (this.isDying && this.scale.x > 0 && this.scale.y > 0) {
      const { scale } = this
      this.scale.set(scale.x -= 0.06, scale.y -= 0.06)
      this.creatureShape.scale = this.scale
    }
  }
  getDeathMorsels = () => {
    return [200]
  }

  isDead = false
  die = () => {
    this.v.x = 0
    this.v.y = 0
    if (!this.isDead && this.scale.x > 0) {
      this.scale.x -= 0.1
      this.scale.y -= 0.1
      this.isDying = true
      this.isDead = false
    } else {
      this.isDying = false
      this.isDead = true
      this.canEat = false
      const morsels = this.getDeathMorsels()
      morsels.forEach(points => {
        const morsel = new Morsel(
          {
            x: this.pos.x,
            y: this.pos.y,
          },
          points,
          10,
          0.9,
        )
        ecosystem.addMorsel({ morsel })
      })
      ecosystem.removeCreature({ creature: this })
    }
  }
}
