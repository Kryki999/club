import React, { useState } from 'react';
import './MenuSection.css';

function MenuSection() {
    const [activeTab, setActiveTab] = useState('piwa');

    const menuItems = {
        piwa: [
            { name: "Lech Premium", price: "12", description: "Lech Premium 400ml" },
            { name: "Pilsner Urquell", price: "15", description: "Pilsner Urquell 330ml" },
            { name: "Capitan Jack", price: "14", description: "Capitan Jack 400ml - różne smaki" },
            { name: "Hardmade", price: "14", description: "Hardmade 400ml - różne smaki" },
            { name: "Książęce Cherry Ale", price: "15", description: "Książęce Cherry Ale 500ml" },
            { name: "Książęce Złote Pszeniczne", price: "15", description: "Książęce Złote Pszeniczne 500ml" }
        ],
        alkohole: [
            { name: "Jameson", price: "16", description: "Jameson 40ml" },
            { name: "Chivas 12yo", price: "20", description: "Chivas 12yo 40ml" },
            { name: "Beefeater Gin", price: "16", description: "Beefeater Gin 40ml" },
            { name: "Havana Especial", price: "18", description: "Havana Especial 40ml" },
            { name: "Olmeca Gold", price: "20", description: "Olmeca Gold 40ml" }
        ],
        napoje: [
            { name: "Napoje Gazowane", price: "12", description: "7UP, PEPSI, PEPSI MAX, SHEEPES TONIC, MIRINDA 500ml" },
            { name: "Napoje Niegazowane", price: "12", description: "LIPTON ICE TEA RÓŻNE SMAKI 500ML" },
            { name: "Woda", price: "8", description: "WODA GAZOWANA / NIEGAZOWANA 500ML" },
            { name: "Soki", price: "8", description: "POMARAŃCZ, JABŁKO, CZARNA PORZECZKA 330 ML" }
        ],
        przekaski: [
            { name: "Lody", price: "10-20", description: "Różne rodzaje lodów" },
            { name: "Chipsy LAY'S", price: "20", description: "LAY'S RÓŻNE SMAKI" }
        ]
    };

    const tabs = [
        { id: 'piwa', label: 'Piwa' },
        { id: 'alkohole', label: 'Alkohole' },
        { id: 'napoje', label: 'Napoje' },
        { id: 'przekaski', label: 'Przekąski' }
    ];

    return (
        <section className="menu-section">
            <h2 className="menu-title">Czego się napijesz?</h2>
            <div className="menu-container">
                <div className="menu-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`menu-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="menu-content">
                    <div className="menu-items">
                        {menuItems[activeTab].map((item, index) => (
                            <div key={index} className="menu-item">
                                <div className="menu-item-header">
                                    <h3>{item.name}</h3>
                                    <span className="price">{item.price} PLN</span>
                                </div>
                                <p className="description">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MenuSection; 