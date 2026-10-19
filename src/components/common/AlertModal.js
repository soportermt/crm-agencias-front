import React from 'react'

export default function AlertModal({
    icon,
    title,
    description,
    onClose,
    onConfirm,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    isLoading = false,
}) {
    return (
        <div className='modal-backdrop modal' onClick={isLoading ? undefined : onClose}>
            <div
                className='card-body modal-content'
                onClick={(e) => e.stopPropagation()}
                style={{ borderRadius: "20px" }}
            >
                <div className='d-flex flex-column align-items-center text-center p-3 gap-2'>
                    {icon}
                    <div>
                        <span className='fw-bold mt-2'>{title}</span>
                        {description && <p>{description}</p>}
                    </div>

                    {onConfirm && (
                        <div className='d-flex gap-2 mt-2'>
                            <button
                                type='button'
                                className='btn btn-outline-secondary'
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </button>
                            <button
                                type='button'
                                className='btn btn-danger'
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? "Eliminando..." : confirmText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}