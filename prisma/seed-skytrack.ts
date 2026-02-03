import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🛫 Creating SkyTrack Guided Project...\n');

  // Create the main project
  const skytrack = await prisma.guidedProject.upsert({
    where: { slug: 'skytrack-flight-tracker' },
    update: {},
    create: {
      slug: 'skytrack-flight-tracker',
      title: 'SkyTrack: Live Flight Tracker',
      description: 'Build a real-time flight tracking platform with live data, interactive maps, and AI-powered predictions.',
      longDescription: `
# SkyTrack Flight Tracker

Build a complete flight tracking platform from scratch! This capstone project evolves with you through every chapter of the Python curriculum.

## What You'll Build
- 🛫 **Real-time flight tracking** using OpenSky Network API
- 🗺️ **Interactive world map** showing aircraft positions
- 📊 **Flight analytics** and statistics dashboard
- 🤖 **AI-powered predictions** for flight delays
- 🌐 **Deployed live** with a public URL you can share!

## How It Works
Each chapter adds new features to your flight tracker. You'll never delete code - only add and improve. By the end, you'll have a production-ready application with 2,500+ lines of code.

## Project Evolution
| Chapter | Lines | Feature Added |
|---------|-------|---------------|
| 1 | ~30 | Basic API |
| 5 | ~200 | History & Watchlists |
| 10 | ~500 | OOP Structure |
| 15 | ~900 | Analytics |
| 20 | ~1,400 | Full Dashboard |
| 25 | ~1,800 | ML Foundation |
| 31 | ~2,500 | AI Predictions Live! |
      `,
      imageUrl: '/images/projects/skytrack.png',
      difficulty: 'BEGINNER',
      estimatedHours: 40,
      technologies: ['Python', 'FastAPI', 'OpenSky Network API', 'SQLite', 'Pandas', 'Scikit-learn', 'Docker'],
      prerequisites: ['Basic computer skills', 'Enthusiasm to learn!'],
      learningOutcomes: [
        'Build REST APIs with FastAPI',
        'Work with real-time external APIs',
        'Store and query data in databases',
        'Create interactive visualizations',
        'Train and deploy ML models',
        'Deploy applications to the cloud'
      ],
      isPublished: true,
      order: 1,
    }
  });

  console.log(`✅ Created project: ${skytrack.title}`);

  // Define all milestones
  const milestones = [
    {
      chapterNumber: 1,
      title: 'Your First Flight API',
      description: 'Create the foundation - a working API endpoint that returns flight tracker info.',
      objectives: [
        'Set up a FastAPI project',
        'Create variables for API info',
        'Build your first endpoint',
        'See JSON in the browser'
      ],
      instructions: `
# Chapter 1: Your First Flight API

## Setup Your Project

\`\`\`bash
mkdir skytrack && cd skytrack
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install fastapi uvicorn
\`\`\`

## Create app.py

\`\`\`python
from fastapi import FastAPI

# Variables store our API information
api_name = "SkyTrack"
api_version = 1
api_status = "online"
total_flights_tracked = 0

app = FastAPI(title=api_name)

@app.get("/")
def home():
    return {
        "name": api_name,
        "version": api_version,
        "status": api_status,
        "message": "Welcome to SkyTrack Flight Tracker!",
        "flights_tracked": total_flights_tracked
    }
\`\`\`

## Run It!

\`\`\`bash
uvicorn app:app --reload
\`\`\`

Visit http://localhost:8000 - You built an API! 🎉

## Aviation Learning
Every flight tracking system starts with an API. FlightRadar24, FlightAware, and airline apps all use APIs to share flight data.
      `,
      starterCode: '',
      solutionCode: `from fastapi import FastAPI

api_name = "SkyTrack"
api_version = 1
api_status = "online"
total_flights_tracked = 0

app = FastAPI(title=api_name)

@app.get("/")
def home():
    return {
        "name": api_name,
        "version": api_version,
        "status": api_status,
        "message": "Welcome to SkyTrack Flight Tracker!",
        "flights_tracked": total_flights_tracked
    }`,
      hints: [
        'Make sure FastAPI is installed: pip install fastapi uvicorn',
        'The @app.get("/") decorator creates a route for the home page',
        'Return a dictionary - FastAPI converts it to JSON automatically'
      ],
      testInstructions: 'Visit http://localhost:8000 and verify you see JSON with your API info.',
      order: 1
    },
    {
      chapterNumber: 2,
      title: 'Flight Lookup & Conversions',
      description: 'Add flight number parsing and aviation unit conversions using operators.',
      objectives: [
        'Parse airline codes from flight numbers',
        'Convert altitude (meters to feet)',
        'Convert speed (knots to mph)',
        'Use arithmetic operators'
      ],
      instructions: `
# Chapter 2: Flight Lookup & Conversions

## Add to app.py

\`\`\`python
# Aviation constants
KM_TO_MILES = 0.621371
METERS_TO_FEET = 3.28084
KTS_TO_MPH = 1.15078

AIRLINE_CODES = {
    "AA": "American Airlines",
    "DL": "Delta Air Lines",
    "UA": "United Airlines",
    "WN": "Southwest Airlines",
}

@app.get("/flight/{flight_number}")
def get_flight(flight_number: str):
    flight_number = flight_number.upper()
    airline_code = flight_number[:2]  # String slicing!
    airline_name = AIRLINE_CODES.get(airline_code, "Unknown")
    
    return {
        "flight_number": flight_number,
        "airline_code": airline_code,
        "airline_name": airline_name
    }

@app.get("/convert/altitude/{meters}")
def convert_altitude(meters: float):
    feet = meters * METERS_TO_FEET
    return {"meters": meters, "feet": round(feet)}
\`\`\`

## Test It
- http://localhost:8000/flight/AA100 → American Airlines
- http://localhost:8000/convert/altitude/10000 → 32808 feet

## Aviation Learning
- Flight numbers: First 2 letters = airline code (AA = American)
- Altitude: Aviation uses FEET worldwide
- Speed: Aviation uses KNOTS (nautical miles per hour)
      `,
      hints: [
        'String slicing: flight_number[:2] gets first 2 characters',
        'Use .get() on dictionaries to provide a default value',
        'round() makes numbers cleaner for display'
      ],
      testInstructions: 'Test /flight/DL456 and /convert/altitude/10668 (should be ~35000 feet)',
      order: 2
    },
    {
      chapterNumber: 3,
      title: 'REAL Flight Tracking!',
      description: 'Connect to OpenSky Network API and track real flights with live data!',
      objectives: [
        'Fetch data from external API',
        'Use if/elif/else for flight phases',
        'Handle API errors gracefully',
        'Track actual aircraft!'
      ],
      instructions: `
# Chapter 3: REAL Flight Tracking! 🎉

This is the exciting chapter - you'll track REAL flights!

## Install requests
\`\`\`bash
pip install requests
\`\`\`

## Add to app.py

\`\`\`python
import requests

OPENSKY_API = "https://opensky-network.org/api/states/all"

def get_flight_phase(altitude_ft, vertical_rate):
    if altitude_ft < 100:
        return "On Ground"
    if vertical_rate > 500:
        return "Climbing"
    elif vertical_rate < -500:
        return "Descending"
    else:
        return "Cruising" if altitude_ft > 28000 else "Level Flight"

def fetch_live_flights():
    try:
        response = requests.get(OPENSKY_API, timeout=15)
        if response.status_code == 200:
            data = response.json()
            flights = {}
            for state in data.get('states', []):
                callsign = state[1].strip() if state[1] else None
                if callsign:
                    flights[callsign] = {
                        "latitude": state[6],
                        "longitude": state[5],
                        "altitude_m": state[7],
                        "velocity_ms": state[9],
                        "on_ground": state[8],
                        "vertical_rate": state[11]
                    }
            return flights
        return None
    except:
        return None

@app.get("/track/{callsign}")
def track_flight(callsign: str):
    callsign = callsign.upper()
    flights = fetch_live_flights()
    
    if not flights:
        return {"error": "Could not fetch flight data"}
    
    if callsign not in flights:
        return {"error": "Flight not found", "total_flights": len(flights)}
    
    flight = flights[callsign]
    alt_ft = (flight['altitude_m'] or 0) * 3.28084
    
    return {
        "callsign": callsign,
        "position": {"lat": flight['latitude'], "lon": flight['longitude']},
        "altitude_ft": round(alt_ft),
        "phase": get_flight_phase(alt_ft, flight['vertical_rate'] or 0)
    }
\`\`\`

## Try It!
1. Go to flightradar24.com
2. Click any airplane, note the callsign (e.g., "DAL1234")
3. Visit: http://localhost:8000/track/DAL1234

You're tracking REAL flights! ✈️
      `,
      hints: [
        'OpenSky returns data for ~8000 flights - be patient!',
        'Callsigns are like "DAL123" (Delta 123) or "UAL456" (United 456)',
        'If a flight isnt found, it might have landed - try another!'
      ],
      testInstructions: 'Find an active flight on FlightRadar24 and track it with your API!',
      order: 3
    },
    {
      chapterNumber: 4,
      title: 'Multiple Flight Tracking',
      description: 'Track multiple flights at once using loops and filtering.',
      objectives: [
        'Use for loops to process lists',
        'Filter flights by country',
        'Search by altitude range',
        'Calculate statistics'
      ],
      instructions: `
# Chapter 4: Multiple Flight Tracking

## Add to app.py

\`\`\`python
@app.get("/track/multiple/{callsigns}")
def track_multiple(callsigns: str):
    callsign_list = [cs.strip().upper() for cs in callsigns.split(",")]
    flights = fetch_live_flights()
    
    if not flights:
        return {"error": "Could not fetch data"}
    
    results = []
    for callsign in callsign_list:
        if callsign in flights:
            f = flights[callsign]
            results.append({
                "callsign": callsign,
                "altitude_ft": round((f['altitude_m'] or 0) * 3.28084),
                "found": True
            })
        else:
            results.append({"callsign": callsign, "found": False})
    
    return {"requested": len(callsign_list), "results": results}

@app.get("/flights/country/{country}")
def flights_by_country(country: str, limit: int = 20):
    # Implementation with for loop and continue
    pass

@app.get("/flights/statistics")
def flight_statistics():
    # Calculate averages, counts by country
    pass
\`\`\`

## Test It
- /track/multiple/DAL123,UAL456,AAL789
- /flights/country/United%20States
- /flights/statistics
      `,
      hints: [
        'split(",") breaks a string into a list',
        'Use continue to skip items in a loop',
        'Use break to exit a loop early'
      ],
      testInstructions: 'Track 3+ flights at once and verify statistics endpoint works.',
      order: 4
    },
    {
      chapterNumber: 5,
      title: 'Flight History & Watchlists',
      description: 'Store position history and create personal flight watchlists.',
      objectives: [
        'Use lists to store history',
        'Implement watchlist with append/remove',
        'Track all watchlist flights at once',
        'Slice lists for recent items'
      ],
      instructions: `
# Chapter 5: Flight History & Watchlists

## Add to app.py

\`\`\`python
from datetime import datetime

flight_history = {}  # {callsign: [positions...]}
watchlist = []       # List of callsigns

@app.post("/watchlist/add/{callsign}")
def add_to_watchlist(callsign: str):
    callsign = callsign.upper()
    if callsign not in watchlist:
        watchlist.append(callsign)
    return {"watchlist": watchlist}

@app.delete("/watchlist/remove/{callsign}")
def remove_from_watchlist(callsign: str):
    callsign = callsign.upper()
    if callsign in watchlist:
        watchlist.remove(callsign)
    return {"watchlist": watchlist}

@app.get("/watchlist/track")
def track_watchlist():
    # Track all watchlist flights at once
    flights = fetch_live_flights()
    results = []
    for cs in watchlist:
        if cs in flights:
            results.append({"callsign": cs, "found": True})
    return {"flights": results}

@app.get("/history/{callsign}")
def get_history(callsign: str, last_n: int = 10):
    callsign = callsign.upper()
    if callsign not in flight_history:
        return {"error": "No history"}
    return {"positions": flight_history[callsign][-last_n:]}
\`\`\`

## Test It
1. POST /watchlist/add/DAL123
2. POST /watchlist/add/UAL456
3. GET /watchlist/track
      `,
      hints: [
        'list.append() adds to end, list.remove() deletes by value',
        'list[-10:] gets last 10 items (slicing)',
        'Use "in" to check if item exists in list'
      ],
      testInstructions: 'Add 3 flights to watchlist, track them all, then remove one.',
      order: 5
    },
    {
      chapterNumber: 6,
      title: 'Aircraft Database',
      description: 'Build an aircraft registry using dictionaries.',
      objectives: [
        'Create nested dictionaries',
        'Store aircraft details',
        'Look up by tail number',
        'Update aircraft info'
      ],
      order: 6
    },
    {
      chapterNumber: 7,
      title: 'Save & Load Data',
      description: 'Export flight history to JSON/CSV files.',
      objectives: [
        'Write data to JSON files',
        'Read data on startup',
        'Export to CSV format',
        'Handle file errors'
      ],
      order: 7
    },
    {
      chapterNumber: 8,
      title: 'Error Handling',
      description: 'Make the API robust with proper error handling.',
      objectives: [
        'Handle API timeouts',
        'Validate user input',
        'Return proper HTTP errors',
        'Add retry logic'
      ],
      order: 8
    },
    {
      chapterNumber: 9,
      title: 'Utility Functions',
      description: 'Refactor code into reusable functions.',
      objectives: [
        'Extract common code',
        'Create helper functions',
        'Add documentation',
        'Follow DRY principles'
      ],
      order: 9
    },
    {
      chapterNumber: 10,
      title: 'OOP: Flight & Aircraft Classes',
      description: 'Structure code with classes for Flight and Aircraft.',
      objectives: [
        'Create Flight class',
        'Create Aircraft class',
        'Add methods for calculations',
        'Use class inheritance'
      ],
      order: 10
    },
    {
      chapterNumber: 13,
      title: 'Interactive Map! 🗺️',
      description: 'Display flights on an interactive world map with Folium.',
      objectives: [
        'Create HTML map with Folium',
        'Plot aircraft positions',
        'Add popup information',
        'Style markers by status'
      ],
      order: 13
    },
    {
      chapterNumber: 18,
      title: 'SQLite Database',
      description: 'Store flight data in a proper database.',
      objectives: [
        'Create SQLite database',
        'Define flight tables',
        'Insert and query data',
        'Join related tables'
      ],
      order: 18
    },
    {
      chapterNumber: 19,
      title: 'Pandas Analytics',
      description: 'Analyze flight data with Pandas DataFrames.',
      objectives: [
        'Load data into DataFrames',
        'Calculate statistics',
        'Group and aggregate',
        'Filter and sort'
      ],
      order: 19
    },
    {
      chapterNumber: 20,
      title: 'Dashboard Visualization',
      description: 'Create charts and graphs for flight analytics.',
      objectives: [
        'Plot flight statistics',
        'Create time series charts',
        'Build interactive dashboard',
        'Export visualizations'
      ],
      order: 20
    },
    {
      chapterNumber: 24,
      title: 'Deploy to Cloud! 🚀',
      description: 'Containerize and deploy your flight tracker online.',
      objectives: [
        'Create Dockerfile',
        'Set up environment variables',
        'Deploy to Railway/Render',
        'Get public URL!'
      ],
      order: 24
    },
    {
      chapterNumber: 25,
      title: 'ML: Load Flight Data',
      description: 'Prepare historical flight data for machine learning.',
      objectives: [
        'Load delay dataset',
        'Explore data patterns',
        'Handle missing values',
        'Create features'
      ],
      order: 25
    },
    {
      chapterNumber: 26,
      title: 'ML: Delay Predictor',
      description: 'Train a model to predict flight delays.',
      objectives: [
        'Split train/test data',
        'Train linear regression',
        'Evaluate accuracy',
        'Make predictions'
      ],
      order: 26
    },
    {
      chapterNumber: 29,
      title: 'ML Pipeline',
      description: 'Build a complete ML pipeline with scikit-learn.',
      objectives: [
        'Create preprocessing pipeline',
        'Train multiple models',
        'Compare performance',
        'Select best model'
      ],
      order: 29
    },
    {
      chapterNumber: 31,
      title: 'AI Predictions Live! 🤖',
      description: 'Deploy ML model to your API for live predictions.',
      objectives: [
        'Save trained model',
        'Create prediction endpoint',
        'Return delay probability',
        'Monitor performance'
      ],
      order: 31
    }
  ];

  // Create milestones
  for (const milestone of milestones) {
    await prisma.projectMilestone.upsert({
      where: {
        projectId_chapterNumber: {
          projectId: skytrack.id,
          chapterNumber: milestone.chapterNumber
        }
      },
      update: {},
      create: {
        projectId: skytrack.id,
        chapterNumber: milestone.chapterNumber,
        title: milestone.title,
        description: milestone.description,
        objectives: milestone.objectives || [],
        instructions: milestone.instructions || `# ${milestone.title}\n\nDetailed instructions coming soon...`,
        starterCode: milestone.starterCode || null,
        solutionCode: milestone.solutionCode || null,
        hints: milestone.hints || [],
        testInstructions: milestone.testInstructions || null,
        order: milestone.order
      }
    });
    console.log(`  ✓ Milestone ${milestone.chapterNumber}: ${milestone.title}`);
  }

  console.log(`\n✅ SkyTrack project created with ${milestones.length} milestones!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
