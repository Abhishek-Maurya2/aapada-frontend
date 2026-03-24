export const ALERT_PRECAUTIONS = {
    Earthquake: {
        icon: 'earth',
        color: '#8B4513',
        defaultPrecautions: [
            { text: 'precautions.drop_cover_hold', graphic: 'earthquake_drop' },
            { text: 'precautions.hold_on', graphic: 'earthquake_drop' },
            { text: 'precautions.glass_furniture', graphic: 'cyclone_indoor' },
            { text: 'precautions.open_area', graphic: 'flood_high_ground' },
        ],
        levels: {
            CRITICAL: [
                { text: 'precautions.immediate_shelter', graphic: 'earthquake_drop' },
                { text: 'precautions.tall_structures', graphic: 'earthquake_drop' },
                { text: 'precautions.shut_utilities', graphic: 'cyclone_indoor' },
                { text: 'precautions.major_aftershocks', graphic: 'earthquake_drop' },
            ],
            HIGH: [
                { text: 'precautions.secure_appliances', graphic: 'cyclone_indoor' },
                { text: 'precautions.safe_interior', graphic: 'cyclone_indoor' },
                { text: 'precautions.go_bag', graphic: 'earthquake_drop' },
                { text: 'precautions.broadcast_inst', graphic: 'cyclone_indoor' },
            ]
        },
        actions: [
            { id: 'sos', label: 'emergency.sosHelp', icon: 'alarm-light' },
            { id: 'safe_zones', label: 'home.safeZones', icon: 'map-marker-radius' },
        ]
    },
    Flood: {
        icon: 'home-flood',
        color: '#0000FF',
        defaultPrecautions: [
            { text: 'precautions.higher_ground', graphic: 'flood_high_ground' },
            { text: 'precautions.walk_drive_flood', graphic: 'flood_high_ground' },
            { text: 'precautions.turn_off_switches', graphic: 'cyclone_indoor' },
            { text: 'precautions.kit_ready', graphic: 'flood_high_ground' },
        ],
        levels: {
            CRITICAL: [
                { text: 'precautions.evac_flash_flood', graphic: 'flood_high_ground' },
                { text: 'precautions.highest_possible', graphic: 'flood_high_ground' },
                { text: 'precautions.abandon_vehicles', graphic: 'flood_high_ground' },
                { text: 'precautions.electrical_wet', graphic: 'cyclone_indoor' },
            ],
            HIGH: [
                { text: 'precautions.pack_essentials', graphic: 'flood_high_ground' },
                { text: 'precautions.upper_floors', graphic: 'flood_high_ground' },
                { text: 'precautions.monitor_levels', graphic: 'flood_high_ground' },
                { text: 'precautions.low_lying_roads', graphic: 'flood_high_ground' },
            ]
        },
        actions: [
            { id: 'rescue', label: 'alertDetail.immediateActions', icon: 'lifebuoy' },
            { id: '112', label: 'home.call112', icon: 'phone' },
        ]
    },
    Cyclone: {
        icon: 'weather-hurricane',
        color: '#4682B4',
        defaultPrecautions: [
            { text: 'precautions.indoors_windows', graphic: 'cyclone_indoor' },
            { text: 'precautions.doors_secure', graphic: 'cyclone_indoor' },
            { text: 'precautions.weather_updates', graphic: 'cyclone_indoor' },
            { text: 'precautions.power_banks', graphic: 'cyclone_indoor' },
        ],
        levels: {
            CRITICAL: [
                { text: 'precautions.strongest_part', graphic: 'cyclone_indoor' },
                { text: 'precautions.glass_doors', graphic: 'cyclone_indoor' },
                { text: 'precautions.protect_head', graphic: 'cyclone_indoor' },
                { text: 'precautions.eye_storm', graphic: 'cyclone_indoor' },
            ],
            HIGH: [
                { text: 'precautions.board_up', graphic: 'cyclone_indoor' },
                { text: 'precautions.outdoor_furniture', graphic: 'cyclone_indoor' },
                { text: 'precautions.charge_devices', graphic: 'cyclone_indoor' },
                { text: 'precautions.cyclone_shelter', graphic: 'cyclone_indoor' },
            ]
        },
        actions: [
            { id: '112', label: 'home.call112', icon: 'phone' },
            { id: 'shelter', label: 'home.safeZones', icon: 'home-variant' },
        ]
    },
    Tsunami: {
        icon: 'waves',
        color: '#008B8B',
        defaultPrecautions: [
            { text: 'precautions.inland_high', graphic: 'tsunami_run' },
            { text: 'precautions.shore_wave', graphic: 'tsunami_run' },
            { text: 'precautions.official_orders', graphic: 'tsunami_run' },
            { text: 'precautions.radio_info', graphic: 'cyclone_indoor' },
        ],
        levels: {
            CRITICAL: [
                { text: 'precautions.tsunami_move_now', graphic: 'tsunami_run' },
                { text: 'precautions.no_wait_sirens', graphic: 'tsunami_run' },
                { text: 'precautions.inland_dist', graphic: 'tsunami_run' },
                { text: 'precautions.river_mouths', graphic: 'tsunami_run' },
            ],
            HIGH: [
                { text: 'precautions.coastal_zones', graphic: 'tsunami_run' },
                { text: 'precautions.beach_series', graphic: 'tsunami_run' },
                { text: 'precautions.wave_height', graphic: 'tsunami_run' },
                { text: 'precautions.all_clear_return', graphic: 'tsunami_run' },
            ]
        },
        actions: [
            { id: 'evacuate', label: 'home.checklist.evacuation', icon: 'run' },
            { id: '112', label: 'home.call112', icon: 'phone' },
        ]
    },
    Landslide: {
        icon: 'image-filter-hdr',
        color: '#556B2F',
        defaultPrecautions: [
            { text: 'Avoid areas prone to landslides like steep slopes.', graphic: 'flood_high_ground' },
            { text: 'Stay alert for unusual sounds that might indicate debris flow.', graphic: 'flood_high_ground' },
            { text: 'If near a stream, note any changes in water level.', graphic: 'flood_high_ground' },
            { text: 'Move quickly away from the path of the landslide.', graphic: 'flood_high_ground' },
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
            { text: 'precautions.evac_imm', graphic: 'fire_crawl' },
            { text: 'precautions.crawl_low', graphic: 'fire_crawl' },
            { text: 'precautions.no_elevators', graphic: 'fire_crawl' },
            { text: 'precautions.stop_drop_roll', graphic: 'fire_crawl' },
        ],
        levels: {
            CRITICAL: [
                { text: 'precautions.fire_spread', graphic: 'fire_crawl' },
                { text: 'precautions.touch_doors', graphic: 'fire_crawl' },
                { text: 'precautions.seal_cracks', graphic: 'fire_crawl' },
                { text: 'precautions.stay_out', graphic: 'fire_crawl' },
            ],
            HIGH: [
                { text: 'precautions.prepare_evac', graphic: 'fire_crawl' },
                { text: 'precautions.flammable_mats', graphic: 'fire_crawl' },
                { text: 'precautions.smoke_alarms', graphic: 'fire_crawl' },
                { text: 'precautions.escape_routes', graphic: 'fire_crawl' },
            ]
        },
        actions: [
            { id: 'fire_dept', label: 'alertDetail.emergency', icon: 'fire-truck' },
            { id: '112', label: 'home.call112', icon: 'phone' },
        ]
    },
    'Industrial Accident': {
        icon: 'factory',
        color: '#708090',
        defaultPrecautions: [
            { text: 'Stay indoors and seal all windows and doors.', graphic: 'cyclone_indoor' },
            { text: 'Turn off air conditioning and ventilation systems.', graphic: 'cyclone_indoor' },
            { text: 'Listen for official instructions regarding shelter or evacuation.', graphic: 'cyclone_indoor' },
            { text: 'If outside, move upwind and away from the source.', graphic: 'flood_high_ground' },
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
            { text: 'Stay hydrated and drink plenty of water.', graphic: 'flood_high_ground' },
            { text: 'Keep out of the sun during the hottest part of the day.', graphic: 'cyclone_indoor' },
            { text: 'Wear light-colored, loose-fitting clothing.', graphic: 'flood_high_ground' },
            { text: 'Check on neighbors, especially the elderly.', graphic: 'flood_high_ground' },
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
            { text: 'Stay indoors and avoid using electrical appliances.', graphic: 'cyclone_indoor' },
            { text: 'Keep away from windows and doors.', graphic: 'cyclone_indoor' },
            { text: 'If outdoors, find shelter in a low-lying area.', graphic: 'flood_high_ground' },
            { text: 'Do not stand under tall trees or near metal objects.', graphic: 'flood_high_ground' },
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
            { text: 'precautions.news_updates', graphic: 'cyclone_indoor' },
            { text: 'home.emergencyChecklist', graphic: 'flood_high_ground' },
            { text: 'precautions.comms_status', graphic: 'cyclone_indoor' },
            { text: 'precautions.official_orders', graphic: 'cyclone_indoor' },
        ],
        actions: [
            { id: '112', label: 'home.call112', icon: 'phone' },
            { id: 'share', label: 'common.back', icon: 'share-variant' },
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
