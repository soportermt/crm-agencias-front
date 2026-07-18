"use client";

import React from "react";

export default function PassengersInput({ room, onChange }) {
  const handleAdultsChange = (e) => {
    onChange(Number(e.target.value), room.children);
  };

  const handleChildrenChange = (e) => {
    onChange(room.adults, Number(e.target.value));
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
        value={`${room.adults} adulto(s), ${room.children} menor(es)`}
        style={{ cursor: "pointer" }}
      />

      <div className="dropdown-menu p-3 w-100">
        <div className="row g-3">
          <div className="col-6">
            <label className="form-label">Adultos</label>

            <select
              className="form-select"
              value={room.adults}
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
              value={room.children}
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