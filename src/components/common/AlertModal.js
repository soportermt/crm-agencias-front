import React from 'react'

export default function AlertModal({ icon, title, description, onClose }) {
    return (
        <div className='modal-backdrop modal' onClick={onClose}>
            <div className='card-body modal-content' onClick={(e) => e.stopPropagation()} style={{ borderRadius: "20px" }}>
                <div className='d-flex flex-column align-items-center text-center p-3 gap-2'>
                    {icon}
                    <div>
                        <span className='fw-bold mt-2'>{title}</span>
                        <p>{description}</p>
                    </div>
                    <button onClick={onClose} className='btn btn-bg-style w-100'>Cerrar</button>
                </div>
            </div>
        </div>
    )
}