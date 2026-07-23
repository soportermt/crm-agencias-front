import React, { useMemo } from 'react'
import { useBookingForm } from './BookingFormContext';
import { calcularTotalNeto, formatMoney } from "@/utils/pricing";

export default function BookingPriceBreakdown({ isSubmitting }) {
  const { draft, booking } = useBookingForm();
  const vendedor = booking.customer;
  const provider = draft?.data?.providerData;
  const habitaciones = draft?.data?.habitaciones || [];
  const fee = Number(draft?.data?.fee) || 0;

  const { totalPublico, totalNeto } = useMemo(() => {
    return habitaciones.reduce(
      (acc, hab) => {
        const publico = Number(hab.total_publico) || 0;
        acc.totalPublico += publico;
        acc.totalNeto += calcularTotalNeto(publico, provider?.comision);
        return acc;
      },
      { totalPublico: 0, totalNeto: 0 }
    );
  }, [habitaciones, provider?.comision]);

  const totalFinal = totalPublico + fee;

  return (
    <div className="container-fluid py-2">
      <h5 style={{ fontSize: "18px", fontWeight: 600 }}>Información agencia</h5>
      <div className='d-flex flex-column gap-2 mb-3'>
        <p className='mb-0' style={{ color: "var(--brand-blue)", fontWeight: 600 }}>{vendedor?.label || "Selecciona un vendedor"}</p>
        <p className='d-flex mb-0' style={{ color: "rgba(64, 64, 64, 0.8)", fontSize: 14, alignItems: "flex-start" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="size-6"
            style={{ width: "15px", minWidth: "15px", marginRight: 6, marginTop: 2, flexShrink: 0 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          <span style={{ wordBreak: "break-word" }}>{vendedor?.phone || "-"}</span>
        </p>
        <p className='d-flex mb-0' style={{ color: "rgba(64, 64, 64, 0.8)", fontSize: 14, alignItems: "flex-start" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "15px", minWidth: "15px", marginRight: 6, marginTop: 2, flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <span style={{ wordBreak: "break-word" }}>{vendedor?.email || "-"}</span>
        </p>
        <p className='d-flex mb-0' style={{ color: "rgba(64, 64, 64, 0.8)", fontSize: 14, alignItems: "flex-start" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "15px", minWidth: "15px", marginRight: 6, marginTop: 2, flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span style={{ wordBreak: "break-word" }}>{vendedor?.direccion || "-"}</span>
        </p>
      </div>
      <h5 style={{ fontSize: "18px", fontWeight: 600 }}>Desglose venta</h5>
      <div style={{ fontSize: 14, color: "rgba(64, 64, 64, 0.8)" }}>
        <div className='row align-items-center mb-2'>
          <div className='col-12 col-md-6'>
            <p className='mb-2'>Comisión Agencia:</p>
          </div>
          <div className='col-12 col-md-6 mt-2 mt-md-0'>
            <div className="input-group">
              <input type="number" className="form-control px-2" aria-label="porcentaje" aria-describedby="porcentaje" style={{ borderRadius: "12px 0 0 12px !important", borderRight: "1px solid var(--primary-color)", color: "rgba(64, 64, 64, .8)" }} value={provider?.comision ?? ''}
               onChange={(e) =>
                updateDraftField("providerData", {
                  ...provider,
                  comision: e.target.value,
                })
              } 
              readOnly
              disabled
              />
              <span className="input-group-text" id="porcentaje">%</span>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <p className='mb-2'>Total Neto:</p>
          <p className='mb-2'>{formatMoney(totalNeto)}</p>
        </div>
        <div className='d-flex justify-content-between'>
          <p className='mb-2'>Total Público:</p>
          <p className='mb-2'>{formatMoney(totalPublico)}</p>
        </div>
        <div className='d-flex justify-content-between'>
          <p className='mb-2'>Fee:</p>
          <p className='mb-2'>{formatMoney(fee)}</p>
        </div>
        <div className='d-flex justify-content-between'>
          <p className='mb-2'>Descuento:</p>
          <p className='mb-2'>$0.00</p>
        </div>
        <div className='d-flex justify-content-between'>
          <p className='mb-2 fw-bolder'>Total Público:</p>
          <p className='mb-2 fw-bolder' style={{ color: "var(--dark-green)" }}>{formatMoney(totalFinal)}</p>
        </div>
      </div>
      <button
        type="submit"
        className='btn btn-primary w-100 mt-3'
        style={{ backgroundColor: "var(--brand-blue)" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creando..." : "Crear reservación"}
      </button>
    </div >
  )
}
