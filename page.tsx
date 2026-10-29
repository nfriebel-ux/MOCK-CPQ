"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  Factory, 
  FileText, 
  ShoppingCart, 
  ChevronRight, 
  Package, 
  ShieldCheck,
  AlertCircle,
  Cpu,
  Armchair,
  PlusCircle,
  ArrowRight,
  Layers,
  Tag,
  Building,
  Database,
  Calendar,
  Wrench,
  Server,
  Activity,
  Clock,
  Briefcase
} from 'lucide-react';

const seatOptions = [
  { id: 'standard', name: 'Standard', price: 0 },
  { id: 'schwerlast', name: 'Schwerlast (bis 160kg)', price: 800 },
  { id: 'premium_leder', name: 'Premium-Leder', price: 400 },
  { id: 'drehsitz_auto', name: 'Drehsitz-Automatisch', price: 600 }
];

const App = () => {
  // --- State Management ---
  const [bundle, setBundle] = useState('individual');
  const [formShape, setFormShape] = useState('gerade');
  const [floors, setFloors] = useState(1);
  const [seatType, setSeatType] = useState('standard');
  const [extras, setExtras] = useState({
    foldingRail: false,
    emergencyCall: false,
    remoteControl: false
  });
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [integrationIds, setIntegrationIds] = useState(null);

  // Reset order status if configuration changes
  useEffect(() => {
    setOrderPlaced(false);
    setIntegrationIds(null);
  }, [bundle, formShape, floors, seatType, extras]);

  // --- Handlers ---
  const applyBundle = (selectedBundle) => {
    setBundle(selectedBundle);
    if (selectedBundle === 'basic') {
      setFormShape('gerade');
      setFloors(1);
      setSeatType('standard');
      setExtras({ foldingRail: false, emergencyCall: false, remoteControl: false });
    } else if (selectedBundle === 'premium') {
      setFormShape('kurve');
      setFloors(2);
      setSeatType('premium_leder');
      setExtras({ foldingRail: true, emergencyCall: true, remoteControl: true });
    }
  };

  const handleManualChange = (setter, value) => {
    setBundle('individual');
    setter(value);
  };

  const handleExtraToggle = (key) => {
    setBundle('individual');
    setExtras(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Pricing Logic ---
  const calculatePricing = () => {
    let basePrice = 2500; // Grundpreis Basis-Einheit
    
    // Etagen (1 Etage = ca. 3-5m, wir nehmen pauschal 1500€ pro Etage)
    basePrice += (floors - 1) * 1500; 
    
    // Schienenform
    if (formShape === 'kurve') basePrice += 2000;
    
    // Sitz
    const selectedSeat = seatOptions.find(s => s.id === seatType);
    if (selectedSeat) basePrice += selectedSeat.price;
    
    // Extras
    if (extras.foldingRail) basePrice += 450;
    if (extras.emergencyCall) basePrice += 250;
    if (extras.remoteControl) basePrice += 150;

    let discountPercent = 0;
    if (bundle === 'basic') discountPercent = 0.05;
    if (bundle === 'premium') discountPercent = 0.15;

    const discountAmount = basePrice * discountPercent;
    const finalPrice = basePrice - discountAmount;

    return { 
      subtotal: basePrice, 
      discountPercent, 
      discountAmount, 
      finalPrice 
    };
  };

  const prices = calculatePricing();

  // --- Dynamics 365 Logic ---
  const generateBOM = () => {
    const bom = [];

    // Track
    bom.push({
      id: `TRK-${formShape === 'kurve' ? 'CRV' : 'STR'}-F${floors}`,
      name: formShape === 'kurve' ? 'Kurvenschienen-System (Maßanfertigung)' : 'Gerades Schienenprofil (Standard)',
      qty: floors * 2, // e.g., 2 rail segments per floor
      type: 'mechanic'
    });

    // Motor/Drive based on Seat/Floors
    bom.push({
      id: `DRV-${seatType === 'schwerlast' ? 'HD' : 'STD'}-01`,
      name: seatType === 'schwerlast' ? 'Schwerlast-Antrieb 500W' : 'Standard-Antrieb 300W',
      qty: 1,
      type: 'electronic'
    });

    // Seat
    const seatObj = seatOptions.find(s => s.id === seatType);
    bom.push({
      id: `SEAT-${seatType.toUpperCase()}`,
      name: `Sitzmodul: ${seatObj ? seatObj.name : 'Standard'}`,
      qty: 1,
      type: 'mechanic'
    });

    // Extras
    if (extras.foldingRail) {
      bom.push({ id: 'EXT-FOLD-01', name: 'Automatisches Klappscharnier', qty: 1, type: 'mechanic' });
    }
    if (extras.emergencyCall) {
      bom.push({ id: 'EXT-GSM-01', name: 'GSM-Notrufmodul', qty: 1, type: 'electronic' });
    }
    if (extras.remoteControl) {
      bom.push({ id: 'EXT-RC-02', name: 'Funkfernbedienung', qty: 2, type: 'electronic' });
    }

    return bom;
  };

  const calculateServiceDuration = () => {
    // Basis-Montage: 2h
    // Pro Etage: +1.5h
    // Kurve macht es komplizierter: +3h pauschal
    let hours = 2 + (floors * 1.5);
    if (formShape === 'kurve') hours += 3;
    if (extras.foldingRail) hours += 0.5;
    return hours;
  };

  const handleOrder = () => {
    setIsAnimating(true);
    // Simulate API calls to D365
    setTimeout(() => {
      setIntegrationIds({
        soId: `SO-10${Math.floor(1000 + Math.random() * 9000)}`,
        poId: `PROD-${Math.floor(100000 + Math.random() * 900000)}`,
        woId: `WO-FS${Math.floor(10000 + Math.random() * 90000)}`
      });
      setOrderPlaced(true);
      setIsAnimating(false);
    }, 1200); 
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      
      {/* --- Top Navigation / Brand --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 text-blue-700">
          <Activity size={26} className="text-blue-600" />
          <h1 className="text-xl font-bold tracking-tight">LiftTech <span className="font-light text-slate-500">CPQ zu D365</span></h1>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Database size={14} className="text-blue-500" />
            <span className="font-medium">Business Central</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Wrench size={14} className="text-teal-500" />
            <span className="font-medium">Field Service</span>
          </div>
        </div>
      </header>

      {/* --- Visual Workflow Flowchart --- */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between text-sm overflow-x-auto">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${!orderPlaced ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500'}`}>
            <Settings size={18} />
            <span>KUNDE / CPQ</span>
          </div>
          <ArrowRight className="text-slate-300 mx-2 flex-shrink-0" />
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${!orderPlaced ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500'}`}>
            <ShoppingCart size={18} />
            <span>ANGEBOT & PREIS</span>
          </div>
          <ArrowRight className="text-slate-300 mx-2 flex-shrink-0" />
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${orderPlaced ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' : 'text-slate-400'}`}>
            <Database size={18} />
            <span>D365 BUSINESS CENTRAL</span>
          </div>
          <ArrowRight className="text-slate-300 mx-2 flex-shrink-0" />
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${orderPlaced ? 'bg-teal-50 text-teal-700 font-medium border border-teal-200' : 'text-slate-400'}`}>
            <Calendar size={18} />
            <span>D365 FIELD SERVICE</span>
          </div>
        </div>
      </div>

      {/* --- Main Dashboard Grid --- */}
      <main className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONFIGURATOR */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-slate-500" />
                Lift-Konfigurator
              </h2>
            </div>
            
            <div className="p-6 space-y-8">

              {/* Vorkonfigurierte Systeme / Bundles */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-sm font-bold text-slate-800 flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-blue-600" /> Pakete & Bundles
                </label>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => applyBundle('individual')}
                    className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all flex justify-between items-center ${bundle === 'individual' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>Individuelle Konfiguration</span>
                  </button>
                  <button 
                    onClick={() => applyBundle('basic')}
                    className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all flex justify-between items-center ${bundle === 'basic' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>Basic Line (Gerade, 1 Etage)</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">-5%</span>
                  </button>
                  <button 
                    onClick={() => applyBundle('premium')}
                    className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all flex justify-between items-center ${bundle === 'premium' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>Premium Line (Kurve, 2 Etagen, Vollausstattung)</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">-15%</span>
                  </button>
                </div>
              </div>
              
              {/* Treppenform */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <ChevronRight className="w-4 h-4 mr-1 text-blue-500" /> Schienensystem
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleManualChange(setFormShape, 'gerade')}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formShape === 'gerade' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Gerade Treppe
                  </button>
                  <button 
                    onClick={() => handleManualChange(setFormShape, 'kurve')}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formShape === 'kurve' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Kurventreppe
                  </button>
                </div>
              </div>

              {/* Etagen */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center"><Building className="w-4 h-4 mr-2 text-blue-500" /> Etagen / Stockwerke</span>
                  <span className="text-blue-600 font-bold">{floors} Etage{floors > 1 ? 'n' : ''}</span>
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => handleManualChange(setFloors, num)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${floors === num ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sitze */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Armchair className="w-4 h-4 mr-2 text-blue-500" /> Sitzmodul
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {seatOptions.map(option => (
                    <label 
                      key={option.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${seatType === option.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="seat"
                          checked={seatType === option.id}
                          onChange={() => handleManualChange(setSeatType, option.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className={`ml-3 text-sm font-medium ${seatType === option.id ? 'text-blue-800' : 'text-slate-700'}`}>
                          {option.name}
                        </span>
                      </div>
                      {option.price > 0 && (
                        <span className="text-xs text-slate-500 font-medium">+{option.price} €</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Extras */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <PlusCircle className="w-4 h-4 mr-2 text-blue-500" /> Zusatzoptionen
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'foldingRail', label: 'Autom. Klappschiene', price: 450 },
                    { id: 'emergencyCall', label: 'GSM-Notrufmodul', price: 250 },
                    { id: 'remoteControl', label: 'Funkfernbedienung (Set)', price: 150 }
                  ].map(extra => (
                    <label key={extra.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={extras[extra.id]}
                          onChange={() => handleExtraToggle(extra.id)}
                          className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" 
                        />
                        <span className="ml-3 text-sm text-slate-700 font-medium">{extra.label}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">+{extra.price} €</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRICING OR ORDER FULFILLMENT */}
        <div className="lg:col-span-7">
          
          {!orderPlaced ? (
            /* --- PRE-ORDER: PRICING & QUOTE --- */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="bg-slate-800 px-6 py-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-blue-400" />
                  Kalkulation & Angebot
                </h2>
                <div className="bg-blue-500/20 text-blue-300 px-3 py-1 text-xs font-semibold rounded-full border border-blue-500/30">
                  Entwurf
                </div>
              </div>

              <div className="p-8">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8 shadow-inner">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-base font-medium">Zwischensumme:</span>
                      <span className="text-base font-semibold">{prices.subtotal.toLocaleString('de-DE')} €</span>
                    </div>
                    
                    {prices.discountPercent > 0 && (
                      <div className="flex justify-between items-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="text-sm font-bold flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Paket-Rabatt ({(prices.discountPercent * 100).toFixed(0)}%):
                        </span>
                        <span className="text-sm font-bold">- {prices.discountAmount.toLocaleString('de-DE')} €</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-4 mt-2 flex justify-between items-end">
                      <div>
                        <p className="text-sm text-slate-500 font-bold mb-1">Angebotspreis (Netto)</p>
                      </div>
                      <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
                        {prices.finalPrice.toLocaleString('de-DE')} €
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleOrder}
                  disabled={isAnimating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center group relative overflow-hidden text-lg"
                >
                  {isAnimating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Übertrage an Dynamics 365...
                    </span>
                  ) : (
                    <>
                      Auftrag freigeben & in ERP überspielen
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4 flex justify-center items-center">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Dieser Vorgang generiert ERP- und Service-Datensätze.
                </p>
              </div>
            </div>

          ) : (
            /* --- POST-ORDER: MICROSOFT DYNAMICS INTEGRATION --- */
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-900 font-bold">Auftrag erfolgreich verarbeitet</h3>
                  <p className="text-green-700 text-sm mt-1">Die Konfiguration wurde validiert und synchron an die Backend-Systeme übergeben.</p>
                </div>
              </div>

              {/* Dynamics 365 Business Central Card */}
              <div className="bg-white rounded-xl shadow-md border-t-4 border-t-blue-600 border-x border-b border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-600 p-1.5 rounded mr-3">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 leading-tight">Dynamics 365 Business Central</h3>
                      <p className="text-xs text-blue-600 font-medium">ERP & Fertigung</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">SYNCED</span>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Verkaufsauftrag (SO)</p>
                      <p className="text-lg font-bold text-slate-800">{integrationIds?.soId}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Produktionsauftrag</p>
                      <p className="text-lg font-bold text-slate-800 flex items-center">
                        <Factory className="w-4 h-4 mr-2 text-blue-500" />
                        {integrationIds?.poId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                      <Server className="w-4 h-4 mr-2 text-slate-400" /> Generierte Fertigungsstückliste (BOM)
                    </h4>
                    <div className="space-y-2">
                      {generateBOM().map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded hover:border-blue-300 transition-colors">
                          <div className="flex items-center">
                            {item.type === 'mechanic' ? <Settings className="w-4 h-4 text-slate-400 mr-3" /> : <Cpu className="w-4 h-4 text-blue-400 mr-3" />}
                            <div>
                              <p className="text-sm font-semibold text-slate-800 leading-tight">{item.name}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{item.id}</p>
                            </div>
                          </div>
                          <div className="text-sm font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {item.qty}x
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamics 365 Field Service Card */}
              <div className="bg-white rounded-xl shadow-md border-t-4 border-t-teal-600 border-x border-b border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-teal-600 p-1.5 rounded mr-3">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-teal-900 leading-tight">Dynamics 365 Field Service</h3>
                      <p className="text-xs text-teal-700 font-medium">Ressourcen & Disposition</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-1 rounded">DISPATCHED</span>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Work Order ID</p>
                      <p className="text-xl font-bold text-slate-800">{integrationIds?.woId}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Incident Type</p>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-teal-500 mr-2" />
                        <span className="font-semibold text-slate-800">Neu-Montage & Inbetriebnahme</span>
                      </div>
                    </div>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> Kalkulierte Dauer
                      </h4>
                      <p className="text-lg font-bold text-teal-700">
                        {calculateServiceDuration()} Stunden
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Basiert auf {floors} Etagen & {formShape === 'kurve' ? 'Kurvensystem' : 'Geradem System'}.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider flex items-center">
                        <Activity className="w-4 h-4 mr-1" /> Benötigte Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded border border-teal-200">
                          Treppenlift-Mechaniker
                        </span>
                        <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200">
                          Elektrofachkraft (Zert.)
                        </span>
                        {formShape === 'kurve' && (
                          <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded border border-purple-200">
                            Spezialist Kurvenbahn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
