export const ALERT_PRECAUTIONS = {
    Earthquake: {
        icon: 'earthquake',
        color: '#8B4513',
        precautions: [
            'Drop to your hands and knees. Cover your head and neck.',
            'Hold on to your shelter until the shaking stops.',
            'Stay away from glass, windows, and heavy furniture.',
            'If outdoors, move to an open area away from buildings.',
        ],
        actions: [
            { id: 'sos', label: 'SOS Alarm', icon: 'alarm-light' },
            { id: 'safe_zones', label: 'Nearby Safe Zones', icon: 'map-marker-radius' },
        ]
    },
    Flood: {
        icon: 'home-flood',
        color: '#0000FF',
        precautions: [
            'Move to higher ground immediately.',
            'Do not walk or drive through flood waters.',
            'Turn off utilities at the main switches if safe to do so.',
            'Keep an emergency kit with food and water ready.',
        ],
        actions: [
            { id: 'rescue', label: 'Request Rescue', icon: 'lifebuoy' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    Cyclone: {
        icon: 'weather-hurricane',
        color: '#4682B4',
        precautions: [
            'Stay indoors and keep away from windows.',
            'Ensure all doors and windows are securely closed.',
            'Listen to weather updates and local news.',
            'Keep emergency lights and power banks charged.',
        ],
        actions: [
            { id: '112', label: 'Call 112', icon: 'phone' },
            { id: 'shelter', label: 'Find Shelter', icon: 'home-variant' },
        ]
    },
    Tsunami: {
        icon: 'waves',
        color: '#008B8B',
        precautions: [
            'Move inland or to high ground immediately.',
            'Do not stay near the shore to watch the wave.',
            'Follow evacuation orders from local authorities.',
            'Stay tuned to the radio for official information.',
        ],
        actions: [
            { id: 'evacuate', label: 'Evacuation Route', icon: 'run' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    Landslide: {
        icon: 'image-filter-hdr',
        color: '#556B2F',
        precautions: [
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
        precautions: [
            'Evacuate the building immediately.',
            'Crawl low under smoke to find fresh air.',
            'Do not use elevators; use the stairs.',
            'If your clothes catch fire: Stop, Drop, and Roll.',
        ],
        actions: [
            { id: 'fire_dept', label: 'Call Fire Dept (101)', icon: 'fire-truck' },
            { id: '112', label: 'Call 112', icon: 'phone' },
        ]
    },
    'Industrial Accident': {
        icon: 'factory',
        color: '#708090',
        precautions: [
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
        precautions: [
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
        precautions: [
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
        precautions: [
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

export const getPrecautionsForType = (type) => {
    return ALERT_PRECAUTIONS[type] || ALERT_PRECAUTIONS.Other;
};
