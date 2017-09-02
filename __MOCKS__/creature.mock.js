const attrs = {
  energy: {
    max: 1000, // max
    price: 2, // energy units per unit food
    getsHungryAt: 300,
  },
  health: {
    max: 2000, // max points
    cost: 2, // energy cost per unit
    rechargeRate: 2,
  },
  move: {
    can: true,
    cost: 2, // energy units needed per unit of movement
    speed: 2, // multiplier for normalised velocity vector
  },
  hit: {
    can: true,
    cost: 2,
    range: 50,
    recharge : {
      rate: 200, // rate at which hit recharges
      value: 200, // 
    }, // rate of recharge per round  
  },

  beingRate: 2, // the rate of energy it costs just to be / resting metabolism rate
  likesToMove: 0.9, // probability that the creature will want to move
  eats: 123, // number(3), can only eat creatures whos emitnum is equal or similar to 'eats',
  speed: 200,
  strength: 200, // strength is proportional to energy? hitDamage will be relational to this.
  emits: {
    signature: 123, // number associated with poo of this creature,
    emitRateOfDecay: 200, // how quickly the emit decays.
  }, // scent number it emits after using energy
  senseRange: 100, // range around the creature it can detect
}

export default btoa(JSON.stringify(attrs))
