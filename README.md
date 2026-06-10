Roadtrip Planner 🗺️


A production-grade mobile app for discovering U.S. national parks, hiking trails, and city parks — built for road trippers and World Cup 2026 tourists. Built with React Native and Expo, this project demonstrates multi-source API orchestration, lazy data enrichment, resilient network patterns, and cost-optimized caching strategies.


📱 App Screenshots

<img width="385" height="828" alt="ss12" src="https://github.com/user-attachments/assets/a0458d84-f32e-4142-a998-87381de70c5c" /> <img width="388" height="846" alt="ss11" src="https://github.com/user-attachments/assets/d17cfbcd-1601-463a-a24d-92bfa9e65b87" /> <img width="395" height="842" alt="ss10" src="https://github.com/user-attachments/assets/68d95fba-439f-4941-8199-e71b807224bc" /><img width="392" height="833" alt="ss9" src="https://github.com/user-attachments/assets/93439a78-ddde-40ab-9e82-0911760688a6" /> 

<img width="406" height="864" alt="ss8" src="https://github.com/user-attachments/assets/cbe8ac0f-02a6-4fef-9d67-f01754da970b" /> <img width="408" height="855" alt="ss7" src="https://github.com/user-attachments/assets/61e48d93-c4b0-404b-8fbf-1e0f21e71eb3" /><img width="397" height="859" alt="ss6" src="https://github.com/user-attachments/assets/253001f4-0264-4213-b840-daf98dce42b0" /><img width="400" height="868" alt="ss5" src="https://github.com/user-attachments/assets/5c1096ec-ae93-439e-9f50-fda95d325c63" />

<img width="405" height="862" alt="ss4" src="https://github.com/user-attachments/assets/5deb08cb-c0f1-467d-8578-53f8b96a9898" /><img width="397" height="855" alt="ss3" src="https://github.com/user-attachments/assets/56e89800-d7d9-42b0-aaf2-da9ad4f3bcae" /><img width="402" height="860" alt="ss2" src="https://github.com/user-attachments/assets/00d3d8b0-2ad1-4c51-95d2-b97828d457c8" /><img width="391" height="833" alt="ss1" src="https://github.com/user-attachments/assets/d66b0c3f-2ad6-4821-8b10-90fb5357e3c6" />



🌐 Multi-Source Data Architecture

This app orchestrates six independent APIs into a single cohesive experience:

APIPurposeCaching Strategy🏞️ NPS API439 federal parks & monumentsIn-memory🥾 OSM OverpassHiking trails & city parks (state-based)30 days🎥 YouTube Data v3Park & trail video shorts7 days📍 Google PlacesRatings, reviews, photos, hours30 days🌤️ OpenWeather5-day forecasts3 hours🏕️ Recreation.gov RIDBFederal campgrounds + booking links7 days

Each source has different rate limits, response formats, and reliability profiles — the service layer abstracts these differences behind a consistent interface.


🌟 Key Engineering Highlights


✨ Lazy Enrichment Pattern: Bulk OSM data populates 1,000+ map markers for free; Google Places enriches only the markers users actually tap. Two-phase fallback (text search → nearby search) handles varying POI quality. Coordinate-based caching keeps real cost at ~$0.05 per click — well within Google's free tier.
🔄 Multi-Endpoint Retry with AbortController: When an OSM Overpass mirror returns 504, the client automatically cycles through four fallback servers with linear backoff (1s → 2s → 3s) and a 30-second client-side timeout. Granular error handling means trails can fail while parks still load.
🔍 Unified Search Across Sources: A single search bar queries NPS parks, OSM trails, and Google city parks simultaneously — with defensive field normalization to handle inconsistent schemas across sources.
📍 GPS Distance with Haversine: Real-time "X mi away" labels using the Haversine formula, with 5-minute location caching for battery efficiency and graceful degradation when permissions are denied.
🥾 Trail Details from Raw Geometry: On-demand OSM geometry queries fetch full polyline data; path length is computed by summing Haversine distances across all nodes, and loop detection compares start/end proximity (< 50m = loop).
❤️ Favorites with Map Focus Navigation: Persistent bookmarks via AsyncStorage, with a pendingFocus + onMapReady state pattern that solves the timing race between navigation params arriving and MapView mounting.
🏕️ Federal Campground Integration: Nearby campgrounds within 25 miles via Recreation.gov RIDB, with direct deep links to official reservation pages.
🗂️ Multi-Trip Data Model: Hierarchical { trips: [...], activeTripId } structure supporting stop reordering, visited tracking with auto-skip routing, and multi-stop Google Maps navigation export.



🛠 Tech Stack & Libraries


Language: JavaScript (ES2022+)
Framework: React Native with Expo SDK 54
Maps: react-native-maps with custom zoom-based progressive disclosure
Storage: AsyncStorage (favorites, trips, tiered API caches)
Location: expo-location (Haversine distance, permission handling)
Navigation: React Navigation (Native Stack)
State Management: React Hooks (useState, useEffect, useFocusEffect, useRef)



🏗 Architecture

The app follows a service-layer architecture for separation of concerns:

roadtrip-planner/
├── App.js                    # Navigation stack (Map, TripList, TripDetail, Favorites)
├── services/                 # API integration layer
│   ├── npsService.js         # National Park Service
│   ├── osmService.js         # Overpass: trails, parks, geometry (multi-endpoint retry)
│   ├── placesService.js      # Google Places lazy enrichment
│   ├── citySearchService.js  # Dynamic city park search
│   ├── youtubeService.js     # Type-aware video queries
│   ├── weatherService.js     # 5-day forecast with day grouping
│   ├── recreationService.js  # Federal campgrounds
│   ├── locationService.js    # GPS + Haversine
│   ├── favoritesService.js   # Bookmark CRUD
│   └── tripService.js        # Multi-trip data model
├── screens/                  # Map, TripList, TripDetail, Favorites
├── components/               # ParkBottomSheet, PhotoGallery, SearchBar, modals
├── styles/                   # One style file per component
└── utils/                    # geometry.js (Haversine, path length, loop detection)


Services own all network logic, caching, and error handling — screens never call fetch directly.
Screens compose components and manage navigation state.
Components are presentational and type-flexible (e.g., PhotoGallery accepts both string arrays and object arrays).



⚡ Resilience & Cost Optimization


Tiered cache TTLs matched to data volatility (weather changes hourly; trail networks change yearly)
Sequential loading for heavy Overpass queries (parallel requests overwhelmed servers with 504s)
Strict type filtering on Google Places results (PREFERRED_TYPES whitelist eliminates false matches)
Budget alerts configured on Google Cloud at 50/90/100/150% thresholds



🚀 How to Run


Clone this repository:


bash    git clone https://github.com/baranDincsoy/roadtrip_planner.git


Install dependencies:


bash    npm install


Create a .env file in the project root with your API keys:


    EXPO_PUBLIC_NPS_API_KEY=your_key
    EXPO_PUBLIC_YOUTUBE_API_KEY=your_key
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key
    EXPO_PUBLIC_OPENWEATHER_API_KEY=your_key
    EXPO_PUBLIC_RIDB_API_KEY=your_key


Start the development server:


bash    npx expo start


Run on an emulator or scan the QR code with Expo Go.



Note: Free API keys are available from NPS, Google Cloud, OpenWeather, and Recreation.gov RIDB.




🔮 Future Improvements


Onboarding & Branding: Custom app icon, splash screen, and first-launch tutorial for Play Store release.
Offline Mode: Pre-downloaded region data for use without connectivity in remote parks.
Community Amenity Tags: Backend-synced user-generated data (dog-friendly, restrooms) — currently scoped out to avoid premature infrastructure.
Multi-Language Support: i18n for Spanish, French, and Portuguese targeting World Cup 2026 tourists.
Testing: Unit tests for service-layer logic (Haversine, cache TTL, retry) and component tests for the bottom sheet.



Developed by Baran Cenk Dincsoy
📍 Charlotte, NC · GitHub · LinkedIn
