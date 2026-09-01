'use client';

import { useMemo, useState } from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';


const MOCK_EVENTS = {
    '2026-09-09': [{ id: 1, label: 'Hotel Dreams - Folio #0042', type: 'hotel' }],
    '2026-09-16': [
        { id: 2, label: 'Vuelo AM 302 - Folio #0051', type: 'vuelo' },
        { id: 3, label: 'Transfer Aeropuerto - Folio #0067', type: 'operador' },
    ],
    '2026-09-23': [{ id: 4, label: 'Tour Huatulco Bays - Folio #0089', type: 'tour' }],
};

const TYPE_COLORS = {
    hotel: '#2563eb',
    vuelo: '#7c3aed',
    operador: '#ea580c',
    tour: '#059669',
};

const VIEWS = ['Día', 'Semana', 'Mes'];

export default function Calendario({ events = MOCK_EVENTS, onDayClick, alertMessage }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [view, setView] = useState('Mes');
    const [selectedDay, setSelectedDay] = useState(null);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const weekdayLabels = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];

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
                    >
                        ‹
                    </button>
                    <span style={styles.monthLabel}>
                        {format(currentMonth, 'MMMM', { locale: es }).replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                    <button
                        style={styles.navBtn}
                        onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                        aria-label="Mes siguiente"
                    >
                        ›
                    </button>
                </div>

                <div style={styles.viewSwitch}>
                    {VIEWS.map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            style={{
                                ...styles.viewBtn,
                                ...(view === v ? styles.viewBtnActive : {}),
                            }}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

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
                                        title={ev.label}
                                        style={{
                                            ...styles.eventBadge,
                                            background: `${TYPE_COLORS[ev.type] || '#6b7280'}1a`,
                                            color: TYPE_COLORS[ev.type] || '#374151',
                                        }}
                                    >
                                        <span
                                            style={{
                                                ...styles.eventDot,
                                                background: TYPE_COLORS[ev.type] || '#6b7280',
                                            }}
                                        />
                                        {ev.label}
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
    );
}

const styles = {
    card: {
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        maxWidth: 1200,
        margin: '0 auto',
        fontFamily: 'inherit',
    },
    title: { margin: '0 0 16px', fontSize: 22, fontWeight: 600, color: '#111827' },
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
        marginBottom: 16,
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
    monthLabel: { fontSize: 16, fontWeight: 600, color: '#111827', minWidth: 90, textAlign: 'center' },
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
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
    eventList: { display: 'flex', flexDirection: 'column', gap: 3, width: '100%' },
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
    },
    eventDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
    moreLabel: { fontSize: 10, color: '#6b7280', paddingLeft: 5 },
};