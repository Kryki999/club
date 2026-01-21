import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';

const ClubMap = ({ eventId }) => {
    const [tables, setTables] = useState([]);
    const [confirmedTableIds, setConfirmedTableIds] = useState([]);
    const [pendingTableIds, setPendingTableIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [eventName, setEventName] = useState('');



    // Fetch Tables
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const apiUrl = process.env.REACT_APP_STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

                const response = await fetch(`${apiUrl}/api/tables?populate=zone`);
                const data = await response.json();



                if (data.data) {
                    const formattedTables = data.data.map(t => {
                        const props = t.attributes || t;
                        let zoneData = null;
                        if (props.zone) {
                            if (props.zone.data?.attributes) {
                                zoneData = props.zone.data.attributes;
                            } else {
                                zoneData = props.zone;
                            }
                        }

                        return {
                            id: t.id,
                            ...props,
                            zone: zoneData
                        };
                    });
                    setTables(formattedTables);
                }
            } catch (error) {
                console.error("Error fetching tables:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    // Fetch Event Name
    useEffect(() => {
        if (!eventId) return;

        const fetchEventName = async () => {
            try {
                const apiUrl = process.env.REACT_APP_STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
                // Poprawione zapytanie do /api/wydarzenias
                const response = await fetch(`${apiUrl}/api/wydarzenias/${eventId}`);
                const data = await response.json();

                const eventData = data.data?.attributes || data.data || data;
                setEventName(eventData.NazwaWydarzenia || `Event #${eventId}`);
            } catch (error) {
                console.error("Error fetching event name:", error);
                setEventName(`Event #${eventId}`);
            }
        };

        fetchEventName();
    }, [eventId]);

    // Fetch Reservations when eventId changes
    useEffect(() => {
        if (!eventId) {
            setConfirmedTableIds([]);
            setPendingTableIds([]);
            return;
        }

        fetchReservations();
    }, [eventId]);

    const fetchReservations = async () => {
        setConfirmedTableIds([]);
        setPendingTableIds([]);

        try {
            const apiUrl = process.env.REACT_APP_STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

            console.log('🔍 Pobieranie rezerwacji dla wydarzenia via nowa API:', eventId);
            const url = `${apiUrl}/api/reservations/by-event/${eventId}`;

            const response = await fetch(url);
            const resData = await response.json();

            if (resData.data) {
                const confirmed = new Set();
                const pending = new Set();

                resData.data.forEach((res) => {
                    if (res.status === 'confirmed') {
                        confirmed.add(res.tableId);
                    } else if (res.status === 'pending') {
                        pending.add(res.tableId);
                    }
                    // drafty są traktowane jako wolne (zielone)
                });

                console.log('✅ Confirmed (gray):', [...confirmed]);
                console.log('🟠 Pending (orange):', [...pending]);
                setConfirmedTableIds([...confirmed]);
                setPendingTableIds([...pending]);
            }
        } catch (error) {
            console.error("❌ Błąd pobierania rezerwacji:", error);
        }
    };

    const handleMouseEnter = (e, table) => {
        setTooltip({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            content: { name: table.name || 'Unnamed', minSpend: table.minSpend }
        });
    };

    const handleMouseMove = (e) => {
        if (tooltip.visible) {
            setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
        }
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    const handleTableClick = (table) => {
        const isConfirmed = confirmedTableIds.includes(table.id);
        const isPending = pendingTableIds.includes(table.id);

        if (isConfirmed) {
            console.log(`❌ Stolik ${table.name} jest zajęty (confirmed)`);
            alert(`Stolik ${table.name} jest już zajęty`);
        } else if (isPending) {
            console.log(`🟠 Stolik ${table.name} jest zarezerwowany (pending)`);
            alert(`Stolik ${table.name} jest już zarezerwowany`);
        } else {
            console.log(`✅ Otwieranie modala dla stolika: ${table.name}`);
            setSelectedTable(table);
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedTable(null);
        // Odśwież rezerwacje po zamknięciu modala
        fetchReservations();
    };

    if (loading) return <div>Ładowanie mapy...</div>;

    return (
        <div className="club-map-container" style={{ position: 'relative', width: '100%' }}>
            <svg
                viewBox="0 0 600 400"
                preserveAspectRatio="xMidYMid meet"
                className="club-map-svg"
                onMouseMove={handleMouseMove}
            >
                {tables.map(table => {
                    const isConfirmed = confirmedTableIds.includes(table.id);
                    const isPending = pendingTableIds.includes(table.id);

                    // Kolory: zielony = wolny, orange = pending, szary = confirmed
                    let fillColor = '#4caf50'; // zielony (available)
                    if (isPending) fillColor = '#FFA500'; // pomarańczowy (pending)
                    if (isConfirmed) fillColor = '#ccc'; // szary (confirmed)

                    const strokeColor = table.zone?.color || '#000';

                    const commonProps = {
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: "2",
                        onMouseEnter: (e) => handleMouseEnter(e, table),
                        onMouseLeave: handleMouseLeave,
                        onClick: () => handleTableClick(table),
                        style: { cursor: 'pointer', transition: 'fill 0.3s' }
                    };

                    if (table.shape === 'circle') {
                        return (
                            <circle
                                key={table.id}
                                cx={table.x}
                                cy={table.y}
                                r={table.radius || 20}
                                {...commonProps}
                            />
                        );
                    } else {
                        return (
                            <rect
                                key={table.id}
                                x={table.x}
                                y={table.y}
                                width={table.width || 40}
                                height={table.height || 40}
                                {...commonProps}
                            />
                        );
                    }
                })}
            </svg>

            {tooltip.visible && (
                <div style={{
                    position: 'fixed',
                    top: tooltip.y + 15,
                    left: tooltip.x + 15,
                    background: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    whiteSpace: 'nowrap'
                }}>
                    <div style={{ fontWeight: 'bold' }}>{tooltip.content.name}</div>
                    <div>Min. wydatek: {tooltip.content.minSpend} PLN</div>
                </div>
            )}

            <BookingModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                table={selectedTable}
                eventId={eventId}
                eventName={eventName}
            />
        </div>
    );
};

export default ClubMap;
