import {
  Graphics,
} from 'pixi.js'

export default class Creature {

  constructor(pos, dna) {

  }
}

// for every mutation points add up to total, eg if max energy goes up another attribute must go down
// if energy is 0, health will be depleted instead
// can only consume up to max energy

const dna = {
  energy: {
    points: 0, // current
    max: 0, // max
    price: 0, // units of food for one unit energy
  },
  health: {
    points: 0, // current points
    max: 0, // max points
    price: 0, // points of energy per unit health
    rechargeRate: 0,
  },
  move: {
    points: 0, // current points
    cost: 0, // energy cost to heal 1 point
    recharge : {
      rate: 0,
      value: 0,
    }, // rate of recharge per round

  },
  hit: {
    points: 0,
    cost: 0,
    recharge : {
      rate: 0, // rate at which hit recharges
      value: 0, // 
    }, // rate of recharge per round  
  },

  beingRate: 0,
  energyPerUnitFood: 0,

  speed: 0,
  strength: 0, // strength is proportional to energy?
  isDead: 0,
}
