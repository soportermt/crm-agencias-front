"use client";

import React from "react";

export default function DataTable({
  columns = [],
  data = [],
  renderCell,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  emptyMessage = "No se encontraron registros.",
  minWidth = "1200px"
}) {
  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-hover mb-0" style={{ minWidth }}>
          <thead className="small">
            <tr className="align-middle">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`fw-medium font-inter ${col.align ? `text-${col.align}` : ""}`}
                  style={{
                    backgroundColor: "#e7f1fe",
                    color: "#0c5cc6",
                    padding: "6px 16px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    borderTop: "none",
                    whiteSpace: "nowrap",
                    width: col.width || "auto"
                  }}
                >
                  <span 
                    className={`d-inline-flex align-items-center gap-1 ${col.align === "center" ? "justify-content-center w-100" : ""}`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {col.label}
                    {col.sortable && (
                      <i className="bi bi-arrow-down small opacity-50"></i>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="small">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                  {columns.map((col, colIndex) => {
                    const content = renderCell ? renderCell(col.key, row) : row[col.key];
                    return (
                      <td
                        key={colIndex}
                        className={`py-3 px-3 font-inter ${col.align ? `text-${col.align}` : ""}`}
                        style={{ color: "#0f1901", fontSize: "13px" }}
                      >
                        {content !== undefined ? content : row[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-secondary font-inter" style={{ fontSize: "13px" }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="d-flex justify-content-center align-items-center p-3 border-top gap-3 bg-white">
          <nav aria-label="Navegación de registros">
            <div className="d-inline-flex align-items-center">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1); }}
                style={{
                  border: "1px solid #dcdcdc",
                  color: "#292929",
                  fontSize: "14px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "#ffffff",
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  padding: "0 12px",
                }}
              >
                <i className="bi bi-chevron-left" style={{ fontSize: "12px", color: "#292929" }}></i>
                <span>Previous</span>
              </a>

              {[...Array(totalPages)].map((_, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (onPageChange) onPageChange(i + 1); }}
                  style={{
                    border: "1px solid #dcdcdc",
                    color: "#292929",
                    fontSize: "14px",
                    height: "36px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    cursor: "pointer",
                    textDecoration: "none",
                    backgroundColor: currentPage === i + 1 ? "#f6f6f6" : "#ffffff",
                    marginLeft: "-1px",
                    padding: "0 14px",
                  }}
                >
                  {i + 1}
                </a>
              ))}

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1); }}
                style={{
                  border: "1px solid #dcdcdc",
                  color: "#292929",
                  fontSize: "14px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: "#ffffff",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  marginLeft: "-1px",
                  padding: "0 12px",
                }}
              >
                <span>Next</span>
                <i className="bi bi-chevron-right" style={{ fontSize: "12px", color: "#292929" }}></i>
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
