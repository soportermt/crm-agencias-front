"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  
  // Estado para conmutar visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0 d-flex font-inter login-container-bg">
      <div className="row g-0 w-100 min-vh-100">
        {/* Columna Izquierda: Carrusel / Presentación */}
        <div
          className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center px-5 relative position-relative"
          style={{
            color: "var(--dark-green)",
          }}
        >
          {/* Contenedor del Carrusel Estático */}
          <div
            className="text-center w-100"
            style={{ maxWidth: "626px" }}
          >
            <div>
              <h1 className="title-login mb-4 text-center">
                Control total de tu operación turística.
              </h1>
              <p className="subtitle-login px-3 mb-5">
                Identifícate para gestionar salidas, pagos y reportes en tiempo real.
              </p>
            </div>
            {/* Indicadores de diapositiva estáticos */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              <span
                className="rounded-circle"
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "var(--primary-color)",
                }}
              />
              <span
                className="rounded-circle"
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "var(--primary-color)",
                }}
              />
              <span
                className="rounded-circle"
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "var(--primary-color)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Login */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="p-card-login border border-light">
            {/* Logo Image */}
            <div className="text-center mb-4 mb-md-5">
              <Image
                src="/2bt2025.png"
                alt="2Business Travel Logo"
                width={300}
                height={60}
                priority
                className="img-fluid mx-auto d-block"
                style={{ height: "auto", maxWidth: "min(300px, 85vw)" }}
              />
            </div>

            {/* Encabezado del panel */}
            <div className="mb-4">
              <h2
                className="font-poppins h4 fw-semibold mb-1"
                style={{ color: "var(--dark-green)" }}
              >
                Accede a tu panel de control
              </h2>
              <p
                className="text-secondary small font-poppins"
                style={{ color: "var(--grey-text)" }}
              >
                Por favor, introduce tus credenciales para continuar.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              {error && (
                <div className="alert alert-danger py-2 px-3 small font-inter mb-3" role="alert" style={{ borderRadius: "8px", backgroundColor: "#ffebee", color: "#c62828", border: "none" }}>
                  {error}
                </div>
              )}

              {/* Campo Correo / Username */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  htmlFor="email"
                  className="form-label small fw-medium text-secondary mb-1"
                >
                  Usuario o Correo electrónico
                </label>
                <input
                  type="text"
                  id="email"
                  required
                  placeholder="atencion@solucionesid.com"
                  className="form-control input-custom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Campo Contraseña */}
              <div style={{ marginBottom: "18px" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label
                    htmlFor="password"
                    className="form-label small fw-medium text-secondary mb-0"
                  >
                    Contraseña
                  </label>
                  <a
                    href="#"
                    className="small transition-smooth fw-medium"
                    style={{
                      color: "var(--primary-light)",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    ¿Olvidó su contraseña?
                  </a>
                </div>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    placeholder="••••••••••••••"
                    className="form-control input-custom pe-5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn p-0 position-absolute end-0 top-50 translate-middle-y me-3 text-secondary bg-transparent border-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ zIndex: 10 }}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Recordarme */}
              <div className="form-check d-flex align-items-center gap-2" style={{ marginBottom: "24px" }}>
                <input
                  type="checkbox"
                  id="remember"
                  className="form-check-input mt-0"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    borderColor: "var(--border-color)",
                  }}
                />
                <label
                  htmlFor="remember"
                  className="form-check-label small text-secondary select-none"
                  style={{ cursor: "pointer", fontSize: "13px" }}
                >
                  Recordarme la proxima vez
                </label>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="btn w-100 font-poppins fw-medium transition-smooth"
                style={{
                  backgroundColor: loading ? "#90caf9" : "#227cf2",
                  color: "#f2f2f2",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  border: "none",
                }}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
