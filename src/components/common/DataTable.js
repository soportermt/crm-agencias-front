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
  minWidth = "1200px",
  cellPadding = "6px 16px",
  headerPadding = "6px 16px"
}) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

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
                    padding: headerPadding,
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
                        className={`font-inter ${col.align ? `text-${col.align}` : ""}`}
                        style={{
                          color: "#0f1901",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          padding: cellPadding
                        }}
                      >
                        {content !== undefined ? content : row[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-secondary font-inter" style={{ fontSize: "13px" }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="d-flex justify-content-center align-items-center py-2 px-3 border-top gap-3 bg-white">
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

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span
                    key={`dots-${index}`}
                    style={{
                      border: "1px solid #dcdcdc",
                      color: "#292929",
                      fontSize: "14px",
                      height: "36px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ffffff",
                      marginLeft: "-1px",
                      padding: "0 14px",
                    }}
                  >
                    ...
                  </span>
                ) : (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (onPageChange) onPageChange(page); }}
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
                      backgroundColor: currentPage === page ? "#f6f6f6" : "#ffffff",
                      marginLeft: "-1px",
                      padding: "0 14px",
                    }}
                  >
                    {page}
                  </a>
                )
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
