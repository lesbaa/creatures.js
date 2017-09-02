import {
  Text,
  Graphics,
} from 'pixi.js'
import { stage } from './stage.instance'

class Ecosystem {
  constructor (purgeEvery) {
    this.creatures = {}
    this.morsels = {}
    this.purgeEvery = purgeEvery
  }

  init = (stage) => {
    Object.values(this.creatures)
      .forEach(creature => {
        stage.addChild(creature.creatureShape)
      })
    Object.values(this.morsels)
      .forEach(morsel => {
        stage.addChild(morsel.morselShape)
      })
  }

  addCreature = ({ creature }) => {
    this.creatures[creature.id] = creature
    stage.addChild(creature.creatureShape)

    const creatureDeets = new Text(`--`,{fontFamily : 'Arial', fontSize: 15, fill : 0x88FF66, align : 'left'})
    creature.deets = creatureDeets
    creatureDeets.x = creature.pos.x
    creatureDeets.y = creature.pos.y
    const creatureSenseRange = new Graphics(creature.pos.x, creature.pos.y)
    creatureSenseRange
      .lineStyle(1, 0x33DD00, 1)
      .drawCircle(0, 0, creature.attributes.senseRange)
      .endFill()
    creatureSenseRange.x = creature.pos.x
    creatureSenseRange.y = creature.pos.y
    creature.creatureSenseRangeOverlay = creatureSenseRange
    stage.addChild(creature.creatureSenseRangeOverlay)

    const creatureHitRange = new Graphics(creature.pos.x, creature.pos.y)
    creatureHitRange
      .lineStyle(1, 0x3333DD, 1)
      .drawCircle(0, 0, creature.attributes.hit.range)
      .endFill()
    creatureHitRange.x = creature.pos.x
    creatureHitRange.y = creature.pos.y
    creature.creatureHitRangeOverlay = creatureHitRange
    stage.addChild(creature.creatureHitRangeOverlay)

    stage.addChild(creature.deets)
  }

  addMorsel = ({ morsel }) => {
    this.morsels[morsel.id] = morsel
    stage.addChild(morsel.morselShape)
  }

  removeCreature = ({ creature }) => {
    this.creatures[creature.id] = creature
    stage.removeChild(creature.creatureShape)
    stage.removeChild(creature.creatureSenseRangeOverlay)
    stage.removeChild(creature.creatureHitRangeOverlay)
    stage.removeChild(creature.deets)
    // remove this from stage too!
  }

  removeMorsel = ({ morselId }) => {
    console.log('remove morsel')
    const morsel = this.morsels[morselId]
    delete this.morsels[morselId]
    stage.removeChild(morsel.morselShape)
    // remove this from stage too!
  }

  // call this every now and again, not every frame, once every 30 seconds or something
  purgeCreatures = () => {
    console.log(purgeCreatures)
    Object.keys(this.creatures)
      .forEach((key, ind) => {
        if (this.creatures[key].isDead) {
          console.log('removing deed beasties')
          stage.removeChild(this.creatures[key].creatureShape)
          delete this.creatures[key]
        }
      })
  }

  hit = ({ creatureId, points }) => {
    this.creatures[creatureId].takeHit(points)
  }

  eat = ({ morselId, points }) => {
    delete this.morsels[morselId]
  }

  update = (frame) => {
    Object.values(this.morsels)
      .forEach(mrsl => {
        mrsl.be()
      })
    Object.values(this.creatures)
      .forEach(crtr => {
        const {
          senseRange,
          hit,
        } = crtr.attributes
        // probably best to turn this into for loop for performance
        Object.values(this.morsels)
          .forEach(mrsl => {
            const distance = crtr.pos.distanceSq(mrsl.pos)
            // console.log(distance)
            // if (frame % 30 === 0) console.log(`whr:${crtr.hitRange.contains(mrsl.pos.x, mrsl.pos.y)}`)
            if (distance <= senseRange * senseRange) {
              crtr.setTarget(mrsl.pos, mrsl.id, mrsl.isMoving)
            } else {
              crtr.removeTarget(mrsl.id)
            }
            if (distance <= hit.range * hit.range) {
              crtr.eat({morselId: mrsl.id, points: mrsl.points})
              crtr.removeTarget(mrsl.id)
            }
          })
        crtr.be()
      })
  }

}

export default new Ecosystem(30000)