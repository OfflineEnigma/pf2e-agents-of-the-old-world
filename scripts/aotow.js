Hooks.once("ready", async () => {
    if (!game.modules.get("pf2e-dailies")?.active) return;

    //Get the compendium of subclasses
    const pack = game.packs.get("pf2e-agents-of-the-old-world.subclasses");
    if(!pack) return;

    //Get and filter for apparitions
    const index = await pack.getIndex({
        fields: ["system.traits.otherTags"]
    });
    
    const apparitions = index.filter((entry) => 
        entry.type === "feat" &&
        entry.system.traits.otherTags?.includes("animist-apparition")
    );

    const updatedSettings = foundry.utils.deepClone(
        game.settings.get("pf2e-dailies", "homebrewEntries")
    );

    //Make sure animist options exist!
    updatedSettings.animist ??= [];

    //Loop throughg apparitions, mark changed
    for(const apparition of apparitions){
        if(!updatedSettings.animist.includes(apparition.uuid)){
            updatedSettings.animist.push(apparition.uuid);
        }
    }

    //save changes
    await game.settings.set(
        "pf2e-dailies",
        "homebrewEntries",
        updatedSettings
    );
})