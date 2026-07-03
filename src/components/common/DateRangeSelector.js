"use client";

import React, { useState, useRef, useEffect } from "react";

export default function DateRangeSelector({
  startDate: initialStartDate = "2026-05-01",
  endDate: initialEndDate = "2026-05-25",
  onChange,
  showIcon = true,
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (onChange) {
      onChange({ startDate: newStart, endDate });
    }
  };

  const handleEndDateChange = (e) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    if (onChange) {
      onChange({ startDate, endDate: newEnd });
    }
  };

  const formattedRange = `${formatDate(startDate)} al ${formatDate(endDate)}`;

  return (
    <div className="position-relative d-inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn d-flex align-items-center gap-2 border bg-white transition-smooth"
        style={{
          height: "38px",
          borderRadius: "8px",
          borderColor: "#d0d5dd",
          fontSize: "13px",
          color: "#0f1901",
          fontWeight: 400,
          padding: "0 16px",
          boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
        }}
        type="button"
      >
        {showIcon && <i className="bi bi-calendar3" style={{ fontSize: "14px", color: "#475569" }}></i>}
        <span style={{ fontFamily: "var(--font-inter)" }}>{formattedRange}</span>
      </button>

      {isOpen && (
        <div
          className="position-absolute bg-white border p-3 mt-1 shadow-premium"
          style={{
            borderRadius: "12px",
            zIndex: 1050,
            minWidth: "280px",
            right: 0,
            top: "100%",
            borderColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="d-flex flex-column gap-2">
            <div>
              <label
                className="form-label font-inter mb-1 text-secondary"
                style={{ fontSize: "11px", fontWeight: 500 }}
              >
                Desde
              </label>
              <input
                type="date"
                className="form-control"
                style={{ fontSize: "13px", borderRadius: "6px" }}
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div>
              <label
                className="form-label font-inter mb-1 text-secondary"
                style={{ fontSize: "11px", fontWeight: 500 }}
              >
                Hasta
              </label>
              <input
                type="date"
                className="form-control"
                style={{ fontSize: "13px", borderRadius: "6px" }}
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
