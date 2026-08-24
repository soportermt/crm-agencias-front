"use client";

import React, { useState, useEffect, useRef } from "react";
import { clientsService } from "@/services/clients.service";

export default function ClientModal({ show, onClose, onClientCreated, client }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const locationInputRef = useRef(null);
  const debounceTimer = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correo: "",
    fechaNacimiento: "",
    celular: "",
    sexo: "",
    estadoCivil: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
    pais: "",
    rfc: "",
  });
  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      correo: "",
      fechaNacimiento: "",
      celular: "",
      sexo: "",
      estadoCivil: "",
      codigoPostal: "",
      ciudad: "",
      estado: "",
      pais: "",
      rfc: "",
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google && window.google.maps && window.google.maps.places) {
      setMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      document.head.appendChild(script);
    } else {
      const script = document.getElementById(scriptId);
      script.addEventListener('load', () => setMapsLoaded(true));
    }
  }, []);

  const handleLocationSearch = (value, field, types) => {
    setFormData({ ...formData, [field]: value });
    setActiveField(field);
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (value && mapsLoaded && window.google) {
      debounceTimer.current = setTimeout(() => {
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: value, types: types }, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        });
      }, 500); // 500ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (placeId, description, field) => {
    setFormData(prev => ({ ...prev, [field]: description.split(',')[0] }));
    setShowSuggestions(false);

    if (window.google) {
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails({ placeId, fields: ['address_components'] }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.address_components) {
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';

          place.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = city || component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }
            if (types.includes('country')) {
              country = component.long_name;
            }
            if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          setFormData(prev => ({
            ...prev,
            ciudad: city || prev.ciudad,
            estado: state || prev.estado,
            pais: country || prev.pais,
            codigoPostal: postalCode || prev.codigoPostal
          }));
        }
      });
    }
  };

  useEffect(() => {
    if (show) {
      if (client) {
        setFormData({
          nombreCompleto: client.nombreCompleto || client.name || "",
          correo: client.correo || "",
          fechaNacimiento: (client.fechaNacimiento || client.fecha_nacimiento || "").split("T")[0].split(" ")[0],
          celular: client.celular || client.telefono || "",
          sexo: client.sexo || "",
          estadoCivil: client.estadoCivil || client.estado_civil || "",
          codigoPostal: client.codigoPostal || client.codigo_postal || "",
          ciudad: client.ciudad || "",
          estado: client.estado || "",
          pais: client.pais || "",
          rfc: client.rfc || "",
        });
      } else {
        resetForm();
      }
    }
  }, [show, client]);

  const handleSubmit = async () => {

    if (!formData.nombreCompleto || !formData.fechaNacimiento || !formData.celular || !formData.ciudad || !formData.estado || !formData.pais) {
      setError("Completa los campos obligatorios (*).");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      if (client) {
        const updatedClient = await clientsService.updateClient(client.id, formData);
        if (onClientCreated) onClientCreated(updatedClient);
      } else {
        const newClient = await clientsService.createClient(formData);
        if (onClientCreated) onClientCreated(newClient);
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      setError("Error al guardar cliente en el backend. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };
  if (!show) return null;

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-stretch justify-content-end"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-premium font-inter w-100 transition-smooth"
        style={{
          maxWidth: "500px",
          height: "100vh",
          overflowY: "auto",
          borderRadius: "0",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2
            className="font-inter h4 mb-0 fw-medium"
            style={{ color: "var(--dark-green)" }}
          >
            {client ? "Editar cliente" : "Registro de nuevo cliente"}
          </h2>
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ fontSize: "1.5rem", color: "var(--dark-green)", lineHeight: 1 }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div>
          <div className="mb-4">
            <h3
              className="font-inter h6 fw-medium mb-3"
              style={{ color: "var(--dark-green)" }}
            >
              Datos personales
            </h3>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  className="form-control input-custom"
                  value={formData.nombreCompleto}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreCompleto: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control input-custom"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  RFC
                </label>
                <input
                  type="text"
                  className="form-control input-custom text-uppercase"
                  value={formData.rfc}
                  onChange={(e) =>
                    setFormData({ ...formData, rfc: e.target.value.toUpperCase() })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Fecha de nacimiento *
                </label>
                <input
                  type="date"
                  required
                  className="form-control input-custom"
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaNacimiento: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Celular *
                </label>
                <input
                  type="tel"
                  required
                  className="form-control input-custom"
                  value={formData.celular}
                  onChange={(e) =>
                    setFormData({ ...formData, celular: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Sexo
                </label>
                <select
                  className="form-select input-custom"
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({ ...formData, sexo: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Estado civil
                </label>
                <select
                  className="form-select input-custom"
                  value={formData.estadoCivil}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoCivil: e.target.value })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="Casado">Casado/a</option>
                  <option value="Divorciado">Divorciado/a</option>
                  <option value="Viudo">Viudo/a</option>
                  <option value="UnionLibre">Unión Libre</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3
              className="font-inter h6 fw-medium mb-3"
              style={{ color: "var(--dark-green)" }}
            >
              Dirección
            </h3>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Código postal
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control input-custom"
                    value={formData.codigoPostal}
                    onChange={(e) => handleLocationSearch(e.target.value, 'codigoPostal', ['(regions)'])}
                    onFocus={() => {
                      setActiveField('codigoPostal');
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    autoComplete="off"
                  />
                  {showSuggestions && activeField === 'codigoPostal' && suggestions.length > 0 && (
                    <ul
                      className="list-group position-absolute w-100 shadow-sm"
                      style={{ zIndex: 1060, top: '100%', maxHeight: '200px', overflowY: 'auto' }}
                    >
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="list-group-item list-group-item-action font-poppins small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSelectSuggestion(suggestion.place_id, suggestion.description, 'codigoPostal')}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>


              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Ciudad *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    ref={locationInputRef}
                    className="form-control input-custom"
                    value={formData.ciudad}
                    onChange={(e) => handleLocationSearch(e.target.value, 'ciudad', ['(cities)'])}
                    onFocus={() => {
                      setActiveField('ciudad');
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    autoComplete="off"
                  />
                  {showSuggestions && activeField === 'ciudad' && suggestions.length > 0 && (
                    <ul
                      className="list-group position-absolute w-100 shadow-sm"
                      style={{ zIndex: 1060, top: '100%', maxHeight: '200px', overflowY: 'auto' }}
                    >
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="list-group-item list-group-item-action font-poppins small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSelectSuggestion(suggestion.place_id, suggestion.description, 'ciudad')}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>


              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  Estado *
                </label>
                <input
                  type="text"
                  required
                  className="form-control input-custom"
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                />
              </div>


              <div className="col-6 mb-3">
                <label className="form-label text-secondary small font-poppins mb-1" style={{ fontWeight: 400 }}>
                  País *
                </label>
                <input
                  type="text"
                  required
                  className="form-control input-custom"
                  value={formData.pais}
                  onChange={(e) =>
                    setFormData({ ...formData, pais: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {error && <div className="text-danger mb-3 font-poppins small">{error}</div>}
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary-custom transition-smooth fw-medium d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                width: "215px",
                height: "43px",
                borderRadius: "12px",
              }}
            >
              {submitting ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </span>
              ) : (
                "Confirmar"
              )}
            </button>
          </div>

        </div>
      </div>
      <style>{`
        .pac-container {
          z-index: 1060 !important;
        }
      `}</style>
    </div>
  );
}
