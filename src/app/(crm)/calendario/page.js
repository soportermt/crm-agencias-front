'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { bookingService } from '@/services/booking.service';
import Link from 'next/link';

const TYPE_COLORS = {
    'Hospedaje': '#2563eb',
    'Traslado': '#ea580c',
    'Circuitos': '#059669',
};

function formatLimitDate(dateStr) {
    if (!dateStr || dateStr === '0000-00-00' || dateStr === '0000-00-00 00:00:00') return 'Sin definir';
    const [year, month, day] = dateStr.split(' ')[0].split('-').map(Number);
    return format(new Date(year, month - 1, day), 'dd/MM/yyyy', { locale: es });
}

export default function Calendario({ onDayClick, alertMessage }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const [hoveredEvent, setHoveredEvent] = useState(null);

    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const weekdayLabels = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];

    useEffect(() => {
        let cancelado = false;

        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                const mes = format(currentMonth, 'M');
                const anio = format(currentMonth, 'yyyy');
                const data = await bookingService.calendario(mes, anio);
                if (!cancelado) {
                    setEvents(data);
                }
            } catch (err) {
                console.error('Error al cargar el calendario:', err);
                if (!cancelado) setError('No se pudo cargar el calendario.');
            } finally {
                if (!cancelado) setLoading(false);
            }
        }

        loadData();
        return () => {
            cancelado = true;
        };
    }, [currentMonth]);

    const getEventsForDay = (day) => {
        const key = format(day, 'yyyy-MM-dd');
        return events[key] || [];
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        onDayClick?.(day, getEventsForDay(day));
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Calendario</h2>

            {error && <div style={styles.errorBanner}>{error}</div>}

            {alertMessage && (
                <div style={styles.alert}>
                    <span style={styles.alertIcon}>⚠</span>
                    <div style={{ flex: 1 }}>
                        <div style={styles.alertMain}>{alertMessage.main}</div>
                        {alertMessage.sub && <div style={styles.alertSub}>{alertMessage.sub}</div>}
                    </div>
                </div>
            )}

            <div style={styles.toolbar}>
                <div style={styles.monthNav}>
                    <button
                        style={styles.navBtn}
                        onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                        aria-label="Mes anterior"
                        disabled={loading}
                    >
                        ‹
                    </button>
                    <span style={styles.monthLabel}>
                        {format(currentMonth, 'MMMM yyyy', { locale: es }).replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                    <button
                        style={styles.navBtn}
                        onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                        aria-label="Mes siguiente"
                        disabled={loading}
                    >
                        ›
                    </button>
                </div>

                <div style={styles.legend}>
                    {Object.entries(TYPE_COLORS).map(([tipo, color]) => (
                        <div key={tipo} style={styles.legendItem}>
                            <span style={{ ...styles.legendDot, background: color }} />
                            <span style={styles.legendLabel}>{tipo}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                {loading && <div style={styles.loadingOverlay}>Cargando…</div>}
                <div style={styles.gridScroll}>
                    <div style={styles.grid}>
                        {weekdayLabels.map((label) => (
                            <div key={label} style={styles.weekdayCell}>
                                {label}
                            </div>
                        ))}

                        {days.map((day) => {
                            const inMonth = isSameMonth(day, currentMonth);
                            const dayEvents = getEventsForDay(day);
                            const selected = selectedDay && isSameDay(day, selectedDay);

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => handleDayClick(day)}
                                    style={{
                                        ...styles.dayCell,
                                        ...(inMonth ? {} : styles.dayCellOutside),
                                        ...(isToday(day) && inMonth ? styles.dayCellToday : {}),
                                        ...(selected ? styles.dayCellSelected : {}),
                                    }}
                                >
                                    <span
                                        style={{
                                            ...styles.dayNumber,
                                            ...(inMonth ? {} : styles.dayNumberOutside),
                                        }}
                                    >
                                        {format(day, 'd')}
                                    </span>

                                    <div style={styles.eventList}>
                                        {dayEvents.slice(0, 3).map((ev) => (
                                            <div
                                                key={ev.id}
                                                style={styles.eventWrapper}
                                                onMouseEnter={() => setHoveredEvent(ev.id)}
                                                onMouseLeave={() => setHoveredEvent(null)}
                                            >
                                                <Link href={`/reservaciones/editar/${ev.id_venta}`} target="_blank" style={{ textDecoration: "none" }}>
                                                    <div
                                                        style={{
                                                            ...styles.eventBadge,
                                                            background: `${TYPE_COLORS[ev.type] || '#6b7280'}1a`,
                                                            color: TYPE_COLORS[ev.type] || '#374151',
                                                        }}
                                                    >
                                                        {ev.label}
                                                    </div>
                                                </Link>

                                                {hoveredEvent === ev.id && (
                                                    <div style={styles.tooltip}>
                                                        <div style={styles.tooltipTitle}>{ev.label}</div>
                                                        <div style={styles.tooltipRow}>
                                                            <span style={styles.tooltipLabel}>Límite cliente:</span>
                                                            <span>{formatLimitDate(ev.lim_pago_cliente)}</span>
                                                        </div>
                                                        <div style={styles.tooltipRow}>
                                                            <span style={styles.tooltipLabel}>Límite pago:</span>
                                                            <span>{formatLimitDate(ev.lim_pago)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div style={styles.moreLabel}>+{dayEvents.length - 3} más</div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        maxWidth: 1300,
        margin: '0 auto',
        fontFamily: 'inherit',
    },
    title: { margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#111827' },
    errorBanner: {
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13,
        marginBottom: 12,
    },
    alert: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 8,
        padding: '10px 14px',
        marginBottom: 16,
    },
    alertIcon: { color: '#b45309', marginTop: 1 },
    alertMain: { fontSize: 13, color: '#92400e', fontWeight: 500 },
    alertSub: { fontSize: 12, color: '#a16207', marginTop: 2 },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
        gap: 12,
    },
    monthNav: { display: 'flex', alignItems: 'center', gap: 12 },
    navBtn: {
        border: 'none',
        background: 'transparent',
        fontSize: 18,
        cursor: 'pointer',
        color: '#374151',
        padding: '2px 6px',
        borderRadius: 6,
    },
    monthLabel: { fontSize: 16, fontWeight: 600, color: 'rgb(29, 78, 216)', minWidth: 130, textAlign: 'center' },
    viewSwitch: { display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 3, gap: 2 },
    viewBtn: {
        border: 'none',
        background: 'transparent',
        padding: '6px 14px',
        borderRadius: 6,
        fontSize: 13,
        cursor: 'pointer',
        color: '#4b5563',
    },
    viewBtnActive: { background: '#1d4ed8', color: '#fff', fontWeight: 500 },
    loadingOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        color: '#4b5563',
        zIndex: 1,
        borderRadius: 8,
    },
    weekdayCell: {
        background: '#1d4ed8',
        color: '#fff',
        fontSize: 13,
        fontWeight: 500,
        padding: '10px 0',
        textAlign: 'center',
    },
    dayCell: {
        minHeight: 96,
        border: '1px solid #e5e7eb',
        background: '#fff',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        cursor: 'pointer',
        textAlign: 'left',
    },
    dayCellOutside: { background: '#f9fafb' },
    dayCellToday: { background: '#eff6ff' },
    dayCellSelected: { outline: '2px solid #1d4ed8', outlineOffset: -2 },
    dayNumber: { fontSize: 13, fontWeight: 500, color: '#111827', marginBottom: 6 },
    dayNumberOutside: { color: '#9ca3af' },
    eventList: { display: 'flex', flexDirection: 'column', gap: 3, width: '100%', minWidth: 0 },
    eventBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 10.5,
        borderRadius: 4,
        padding: '2px 5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
    },
    eventDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
    moreLabel: { fontSize: 10, color: '#6b7280', paddingLeft: 5 },
    legend: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        flexShrink: 0,
    },
    legendLabel: {
        fontSize: 12,
        color: '#4b5563',
        fontWeight: 500,
    },
    gridScroll: {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        minWidth: 700,
    },
    eventWrapper: {
        position: 'relative',
        width: '100%',
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: 6,
        background: '#111827',
        color: '#fff',
        borderRadius: 8,
        padding: '8px 10px',
        fontSize: 11,
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        zIndex: 20,
        pointerEvents: 'none',
    },
    tooltipTitle: {
        fontWeight: 600,
        marginBottom: 4,
        maxWidth: 220,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    tooltipRow: {
        display: 'flex',
        gap: 6,
    },
    tooltipLabel: {
        color: '#9ca3af',
    },
};