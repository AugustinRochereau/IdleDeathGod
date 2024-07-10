
let gV = // Game Vars
{
  livingHumans: 2,
  eternalHumans: 0,
  growthRate: 0.1,
  maxLivingHumans: 100,
  growthSlowdown: 2,
  deathRate: 0,
  deadSouls: 0,
  mortalRealmNumber: 1,
  lifeExpectancy: 20,
  years: 0,
  tickspeed: 1,
  soulPoints: 0,
  maxGrowthAffect: 0.1,
  soulPointMultiplier: 1,
  maxHumansGrowthRate: 0.01,
  maxHumansGrowthRateMultiplierCondition: 0,

  // World Tendancy variables 
  worldTendancyMinLifeExpectancy : 15,
  worldTendancyMaxLifeExpectancy : 25,

  // Civilisation variables
  isCivilisation: false,
  civName: '',
  nbLivingHumansToAdvance: 450,
  nbCivs: 0,

  // Upgrade variables
  upgradeCosts : {
      diseaseButton: 1000,
      tickspeedUpgrade: 100,
      soulVessels: 1000,
    },
  upgradeNumbers : {
      tickspeedUpgrade: 0,
      soulVessels: 0,
    },

  // Achievement variables
  achievement_unlocks : {
      'a1': false,
      'a2': false,
  },

  // Statistics variables
  maxPopulationEver: 0,
  maxPopulation: 0,
};
