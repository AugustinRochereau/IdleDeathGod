function saveState()
{
  
  console.log("Saving");
  let stateTime = Date.now();
  let techTree = {};
  for(const [key, value] of Object.entries(technologies))
  {
    techTree[key] = value.isactive;
  }
  


  const stateData = {
    gameVars : gV,
    stateTime: stateTime,
    techTree: techTree,
  };
  document.cookie = `gameState=${encodeURIComponent(JSON.stringify(stateData))};path=/;max-age=31536000;SameSite=Lax`; // keep the cookie 1 year in memory

}


function loadState()
{  
  const cookies = document.cookie.split('; ');
  const gameStateCookie = cookies.find(cookie => cookie.startsWith('gameState='));
  if(!gameStateCookie)
  {
    // Pas de cookie  
    resetToDefaultValues(); 
  }
  else
  {
    const gameStateData = JSON.parse(decodeURIComponent(gameStateCookie.split('=')[1]));
    

    gV = gameStateData.gameVars; 

    // Update achievements 
    updateAchievement();

    
    for(var key in technologies)
    {
      technologies[key].isactive = gameStateData.techTree[key];
      if(technologies[key].upgradetype == 1 && technologies[key].isactive)
      {
        technologies[key].buyfunction();
      }
    }

    updateTechDependencies();
    updateTechButtonsDisplay();
  }
}
