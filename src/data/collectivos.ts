// Collectivo data for San Cristobal de las Casas
// Based on local knowledge and research

export interface CollectivoTerminal {
  id: string;
  name: string;
  location: [number, number]; // [latitude, longitude]
  description: string;
  access?: string;
}

export interface CollectivoStop {
  id: string;
  name: string;
  location: [number, number]; // [latitude, longitude]
  description?: string;
}

export interface CollectivoRoute {
  id: string;
  name: string;
  description: string;
  color: string;
  fare: string;
  type: 'neighborhood' | 'mountain' | 'intercity' | 'tourist';
  terminals: string[]; // Terminal IDs
  stops: CollectivoStop[];
}

// Main terminal stops
export const collectivoTerminals: CollectivoTerminal[] = [
  {
    id: "mercado-municipal",
    name: "Mercado Municipal",
    location: [16.7425, -92.6368], // Approximate location
    description: "The central hub for combi routes, this vibrant market area is where most combis begin their journeys. Travelers can find vans lined up or passing through, with destinations clearly marked on their windshields.",
    access: "A 10-minute walk from the main plaza. Head north on Av. 20 de Noviembre, then turn left onto Calle Utrilla. Taxis from the plaza cost ~60 MXN."
  },
  {
    id: "avenida-utrilla",
    name: "Avenida Utrilla",
    location: [16.7420, -92.6380], // Approximate location
    description: "This busy street is a key route for combis traveling to various neighborhoods. Passengers can flag down combis heading to destinations like El Cerrillo, Santa Lucía, or mountain areas.",
    access: "Easily reachable on foot from the market or plaza. Combis pass frequently, especially during daylight hours."
  },
  {
    id: "plaza-31-marzo",
    name: "Plaza 31 de Marzo (Central Plaza)",
    location: [16.7370, -92.6376], // Central plaza
    description: "While not a formal terminal, many combis pass through or near the plaza en route to their destinations. It's a strategic spot for catching rides to neighborhoods like La Merced or Guadalupe.",
    access: "Central and walkable from most downtown accommodations. Look for combis along Av. 20 de Noviembre or Av. 16 de Septiembre."
  }
];

// Mountain routes
export const mountainRoutes: CollectivoRoute[] = [
  {
    id: "huitepec",
    name: "Huitepec Ecological Reserve",
    description: "Route to the Huitepec Ecological Reserve, a cloud forest ideal for hiking and birdwatching.",
    color: "#4CAF50", // Green
    fare: "10-15 MXN",
    type: "mountain",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "huitepec-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "huitepec-2",
        name: "Av. Utrilla",
        location: [16.7420, -92.6380]
      },
      {
        id: "huitepec-3",
        name: "Las Palmas",
        location: [16.7500, -92.6500], // Approximate location
        description: "Drop-off point near Huitepec Ecological Reserve"
      }
    ]
  },
  {
    id: "moxviquil",
    name: "Reserva Moxviquil",
    description: "Route to the Moxviquil Ecological Reserve and Orchid Garden, with hiking trails and natural attractions.",
    color: "#8BC34A", // Light Green
    fare: "10-15 MXN",
    type: "mountain",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "moxviquil-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "moxviquil-2",
        name: "Av. Utrilla",
        location: [16.7420, -92.6380]
      },
      {
        id: "moxviquil-3",
        name: "Periférico Norte",
        location: [16.7480, -92.6420], // Approximate location
        description: "Drop-off near Moxviquil entrance"
      },
      {
        id: "moxviquil-4",
        name: "Barrio de Fátima",
        location: [16.7490, -92.6430], // Approximate location
        description: "Alternative drop-off for Moxviquil"
      }
    ]
  }
];

// Neighborhood routes
export const neighborhoodRoutes: CollectivoRoute[] = [
  {
    id: "cerrillo",
    name: "Barrio El Cerrillo",
    description: "Route to the historic neighborhood north of the center, known for ironworking and Casa Na Bolom.",
    color: "#FF5733", // Orange-Red
    fare: "6-10 MXN",
    type: "neighborhood",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "cerrillo-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "cerrillo-2",
        name: "Av. Utrilla",
        location: [16.7420, -92.6380]
      },
      {
        id: "cerrillo-3",
        name: "El Cerrillo",
        location: [16.7450, -92.6330], // Approximate location
        description: "Historic neighborhood north of the center"
      }
    ]
  },
  {
    id: "merced",
    name: "Barrio de la Merced",
    description: "Route to the neighborhood south of the center, home to the Amber Museum and traditional markets.",
    color: "#FFC107", // Amber
    fare: "6-10 MXN",
    type: "neighborhood",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "merced-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "merced-2",
        name: "Av. Insurgentes",
        location: [16.7380, -92.6390], // Approximate location
      },
      {
        id: "merced-3",
        name: "La Merced",
        location: [16.7320, -92.6380], // Approximate location
        description: "Neighborhood south of the center"
      }
    ]
  },
  {
    id: "mexicanos",
    name: "Barrio de Mexicanos",
    description: "Route to the residential area west of the center with local markets.",
    color: "#3F51B5", // Indigo
    fare: "6-10 MXN",
    type: "neighborhood",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "mexicanos-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "mexicanos-2",
        name: "Av. 20 de Noviembre",
        location: [16.7400, -92.6400], // Approximate location
      },
      {
        id: "mexicanos-3",
        name: "Mexicanos",
        location: [16.7380, -92.6500], // Approximate location
        description: "Residential area west of the center"
      }
    ]
  },
  {
    id: "guadalupe",
    name: "Barrio de Guadalupe",
    description: "Route to the area east of the center, featuring Iglesia de Guadalupe and art galleries.",
    color: "#E91E63", // Pink
    fare: "6-10 MXN",
    type: "neighborhood",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "guadalupe-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "guadalupe-2",
        name: "Real de Guadalupe",
        location: [16.7370, -92.6350], // Approximate location
      },
      {
        id: "guadalupe-3",
        name: "Iglesia de Guadalupe",
        location: [16.7350, -92.6300], // Approximate location
        description: "Church and surrounding neighborhood east of center"
      }
    ]
  },
  {
    id: "san-diego",
    name: "Barrio de San Diego",
    description: "Route to the area southwest of the center, known for traditional toy workshops.",
    color: "#9C27B0", // Purple
    fare: "6-10 MXN",
    type: "neighborhood",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "san-diego-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "san-diego-2",
        name: "Av. Insurgentes",
        location: [16.7380, -92.6390], // Approximate location
      },
      {
        id: "san-diego-3",
        name: "San Diego",
        location: [16.7300, -92.6420], // Approximate location
        description: "Neighborhood southwest of the center"
      }
    ]
  },
  {
    id: "santa-lucia",
    name: "Barrio de Santa Lucía",
    description: "Route to the quiet northern neighborhood with residential charm.",
    color: "#00BCD4", // Cyan
    fare: "6-10 MXN",
    type: "neighborhood",
    terminals: ["mercado-municipal"],
    stops: [
      {
        id: "santa-lucia-1",
        name: "Mercado Municipal",
        location: [16.7425, -92.6368]
      },
      {
        id: "santa-lucia-2",
        name: "Av. Utrilla",
        location: [16.7420, -92.6380]
      },
      {
        id: "santa-lucia-3",
        name: "Santa Lucía",
        location: [16.7460, -92.6370], // Approximate location
        description: "Quiet northern neighborhood"
      }
    ]
  }
];

// Tourist routes
export const touristRoutes: CollectivoRoute[] = [
  {
    id: "centro-historico",
    name: "Centro Histórico",
    description: "Route through the historic center of San Cristóbal, visiting key landmarks and cultural sites.",
    color: "#FF5733", // Orange-Red
    fare: "10-20 MXN",
    type: "tourist",
    terminals: ["plaza-31-marzo"],
    stops: [
      { id: "centro-1", name: "Catedral de San Cristóbal", location: [16.7370, -92.6376] },
      { id: "centro-2", name: "Arco del Carmen", location: [16.7352, -92.6390] },
      { id: "centro-3", name: "Mercado Municipal", location: [16.7380, -92.6410] },
      { id: "centro-4", name: "Templo de Santo Domingo", location: [16.7390, -92.6365] },
      { id: "centro-5", name: "Andador Eclesiástico", location: [16.7375, -92.6355] },
    ],
  },
  {
    id: "ruta-cultural",
    name: "Ruta Cultural",
    description: "Cultural route connecting museums and art centers throughout San Cristóbal.",
    color: "#33A1FF", // Blue
    fare: "10-20 MXN",
    type: "tourist",
    terminals: ["plaza-31-marzo"],
    stops: [
      { id: "cultural-1", name: "Museo Na Bolom", location: [16.7420, -92.6320] },
      { id: "cultural-2", name: "Museo del Ámbar", location: [16.7365, -92.6368] },
      { id: "cultural-3", name: "Centro Cultural El Carmen", location: [16.7350, -92.6395] },
      { id: "cultural-4", name: "Museo de Culturas Populares", location: [16.7385, -92.6372] },
    ],
  },
  {
    id: "pueblos-indigenas",
    name: "Pueblos Indígenas",
    description: "Route connecting San Cristóbal with nearby indigenous communities and cultural sites.",
    color: "#33FF57", // Green
    fare: "15-30 MXN",
    type: "tourist",
    terminals: ["mercado-municipal"],
    stops: [
      { id: "indigenas-1", name: "San Juan Chamula", location: [16.7833, -92.6833] },
      { id: "indigenas-2", name: "Zinacantán", location: [16.7667, -92.7167] },
      { id: "indigenas-3", name: "Tenejapa", location: [16.8167, -92.5167] },
      { id: "indigenas-4", name: "Amatenango del Valle", location: [16.5333, -92.4333] },
    ],
  },
  {
    id: "ruta-ecoturistica",
    name: "Ruta Ecoturística",
    description: "Route to major natural attractions and ecological sites around San Cristóbal.",
    color: "#9933FF", // Purple
    fare: "30-100 MXN",
    type: "tourist",
    terminals: ["mercado-municipal"],
    stops: [
      { id: "eco-1", name: "Cañón del Sumidero", location: [16.8500, -93.0833] },
      { id: "eco-2", name: "Cascadas El Chiflón", location: [16.1000, -92.2667] },
      { id: "eco-3", name: "Lagos de Montebello", location: [16.1167, -91.7333] },
      { id: "eco-4", name: "Cascadas de Agua Azul", location: [17.2500, -92.1167] },
    ],
  },
];

// Combine all routes
export const collectivoRoutes: CollectivoRoute[] = [
  ...mountainRoutes,
  ...neighborhoodRoutes,
  ...touristRoutes
];

// Helper function to get all routes
export const getAllCollectivoRoutes = () => {
  return collectivoRoutes;
};

// Helper function to get route by ID
export const getCollectivoRouteById = (id: string) => {
  return collectivoRoutes.find(route => route.id === id);
};

// Helper function to get terminal by ID
export const getCollectivoTerminalById = (id: string) => {
  return collectivoTerminals.find(terminal => terminal.id === id);
};

// Helper function to get all terminals
export const getAllCollectivoTerminals = () => {
  return collectivoTerminals;
};

// Helper function to get routes by type
export const getCollectivoRoutesByType = (type: 'neighborhood' | 'mountain' | 'intercity') => {
  return collectivoRoutes.filter(route => route.type === type);
};
