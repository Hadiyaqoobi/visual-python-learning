import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const milestoneContent = [
  {
    chapterNumber: 6,
    title: 'Aircraft Database',
    description: 'Build an aircraft registry using dictionaries to store and lookup aircraft details.',
    objectives: ['Create nested dictionaries', 'Store aircraft by tail number', 'Look up aircraft details', 'Update aircraft info'],
    instructions: `
# Chapter 6: Aircraft Database

Now we'll build a proper aircraft registry using dictionaries - the perfect data structure for lookups!

## Add Aircraft Registry

\`\`\`python
# Aircraft database - nested dictionaries
aircraft_registry = {}

# Aircraft type info
AIRCRAFT_TYPES = {
    "B738": {"name": "Boeing 737-800", "manufacturer": "Boeing", "capacity": 189},
    "A320": {"name": "Airbus A320", "manufacturer": "Airbus", "capacity": 180},
    "B77W": {"name": "Boeing 777-300ER", "manufacturer": "Boeing", "capacity": 396},
    "A388": {"name": "Airbus A380-800", "manufacturer": "Airbus", "capacity": 555},
    "E190": {"name": "Embraer 190", "manufacturer": "Embraer", "capacity": 114},
}

@app.post("/aircraft/register")
def register_aircraft(
    tail_number: str,
    aircraft_type: str,
    airline: str,
    year: int = 2020
):
    tail_number = tail_number.upper()
    
    if tail_number in aircraft_registry:
        return {"error": "Aircraft already registered"}
    
    type_info = AIRCRAFT_TYPES.get(aircraft_type.upper(), {})
    
    aircraft_registry[tail_number] = {
        "tail_number": tail_number,
        "type_code": aircraft_type.upper(),
        "type_name": type_info.get("name", "Unknown"),
        "manufacturer": type_info.get("manufacturer", "Unknown"),
        "capacity": type_info.get("capacity", 0),
        "airline": airline,
        "year_manufactured": year,
        "total_flights": 0,
        "registered_at": datetime.now().isoformat()
    }
    
    return {"message": "Aircraft registered", "aircraft": aircraft_registry[tail_number]}

@app.get("/aircraft/{tail_number}")
def get_aircraft(tail_number: str):
    tail_number = tail_number.upper()
    
    if tail_number not in aircraft_registry:
        return {"error": "Aircraft not found"}
    
    return aircraft_registry[tail_number]

@app.get("/aircraft")
def list_aircraft(airline: str = None):
    if airline:
        filtered = {k: v for k, v in aircraft_registry.items() if v["airline"].lower() == airline.lower()}
        return {"count": len(filtered), "aircraft": filtered}
    return {"count": len(aircraft_registry), "aircraft": aircraft_registry}

@app.put("/aircraft/{tail_number}/flight")
def record_aircraft_flight(tail_number: str):
    tail_number = tail_number.upper()
    if tail_number in aircraft_registry:
        aircraft_registry[tail_number]["total_flights"] += 1
        return aircraft_registry[tail_number]
    return {"error": "Aircraft not found"}
\`\`\`

## Test It

1. Register an aircraft:
   POST http://localhost:8000/aircraft/register?tail_number=N12345&aircraft_type=B738&airline=American

2. Look it up:
   GET http://localhost:8000/aircraft/N12345

3. List all aircraft:
   GET http://localhost:8000/aircraft

## Aviation Learning

- **Tail Numbers**: Every aircraft has a unique registration (N12345 = US, G-ABCD = UK, C-GABC = Canada)
- **Type Codes**: ICAO codes identify aircraft models (B738 = Boeing 737-800)
- **Aircraft Registry**: FAA maintains the official US aircraft registry
`,
    hints: ['Dictionary keys must be unique - perfect for tail numbers!', 'Use .get() with defaults for safe lookups', 'Nested dictionaries let you store complex data'],
    testInstructions: 'Register 3 different aircraft, then list them all and verify the count.',
    solutionCode: `aircraft_registry = {}

AIRCRAFT_TYPES = {
    "B738": {"name": "Boeing 737-800", "manufacturer": "Boeing", "capacity": 189},
    "A320": {"name": "Airbus A320", "manufacturer": "Airbus", "capacity": 180},
}

@app.post("/aircraft/register")
def register_aircraft(tail_number: str, aircraft_type: str, airline: str, year: int = 2020):
    tail_number = tail_number.upper()
    if tail_number in aircraft_registry:
        return {"error": "Aircraft already registered"}
    
    type_info = AIRCRAFT_TYPES.get(aircraft_type.upper(), {})
    aircraft_registry[tail_number] = {
        "tail_number": tail_number,
        "type_code": aircraft_type.upper(),
        "type_name": type_info.get("name", "Unknown"),
        "airline": airline,
        "year_manufactured": year,
        "total_flights": 0
    }
    return {"message": "Aircraft registered", "aircraft": aircraft_registry[tail_number]}`
  },
  {
    chapterNumber: 7,
    title: 'Save & Load Data',
    description: 'Persist your flight data to JSON files so it survives server restarts.',
    objectives: ['Write data to JSON files', 'Load data on startup', 'Export to CSV format', 'Handle file errors gracefully'],
    instructions: `
# Chapter 7: Save & Load Data

Your data disappears when the server restarts! Let's fix that with file persistence.

## Add File Operations

\`\`\`python
import json
import csv
from pathlib import Path

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

def save_data(filename: str, data: dict):
    """Save dictionary to JSON file"""
    filepath = DATA_DIR / f"{filename}.json"
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    return filepath

def load_data(filename: str) -> dict:
    """Load dictionary from JSON file"""
    filepath = DATA_DIR / f"{filename}.json"
    if filepath.exists():
        with open(filepath, 'r') as f:
            return json.load(f)
    return {}

# Load data on startup
@app.on_event("startup")
def startup_event():
    global aircraft_registry, flight_history, watchlist
    aircraft_registry = load_data("aircraft_registry")
    flight_history = load_data("flight_history")
    watchlist_data = load_data("watchlist")
    watchlist = watchlist_data.get("items", [])
    print(f"Loaded {len(aircraft_registry)} aircraft, {len(flight_history)} flight histories")

@app.post("/data/save")
def save_all_data():
    """Save all data to files"""
    save_data("aircraft_registry", aircraft_registry)
    save_data("flight_history", flight_history)
    save_data("watchlist", {"items": watchlist})
    return {"message": "All data saved", "files": ["aircraft_registry.json", "flight_history.json", "watchlist.json"]}

@app.get("/export/csv/aircraft")
def export_aircraft_csv():
    """Export aircraft registry to CSV"""
    filepath = DATA_DIR / "aircraft_export.csv"
    
    if not aircraft_registry:
        return {"error": "No aircraft to export"}
    
    with open(filepath, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(list(aircraft_registry.values())[0].keys()))
        writer.writeheader()
        writer.writerows(aircraft_registry.values())
    
    return {"message": "Exported to CSV", "file": str(filepath), "count": len(aircraft_registry)}

@app.get("/export/csv/history/{callsign}")
def export_history_csv(callsign: str):
    """Export flight history to CSV"""
    callsign = callsign.upper()
    if callsign not in flight_history:
        return {"error": "No history for this callsign"}
    
    filepath = DATA_DIR / f"history_{callsign}.csv"
    positions = flight_history[callsign]
    
    with open(filepath, 'w', newline='') as f:
        if positions:
            writer = csv.DictWriter(f, fieldnames=positions[0].keys())
            writer.writeheader()
            writer.writerows(positions)
    
    return {"message": "Exported history", "file": str(filepath), "positions": len(positions)}
\`\`\`

## Test It

1. Add some data (aircraft, watchlist items)
2. Save: POST http://localhost:8000/data/save
3. Restart the server
4. Your data should still be there!

## File Structure
\`\`\`
skytrack/
├── app.py
└── data/
    ├── aircraft_registry.json
    ├── flight_history.json
    └── watchlist.json
\`\`\`
`,
    hints: ['Use Path from pathlib for cross-platform file paths', 'json.dump with default=str handles datetime objects', 'Always create directories with mkdir(exist_ok=True)'],
    testInstructions: 'Register aircraft, save data, restart server, verify data persists.',
    solutionCode: null
  },
  {
    chapterNumber: 8,
    title: 'Error Handling',
    description: 'Make your API bulletproof with proper error handling and validation.',
    objectives: ['Handle API timeouts', 'Validate user input', 'Return proper HTTP errors', 'Add retry logic'],
    instructions: `
# Chapter 8: Error Handling

Real APIs need to handle errors gracefully. Let's make SkyTrack bulletproof!

## Add Robust Error Handling

\`\`\`python
from fastapi import HTTPException, status
from tenacity import retry, stop_after_attempt, wait_exponential
import re

# Validation patterns
CALLSIGN_PATTERN = re.compile(r'^[A-Z]{2,3}\\d{1,4}[A-Z]?$')
TAIL_NUMBER_PATTERN = re.compile(r'^[A-Z]-?[A-Z]{1,5}$|^N\\d{1,5}[A-Z]{0,2}$')

def validate_callsign(callsign: str) -> str:
    """Validate and normalize callsign"""
    callsign = callsign.upper().strip()
    if not callsign:
        raise HTTPException(status_code=400, detail="Callsign cannot be empty")
    if len(callsign) > 10:
        raise HTTPException(status_code=400, detail="Callsign too long")
    return callsign

def validate_tail_number(tail: str) -> str:
    """Validate aircraft tail number format"""
    tail = tail.upper().strip()
    if not TAIL_NUMBER_PATTERN.match(tail):
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid tail number format: {tail}. Examples: N12345, G-ABCD"
        )
    return tail

# Retry decorator for external API calls
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_live_flights_with_retry():
    """Fetch flights with automatic retry on failure"""
    response = requests.get(OPENSKY_API, timeout=15)
    response.raise_for_status()  # Raises exception for 4xx/5xx
    return response.json()

def fetch_live_flights():
    """Fetch with error handling"""
    try:
        data = fetch_live_flights_with_retry()
        flights = {}
        for state in data.get('states', []) or []:
            callsign = (state[1] or '').strip()
            if callsign:
                flights[callsign] = {
                    "latitude": state[6],
                    "longitude": state[5],
                    "altitude_m": state[7] or 0,
                    "velocity_ms": state[9] or 0,
                    "on_ground": state[8],
                    "vertical_rate": state[11] or 0,
                    "origin_country": state[2]
                }
        return flights
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="OpenSky API timeout - try again")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"OpenSky API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.get("/track/{callsign}")
def track_flight(callsign: str):
    callsign = validate_callsign(callsign)
    
    flights = fetch_live_flights()
    
    if callsign not in flights:
        raise HTTPException(
            status_code=404,
            detail=f"Flight {callsign} not found. It may have landed or not yet departed."
        )
    
    flight = flights[callsign]
    # ... rest of tracking logic
\`\`\`

## Install tenacity for retries
\`\`\`bash
pip install tenacity
\`\`\`

## HTTP Status Codes Used
- **400** Bad Request - Invalid input
- **404** Not Found - Flight/aircraft doesn't exist
- **502** Bad Gateway - External API error
- **504** Gateway Timeout - External API slow
`,
    hints: ['Use HTTPException for proper error responses', 'tenacity library provides easy retry logic', 'Always validate user input before processing'],
    testInstructions: 'Try invalid callsigns, disconnect internet briefly, verify graceful errors.',
    solutionCode: null
  },
  {
    chapterNumber: 9,
    title: 'Utility Functions',
    description: 'Refactor your code into clean, reusable functions following DRY principles.',
    objectives: ['Extract common code patterns', 'Create helper functions', 'Add documentation', 'Follow DRY principles'],
    instructions: `
# Chapter 9: Utility Functions

Time to clean up! Let's refactor common patterns into reusable functions.

## Create utils.py

\`\`\`python
# utils.py
"""
SkyTrack Utility Functions
Aviation calculations and helpers
"""

from datetime import datetime
from typing import Optional, Tuple

# Constants
METERS_TO_FEET = 3.28084
KTS_TO_MPH = 1.15078
MS_TO_KTS = 1.944
MS_TO_FPM = 196.85  # meters/sec to feet/min

def meters_to_feet(meters: Optional[float]) -> int:
    """Convert meters to feet, handling None values"""
    if meters is None:
        return 0
    return round(meters * METERS_TO_FEET)

def ms_to_knots(ms: Optional[float]) -> int:
    """Convert m/s to knots"""
    if ms is None:
        return 0
    return round(ms * MS_TO_KTS)

def ms_to_fpm(ms: Optional[float]) -> int:
    """Convert m/s to feet per minute (for vertical rate)"""
    if ms is None:
        return 0
    return round(ms * MS_TO_FPM)

def get_heading_direction(heading: Optional[float]) -> str:
    """Convert heading degrees to compass direction"""
    if heading is None:
        return "Unknown"
    
    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    index = round(heading / 45) % 8
    return directions[index]

def get_flight_phase(altitude_ft: int, vertical_rate_fpm: int, on_ground: bool) -> str:
    """Determine flight phase from altitude and vertical rate"""
    if on_ground:
        return "On Ground"
    if altitude_ft < 1000:
        return "Initial Climb" if vertical_rate_fpm > 100 else "Final Approach"
    if vertical_rate_fpm > 500:
        return "Climbing"
    if vertical_rate_fpm < -500:
        return "Descending"
    if altitude_ft > 28000:
        return "Cruising"
    return "Level Flight"

def format_flight_data(raw_state: dict) -> dict:
    """Transform raw OpenSky data into clean format"""
    alt_ft = meters_to_feet(raw_state.get('altitude_m'))
    vrate_fpm = ms_to_fpm(raw_state.get('vertical_rate'))
    
    return {
        "position": {
            "lat": raw_state.get('latitude'),
            "lon": raw_state.get('longitude')
        },
        "altitude_ft": alt_ft,
        "speed_kts": ms_to_knots(raw_state.get('velocity_ms')),
        "heading": raw_state.get('heading'),
        "heading_direction": get_heading_direction(raw_state.get('heading')),
        "vertical_rate_fpm": vrate_fpm,
        "phase": get_flight_phase(alt_ft, vrate_fpm, raw_state.get('on_ground', False)),
        "on_ground": raw_state.get('on_ground', False),
        "origin_country": raw_state.get('origin_country', 'Unknown')
    }

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in nautical miles (Haversine formula)"""
    import math
    
    R = 3440.065  # Earth radius in nautical miles
    
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return round(R * c, 1)
\`\`\`

## Update app.py to use utils

\`\`\`python
from utils import meters_to_feet, ms_to_knots, get_flight_phase, format_flight_data

@app.get("/track/{callsign}")
def track_flight(callsign: str):
    callsign = validate_callsign(callsign)
    flights = fetch_live_flights()
    
    if callsign not in flights:
        raise HTTPException(status_code=404, detail=f"Flight {callsign} not found")
    
    raw = flights[callsign]
    formatted = format_flight_data(raw)
    
    return {
        "callsign": callsign,
        **formatted,
        "tracked_at": datetime.now().isoformat()
    }
\`\`\`

## Benefits of Refactoring
- **DRY**: Don't Repeat Yourself
- **Testable**: Easy to unit test individual functions
- **Readable**: Clear function names explain intent
- **Maintainable**: Change logic in one place
`,
    hints: ['Type hints make code self-documenting', 'Docstrings explain what functions do', 'Small focused functions are easier to test'],
    testInstructions: 'Verify all endpoints still work after refactoring.',
    solutionCode: null
  },
  {
    chapterNumber: 10,
    title: 'OOP: Flight & Aircraft Classes',
    description: 'Structure your code with classes for Flight, Aircraft, and Position.',
    objectives: ['Create Flight class', 'Create Aircraft class', 'Add methods for calculations', 'Use dataclasses for clean code'],
    instructions: `
# Chapter 10: Object-Oriented Programming

Let's level up with classes! OOP makes complex data easier to manage.

## Create models.py

\`\`\`python
# models.py
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class FlightPhase(Enum):
    ON_GROUND = "On Ground"
    INITIAL_CLIMB = "Initial Climb"
    CLIMBING = "Climbing"
    CRUISING = "Cruising"
    DESCENDING = "Descending"
    APPROACH = "Final Approach"
    UNKNOWN = "Unknown"

@dataclass
class Position:
    latitude: float
    longitude: float
    altitude_ft: int = 0
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> dict:
        return {
            "lat": self.latitude,
            "lon": self.longitude,
            "altitude_ft": self.altitude_ft,
            "timestamp": self.timestamp.isoformat()
        }

@dataclass
class Flight:
    callsign: str
    position: Position
    speed_kts: int = 0
    heading: float = 0
    vertical_rate_fpm: int = 0
    on_ground: bool = False
    origin_country: str = "Unknown"
    
    @property
    def phase(self) -> FlightPhase:
        if self.on_ground:
            return FlightPhase.ON_GROUND
        if self.position.altitude_ft < 1000:
            return FlightPhase.INITIAL_CLIMB if self.vertical_rate_fpm > 100 else FlightPhase.APPROACH
        if self.vertical_rate_fpm > 500:
            return FlightPhase.CLIMBING
        if self.vertical_rate_fpm < -500:
            return FlightPhase.DESCENDING
        if self.position.altitude_ft > 28000:
            return FlightPhase.CRUISING
        return FlightPhase.UNKNOWN
    
    @property
    def heading_direction(self) -> str:
        directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        index = round(self.heading / 45) % 8
        return directions[index]
    
    def to_dict(self) -> dict:
        return {
            "callsign": self.callsign,
            "position": self.position.to_dict(),
            "speed_kts": self.speed_kts,
            "heading": self.heading,
            "heading_direction": self.heading_direction,
            "vertical_rate_fpm": self.vertical_rate_fpm,
            "phase": self.phase.value,
            "on_ground": self.on_ground,
            "origin_country": self.origin_country
        }
    
    @classmethod
    def from_opensky(cls, callsign: str, state: dict) -> 'Flight':
        """Create Flight from OpenSky API data"""
        from utils import meters_to_feet, ms_to_knots, ms_to_fpm
        
        position = Position(
            latitude=state.get('latitude') or 0,
            longitude=state.get('longitude') or 0,
            altitude_ft=meters_to_feet(state.get('altitude_m'))
        )
        
        return cls(
            callsign=callsign,
            position=position,
            speed_kts=ms_to_knots(state.get('velocity_ms')),
            heading=state.get('heading') or 0,
            vertical_rate_fpm=ms_to_fpm(state.get('vertical_rate')),
            on_ground=state.get('on_ground', False),
            origin_country=state.get('origin_country', 'Unknown')
        )

@dataclass
class Aircraft:
    tail_number: str
    type_code: str
    type_name: str
    manufacturer: str
    airline: str
    capacity: int = 0
    year_manufactured: int = 2020
    total_flights: int = 0
    
    def record_flight(self):
        self.total_flights += 1
    
    def to_dict(self) -> dict:
        return {
            "tail_number": self.tail_number,
            "type_code": self.type_code,
            "type_name": self.type_name,
            "manufacturer": self.manufacturer,
            "airline": self.airline,
            "capacity": self.capacity,
            "year_manufactured": self.year_manufactured,
            "total_flights": self.total_flights
        }
\`\`\`

## Update app.py

\`\`\`python
from models import Flight, Aircraft, Position

@app.get("/track/{callsign}")
def track_flight(callsign: str):
    callsign = validate_callsign(callsign)
    flights_data = fetch_live_flights()
    
    if callsign not in flights_data:
        raise HTTPException(status_code=404, detail=f"Flight {callsign} not found")
    
    flight = Flight.from_opensky(callsign, flights_data[callsign])
    
    return {
        **flight.to_dict(),
        "tracked_at": datetime.now().isoformat()
    }
\`\`\`

## Why Classes?
- **Encapsulation**: Data and behavior together
- **Properties**: Computed values like \`phase\`
- **Factory Methods**: \`from_opensky()\` creates objects cleanly
- **Type Safety**: Clear structure for your data
`,
    hints: ['@dataclass reduces boilerplate code', 'Properties compute values on access', 'Factory methods (from_x) create objects from various sources'],
    testInstructions: 'All endpoints should work the same, but code is now cleaner.',
    solutionCode: null
  },
  {
    chapterNumber: 13,
    title: 'Interactive Map! 🗺️',
    description: 'Display flights on an interactive world map with Folium - see planes move in real-time!',
    objectives: ['Create HTML map with Folium', 'Plot aircraft positions', 'Add popup information', 'Style markers by flight phase'],
    instructions: `
# Chapter 13: Interactive Map! 🗺️

The moment you've been waiting for - see flights on a REAL map!

## Install Folium

\`\`\`bash
pip install folium
\`\`\`

## Add Map Endpoint

\`\`\`python
import folium
from fastapi.responses import HTMLResponse

# Marker colors by flight phase
PHASE_COLORS = {
    "On Ground": "gray",
    "Initial Climb": "lightblue",
    "Climbing": "blue",
    "Cruising": "green",
    "Descending": "orange",
    "Final Approach": "red",
    "Level Flight": "purple",
    "Unknown": "black"
}

@app.get("/map", response_class=HTMLResponse)
def get_flight_map(
    lat: float = 39.8283,  # Center of US
    lon: float = -98.5795,
    zoom: int = 4
):
    """Generate interactive map with current flights"""
    
    # Create base map
    m = folium.Map(
        location=[lat, lon],
        zoom_start=zoom,
        tiles='CartoDB dark_matter'  # Dark theme!
    )
    
    # Fetch current flights
    flights_data = fetch_live_flights()
    
    # Add markers for first 500 flights (for performance)
    count = 0
    for callsign, data in list(flights_data.items())[:500]:
        if data.get('latitude') and data.get('longitude'):
            flight = Flight.from_opensky(callsign, data)
            
            # Create popup content
            popup_html = f"""
            <div style="font-family: Arial; width: 200px;">
                <h4 style="margin: 0; color: #6366f1;">{flight.callsign}</h4>
                <hr style="margin: 5px 0;">
                <b>Altitude:</b> {flight.position.altitude_ft:,} ft<br>
                <b>Speed:</b> {flight.speed_kts} kts<br>
                <b>Heading:</b> {flight.heading_direction} ({flight.heading}°)<br>
                <b>Phase:</b> {flight.phase.value}<br>
                <b>Country:</b> {flight.origin_country}
            </div>
            """
            
            # Add marker
            folium.CircleMarker(
                location=[flight.position.latitude, flight.position.longitude],
                radius=5,
                color=PHASE_COLORS.get(flight.phase.value, 'black'),
                fill=True,
                fillOpacity=0.8,
                popup=folium.Popup(popup_html, max_width=250)
            ).add_to(m)
            
            count += 1
    
    # Add legend
    legend_html = """
    <div style="position: fixed; bottom: 50px; left: 50px; z-index: 1000; 
                background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px; color: white;">
        <h4 style="margin: 0 0 10px 0;">Flight Phases</h4>
        <div><span style="color: gray;">●</span> On Ground</div>
        <div><span style="color: lightblue;">●</span> Initial Climb</div>
        <div><span style="color: blue;">●</span> Climbing</div>
        <div><span style="color: green;">●</span> Cruising</div>
        <div><span style="color: orange;">●</span> Descending</div>
        <div><span style="color: red;">●</span> Final Approach</div>
        <hr style="margin: 10px 0;">
        <div><b>Flights shown:</b> """ + str(count) + """</div>
    </div>
    """
    m.get_root().html.add_child(folium.Element(legend_html))
    
    return m._repr_html_()

@app.get("/map/track/{callsign}", response_class=HTMLResponse)
def get_single_flight_map(callsign: str):
    """Map centered on a specific flight"""
    callsign = validate_callsign(callsign)
    flights_data = fetch_live_flights()
    
    if callsign not in flights_data:
        return "<h1>Flight not found</h1>"
    
    flight = Flight.from_opensky(callsign, flights_data[callsign])
    
    m = folium.Map(
        location=[flight.position.latitude, flight.position.longitude],
        zoom_start=8,
        tiles='CartoDB dark_matter'
    )
    
    # Add airplane icon marker
    folium.Marker(
        location=[flight.position.latitude, flight.position.longitude],
        popup=f"<b>{callsign}</b><br>{flight.position.altitude_ft:,} ft",
        icon=folium.Icon(color='red', icon='plane', prefix='fa')
    ).add_to(m)
    
    return m._repr_html_()
\`\`\`

## View Your Map!

Open in browser: http://localhost:8000/map

🎉 **You now have a live flight tracker with a real map!**

## Customize Views
- US East Coast: /map?lat=40.7&lon=-73.9&zoom=6
- Europe: /map?lat=50&lon=10&zoom=4
- Track specific flight: /map/track/UAL123
`,
    hints: ['Folium creates interactive Leaflet.js maps', 'CartoDB dark_matter gives a cool dark theme', 'CircleMarker is more performant than regular markers'],
    testInstructions: 'Open /map in your browser and see real flights appear on the map!',
    solutionCode: null
  },
  {
    chapterNumber: 18,
    title: 'SQLite Database',
    description: 'Store flight data in a proper database for persistence and powerful queries.',
    objectives: ['Create SQLite database', 'Define flight tables', 'Insert and query data', 'Join related tables'],
    instructions: `
# Chapter 18: SQLite Database

Time for a real database! SQLite is perfect - no server needed.

## Install SQLAlchemy

\`\`\`bash
pip install sqlalchemy
\`\`\`

## Create database.py

\`\`\`python
# database.py
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

DATABASE_URL = "sqlite:///./skytrack.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AircraftDB(Base):
    __tablename__ = "aircraft"
    
    id = Column(Integer, primary_key=True, index=True)
    tail_number = Column(String, unique=True, index=True)
    type_code = Column(String)
    type_name = Column(String)
    manufacturer = Column(String)
    airline = Column(String)
    capacity = Column(Integer)
    year_manufactured = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    flights = relationship("FlightRecordDB", back_populates="aircraft")

class FlightRecordDB(Base):
    __tablename__ = "flight_records"
    
    id = Column(Integer, primary_key=True, index=True)
    callsign = Column(String, index=True)
    aircraft_id = Column(Integer, ForeignKey("aircraft.id"), nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    altitude_ft = Column(Integer)
    speed_kts = Column(Integer)
    heading = Column(Float)
    phase = Column(String)
    origin_country = Column(String)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    aircraft = relationship("AircraftDB", back_populates="flights")

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
\`\`\`

## Update app.py with Database Operations

\`\`\`python
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db, AircraftDB, FlightRecordDB

@app.post("/db/aircraft")
def create_aircraft_db(
    tail_number: str,
    type_code: str,
    airline: str,
    db: Session = Depends(get_db)
):
    """Create aircraft in database"""
    db_aircraft = AircraftDB(
        tail_number=tail_number.upper(),
        type_code=type_code.upper(),
        type_name=AIRCRAFT_TYPES.get(type_code.upper(), {}).get("name", "Unknown"),
        manufacturer=AIRCRAFT_TYPES.get(type_code.upper(), {}).get("manufacturer", "Unknown"),
        airline=airline,
        capacity=AIRCRAFT_TYPES.get(type_code.upper(), {}).get("capacity", 0)
    )
    db.add(db_aircraft)
    db.commit()
    db.refresh(db_aircraft)
    return {"message": "Aircraft created", "id": db_aircraft.id}

@app.get("/db/aircraft")
def list_aircraft_db(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all aircraft from database"""
    aircraft = db.query(AircraftDB).offset(skip).limit(limit).all()
    return {"count": len(aircraft), "aircraft": aircraft}

@app.post("/db/record/{callsign}")
def record_flight_position(callsign: str, db: Session = Depends(get_db)):
    """Record current flight position to database"""
    callsign = validate_callsign(callsign)
    flights_data = fetch_live_flights()
    
    if callsign not in flights_data:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    flight = Flight.from_opensky(callsign, flights_data[callsign])
    
    record = FlightRecordDB(
        callsign=callsign,
        latitude=flight.position.latitude,
        longitude=flight.position.longitude,
        altitude_ft=flight.position.altitude_ft,
        speed_kts=flight.speed_kts,
        heading=flight.heading,
        phase=flight.phase.value,
        origin_country=flight.origin_country
    )
    db.add(record)
    db.commit()
    
    return {"message": "Position recorded", "id": record.id}

@app.get("/db/history/{callsign}")
def get_flight_history_db(callsign: str, limit: int = 100, db: Session = Depends(get_db)):
    """Get flight history from database"""
    records = db.query(FlightRecordDB).filter(
        FlightRecordDB.callsign == callsign.upper()
    ).order_by(FlightRecordDB.recorded_at.desc()).limit(limit).all()
    
    return {"callsign": callsign, "records": len(records), "history": records}
\`\`\`

## Database Benefits
- **Persistence**: Data survives restarts
- **Queries**: SQL is powerful for filtering
- **Relationships**: Link aircraft to flights
- **Scalability**: SQLite handles millions of rows
`,
    hints: ['SQLAlchemy ORM makes database code clean', 'Use Depends(get_db) for database sessions', 'Indexes speed up queries on frequently searched columns'],
    testInstructions: 'Create aircraft, record flight positions, query history from database.',
    solutionCode: null
  },
  {
    chapterNumber: 19,
    title: 'Pandas Analytics',
    description: 'Analyze flight data with Pandas DataFrames for powerful insights.',
    objectives: ['Load data into DataFrames', 'Calculate statistics', 'Group and aggregate', 'Filter and sort'],
    instructions: `
# Chapter 19: Pandas Analytics

Pandas is the ultimate tool for data analysis. Let's unlock flight insights!

## Install Pandas

\`\`\`bash
pip install pandas
\`\`\`

## Add Analytics Endpoints

\`\`\`python
import pandas as pd
from sqlalchemy import text

@app.get("/analytics/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    """Get summary statistics of all recorded flights"""
    
    # Load data into DataFrame
    query = "SELECT * FROM flight_records"
    df = pd.read_sql(query, db.bind)
    
    if df.empty:
        return {"error": "No flight data recorded yet"}
    
    summary = {
        "total_records": len(df),
        "unique_flights": df['callsign'].nunique(),
        "countries": df['origin_country'].nunique(),
        "altitude": {
            "mean": round(df['altitude_ft'].mean()),
            "max": int(df['altitude_ft'].max()),
            "min": int(df['altitude_ft'].min())
        },
        "speed": {
            "mean": round(df['speed_kts'].mean()),
            "max": int(df['speed_kts'].max())
        },
        "phase_distribution": df['phase'].value_counts().to_dict(),
        "top_countries": df['origin_country'].value_counts().head(10).to_dict(),
        "date_range": {
            "first": str(df['recorded_at'].min()),
            "last": str(df['recorded_at'].max())
        }
    }
    
    return summary

@app.get("/analytics/flight/{callsign}")
def analyze_flight(callsign: str, db: Session = Depends(get_db)):
    """Detailed analytics for a specific flight"""
    
    query = f"SELECT * FROM flight_records WHERE callsign = '{callsign.upper()}' ORDER BY recorded_at"
    df = pd.read_sql(query, db.bind)
    
    if df.empty:
        return {"error": "No data for this flight"}
    
    # Calculate flight statistics
    analysis = {
        "callsign": callsign.upper(),
        "data_points": len(df),
        "duration_tracked": str(df['recorded_at'].max() - df['recorded_at'].min()),
        "altitude_profile": {
            "start": int(df.iloc[0]['altitude_ft']),
            "end": int(df.iloc[-1]['altitude_ft']),
            "max": int(df['altitude_ft'].max()),
            "avg": round(df['altitude_ft'].mean())
        },
        "speed_profile": {
            "max": int(df['speed_kts'].max()),
            "avg": round(df['speed_kts'].mean())
        },
        "phases_visited": df['phase'].unique().tolist(),
        "route": {
            "start": {"lat": df.iloc[0]['latitude'], "lon": df.iloc[0]['longitude']},
            "end": {"lat": df.iloc[-1]['latitude'], "lon": df.iloc[-1]['longitude']}
        }
    }
    
    return analysis

@app.get("/analytics/hourly")
def hourly_traffic(db: Session = Depends(get_db)):
    """Traffic patterns by hour"""
    
    df = pd.read_sql("SELECT * FROM flight_records", db.bind)
    
    if df.empty:
        return {"error": "No data"}
    
    df['recorded_at'] = pd.to_datetime(df['recorded_at'])
    df['hour'] = df['recorded_at'].dt.hour
    
    hourly = df.groupby('hour').agg({
        'callsign': 'nunique',
        'altitude_ft': 'mean'
    }).round().to_dict()
    
    return {
        "flights_by_hour": hourly['callsign'],
        "avg_altitude_by_hour": hourly['altitude_ft']
    }

@app.get("/analytics/export/csv")
def export_analytics_csv(db: Session = Depends(get_db)):
    """Export all flight records to CSV"""
    
    df = pd.read_sql("SELECT * FROM flight_records", db.bind)
    
    filepath = DATA_DIR / "flight_analytics.csv"
    df.to_csv(filepath, index=False)
    
    return {
        "message": "Exported to CSV",
        "file": str(filepath),
        "rows": len(df),
        "columns": list(df.columns)
    }
\`\`\`

## Pandas Superpowers
- **DataFrames**: Excel-like data manipulation in Python
- **Aggregations**: mean, sum, count, groupby
- **Time Series**: Analyze patterns over time
- **Export**: CSV, Excel, JSON with one line
`,
    hints: ['pd.read_sql loads database data directly into DataFrame', 'groupby() is incredibly powerful for aggregations', 'value_counts() quickly shows distributions'],
    testInstructions: 'Record multiple flight positions, then run analytics endpoints.',
    solutionCode: null
  },
  {
    chapterNumber: 24,
    title: 'Deploy to Cloud! 🚀',
    description: 'Containerize with Docker and deploy to Railway for a public URL!',
    objectives: ['Create Dockerfile', 'Set up environment variables', 'Deploy to Railway/Render', 'Get your public URL!'],
    instructions: `
# Chapter 24: Deploy to Cloud! 🚀

Time to show the world! Let's deploy SkyTrack live.

## Create Dockerfile

\`\`\`dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## Create requirements.txt

\`\`\`
fastapi
uvicorn[standard]
requests
tenacity
folium
pandas
sqlalchemy
\`\`\`

## Create .dockerignore

\`\`\`
__pycache__
*.pyc
.git
.env
venv
*.db
data/
\`\`\`

## Test Locally with Docker

\`\`\`bash
# Build image
docker build -t skytrack .

# Run container
docker run -p 8000:8000 skytrack

# Visit http://localhost:8000
\`\`\`

## Deploy to Railway (Easiest!)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your SkyTrack repository
5. Railway auto-detects Dockerfile
6. Click Deploy!

**Your app will be live at**: https://skytrack-xxxx.up.railway.app

## Deploy to Render (Alternative)

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Set:
   - Build Command: \`pip install -r requirements.txt\`
   - Start Command: \`uvicorn app:app --host 0.0.0.0 --port $PORT\`
5. Deploy!

## Environment Variables

For production, set these:
\`\`\`
OPENSKY_USERNAME=your_username  # Optional, for higher rate limits
OPENSKY_PASSWORD=your_password
\`\`\`

## 🎉 Congratulations!

Share your URL with friends and family:
**"Check out this flight tracker I built!"**

Your portfolio now includes:
- ✅ Live API with real data
- ✅ Interactive map
- ✅ Database persistence
- ✅ Analytics dashboard
- ✅ Deployed to production
`,
    hints: ['Railway is the easiest deployment option', 'Docker ensures consistency between dev and prod', 'Free tiers are enough for portfolio projects'],
    testInstructions: 'Deploy and verify your public URL shows the flight map!',
    solutionCode: null
  },
  {
    chapterNumber: 25,
    title: 'ML: Load Flight Data',
    description: 'Prepare historical flight data for machine learning predictions.',
    objectives: ['Load delay dataset', 'Explore data patterns', 'Handle missing values', 'Create features'],
    instructions: `
# Chapter 25: Machine Learning - Data Preparation

Time to add AI! We'll predict flight delays.

## Download Flight Delay Dataset

We'll use real FAA flight delay data. Create a sample dataset:

\`\`\`python
# ml/create_sample_data.py
import pandas as pd
import numpy as np

# Create synthetic but realistic flight delay data
np.random.seed(42)
n_samples = 10000

data = {
    'flight_number': [f'FL{i:04d}' for i in range(n_samples)],
    'airline': np.random.choice(['AA', 'DL', 'UA', 'WN', 'B6'], n_samples),
    'origin': np.random.choice(['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'SFO'], n_samples),
    'destination': np.random.choice(['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'SFO'], n_samples),
    'scheduled_departure_hour': np.random.randint(6, 23, n_samples),
    'day_of_week': np.random.randint(0, 7, n_samples),
    'month': np.random.randint(1, 13, n_samples),
    'distance_miles': np.random.randint(200, 3000, n_samples),
    'weather_delay': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
    'carrier_delay': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
    'is_holiday_period': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
}

# Create delay target (correlated with features)
delay_minutes = (
    data['weather_delay'] * np.random.randint(20, 120, n_samples) +
    data['carrier_delay'] * np.random.randint(10, 60, n_samples) +
    data['is_holiday_period'] * np.random.randint(5, 30, n_samples) +
    (data['scheduled_departure_hour'] > 17).astype(int) * np.random.randint(5, 25, n_samples) +
    np.random.randint(-10, 20, n_samples)
)
data['delay_minutes'] = np.maximum(0, delay_minutes)
data['is_delayed'] = (data['delay_minutes'] > 15).astype(int)

df = pd.DataFrame(data)
df.to_csv('data/flight_delays.csv', index=False)
print(f"Created dataset with {len(df)} samples")
print(f"Delay rate: {df['is_delayed'].mean():.1%}")
\`\`\`

## Explore the Data

\`\`\`python
# ml/explore_data.py
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data/flight_delays.csv')

print("Dataset Shape:", df.shape)
print("\\nColumn Types:")
print(df.dtypes)

print("\\nDelay Statistics:")
print(df['delay_minutes'].describe())

print("\\nDelay Rate by Airline:")
print(df.groupby('airline')['is_delayed'].mean().sort_values(ascending=False))

print("\\nDelay Rate by Hour:")
hourly = df.groupby('scheduled_departure_hour')['is_delayed'].mean()
print(hourly)
\`\`\`

## Add to API

\`\`\`python
@app.get("/ml/data/summary")
def ml_data_summary():
    """Summary of training data"""
    df = pd.read_csv('data/flight_delays.csv')
    
    return {
        "total_samples": len(df),
        "features": list(df.columns),
        "delay_rate": round(df['is_delayed'].mean(), 3),
        "avg_delay_minutes": round(df['delay_minutes'].mean(), 1),
        "airlines": df['airline'].unique().tolist(),
        "airports": df['origin'].unique().tolist()
    }
\`\`\`

## Feature Engineering Concepts
- **Categorical**: airline, origin, destination → One-hot encode
- **Numerical**: hour, distance → Normalize/scale
- **Binary**: weather_delay, holiday → Use directly
- **Target**: is_delayed (binary classification)
`,
    hints: ['Real ML projects spend 80% time on data prep', 'Check for missing values with df.isnull().sum()', 'Visualize distributions to understand your data'],
    testInstructions: 'Run the data creation script and verify /ml/data/summary works.',
    solutionCode: null
  },
  {
    chapterNumber: 26,
    title: 'ML: Delay Predictor',
    description: 'Train your first machine learning model to predict flight delays.',
    objectives: ['Split train/test data', 'Train logistic regression', 'Evaluate accuracy', 'Make predictions'],
    instructions: `
# Chapter 26: Train Your First ML Model

Let's train a model to predict if a flight will be delayed!

## Install Scikit-Learn

\`\`\`bash
pip install scikit-learn
\`\`\`

## Create the Model

\`\`\`python
# ml/train_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load data
df = pd.read_csv('data/flight_delays.csv')

# Prepare features
feature_columns = [
    'scheduled_departure_hour', 'day_of_week', 'month',
    'distance_miles', 'weather_delay', 'carrier_delay', 'is_holiday_period'
]

# Encode categorical variables
le_airline = LabelEncoder()
le_origin = LabelEncoder()

df['airline_encoded'] = le_airline.fit_transform(df['airline'])
df['origin_encoded'] = le_origin.fit_transform(df['origin'])

feature_columns.extend(['airline_encoded', 'origin_encoded'])

X = df[feature_columns]
y = df['is_delayed']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {accuracy:.1%}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save model and preprocessors
joblib.dump(model, 'ml/delay_model.pkl')
joblib.dump(scaler, 'ml/scaler.pkl')
joblib.dump(le_airline, 'ml/le_airline.pkl')
joblib.dump(le_origin, 'ml/le_origin.pkl')
joblib.dump(feature_columns, 'ml/features.pkl')

print("\\nModel saved to ml/delay_model.pkl")
\`\`\`

## Add Prediction Endpoint

\`\`\`python
import joblib

# Load model on startup
delay_model = None
delay_scaler = None

@app.on_event("startup")
def load_ml_model():
    global delay_model, delay_scaler
    try:
        delay_model = joblib.load('ml/delay_model.pkl')
        delay_scaler = joblib.load('ml/scaler.pkl')
        print("ML model loaded successfully")
    except:
        print("ML model not found - train it first!")

@app.post("/ml/predict")
def predict_delay(
    airline: str,
    origin: str,
    departure_hour: int,
    day_of_week: int,
    month: int,
    distance: int,
    weather_delay: int = 0,
    carrier_delay: int = 0,
    is_holiday: int = 0
):
    """Predict if a flight will be delayed"""
    
    if delay_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Load encoders
    le_airline = joblib.load('ml/le_airline.pkl')
    le_origin = joblib.load('ml/le_origin.pkl')
    
    # Encode inputs
    try:
        airline_enc = le_airline.transform([airline.upper()])[0]
        origin_enc = le_origin.transform([origin.upper()])[0]
    except:
        raise HTTPException(status_code=400, detail="Unknown airline or airport code")
    
    # Create feature vector
    features = [[
        departure_hour, day_of_week, month, distance,
        weather_delay, carrier_delay, is_holiday,
        airline_enc, origin_enc
    ]]
    
    # Scale and predict
    features_scaled = delay_scaler.transform(features)
    prediction = delay_model.predict(features_scaled)[0]
    probability = delay_model.predict_proba(features_scaled)[0]
    
    return {
        "prediction": "DELAYED" if prediction == 1 else "ON TIME",
        "delay_probability": round(float(probability[1]), 3),
        "on_time_probability": round(float(probability[0]), 3),
        "confidence": round(float(max(probability)), 3)
    }
\`\`\`

## Test Predictions

\`\`\`bash
# Predict delay for evening flight during bad weather
curl "http://localhost:8000/ml/predict?airline=AA&origin=JFK&departure_hour=19&day_of_week=5&month=12&distance=2000&weather_delay=1"
\`\`\`

🎉 **You just built an AI-powered flight delay predictor!**
`,
    hints: ['80/20 train/test split is standard', 'Always scale features for logistic regression', 'joblib saves models efficiently'],
    testInstructions: 'Train the model, then test predictions with different inputs.',
    solutionCode: null
  },
  {
    chapterNumber: 29,
    title: 'ML Pipeline',
    description: 'Build a complete ML pipeline with preprocessing, training, and evaluation.',
    objectives: ['Create preprocessing pipeline', 'Train multiple models', 'Compare performance', 'Select best model'],
    instructions: `
# Chapter 29: Production ML Pipeline

Let's build a proper ML pipeline that handles everything automatically.

## Complete Pipeline

\`\`\`python
# ml/pipeline.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib

def create_pipeline():
    """Create complete ML pipeline with preprocessing"""
    
    # Define feature types
    numeric_features = ['scheduled_departure_hour', 'day_of_week', 'month', 
                       'distance_miles', 'weather_delay', 'carrier_delay', 'is_holiday_period']
    categorical_features = ['airline', 'origin', 'destination']
    
    # Preprocessor
    preprocessor = ColumnTransformer(transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])
    
    return preprocessor, numeric_features, categorical_features

def train_and_compare_models():
    """Train multiple models and compare performance"""
    
    # Load data
    df = pd.read_csv('data/flight_delays.csv')
    
    preprocessor, num_features, cat_features = create_pipeline()
    all_features = num_features + cat_features
    
    X = df[all_features]
    y = df['is_delayed']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define models to compare
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    results = []
    best_model = None
    best_score = 0
    
    for name, model in models.items():
        # Create pipeline
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', model)
        ])
        
        # Train
        pipeline.fit(X_train, y_train)
        
        # Evaluate
        y_pred = pipeline.predict(X_test)
        
        metrics = {
            'model': name,
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred)
        }
        
        # Cross-validation
        cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5)
        metrics['cv_mean'] = cv_scores.mean()
        metrics['cv_std'] = cv_scores.std()
        
        results.append(metrics)
        print(f"\\n{name}:")
        print(f"  Accuracy: {metrics['accuracy']:.3f}")
        print(f"  F1 Score: {metrics['f1']:.3f}")
        print(f"  CV Score: {metrics['cv_mean']:.3f} (+/- {metrics['cv_std']:.3f})")
        
        if metrics['f1'] > best_score:
            best_score = metrics['f1']
            best_model = pipeline
            best_name = name
    
    # Save best model
    print(f"\\n✅ Best Model: {best_name} (F1: {best_score:.3f})")
    joblib.dump(best_model, 'ml/best_model.pkl')
    
    return pd.DataFrame(results)

if __name__ == '__main__':
    results = train_and_compare_models()
    print("\\n📊 Model Comparison:")
    print(results.to_string(index=False))
\`\`\`

## Update API to Use Best Model

\`\`\`python
@app.get("/ml/models/compare")
def compare_models():
    """Run model comparison and return results"""
    from ml.pipeline import train_and_compare_models
    results = train_and_compare_models()
    return results.to_dict(orient='records')

@app.post("/ml/predict/v2")
def predict_delay_v2(
    airline: str,
    origin: str,
    destination: str,
    departure_hour: int,
    day_of_week: int,
    month: int,
    distance: int,
    weather_delay: int = 0,
    carrier_delay: int = 0,
    is_holiday: int = 0
):
    """Predict using best model pipeline"""
    
    model = joblib.load('ml/best_model.pkl')
    
    input_data = pd.DataFrame([{
        'airline': airline.upper(),
        'origin': origin.upper(),
        'destination': destination.upper(),
        'scheduled_departure_hour': departure_hour,
        'day_of_week': day_of_week,
        'month': month,
        'distance_miles': distance,
        'weather_delay': weather_delay,
        'carrier_delay': carrier_delay,
        'is_holiday_period': is_holiday
    }])
    
    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]
    
    return {
        "prediction": "DELAYED" if prediction == 1 else "ON TIME",
        "delay_probability": round(float(probabilities[1]), 3),
        "model_used": "Best Pipeline Model"
    }
\`\`\`
`,
    hints: ['Pipelines ensure consistent preprocessing', 'Cross-validation gives more reliable scores', 'F1 score balances precision and recall'],
    testInstructions: 'Run model comparison and verify best model is saved.',
    solutionCode: null
  },
  {
    chapterNumber: 31,
    title: 'AI Predictions Live! 🤖',
    description: 'Deploy your ML model to production - real-time delay predictions!',
    objectives: ['Integrate ML with live API', 'Add prediction to flight tracking', 'Monitor model performance', 'Celebrate your achievement!'],
    instructions: `
# Chapter 31: AI-Powered Flight Tracker 🎉

The final chapter! Your flight tracker now has AI predictions!

## Integrate ML with Live Tracking

\`\`\`python
@app.get("/track/{callsign}/smart")
def smart_track_flight(callsign: str):
    """Track flight with AI delay prediction"""
    callsign = validate_callsign(callsign)
    flights_data = fetch_live_flights()
    
    if callsign not in flights_data:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    flight = Flight.from_opensky(callsign, flights_data[callsign])
    
    # Get AI prediction
    try:
        model = joblib.load('ml/best_model.pkl')
        
        # Use flight data for prediction
        hour = datetime.now().hour
        day = datetime.now().weekday()
        month = datetime.now().month
        
        input_data = pd.DataFrame([{
            'airline': callsign[:2],  # First 2 chars as airline
            'origin': 'JFK',  # Default (would need real data)
            'destination': 'LAX',
            'scheduled_departure_hour': hour,
            'day_of_week': day,
            'month': month,
            'distance_miles': 2000,
            'weather_delay': 0,
            'carrier_delay': 0,
            'is_holiday_period': 0
        }])
        
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1]
        
        ai_prediction = {
            "delay_risk": "HIGH" if probability > 0.5 else "MEDIUM" if probability > 0.3 else "LOW",
            "delay_probability": round(float(probability), 3),
            "recommendation": "Consider backup plans" if probability > 0.5 else "Looking good!"
        }
    except Exception as e:
        ai_prediction = {"error": "ML model not available"}
    
    return {
        **flight.to_dict(),
        "ai_prediction": ai_prediction,
        "tracked_at": datetime.now().isoformat()
    }
\`\`\`

## Add to Map

\`\`\`python
@app.get("/map/smart", response_class=HTMLResponse)
def get_smart_map():
    """Interactive map with AI predictions shown"""
    # Similar to regular map but with color coding by delay risk
    pass
\`\`\`

## Your Final Project Includes:

### 🛫 Real-Time Flight Tracking
- Live data from OpenSky Network
- Track any flight worldwide
- Position history and playback

### 🗺️ Interactive Map
- See all flights on a world map
- Click for flight details
- Color-coded by flight phase

### 📊 Analytics Dashboard
- Flight statistics
- Historical patterns
- Export to CSV

### 🤖 AI Predictions
- Delay probability
- Risk assessment
- Recommendations

### 🚀 Deployed Live
- Docker containerized
- Running on Railway/Render
- Public URL to share!

---

## 🎉 CONGRATULATIONS! 🎉

You've built a complete, production-ready flight tracking platform with:
- **2,500+ lines** of Python code
- **Real API** with live data
- **Database** persistence
- **Machine Learning** predictions
- **Interactive** visualizations
- **Cloud** deployment

### Portfolio Statement:
> "I built SkyTrack, a full-stack flight tracking platform featuring real-time data from OpenSky Network, an interactive map visualization, SQLite database, Pandas analytics, and machine learning models that predict flight delays with 75%+ accuracy. The application is containerized with Docker and deployed to production."

### Skills Demonstrated:
- Python (FastAPI, Pandas, Scikit-learn)
- REST API Design
- Database Management
- Data Analysis
- Machine Learning
- DevOps (Docker, Cloud Deployment)
- Aviation Domain Knowledge

### Next Steps:
1. Add user authentication
2. Implement WebSocket for real-time updates
3. Add more ML features (route prediction, etc.)
4. Build a React frontend
5. Apply to aviation tech companies!

**Thank you for building with us! 🚀✈️**
`,
    hints: ['This is your masterpiece - make it shine!', 'Add error handling for robustness', 'Consider adding user authentication next'],
    testInstructions: 'Test /track/CALLSIGN/smart and verify AI predictions appear!',
    solutionCode: null
  }
];

async function main() {
  console.log('🛫 Updating SkyTrack milestones with full content...\n');

  const project = await prisma.guidedProject.findUnique({
    where: { slug: 'skytrack-flight-tracker' }
  });

  if (!project) {
    console.error('❌ SkyTrack project not found!');
    return;
  }

  for (const content of milestoneContent) {
    await prisma.projectMilestone.upsert({
      where: {
        projectId_chapterNumber: {
          projectId: project.id,
          chapterNumber: content.chapterNumber
        }
      },
      update: {
        title: content.title,
        description: content.description,
        objectives: content.objectives,
        instructions: content.instructions,
        hints: content.hints,
        testInstructions: content.testInstructions,
        solutionCode: content.solutionCode
      },
      create: {
        projectId: project.id,
        chapterNumber: content.chapterNumber,
        title: content.title,
        description: content.description,
        objectives: content.objectives,
        instructions: content.instructions,
        hints: content.hints,
        testInstructions: content.testInstructions,
        solutionCode: content.solutionCode,
        order: content.chapterNumber
      }
    });
    console.log(`  ✓ Chapter ${content.chapterNumber}: ${content.title}`);
  }

  console.log(`\n✅ Updated ${milestoneContent.length} milestones with full content!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
