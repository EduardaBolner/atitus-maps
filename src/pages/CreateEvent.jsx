import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postPoint } from "../services/mapService";
import { Navbar } from "../components/Navbar";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapStyles = [
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f2efe9" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e8f4e8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fde8c8" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d9f0" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#192853" }] },
];

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#192853" opacity="0.5"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#192853" opacity="0.5"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#192853" opacity="0.5"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#192853"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="#192853" opacity="0.5"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#192853" opacity="0.4"/>
  </svg>
);
const UploadIcon = ({ color = "white" }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM12 11L8 15H11V19H13V15H16L12 11Z" fill={color}/>
  </svg>
);
const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="white"/>
  </svg>
);

const CATEGORIAS = ["Música", "Cultura", "Festa", "Entretenimento", "Congresso", "Seminário", "Esporte", "Show", "Feira", "Rodeio", "Inauguração", "Exposição", "Workshop", "Automóvel", "Festival", "Outros"];
const ACESSIBILIDADE = ["Físico", "Visual", "Auditivo", "Todas"];
const INSCRICOES = ["Pago", "Gratuito", "Sem Inscrição"];

function RowField({ icon, placeholder, type = "text", value, onChange, onBlur }) {
  return (
    <label className="flex items-center gap-3 py-[14px] border-b border-gray-100 last:border-0 cursor-pointer w-full">
      <span className="shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="flex-1 bg-transparent text-[#192853] text-[15px] outline-none placeholder:text-[#b0bec5] w-full font-medium"
      />
      <ChevronIcon />
    </label>
  );
}

export function CreateEvent() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const imageInputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [site, setSite] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [acessibilidade, setAcessibilidade] = useState([]);
  const [inscricao, setInscricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickerCenter, setPickerCenter] = useState({ lat: -28.2624, lng: -52.4088 });
  const [pickedPos, setPickedPos] = useState(null);

  useEffect(() => {
    if (location.state?.lat && location.state?.lng) {
      setLat(String(location.state.lat.toFixed(6)));
      setLng(String(location.state.lng.toFixed(6)));
      if (location.state.endereco) setLocalizacao(location.state.endereco);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(6));
          setLng(pos.coords.longitude.toFixed(6));
          setPickerCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {}
      );
    }
  }, []);

  const openMapPicker = () => {
    if (lat && lng) {
      const currentLat = parseFloat(lat);
      const currentLng = parseFloat(lng);
      if (!isNaN(currentLat) && !isNaN(currentLng)) {
        setPickerCenter({ lat: currentLat, lng: currentLng });
        setPickedPos({ lat: currentLat, lng: currentLng });
      }
    }
    setShowMapPicker(true);
  };

  const confirmLocation = () => {
    if (!pickedPos) return;
    setLat(pickedPos.lat.toFixed(6));
    setLng(pickedPos.lng.toFixed(6));
    setShowMapPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagem(ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleChip = (list, setList, value) => {
    setList((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const handleSubmit = async () => {
    setErro("");
    if (!titulo.trim()) return setErro("Informe o título do evento.");
    if (categorias.length === 0) return setErro("Selecione ao menos uma categoria.");

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude))
      return setErro("Selecione a localização no mapa antes de publicar.");

    setLoading(true);
    try {
      const payload = {
        name: titulo,
        description: descricao || null,
        latitude,
        longitude,
        eventDate: data || null,
        eventTime: horario || null,
        locationName: localizacao || null,
        website: site || null,
        categories: categorias,
        accessibility: acessibilidade.length > 0 ? acessibilidade : null,
        registrationType: inscricao || null,
        imageBase64: imagem || null,
      };

      await postPoint(token, payload);

      navigate("/map");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasLocation = lat && lng;

  return (
    <>
      {showMapPicker && (
        <div className="fixed inset-0 z-[100] flex flex-col">
          <div className="bg-[#192853] px-4 h-[56px] flex items-center gap-3 shrink-0">
            <button onClick={() => setShowMapPicker(false)} className="p-1">
              <BackIcon />
            </button>
            <p className="text-white font-semibold text-[16px]">Selecionar localização</p>
          </div>

          <div className="absolute top-[56px] left-0 right-0 z-10 flex justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mt-3 shadow-md">
              <p className="text-[#192853] text-[13px] font-medium">Toque no mapa para marcar o local do evento</p>
            </div>
          </div>

          <div className="flex-1 w-full">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={pickerCenter}
                zoom={14}
                onClick={(e) => setPickedPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
              >
                {pickedPos && (
                  <Marker
                    position={pickedPos}
                    icon={{
                      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                      fillColor: "#192853",
                      fillOpacity: 1,
                      strokeColor: "#ffe14e",
                      strokeWeight: 2,
                      scale: 1.8,
                      anchor: new window.google.maps.Point(12, 22),
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#eff8ff]">
                <div className="w-10 h-10 border-4 border-[#192853] border-t-[#ffe14e] rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-10">
            <button
              onClick={confirmLocation}
              disabled={!pickedPos}
              className="w-full h-[52px] rounded-full bg-[#ffe14e] text-[#192853] font-bold text-[16px] shadow-md disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              Confirmar localização
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white flex flex-col pb-[80px]">
        <div className="flex-1 overflow-y-auto px-5 pt-8">

          <p className="text-[11px] font-semibold text-[#aaa] uppercase tracking-widest mb-3">Sobre o evento</p>

          <div
            onClick={() => imageInputRef.current?.click()}
            className="w-full h-[140px] rounded-[14px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer mb-4 overflow-hidden relative"
          >
            {imagem ? (
              <img src={imagem} alt="capa" className="w-full h-full object-cover" />
            ) : (
              <>
                <UploadIcon color="#bbb" />
                <p className="text-[13px] text-[#bbb] mt-2">Adicionar imagem do evento</p>
              </>
            )}
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          <div className="mb-1">
            <p className="text-[13px] font-semibold text-[#333] mb-1">Título <span className="text-red-500">*</span></p>
            <input
              type="text"
              placeholder="Ex: Festival de Verão 2026"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-200 rounded-[10px] px-3 h-[44px] text-[15px] text-[#333] outline-none placeholder:text-[#ccc] focus:border-[#192853]"
            />
          </div>

          <div className="mt-4 mb-2">
            <p className="text-[13px] font-semibold text-[#333] mb-1">Descrição</p>
            <textarea
              placeholder="Conte mais sobre o evento..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-[10px] px-3 py-2 text-[15px] text-[#333] outline-none placeholder:text-[#ccc] resize-none focus:border-[#192853]"
            />
          </div>

          <div className="mt-2">
            <RowField icon={<CalendarIcon />} placeholder="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
            <RowField icon={<ClockIcon />} placeholder="Horário" type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />

            <button
              type="button"
              onClick={openMapPicker}
              className="flex items-center gap-3 py-3 border-b border-gray-100 w-full text-left"
            >
              <span className="shrink-0"><MapPinIcon /></span>
              <span className={`flex-1 text-[15px] ${hasLocation ? "text-[#192853] font-medium" : "text-[#bbb]"}`}>
                {hasLocation ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}` : "Selecionar no mapa"}
              </span>
              <span className={`text-[12px] font-medium ${hasLocation ? "text-[#192853]" : "text-[#aaa]"}`}>
                {hasLocation ? "Alterar" : ""}
              </span>
              <ChevronIcon />
            </button>

            <RowField icon={<LocationIcon />} placeholder="Nome do local (opcional)" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} />
            <RowField icon={<LinkIcon />} placeholder="Site ou Rede Social" value={site} onChange={(e) => setSite(e.target.value)} />
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-semibold text-[#333] mb-2">Categoria <span className="text-red-500">*</span></p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => (
                <button key={c} type="button" onClick={() => toggleChip(categorias, setCategorias, c)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${categorias.includes(c) ? "bg-[#192853] text-white border-[#192853]" : "bg-white text-[#555] border-gray-300"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-semibold text-[#333] mb-2">Máscaras de acessibilidade</p>
            <div className="flex flex-wrap gap-2">
              {ACESSIBILIDADE.map((a) => (
                <button key={a} type="button" onClick={() => toggleChip(acessibilidade, setAcessibilidade, a)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${acessibilidade.includes(a) ? "bg-[#192853] text-white border-[#192853]" : "bg-white text-[#555] border-gray-300"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 mb-6">
            <p className="text-[13px] font-semibold text-[#333] mb-2">Inscrições</p>
            <div className="flex flex-wrap gap-2">
              {INSCRICOES.map((i) => (
                <button key={i} type="button" onClick={() => setInscricao(i === inscricao ? "" : i)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${inscricao === i ? "bg-[#192853] text-white border-[#192853]" : "bg-white text-[#555] border-gray-300"}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          {erro && <p className="text-red-500 text-sm text-center mb-3">{erro}</p>}

          <button type="button" onClick={handleSubmit} disabled={loading}
            className="w-full h-[52px] rounded-full bg-[#ffe14e] text-[#192853] font-bold text-[16px] flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#192853"/>
            </svg>
            {loading ? "Publicando..." : "Publicar evento"}
          </button>

          <p className="text-center text-[13px] text-[#aaa] cursor-pointer hover:text-[#555] mb-4" onClick={() => navigate("/map")}>
            Cancelar
          </p>
        </div>

        <Navbar />
      </div>
    </>
  );
}
