'use client'
import { grupoService } from '@/services/grupo.service'
import React, { useEffect, useRef, useState, useMemo } from 'react'

const ALLOWED = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'csv']
const MAX_MB = 10
const FILES_URL = process.env.NEXT_PUBLIC_FILES_URL 

const getExt = (name = '') => name.split('.').pop().toLowerCase()
const isImage = (name) => ['jpg', 'jpeg', 'png'].includes(getExt(name))

const BADGE_COLORS = {
  pdf: '#e5252a', jpg: '#7367f0', jpeg: '#7367f0', png: '#7367f0',
  doc: '#2b579a', docx: '#2b579a', xls: '#217346', xlsx: '#217346', csv: '#217346',
}

function FileBadge({ name }) {
  const ext = getExt(name)
  return (
    <span className="badge-archivos" style={{ background: BADGE_COLORS[ext] || '#999' }}>
      {ext.toUpperCase()}
    </span>
  )
}

const formatDate = (log = '') => {
  const [d, t] = log.split(' ')
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y} ${t || ''}`
}

export default function Archivos({ id_grupo }) {
  const [data, setData] = useState([])
  const [selected, setSelected] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function loadData(id) {
    setIsLoading(true)
    try {
      const res = await grupoService.getGroupArchivos(id)
      setData(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error('Error al cargar los archivos:', err)
      setError('No se pudieron cargar los archivos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id_grupo) loadData(id_grupo)
  }, [id_grupo])

  const previews = useMemo(
    () => selected.map((f) => (isImage(f.name) ? URL.createObjectURL(f) : null)),
    [selected]
  )
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews])

  const addFiles = (fileList) => {
    setError(null)
    const valid = []
    const rejected = []

    Array.from(fileList).forEach((f) => {
      if (!ALLOWED.includes(getExt(f.name))) rejected.push(`${f.name}: tipo no permitido`)
      else if (f.size > MAX_MB * 1024 * 1024) rejected.push(`${f.name}: excede ${MAX_MB} MB`)
      else valid.push(f)
    })

    if (rejected.length) setError(rejected.join(' | '))
    setSelected((prev) => {
      const keys = new Set(prev.map((p) => p.name + p.size))
      return [...prev, ...valid.filter((v) => !keys.has(v.name + v.size))]
    })
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const removeSelected = (i) => setSelected((prev) => prev.filter((_, idx) => idx !== i))

  const handleUpload = async () => {
    if (!selected.length) return
    setIsUploading(true)
    setError(null)
    try {
      const res = await grupoService.uploadGroupArchivos(id_grupo, selected)
      if (res?.ok === false) setError((res.errors || []).join(' | '))
      else setSelected([])
      await loadData(id_grupo)
    } catch (err) {
      console.error(err)
      setError('Error al subir los archivos')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h5>Archivos</h5>

      <div className="panel-archivos">
        {isLoading ? (
          <p className="text-muted m-0">Cargando...</p>
        ) : data.length === 0 ? (
          <p className="text-muted m-0">Este grupo aún no tiene archivos.</p>
        ) : (
          <div className="grid-archivos">
            {data.map((f) => (
              <a
                key={f.id_grupo_archivo}
                href={`${FILES_URL}/${encodeURIComponent(f.path)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-archivos"
              >
                <div className="thumb-archivos">
                  {isImage(f.path) ? (
                    <img src={`${FILES_URL}/${encodeURIComponent(f.path)}`} alt={f.path} />
                  ) : (
                    <FileBadge name={f.path} />
                  )}
                </div>
                <div className="info-archivos">
                  <div className="name-archivos" title={f.path}>{f.path}</div>
                  <small className="date-archivos">{formatDate(f.log)}</small>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <>
          <div className="panel-archivos mt-2">
            <div className="grid-archivos">
              {selected.map((f, i) => (
                <div key={f.name + f.size} className="card-archivos">
                  <button className="remove-archivos" onClick={() => removeSelected(i)} title="Quitar">
                    ×
                  </button>
                  <div className="thumb-archivos">
                    {previews[i] ? <img src={previews[i]} alt={f.name} /> : <FileBadge name={f.name} />}
                  </div>
                  <div className="info-archivos">
                    <div className="name-archivos" title={f.name}>{f.name}</div>
                    <small className="date-archivos">{(f.size / 1024).toFixed(0)} KB</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-outline-primary" onClick={() => setSelected([])} disabled={isUploading}>
              Limpiar archivos
            </button>
            <button className="btn btn-primary" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Subiendo...' : `Subir ${selected.length} archivo(s)`}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-danger mt-3">{error}</p>}

      <div
        className={`dropzone ${dragging ? dragging : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <p>Guardar archivos nuevos del grupo.</p>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 10l5 5 5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={ALLOWED.map((e) => '.' + e).join(',')}
          onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
        />
      </div>
    </div>
  )
}