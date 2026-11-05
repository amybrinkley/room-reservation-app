import React, { useState } from 'react';
import { Calendar, Clock, Users, User, PlusCircle, AlertCircle, CheckCircle2, BarChart2, Search, X, MapPin, Plus, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const GOOGLE_SCRIPT_URL = "";

const ROOMS = [
  { id: '31', name: 'Pink Room (31)', color: 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200', headerBg: 'bg-pink-600 text-white', colBg: 'bg-pink-50/40', gradientBg: 'bg-gradient-to-r from-pink-200/90 to-pink-100/70 border-pink-300 text-pink-950' },
  { id: '33', name: 'Blue Room (33)', color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200', headerBg: 'bg-blue-600 text-white', colBg: 'bg-blue-50/40', gradientBg: 'bg-gradient-to-r from-blue-200/90 to-blue-100/70 border-blue-300 text-blue-950' },
  { id: '34', name: 'Yellow Room (34)', color: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200', headerBg: 'bg-amber-500 text-white', colBg: 'bg-amber-50/40', gradientBg: 'bg-gradient-to-r from-amber-200/90 to-amber-100/70 border-amber-300 text-amber-950' },
  { id: '59', name: 'Green Room (59)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200', headerBg: 'bg-emerald-600 text-white', colBg: 'bg-emerald-50/40', gradientBg: 'bg-gradient-to-r from-emerald-200/90 to-emerald-100/70 border-emerald-300 text-emerald-950' }
];

const generate10MinTimes = () => {
  const times = [];
  const startHour = 8;
  const endHour = 20;

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === endHour && m > 0) break;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const displayMin = m === 0 ? '00' : m;
      times.push(`${displayHour}:${displayMin} ${period}`);
    }
  }
  return times;
};

const DETAILED_TIMES = generate10MinTimes();

const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
];

const INITIAL_RESERVATIONS = [
  { id: 'res_101', week: 'this_week', day: 'Wednesday', room: '31', slot: '8:30 AM', time_in: '8:30 AM', time_out: '10:30 AM', barcode: 'w2195408', student_name: 'Student 1', people: 3, any_room: false, status: 'Checked Out', notes: 'Group study' },
  { id: 'res_102', week: 'this_week', day: 'Wednesday', room: '31', slot: '9:30 AM', time_in: '9:30 AM', time_out: '11:30 AM', barcode: '2208365', student_name: 'Rebecca', people: 2, any_room: true, status: 'Checked Out', notes: '' },
  { id: 'res_105', week: 'this_week', day: 'Wednesday', room: '31', slot: '1:30 PM', time_in: '1:30 PM', time_out: '', barcode: 'w2156737', student_name: 'Student 2', people: 1, any_room: false, status: 'Checked-In', notes: '' },
  { id: 'res_107', week: 'this_week', day: 'Wednesday', room: '33', slot: '9:00 AM', time_in: '9:00 AM', time_out: '11:00 AM', barcode: 'w2216701', student_name: 'Sarah', people: 1, any_room: true, status: 'Checked Out', notes: 'WebCam needed' },
  { id: 'res_110', week: 'this_week', day: 'Wednesday', room: '33', slot: '2:30 PM', time_in: '2:30 PM', time_out: '', barcode: 'w1889324', student_name: 'Ryan', people: 1, any_room: false, status: 'Checked-In', notes: '' },
  { id: 'res_111', week: 'this_week', day: 'Wednesday', room: '33', slot: '4:30 PM', time_in: '4:30 PM', time_out: '6:30 PM', barcode: '', student_name: 'Roman', people: 1, any_room: false, status: 'Reserved', notes: '' },
  { id: 'res_112', week: 'this_week', day: 'Wednesday', room: '34', slot: '8:00 AM', time_in: '8:00 AM', time_out: '10:00 AM', barcode: '', student_name: 'Lilly', people: 1, any_room: false, status: 'Checked Out', notes: '' },
  { id: 'res_116', week: 'this_week', day: 'Wednesday', room: '59', slot: '8:00 AM', time_in: '8:00 AM', time_out: '10:00 AM', barcode: '2218883', student_name: 'Zoey', people: 1, any_room: false, status: 'Checked Out', notes: '' },
  { id: 'res_119', week: 'this_week', day: 'Wednesday', room: '59', slot: '3:30 PM', time_in: '3:30 PM', time_out: '5:30 PM', barcode: '', student_name: 'Sarah', people: 2, any_room: true, status: 'Reserved', notes: '' }
];

const INITIAL_TURNAWAYS = [
  { id: 'ta_1', week: 'this_week', day: 'Wednesday', slot: '10:00 AM' },
  { id: 'ta_2', week: 'this_week', day: 'Wednesday', slot: '10:00 AM' },
  { id: 'ta_3', week: 'this_week', day: 'Wednesday', slot: '1:30 PM' },
  { id: 'ta_4', week: 'this_week', day: 'Wednesday', slot: '2:30 PM' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedWeek, setSelectedWeek] = useState('this_week');
  const [selectedDay, setSelectedDay] = useState('Wednesday');
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [turnAways, setTurnAways] = useState(INITIAL_TURNAWAYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRes, setActiveRes] = useState(null);

  const [formData, setFormData] = useState({
    room: '31', time_in: '8:00 AM', time_out: '', barcode: '', student_name: '', people: 1, any_room: false, notes: '', status: 'Reserved'
  });

  const handleIncrementTurnAway = (slot) => {
    const newEntry = {
      id: 'ta_' + Date.now(),
      week: selectedWeek,
      day: selectedDay,
      slot: slot,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    };
    setTurnAways(prev => [...prev, newEntry]);
  };

  const handleDecrementTurnAway = (slot) => {
    setTurnAways(prev => {
      const indexToRemove = prev.findLastIndex(t => t.week === selectedWeek && t.day === selectedDay && t.slot === slot);
      if (indexToRemove === -1) return prev;
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleOpenModal = (room = '31', initialSlot = '8:00 AM', existing = null) => {
    if (existing) {
      setActiveRes(existing);
      setFormData({ any_room: false, ...existing });
    } else {
      const startIdx = DETAILED_TIMES.indexOf(initialSlot) !== -1 ? DETAILED_TIMES.indexOf(initialSlot) : 0;
      
      setActiveRes(null);
      setFormData({ 
        room, 
        time_in: DETAILED_TIMES[startIdx] || '8:00 AM', 
        time_out: '', 
        barcode: '', 
        student_name: '', 
        people: 1, 
        any_room: false,
        notes: '', 
        status: 'Reserved' 
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (activeRes) {
      setReservations(reservations.map(r => r.id === activeRes.id ? { ...r, ...formData, people: Number(formData.people), slot: formData.slot || formData.time_in } : r));
    } else {
      const newRes = { 
        ...formData, 
        people: Number(formData.people),
        id: 'res_' + Date.now(), 
        week: selectedWeek, 
        day: selectedDay, 
        slot: formData.time_in 
      };
      setReservations([...reservations, newRes]);
    }
    setModalOpen(false);
  };

  const handleCheckIn = (res) => {
    setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'Checked-In', time_out: '' } : r));
    setModalOpen(false);
  };

  const handleCheckOut = (res) => {
    const timeOut = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'Checked Out', time_out: timeOut } : r));
    setModalOpen(false);
  };

  const filteredReservations = reservations.filter(r => 
    r.week === selectedWeek && r.day === selectedDay &&
    (searchQuery === '' || r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeTurnAways = turnAways.filter(t => t.week === selectedWeek && t.day === selectedDay);

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.trim().split(' ');
    if (parts.length < 2) return null;
    const [time, period] = parts;
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Determines rowSpan and whether a slot should render a cell or be skipped
  const getOccupancyInfo = (roomId, slot) => {
    const currentSlotMinutes = parseTimeToMinutes(slot);
    if (currentSlotMinutes === null) return null;

    const roomReservations = filteredReservations.filter(r => r.room === roomId);

    for (let res of roomReservations) {
      const startMinutes = parseTimeToMinutes(res.slot || res.time_in);
      if (startMinutes === null) continue;

      const endMinutes = res.time_out ? parseTimeToMinutes(res.time_out) : null;
      const effectiveEndMinutes = endMinutes !== null ? endMinutes : startMinutes + 120; // Default 2 hours (120 mins) if blank

      // Calculate span length in 30-min rows
      const totalSpanRows = Math.max(1, Math.round((effectiveEndMinutes - startMinutes) / 30));

      if (currentSlotMinutes === startMinutes) {
        return { reservation: res, displayType: 'full_reservation', rowSpan: totalSpanRows };
      }

      // If current row is inside an ongoing booking, mark as overlapped so <td> can be skipped
      if (currentSlotMinutes > startMinutes && currentSlotMinutes < effectiveEndMinutes) {
        return { displayType: 'overlapped' };
      }
    }

    return null;
  };

  const usageByRoomData = ROOMS.map(rm => ({
    name: rm.name,
    bookings: reservations.filter(r => r.room === rm.id).length
  }));

  const turnAwaysBySlotData = TIME_SLOTS.map(s => ({
    time: s,
    turnAways: activeTurnAways.filter(t => t.slot === s).length
  }));

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">Library Room Reservations</h1>
              <p className="text-xs text-slate-400">Front Desk Tracking & Analytics System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID# or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-800 text-sm text-white rounded-lg border border-slate-700 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200">
              <AlertCircle className="w-4 h-4 text-slate-400" /> Total Turn-Aways Today: <span className="text-sm font-bold text-white">{activeTurnAways.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('schedule')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}>
              <Calendar className="w-4 h-4" /> Schedule Matrix
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}>
              <BarChart2 className="w-4 h-4" /> Usage Analytics
            </button>
          </div>

          {activeTab === 'schedule' && (
            <div className="flex items-center gap-3">
              <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold">
                <button onClick={() => setSelectedWeek('this_week')} className={`px-3 py-1.5 rounded-md ${selectedWeek === 'this_week' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}>This Week</button>
                <button onClick={() => setSelectedWeek('next_week')} className={`px-3 py-1.5 rounded-md ${selectedWeek === 'next_week' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}>Next Week</button>
              </div>
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="bg-white border border-slate-300 text-sm font-semibold px-3 py-1.5 rounded-lg text-slate-700">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
        </div>

        {activeTab === 'schedule' ? (
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[950px]">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-800 text-white text-xs uppercase tracking-wider w-[9%] text-center border-b border-slate-700 border-r border-slate-700">
                    Time
                  </th>
                  
                  {ROOMS.map(room => (
                    <th key={room.id} className={`p-3 text-xs uppercase tracking-wider text-center font-bold border-b border-slate-200 w-[17.5%] ${room.headerBg}`}>
                      {room.name}
                    </th>
                  ))}

                  <th className="p-3 bg-slate-800 text-white text-xs uppercase tracking-wider w-[9%] text-center border-b border-slate-700 border-r border-slate-700">
                    Time
                  </th>

                  <th className="p-3 bg-slate-800 text-white text-xs uppercase tracking-wider w-[12%] text-center border-b border-slate-700">
                    Turn-Away
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {TIME_SLOTS.map(slot => {
                  const slotTurnAwayCount = activeTurnAways.filter(t => t.slot === slot).length;

                  return (
                    <tr key={slot} className="h-16 hover:bg-slate-100/80">
                      <td className="p-3 font-semibold text-slate-700 text-center bg-slate-50 border-r border-slate-200 whitespace-nowrap text-xs h-16 align-middle">
                        {slot}
                      </td>

                      {ROOMS.map(room => {
                        const occInfo = getOccupancyInfo(room.id, slot);
                        const res = occInfo?.reservation;
                        const isFullBlock = occInfo?.displayType === 'full_reservation';
                        const isOverlapped = occInfo?.displayType === 'overlapped';

                        // Do not render <td> for rows covered by rowSpan
                        if (isOverlapped) return null;

                        const cardBgClass = res?.any_room 
                          ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50' 
                          : room.gradientBg;

                        return (
                          <td 
                            key={room.id} 
                            rowSpan={occInfo?.rowSpan || 1}
                            className={`p-2 border-r border-slate-200 text-center transition-colors align-middle ${room.colBg}`}
                          >
                            {isFullBlock ? (
                              <button 
                                onClick={() => handleOpenModal(room.id, slot, res)} 
                                className={`w-full h-full p-2 rounded-lg text-xs font-semibold border text-left transition shadow-sm flex flex-col justify-center ${cardBgClass}`}
                              >
                                <div className="font-bold flex justify-between items-center">
                                  <span>{res.student_name}</span> 
                                  <span className="text-[10px] opacity-80">[{res.status}]</span>
                                </div>
                                <div className="text-[10px] opacity-80 mt-0.5">
                                  🕒 {res.time_in} – {res.time_out || 'In Session'}
                                </div>
                                <div className="text-[10px] opacity-75 mt-0.5">
                                  {res.people} Person(s) {res.barcode && `• ${res.barcode}`}
                                </div>
                              </button>
                            ) : (
                              <button onClick={() => handleOpenModal(room.id, slot)} className="w-full h-full py-2 border border-dashed border-slate-300 bg-white/70 hover:bg-white rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-600 text-xs transition flex items-center justify-center">
                                + Book
                              </button>
                            )}
                          </td>
                        );
                      })}

                      <td className="p-3 font-semibold text-slate-700 text-center bg-slate-50 border-r border-slate-200 whitespace-nowrap text-xs h-16 align-middle">
                        {slot}
                      </td>

                      <td className="p-2 bg-slate-50 text-center h-16 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDecrementTurnAway(slot)}
                            disabled={slotTurnAwayCount === 0}
                            title="Remove 1 turn-away entry (correction)"
                            className={`p-1 rounded transition border ${
                              slotTurnAwayCount > 0 
                                ? 'bg-white hover:bg-slate-200 text-slate-800 border-slate-400 shadow-sm cursor-pointer' 
                                : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className={`min-w-[20px] text-xs font-bold ${slotTurnAwayCount > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                            {slotTurnAwayCount}
                          </span>

                          <button
                            onClick={() => handleIncrementTurnAway(slot)}
                            title="Add 1 turn-away entry"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-900 text-white border border-slate-900 shadow-sm transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Total Bookings by Room</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageByRoomData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Turn-Aways by Time Slot ({selectedDay})</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={turnAwaysBySlotData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" interval={3} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="turnAways" fill="#475569" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold">{activeRes ? 'Edit Reservation' : 'New Reservation'}</h3>
                <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-semibold mb-1">Name</label>
                  <input type="text" value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Student name" />
                </div>

                <div>
                  <label className="block font-semibold mb-1">ID Number</label>
                  <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="e.g. w1234567" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Room</label>
                    <select value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full p-2 border rounded-lg">
                      {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Number of People</label>
                    <select 
                      value={formData.people} 
                      onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })} 
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="any_room" 
                    checked={formData.any_room || false} 
                    onChange={(e) => setFormData({ ...formData, any_room: e.target.checked })} 
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="any_room" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    Any Room
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Check In Time</label>
                    <select 
                      value={formData.time_in} 
                      onChange={(e) => setFormData({ ...formData, time_in: e.target.value })} 
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {DETAILED_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Check Out Time</label>
                    <select 
                      value={formData.time_out} 
                      onChange={(e) => setFormData({ ...formData, time_out: e.target.value })} 
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""></option>
                      {DETAILED_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Notes</label>
                  <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Group study, laptop, etc." />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                {activeRes && activeRes.status === 'Reserved' && (
                  <button onClick={() => handleCheckIn(activeRes)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold">Check In Now</button>
                )}
                {activeRes && activeRes.status === 'Checked-In' && (
                  <button onClick={() => handleCheckOut(activeRes)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg font-semibold">Check Out Now</button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}