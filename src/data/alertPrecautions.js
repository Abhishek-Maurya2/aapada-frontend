export const ALERT_PRECAUTIONS = {
    Earthquake: {
        icon: 'earth',
        color: '#8B4513',
        defaultPrecautions: [
            'Drop to your hands and knees. Cover your head and neck.',
            'Hold on to your shelter until the shaking stops.',
            'Stay away from glass, windows, and heavy furniture.',
            'If outdoors, move to an open area away from buildings.',
        ],
        levels: {
            CRITICAL: [
                'IMMEDIATE SHELTER: Drop, Cover, and Hold on NOW.',
                'Extreme shaking imminent; stay away from all tall structures.',
                'Shut off gas and electricity if you can do so instantly.',
                'Major aftershocks highly likely; do not enter buildings.',
            ],
            HIGH: [
                'Secure heavy appliances and move away from large windows.',
                'Identify a safe interior spot away from falling objects.',
                'Keep your emergency "Go-Bag" within arm\'s reach.',
                'Stay alert for local emergency broadcast instructions.',
            ]
        },
        actions: [
            { id: 'sos', label: 'SOS Alarm', icon: 'alarm-light' },
            { id: 'safe_zones', label: 'Nearby Safe Zones', icon: 'map-marker-radius' },
        ]
    },
    Flood: {
        icon: 'home-flood',
        color: '#0000FF',
        defaultPrecautions: [
            'Move to higher ground immediately.',
            'Do not walk or drive through flood waters.',
            'Turn off utilities at the main switches if safe to do so.',
            'Keep an emergency kit with food and water ready.',
        ],
        levels: {
            CRITICAL: [
                'EVACUATE IMMEDIATELY: Flash flood risk is extreme.',
                'Move to the highest possible ground or building level.',
                'Abandon vehicles if water begins to surround them.',
                'Do not touch electrical equipment if you are wet or in water.',
            ],
            HIGH: [
                'Prepare for immediate evacuation; pack essentials.',
                'Move valuable items to upper floors or high shelves.',
                'Monitor local water levels and weather stations closely.',
                'Avoid low-lying roads and underpasses.',
            ]
        },
        actions: [
            { id: 'rescue', label: 'Request Rescue', icon: 'lifebuoy' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    Cyclone: {
        icon: 'weather-hurricane',
        color: '#4682B4',
        defaultPrecautions: [
            'Stay indoors and keep away from windows.',
            'Ensure all doors and windows are securely closed.',
            'Listen to weather updates and local news.',
            'Keep emergency lights and power banks charged.',
        ],
        levels: {
            CRITICAL: [
                'EXTREME DANGER: Stay in the strongest part of your home.',
                'Stay away from all glass windows and sliding doors.',
                'If the building begins to fail, protect your head with cushions.',
                'DO NOT go outside during the "eye" of the storm.',
            ],
            HIGH: [
                'Board up windows or close heavy curtains/shutters.',
                'Bring in or secure outdoor furniture and projectiles.',
                'Charge all communication devices and medical equipment.',
                'Identify your nearest official cyclone shelter.',
            ]
        },
        actions: [
            { id: '112', label: 'Call 112', icon: 'phone' },
            { id: 'shelter', label: 'Find Shelter', icon: 'home-variant' },
        ]
    },
    Tsunami: {
        icon: 'waves',
        color: '#008B8B',
        defaultPrecautions: [
            'Move inland or to high ground immediately.',
            'Do not stay near the shore to watch the wave.',
            'Follow evacuation orders from local authorities.',
            'Stay tuned to the radio for official information.',
        ],
        levels: {
            CRITICAL: [
                'MOVE TO HIGH GROUND NOW: Tsunami wave arrival imminent.',
                'Do not wait for official sirens if you feel strong shaking.',
                'Move at least 2 miles inland or 100 feet above sea level.',
                'Stay away from coastal inlets and river mouths.',
            ],
            HIGH: [
                'Evacuate coastal zones immediately upon warning.',
                'Stay away from the beach; a tsunami is a series of waves.',
                'Listen to local maritime authorities for wave height updates.',
                'Do not return to low-lying areas until "All Clear" is given.',
            ]
        },
        actions: [
            { id: 'evacuate', label: 'Evacuation Route', icon: 'run' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    Landslide: {
        icon: 'image-filter-hdr',
        color: '#556B2F',
        defaultPrecautions: [
            'Avoid areas prone to landslides like steep slopes.',
            'Stay alert for unusual sounds that might indicate debris flow.',
            'If near a stream, note any changes in water level.',
            'Move quickly away from the path of the landslide.',
        ],
        actions: [
            { id: '112', label: 'Call 112', icon: 'phone' },
            { id: 'share', label: 'Share Location', icon: 'share-variant' },
        ]
    },
    Fire: {
        icon: 'fire',
        color: '#FF4500',
        defaultPrecautions: [
            'Evacuate the building immediately.',
            'Crawl low under smoke to find fresh air.',
            'Do not use elevators; use the stairs.',
            'If your clothes catch fire: Stop, Drop, and Roll.',
        ],
        levels: {
            CRITICAL: [
                'IMMEDIATE EVACUATE: Fire is spreading rapidly.',
                'Touch doors with the back of your hand before opening.',
                'If trapped, seal door cracks and signal from a window.',
                'Once out, STAY OUT. Do not go back for any reason.',
            ],
            HIGH: [
                'Prepare for potential evacuation; clear exit paths.',
                'Move flammable materials away from heat sources.',
                'Test smoke alarms and ensure extinguishers are ready.',
                'Map out at least two escape routes for every room.',
            ]
        },
        actions: [
            { id: 'fire_dept', label: 'Call Fire Dept (101)', icon: 'fire-truck' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    'Industrial Accident': {
        icon: 'factory',
        color: '#708090',
        defaultPrecautions: [
            'Stay indoors and seal all windows and doors.',
            'Turn off air conditioning and ventilation systems.',
            'Listen for official instructions regarding shelter or evacuation.',
            'If outside, move upwind and away from the source.',
        ],
        actions: [
            { id: '112', label: 'Call 112', icon: 'phone' },
            { id: 'medical', label: 'Medical Help', icon: 'hospital-box' },
        ]
    },
    Heatwave: {
        icon: 'thermometer-alert',
        color: '#FF8C00',
        defaultPrecautions: [
            'Stay hydrated and drink plenty of water.',
            'Keep out of the sun during the hottest part of the day.',
            'Wear light-colored, loose-fitting clothing.',
            'Check on neighbors, especially the elderly.',
        ],
        actions: [
            { id: 'cooling', label: 'Cooling Centers', icon: 'snowflake' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    Thunderstorm: {
        icon: 'weather-lightning',
        color: '#4B0082',
        defaultPrecautions: [
            'Stay indoors and avoid using electrical appliances.',
            'Keep away from windows and doors.',
            'If outdoors, find shelter in a low-lying area.',
            'Do not stand under tall trees or near metal objects.',
        ],
        actions: [
            { id: '112', label: 'Call 112', icon: 'phone' },
            { id: 'weather', label: 'Weather Updates', icon: 'weather-partly-cloudy' },
        ]
    },
    Other: {
        icon: 'alert-decagram',
        color: '#FF6347',
        defaultPrecautions: [
            'Stay alert and follow local news updates.',
            'Keep your emergency kit ready.',
            'Communicate your status to family and friends.',
            'Follow instructions from local authorities.',
        ],
        actions: [
            { id: '112', label: 'Call 112', icon: 'phone' },
            { id: 'share', label: 'Share Alert', icon: 'share-variant' },
        ]
    }
};

/**
 * Gets prioritized precautions based on disaster type, alert level, and title keywords.
 */
export const getPrecautionsForAlert = (alert) => {
    if (!alert) return ALERT_PRECAUTIONS.Other;

    const disasterType = alert.alertType || 'Other';
    const config = ALERT_PRECAUTIONS[disasterType] || ALERT_PRECAUTIONS.Other;

    const severity = (alert.severity || alert.flag || 'LOW').toUpperCase();
    const title = (alert.title || '').toLowerCase();

    // 1. Check for specific keyword overrides in title
    if (title.includes('fire') && disasterType !== 'Fire') {
        const fireConfig = ALERT_PRECAUTIONS.Fire;
        return { ...fireConfig, precautions: fireConfig.levels?.CRITICAL || fireConfig.defaultPrecautions };
    }
    
    if (title.includes('smoke') || title.includes('gas') || title.includes('chemical')) {
        const industrialConfig = ALERT_PRECAUTIONS['Industrial Accident'];
        return { ...industrialConfig, precautions: industrialConfig.defaultPrecautions };
    }

    // 2. Severity-based Level matching
    let levelPrecautions = null;
    if (severity === 'CRITICAL' || severity === 'RED') {
        levelPrecautions = config.levels?.CRITICAL;
    } else if (severity === 'HIGH' || severity === 'ORANGE') {
        levelPrecautions = config.levels?.HIGH;
    }

    return {
        ...config,
        precautions: levelPrecautions || config.defaultPrecautions || config.precautions
    };
};

/**
 * Legacy support for direct type lookup
 */
export const getPrecautionsForType = (type) => {
    const config = ALERT_PRECAUTIONS[type] || ALERT_PRECAUTIONS.Other;
    return {
        ...config,
        precautions: config.defaultPrecautions || config.precautions
    };
};
