"use client";

import { Suspense, useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import ExportDocuments from "@/components/common/ExportDocuments";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ResumenView from "@/components/reportes/ResumenView";

const VALID_TABS = ["resumen", "ventas", "utilidad"];

function ReportesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const tabParam = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(tabParam) ? tabParam : "resumen";

  const [selectedDate, setSelectedDate] = useState(new Date());
  const mes = selectedDate.getMonth() + 1;
  const anio = selectedDate.getFullYear();

  const handleTabChange = useCallback(
    (tab) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("tab", tab);

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );



  return (
    <div className="container-fluid p-0">
      <div
        className="bg-white shadow-premium"
        style={{
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <h1
              style={{
                fontSize: "20px",
                color: "#0f1901",
                lineHeight: "1.2",
                marginBottom: 0,
              }}
            >
              Reportes
            </h1>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-end gap-2">
            <div className="col-12 col-md-4">
              <div className="position-relative">
                <CalendarIcon
                  className="position-absolute"
                  style={{
                    width: "18px",
                    height: "18px",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    color: "#64748b",
                    pointerEvents: "none",
                  }}
                />

                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  locale={es}
                  className="form-control ps-5"
                  wrapperClassName="w-100"
                />
              </div>
            </div>

            <ExportDocuments />
          </div>
        </div>

        <div className="mt-4">
          {/* <div className="d-flex align-items-center gap-2 mb-3">
            {[
              { key: "resumen", label: "Resumen" },
              { key: "ventas", label: "Ventas" },
              { key: "utilidad", label: "Utilidad" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`btn border-0 transition-smooth ${isActive
                    ? "bg-brand-blue-light text-brand-blue"
                    : ""
                    }`}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "24px",
                    fontSize: "14px",
                    color: isActive
                      ? undefined
                      : "rgba(0,0,0,0.4)",
                    fontWeight: 500,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div> */}

          <div>
            {activeTab === "resumen" && <ResumenView mes={mes} anio={anio} />}

            {activeTab === "ventas" && (
              <div>
                Contenido de ventas
              </div>
            )}

            {activeTab === "utilidad" && (
              <div>
                Contenido de utilidad
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportesPage() {
  return (
    <Suspense fallback={null}>
      <ReportesContent />
    </Suspense>
  );
}