const firstPartArray =  [
		"Aesir",
		"Axe",
		"Battle",
		"Bear",
		"Berg",
		"Biscuit",
		"Black",
		"Blade",
		"Blood",
		"Blue",
		"Boar",
		"Board",
		"Bone",
		"Cage",
		"Cave",
		"Chain",
		"Cloud",
		"Coffee",
		"Code",
		"Death",
		"Dragon",
		"Dwarf",
		"Eel",
		"Egg",
		"Elk",
		"Fire",
		"Fjord",
		"Flame",
		"Flour",
		"Forge",
		"Fork",
		"Fox",
		"Frost",
		"Furnace",
		"Cheese",
		"Giant",
		"Glacier",
		"Goat",
		"God",
		"Gold",
		"Granite",
		"Griffon",
		"Grim",
		"Haggis",
		"Hall",
		"Hamarr",
		"Helm",
		"Horn",
		"Horse",
		"House",
		"Huskarl",
		"Ice",
		"Iceberg",
		"Icicle",
		"Iron",
		"Jarl",
		"Kelp",
		"Kettle",
		"Kraken",
		"Lake",
		"Light",
		"Long",
		"Mace",
		"Mead",
		"Maelstrom",
		"Mail",
		"Mammoth",
		"Man",
		"Many",
		"Mountain",
		"Mutton",
		"Noun",
		"Oath",
		"One",
		"Owl",
		"Pain",
		"Peak",
		"Pine",
		"Pot",
		"Rabbit",
		"Rat",
		"Raven",
		"Red",
		"Refresh",
		"Ring",
		"Rime",
		"Rock",
		"Root",
		"Rune",
		"Salmon",
		"Sap",
		"Sea",
		"Seven",
		"Shield",
		"Ship",
		"Silver",
		"Sky",
		"Slush",
		"Smoke",
		"Snow",
		"Spear",
		"Squid",
		"Steam",
		"Stone",
		"Storm",
		"Swine",
		"Sword",
		"Three",
		"Tongue",
		"Torch",
		"Troll",
		"Two",
		"Ulfsark",
		"Umlaut",
		"Unsightly",
		"Valkyrie",
		"Wave",
		"White",
		"Wolf",
		"Woman",
		"Worm",
		"Wyvern"
	];
const secondPartArray = [
		"admirer",
		"arm",
		"axe",
		"back",
		"bane",
		"baker",
		"basher",
		"beard",
		"bearer",
		"bender",
		"blade",
		"bleeder",
		"blender",
		"blood",
		"boiler",
		"bone",
		"boot",
		"borer",
		"born",
		"bow",
		"breaker",
		"breeder",
		"bringer",
		"brow",
		"builder",
		"chaser",
		"chiller",
		"collar",
		"counter",
		"curser",
		"dancer",
		"deck",
		"dottir",
		"doubter",
		"dreamer",
		"drinker",
		"drowner",
		"ear",
		"eater",
		"face",
		"fearer",
		"friend",
		"foot",
		"fury",
		"gorer",
		"grim",
		"grinder",
		"grower",
		"growth",
		"hacker",
		"hall",
		"hammer",
		"hand",
		"hands",
		"head",
		"hilt",
		"hugger",
		"hunter",
		"killer",
		"leg",
		"licker",
		"liker",
		"lost",
		"lover",
		"maker",
		"mender",
		"minder",
		"miner",
		"mocker",
		"monger",
		"neck",
		"puncher",
		"rage",
		"rhyme",
		"rider",
		"ringer",
		"roarer",
		"roller",
		"sailor",
		"screamer",
		"sequel",
		"server",
		"shield",
		"shoe",
		"singer",
		"skinner",
		"slinger",
		"slugger",
		"sniffer",
		"son",
		"smasher",
		"speaker",
		"stinker",
		"sucker",
		"sword",
		"tail",
		"tamer",
		"taster",
		"thigh",
		"tongue",
		"tosser",
		"tracker",
		"washer",
		"wielder",
		"wing",
		"wisher",
		"wrath"
	]


function returnPseudo() {

    const firstPartPseudo = Math.floor(Math.random() * (firstPartArray.length - 2 + 1) + 0)
    var secondPartPseudo = Math.floor(Math.random() * (secondPartArray.length - 2 + 1) + 0)

    var secondPartPseudoClean = secondPartArray[secondPartPseudo].charAt(0).toUpperCase() + secondPartArray[secondPartPseudo].slice(1);
    return firstPartArray[firstPartPseudo]+''+secondPartPseudoClean;
}
const PseudoGenerated = returnPseudo();

export {PseudoGenerated};