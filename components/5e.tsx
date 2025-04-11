import React, { useState } from 'react';

const DnDCharacterSheet = () => {
    const [character, setCharacter] = useState({
        // Basic Info
        name: 'Tordek Fireforge',
        class: 'Fighter',
        level: 3,
        background: 'Soldier',
        race: 'Dwarf (Mountain)',
        alignment: 'Lawful Good',
        experiencePoints: 900,

        // Ability Scores
        strength: 16,
        dexterity: 12,
        constitution: 16,
        intelligence: 10,
        wisdom: 13,
        charisma: 8,

        // Computed Values
        proficiencyBonus: 2,

        // Saving Throws (proficient in bold ones)
        savingThrows: {
            strength: true,
            dexterity: false,
            constitution: true,
            intelligence: false,
            wisdom: false,
            charisma: false
        },

        // Skills (proficient in checked ones)
        skills: {
            acrobatics: false,
            animalHandling: false,
            arcana: false,
            athletics: true,
            deception: false,
            history: false,
            insight: true,
            intimidation: true,
            investigation: false,
            medicine: false,
            nature: false,
            perception: true,
            performance: false,
            persuasion: false,
            religion: false,
            sleightOfHand: false,
            stealth: false,
            survival: true
        },

        // Combat Stats
        armorClass: 18,
        initiative: 1,
        speed: 25,
        hitPointsMax: 32,
        hitPointsCurrent: 32,
        hitDice: '3d10',

        // Equipment
        weapons: [
            { name: 'Battleaxe', attackBonus: 5, damage: '1d8+3 slashing' },
            { name: 'Handaxe', attackBonus: 5, damage: '1d6+3 slashing' },
            { name: 'Light Crossbow', attackBonus: 3, damage: '1d8+1 piercing' }
        ],

        armor: 'Chain Mail',

        // Features & Traits
        features: [
            'Darkvision (60 ft)',
            'Dwarven Resilience',
            'Stonecunning',
            'Second Wind',
            'Action Surge (1/rest)',
            'Combat Style: Defense (+1 AC)'
        ],

        // Background & Description
        personalityTraits: 'I\'m always polishing my armor and weapons.',
        ideals: 'Honor. My word is my bond.',
        bonds: 'I fight for those who cannot fight for themselves.',
        flaws: 'I have a weakness for ale and good stories.',

        // Spellcasting (empty for Fighter)
        spellcastingClass: '',
        spellcastingAbility: '',
        spellSaveDC: 0,
        spellAttackBonus: 0,

        // Equipment & Currency
        equipment: 'Traveler\'s clothes, mess kit, tinderbox, 10 torches, 10 days of rations, waterskin, 50 ft of hempen rope, signet ring of a mercenary company, trophy taken from a fallen enemy, backpack',
        currency: {
            copper: 10,
            silver: 50,
            electrum: 0,
            gold: 15,
            platinum: 0
        }
    });

    // Helper function to calculate ability modifier
    const getAbilityModifier = (score: number) => {
        return Math.floor((score - 10) / 2);
    };

    // Format modifier for display (+2 or -1)
    const formatModifier = (mod: number) => {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div className="flex flex-col p-4 bg-gray-100 text-gray-900 font-serif max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-800 pb-4">
                <h1 className="text-3xl font-bold">D&D 5e Character Sheet</h1>
                <div className="flex space-x-4">
                    <button className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800">Reset</button>
                    <button className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800">Save</button>
                </div>
            </div>

            {/* Character Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Character</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-600">Name</label>
                            <div className="font-bold">{character.name}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Class & Level</label>
                            <div>{character.class} {character.level}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Background</label>
                            <div>{character.background}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Race</label>
                            <div>{character.race}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Alignment</label>
                            <div>{character.alignment}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Experience</label>
                            <div>{character.experiencePoints}</div>
                        </div>
                    </div>
                </div>

                {/* Combat Stats */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Combat</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                            <div className="text-xs text-gray-600">Armor Class</div>
                            <div className="text-2xl font-bold border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                                {character.armorClass}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-600">Initiative</div>
                            <div className="text-2xl font-bold border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                                {formatModifier(getAbilityModifier(character.dexterity))}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-600">Speed</div>
                            <div className="text-2xl font-bold border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                                {character.speed}
                            </div>
                        </div>
                        <div className="col-span-3 mt-2">
                            <div className="text-xs text-gray-600">Hit Points</div>
                            <div className="flex items-center">
                                <div className="text-xl font-bold mr-2">{character.hitPointsCurrent}</div>
                                <div className="text-sm text-gray-600">/ {character.hitPointsMax}</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                    className="bg-red-600 h-2 rounded-full"
                                    style={{ width: `${(character.hitPointsCurrent / character.hitPointsMax) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="text-xs text-gray-600">Hit Dice</div>
                            <div>{character.hitDice}</div>
                        </div>
                    </div>
                </div>

                {/* Proficiency & Inspiration */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Other</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-600">Proficiency Bonus</div>
                            <div className="text-2xl font-bold">{formatModifier(character.proficiencyBonus)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600">Passive Perception</div>
                            <div className="text-2xl font-bold">
                                {10 + getAbilityModifier(character.wisdom) + (character.skills.perception ? character.proficiencyBonus : 0)}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="text-xs text-gray-600">Armor</div>
                            <div>{character.armor}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abilities, Saves, and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Ability Scores */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Abilities</h2>
                    <div className="space-y-4">
                        {['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map(ability => {
                            const abilityLower = ability.toLowerCase();
                            const score = character[abilityLower as keyof typeof character];
                            const mod = typeof score === "number" ? getAbilityModifier(score) : Number(score);

                            return (
                                <div key={ability} className="flex items-center">
                                    <div className="w-20">
                                        <div className="text-xs text-gray-600">{ability}</div>
                                        <div className="text-xl font-bold">{formatModifier(mod)}</div>
                                    </div>
                                    <div className="ml-2 text-sm border border-gray-300 px-2 py-1 rounded">
                                        {typeof score === "boolean" ? (score ? 'Proficient' : 'Not Proficient') : (
                                            typeof score === "object" ? 'N/A' : score
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Saving Throws */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Saving Throws</h2>
                    <div className="space-y-2">
                        {['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map(ability => {
                            const abilityLower = ability.toLowerCase();
                            const isProficient = character.savingThrows[abilityLower as keyof typeof character.savingThrows];
                            const mod = getAbilityModifier(Number(character[abilityLower as keyof typeof character]));
                            const total = mod + (isProficient ? character.proficiencyBonus : 0);

                            return (
                                <div key={ability} className="flex items-center">
                                    <div className="w-6 flex items-center justify-center">
                                        <div className={`w-4 h-4 rounded-full border ${isProficient ? 'bg-gray-800 border-gray-800' : 'border-gray-400'}`}></div>
                                    </div>
                                    <div className="w-16 text-center">{formatModifier(total)}</div>
                                    <div className={`ml-2 ${isProficient ? 'font-bold' : ''}`}>{ability}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white p-4 rounded shadow col-span-2">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Skills</h2>
                    <div className="grid grid-cols-2 gap-y-2">
                        {[
                            { name: 'Acrobatics', ability: 'dexterity', skill: 'acrobatics' },
                            { name: 'Animal Handling', ability: 'wisdom', skill: 'animalHandling' },
                            { name: 'Arcana', ability: 'intelligence', skill: 'arcana' },
                            { name: 'Athletics', ability: 'strength', skill: 'athletics' },
                            { name: 'Deception', ability: 'charisma', skill: 'deception' },
                            { name: 'History', ability: 'intelligence', skill: 'history' },
                            { name: 'Insight', ability: 'wisdom', skill: 'insight' },
                            { name: 'Intimidation', ability: 'charisma', skill: 'intimidation' },
                            { name: 'Investigation', ability: 'intelligence', skill: 'investigation' },
                            { name: 'Medicine', ability: 'wisdom', skill: 'medicine' },
                            { name: 'Nature', ability: 'intelligence', skill: 'nature' },
                            { name: 'Perception', ability: 'wisdom', skill: 'perception' },
                            { name: 'Performance', ability: 'charisma', skill: 'performance' },
                            { name: 'Persuasion', ability: 'charisma', skill: 'persuasion' },
                            { name: 'Religion', ability: 'intelligence', skill: 'religion' },
                            { name: 'Sleight of Hand', ability: 'dexterity', skill: 'sleightOfHand' },
                            { name: 'Stealth', ability: 'dexterity', skill: 'stealth' },
                            { name: 'Survival', ability: 'wisdom', skill: 'survival' }
                        ].map(({ name, ability, skill }) => {
                            const isProficient = character.skills[skill as keyof typeof character.skills];
                            const mod = getAbilityModifier(Number(character[ability as keyof typeof character]));
                            const total = mod + (isProficient ? character.proficiencyBonus : 0);

                            return (
                                <div key={name} className="flex items-center">
                                    <div className="w-6 flex items-center justify-center">
                                        <div className={`w-4 h-4 rounded-full border ${isProficient ? 'bg-gray-800 border-gray-800' : 'border-gray-400'}`}></div>
                                    </div>
                                    <div className="w-8 text-center">{formatModifier(total)}</div>
                                    <div className={`ml-2 ${isProficient ? 'font-bold' : ''}`}>
                                        {name} <span className="text-xs text-gray-500">({ability.charAt(0).toUpperCase()})</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Weapons & Equipment Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Weapons & Attacks */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Weapons & Attacks</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm">
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Attack Bonus</th>
                                <th className="pb-2">Damage/Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {character.weapons.map((weapon, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                    <td className="py-2">{weapon.name}</td>
                                    <td className="py-2">{formatModifier(weapon.attackBonus)}</td>
                                    <td className="py-2">{weapon.damage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Equipment & Currency */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Equipment</h2>
                    <div className="mb-4">
                        <div className="text-sm mb-2">{character.equipment}</div>
                    </div>

                    <h3 className="font-bold text-sm mb-1">Currency</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { name: 'CP', value: character.currency.copper },
                            { name: 'SP', value: character.currency.silver },
                            { name: 'EP', value: character.currency.electrum },
                            { name: 'GP', value: character.currency.gold },
                            { name: 'PP', value: character.currency.platinum },
                        ].map(currency => (
                            <div key={currency.name} className="text-center">
                                <div className="text-xs text-gray-600">{currency.name}</div>
                                <div className="border border-gray-300 rounded px-2 py-1">
                                    {currency.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features & Traits Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Features & Traits */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Features & Traits</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        {character.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                {/* Character Description */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2 border-b border-gray-300">Character</h2>
                    <div className="space-y-2">
                        <div>
                            <div className="text-sm font-bold">Personality Traits</div>
                            <div className="text-sm">{character.personalityTraits}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">Ideals</div>
                            <div className="text-sm">{character.ideals}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">Bonds</div>
                            <div className="text-sm">{character.bonds}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">Flaws</div>
                            <div className="text-sm">{character.flaws}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DnDCharacterSheet;