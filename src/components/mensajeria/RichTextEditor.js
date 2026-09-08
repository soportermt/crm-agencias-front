"use client";

import React, { useRef, useEffect, useState } from "react";

export default function RichTextEditor({ value, onChange, placeholder = "Escribe el contenido del correo..." }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      if (!value) {
        editorRef.current.innerHTML = "";
      } else if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const executeCommand = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt("Introduce el enlace (URL):", "https://");
    if (url && url !== "https://") {
      executeCommand("createLink", url);
    }
  };

  return (
    <div
      className="d-flex flex-column rounded-3"
      style={{
        border: `1px solid ${isFocused ? "var(--primary-color, #0c5cc6)" : "var(--border-color, #e2e8f0)"}`,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isFocused ? "0 0 0 3px rgba(12, 92, 198, 0.1)" : "none",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Barra de herramientas */}
      <div
        className="d-flex align-items-center flex-wrap gap-1 px-2 py-1 border-bottom bg-light"
        style={{ borderColor: "#edf2f7" }}
      >
        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("bold")}
          title="Negrita (Ctrl+B)"
        >
          <i className="bi bi-type-bold" style={{ fontSize: "14px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("italic")}
          title="Cursiva (Ctrl+I)"
        >
          <i className="bi bi-type-italic" style={{ fontSize: "14px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("underline")}
          title="Subrayado (Ctrl+U)"
        >
          <i className="bi bi-type-underline" style={{ fontSize: "14px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("strikeThrough")}
          title="Tachado"
        >
          <i className="bi bi-type-strikethrough" style={{ fontSize: "14px" }}></i>
        </button>

        <div className="vr mx-1 my-auto" style={{ height: "18px", color: "#cbd5e1" }}></div>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("insertUnorderedList")}
          title="Lista con viñetas"
        >
          <i className="bi bi-list-ul" style={{ fontSize: "14px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("insertOrderedList")}
          title="Lista numerada"
        >
          <i className="bi bi-list-ol" style={{ fontSize: "14px" }}></i>
        </button>

        <div className="vr mx-1 my-auto" style={{ height: "18px", color: "#cbd5e1" }}></div>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("justifyLeft")}
          title="Alinear a la izquierda"
        >
          <i className="bi bi-text-left" style={{ fontSize: "14px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("justifyCenter")}
          title="Centrar"
        >
          <i className="bi bi-text-center" style={{ fontSize: "14px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("justifyRight")}
          title="Alinear a la derecha"
        >
          <i className="bi bi-text-right" style={{ fontSize: "14px" }}></i>
        </button>

        <div className="vr mx-1 my-auto" style={{ height: "18px", color: "#cbd5e1" }}></div>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={handleLink}
          title="Insertar enlace"
        >
          <i className="bi bi-link-45deg" style={{ fontSize: "15px" }}></i>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
          style={{ width: "28px", height: "28px", borderRadius: "6px" }}
          onClick={() => executeCommand("removeFormat")}
          title="Limpiar formato"
        >
          <i className="bi bi-eraser" style={{ fontSize: "14px" }}></i>
        </button>

        <div className="ms-auto d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
            style={{ width: "28px", height: "28px", borderRadius: "6px" }}
            onClick={() => executeCommand("undo")}
            title="Deshacer"
          >
            <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "13px" }}></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-light border-0 d-flex align-items-center justify-content-center p-1 text-secondary"
            style={{ width: "28px", height: "28px", borderRadius: "6px" }}
            onClick={() => executeCommand("redo")}
            title="Rehacer"
          >
            <i className="bi bi-arrow-clockwise" style={{ fontSize: "13px" }}></i>
          </button>
        </div>
      </div>

      {/* Área editable */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-3"
        style={{
          minHeight: "220px",
          maxHeight: "380px",
          overflowY: "auto",
          outline: "none",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#1e293b",
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
