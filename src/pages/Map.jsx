import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getPoints } from "../services/mapService";
import { useAuth } from "../contexts/AuthContext";

const containerStyle = { width: "100%", height: "100%" };

const mapStyles = [
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f2efe9" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e8f4e8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fde8c8" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#f5c98a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d9f0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6aa8d0" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e6c9" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e8f5e9" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#ede7f6" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#192853" }] },
  { featureType: "administrative", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 2 }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#6b7a99" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 2 }] },
];

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#192853"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#192853" opacity="0.5"/>
  </svg>
);


export const Map = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -28.2624, lng: -52.4088 });
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (e) {
        console.log(e.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const customMarkerIcon = isLoaded ? {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "#192853",
    fillOpacity: 1,
    strokeColor: "#ffe14e",
    strokeWeight: 2,
    scale: 1.8,
    anchor: new window.google.maps.Point(12, 22),
  } : null;

  const filteredMarkers = markers.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const last10 = markers.slice(-10).reverse();

  return (
    <div className="flex flex-col h-full bg-[#eff8ff] relative">

      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex justify-end">
          <button
            onClick={logout}
            className="w-[40px] h-[40px] rounded-full bg-white border-2 border-[#ffe14e] shadow-md flex items-center justify-center hover:brightness-105 transition-colors"
          >
            <LogoutIcon />
          </button>
        </div>

        <div className="flex items-center bg-white/80 backdrop-blur-sm border-2 border-[#ffe14e] rounded-full shadow-md h-[40px] px-3 gap-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            className="flex-1 bg-transparent text-[#192853] text-[14px] outline-none placeholder:text-[#192853]/60 font-medium"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#192853]/50 flex items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {markers.length > 0 && !search && (
        <div className="absolute top-[126px] left-0 right-0 z-10 px-3">
          <div className="flex gap-[9px] overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {markers.map((m) => {
              const imagem = m.imageBase64;
              return (
                <div
                  key={m.id}
                  onClick={() => { setSelectedMarker(m); setMapCenter(m.position); }}
                  className="w-[110px] h-[110px] rounded-[20px] shrink-0 overflow-hidden shadow-md relative cursor-pointer"
                >
                  {imagem ? (
                    <img src={imagem} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#192853] flex items-center justify-center">
                      <span className="text-white text-[11px] font-bold text-center px-2">{m.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-semibold leading-tight">{m.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(searchFocused || search) && (
        <div className="absolute top-[108px] left-4 right-4 z-20 bg-white rounded-2xl shadow-xl overflow-hidden">
          {(search ? filteredMarkers : last10).length > 0 ? (
            <>
              {!search && (
                <p className="text-[11px] font-semibold text-[#aaa] uppercase tracking-widest px-4 pt-3 pb-1">
                  Últimos eventos
                </p>
              )}
              {(search ? filteredMarkers : last10).map((m) => {
                const imagem = m.imageBase64;
                return (
                  <div
                    key={m.id}
                    onClick={() => { if (m.position) { setSelectedMarker(m); setMapCenter(m.position); } setSearch(""); setSearchFocused(false); }}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                  >
                    {imagem ? (
                      <img src={imagem} alt={m.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#192853] flex items-center justify-center shrink-0">
                        <span className="text-white text-[11px] font-bold">{m.title[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-[#192853] font-semibold text-[14px]">{m.title}</p>
                      {m.locationName && <p className="text-gray-400 text-[12px]">{m.locationName}</p>}
                      {m.eventDate && <p className="text-gray-300 text-[11px]">{m.eventDate}</p>}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center px-4 py-3">Nenhum evento encontrado</p>
          )}
        </div>
      )}

      <div className="flex-1 w-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
            onClick={() => setSelectedMarker(null)}
            options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: false }}
          >
            {filteredMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={customMarkerIcon}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
                options={{ pixelOffset: new window.google.maps.Size(0, -36), disableAutoPan: false, disableCloseButton: true }}
              >
                <div style={{ maxWidth: 190, padding: "4px 2px" }}>
                  <p style={{ fontWeight: "700", color: "#192853", fontSize: 13, margin: "0 0 4px" }}>{selectedMarker.title}</p>
                  {selectedMarker.description && (
                    <p style={{ color: "#555", fontSize: 11, margin: "0 0 3px" }}>{selectedMarker.description}</p>
                  )}
                  {selectedMarker.eventTime && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "2px 0 0" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#888"/>
                      </svg>
                      <span style={{ color: "#888", fontSize: 11 }}>{selectedMarker.eventTime}</span>
                    </div>
                  )}
                  {selectedMarker.locationName && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "2px 0 0" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#888"/>
                      </svg>
                      <span style={{ color: "#888", fontSize: 11 }}>{selectedMarker.locationName}</span>
                    </div>
                  )}
                  {selectedMarker.categories?.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "2px 0 0" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z" fill="#888"/>
                      </svg>
                      <span style={{ color: "#888", fontSize: 11 }}>{selectedMarker.categories.join(", ")}</span>
                    </div>
                  )}
                  {selectedMarker.registrationType && (
                    <p style={{ color: "#888", fontSize: 11, margin: "2px 0 0" }}>🎟 {selectedMarker.registrationType}</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="flex-1 w-full flex items-center justify-center bg-[#eff8ff]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#192853] border-t-[#ffe14e] rounded-full animate-spin" />
              <p className="text-[#192853] font-semibold">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>

      <Navbar />
      <div className="h-[61px]" />
    </div>
  );
};
