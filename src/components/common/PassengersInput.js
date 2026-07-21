"use client";

import React from "react";

export default function PassengersInput({ room, onChange }) {
  const handleAdultsChange = (e) => {
    onChange(Number(e.target.value), room.menores);
  };

  const handleChildrenChange = (e) => {
    onChange(room.adultos, Number(e.target.value));
  };

  return (
    <div className="dropdown">
      <label className="form-label">Pasajeros</label>

      <input
        type="text"
        className="form-control dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        readOnly
        value={`${room.adultos} adulto(s), ${room.menores} menor(es)`}
        style={{ cursor: "pointer" }}
      />

      <div className="dropdown-menu p-3 w-100">
        <div className="row g-3">
          <div className="col-6">
            <label className="form-label">Adultos</label>

            <select
              className="form-select"
              value={room.adultos}
              onChange={handleAdultsChange}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6">
            <label className="form-label">Menores</label>

            <select
              className="form-select"
              value={room.menores}
              onChange={handleChildrenChange}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}