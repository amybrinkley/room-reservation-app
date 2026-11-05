import React, { useState } from 'react';
import { Calendar, Clock, Users, User, PlusCircle, AlertCircle, CheckCircle2, BarChart2, Search, X, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Set your Google Apps Script Web App URL here after deployment
const GOOGLE_SCRIPT_URL = "";

const ROOMS = [
  { id: '31', name: '31 (Pink)', color: 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200', headerBg: 'bg-pink-600 text-white', colBg: 'bg-pink-50/40', occupiedBg: 'bg-gradient-to-b from-pink-200/70 to-pink-100/50' },
  { id: '33', name: '33 (Blue-Webcam)', color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200', headerBg: 'bg-blue-600 text-white', colBg: 'bg-blue-50/40', occupiedBg: 'bg-gradient-to-b from-blue-200/70 to-blue-100/50' },
  { id: '34', name: '34 (Yellow)', color: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200', headerBg: 'bg-amber-500 text-white', colBg: 'bg-amber-50/40', occupiedBg: 'bg-gradient-to-b from-amber-200/70 to-amber-100/50' },
  { id: '59', name: '59 (Green)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200', headerBg: 'bg-emerald-600 text-white', colBg: 'bg-emerald-50/40', occupiedBg: 'bg-gradient-to-b from-emerald-200/70 to-emerald-100/50' }
];

// Time slots in 12-hour AM/PM format
const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
];

const INITIAL_RESERVATIONS = [
  { id: 'res_101', week: 'this_week', day: 'Wednesday', room: '31', slot: '8:30 AM', barcode: 'w2195408', student_name: 'Student 1', people: 3, time_in: '8:40 AM', time_out: '9:10 AM', status: 'Completed', notes: 'Group study' },
  { id: 'res_102', week: 'this_week', day: 'Wednesday', room: '31', slot: '9:30 AM', barcode: '2208365', student_name: 'Rebecca', people: 2, time_in: '9:30 AM', time_out: '10:30 AM', status: 'Completed', notes: '' },
  { id: 'res_103', week: 'this_week', day: 'Wednesday', room: '31', slot: '10:30 AM', barcode: '', student_name: 'Evelina', people: 1, time_in: '10:34 AM', time_out: '11:25 AM', status: 'Completed', notes: '' },
  { id: 'res_105', week: 'this_week', day: 'Wednesday', room: '31', slot: '1:30 PM', barcode: 'w2156737', student_name: 'Student 2', people: 1, time_in: '1:40 PM', time_out: '', status: 'Checked-In', notes: '' },
  { id: 'res_107', week: 'this_week', day: 'Wednesday', room: '33', slot: '9:00 AM', barcode: 'w2216701', student_name: 'Sarah', people: 1, time_in: '9:00 AM', time_out: '11:30 AM', status: 'Completed', notes: 'WebCam needed' },
  { id: 'res_110', week: 'this_week', day: 'Wednesday', room: '33', slot: '2:30 PM', barcode: 'w1889324', student_name: 'Ryan', people: 1, time_in: '2:30 PM', time_out: '', status: 'Checked-In', notes: '' },
  { id: 'res_111', week: 'this_week', day: 'Wednesday', room: '33', slot: '4:30 PM', barcode: '', student_name: 'Roman', people: 1, time_in: '', time_out: '', status: 'Scheduled', notes: '' },
  { id: 'res_112', week: 'this_week', day: 'Wednesday', room: '34', slot: '8:00 AM', barcode: '', student_name: 'Lilly', people: 1, time_in: '8:05 AM', time_out: '10:12 AM', status: 'Completed', notes: '' },
  { id: 'res_116', week: 'this_week', day: 'Wednesday', room: '59', slot: '8:00 AM', barcode: '2218883', student_name: 'Zoey', people: 1, time_in: '8:10 AM', time_out: '10:13 AM', status: 'Completed', notes: '' },
  { id: 'res_119', week: 'this_week', day: 'Wednesday', room: '59', slot: '3:30 PM', barcode: '', student_name: 'Sarah', people: 2, time_in: '', time_out: '', status: 'Scheduled', notes: '' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedWeek, setSelectedWeek] = useState('this_week');
  const [selectedDay, setSelectedDay] = useState('Wednesday');
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [turnAways, setTurnAways] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRes, setActiveRes] = useState(null);

  const [formData, setFormData] = useState({
    room: '31', slot: '8:00 AM', barcode: '', student_name: '', people: 1, notes: '', status: 'Scheduled'
  });

  const handleOpenModal = (room = '31', slot = '8:00 AM', existing = null) => {
    if (existing) {
      setActiveRes(existing);
      setFormData({ ...existing });
    } else {
      setActiveRes(null);
      setFormData({ room, slot, barcode: '', student_name: '', people: 1, notes: '', status: 'Scheduled' });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (activeRes) {
      setReservations(reservations.map(r => r.id === activeRes.id ? { ...r, ...formData } : r));
    } else {
      const newRes = { ...formData, id: 'res_' + Date.now(), week: selectedWeek, day: selectedDay, time_in: '', time_out: '' };
      setReservations([...reservations, newRes]);
    }
    setModalOpen(false);
  };

  const handleCheckIn = (res) => {
    const timeIn = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'Checked-In', time_in: timeIn } : r));
    setModalOpen(false);
  };

  const handleCheckOut = (res) => {
    const timeOut = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'Completed', time_out: timeOut } : r));
    setModalOpen(false);
  };

  const filteredReservations = reservations.filter(r => 
    r.week === selectedWeek && r.day === selectedDay &&
    (searchQuery === '' || r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper to check if a slot falls within a 2-hour window (4 half-hour slots) starting from a booking
  const getOccupancyInfo = (roomId, slot) => {
    const slotIndex = TIME_SLOTS.indexOf(slot);
    if (slotIndex === -1) return null;

    // Search back up to 3 slots (1.5 hours prior) to see if a booking started in that 2-hour block
    for (let offset = 0; offset < 4; offset++) {
      const checkIdx = slotIndex - offset;
      if (checkIdx >= 0) {
        const checkSlot = TIME_SLOTS[checkIdx];
        const res = filteredReservations.find(r => r.room === roomId && r.slot === checkSlot);
        if (res) {
          return { reservation: res, isStart: offset === 0, offset };
        }
      }
    }
    return null;
  };

  const usageByRoomData = ROOMS.map(rm => ({
    name: `Room ${rm.id}`,
    bookings: reservations.filter(r => r.room === rm.id).length
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
                placeholder="Search W# or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-800 text-sm text-white rounded-lg border border-slate-700 focus:outline-none focus:border-blue-400"
              />
            </div>
            <button onClick={() => setTurnAways(prev => prev + 1)} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition">
              <AlertCircle className="w-4 h-4" /> Log Turn-Away ({turnAways})
            </button>
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
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-800 text-white text-xs uppercase tracking-wider w-28 text-center border-b border-slate-700">Time</th>
                  {ROOMS.map(room => (
                    <th key={room.id} className={`p-3 text-xs uppercase tracking-wider text-center font-bold border-b border-slate-200 ${room.headerBg}`}>
                      {room.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {TIME_SLOTS.map(slot => (
                  <tr key={slot} className="hover:bg-slate-100/80">
                    <td className="p-3 font-semibold text-slate-500 text-center bg-slate-50 border-r border-slate-200 whitespace-nowrap">{slot}</td>
                    {ROOMS.map(room => {
                      const occInfo = getOccupancyInfo(room.id, slot);
                      const res = occInfo?.isStart ? occInfo.reservation : null;
                      const isOccupiedBlock = occInfo && !occInfo.isStart;

                      return (
                        <td key={room.id} className={`p-2 border-r border-slate-200 text-center transition-colors ${
                          isOccupiedBlock ? room.occupiedBg : room.colBg
                        }`}>
                          {res ? (
                            <button onClick={() => handleOpenModal(room.id, slot, res)} className={`w-full p-2 rounded-lg text-xs font-semibold border text-left transition shadow-sm ${
                              res.status === 'Checked-In' ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200' :
                              res.status === 'Scheduled' ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200' :
                              'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}>
                              <div className="font-bold flex justify-between">{res.student_name} <span>[{res.status}]</span></div>
                              <div className="text-[10px] text-slate-500">{res.people} Person(s) {res.barcode && `• ${res.barcode}`} (2 hrs)</div>
                            </button>
                          ) : isOccupiedBlock ? (
                            <button onClick={() => handleOpenModal(room.id, slot)} className="w-full py-2 border border-dashed border-slate-300/80 bg-white/40 hover:bg-white/80 rounded-lg text-slate-500 hover:text-blue-600 text-xs transition flex items-center justify-center gap-1 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> Reserved (In Use)
                            </button>
                          ) : (
                            <button onClick={() => handleOpenModal(room.id, slot)} className="w-full py-2 border border-dashed border-slate-300 bg-white/70 hover:bg-white rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-600 text-xs transition">
                              + Book
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
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
                  <label className="block font-semibold mb-1">Student Name</label>
                  <input type="text" value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Student name" />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Barcode / W#</label>
                  <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="w1234567" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Room</label>
                    <select value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full p-2 border rounded-lg">
                      {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Time Slot</label>
                    <select value={formData.slot} onChange={(e) => setFormData({ ...formData, slot: e.target.value })} className="w-full p-2 border rounded-lg">
                      {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Notes</label>
                  <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Group study, laptop, etc." />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                {activeRes && activeRes.status === 'Scheduled' && (
                  <button onClick={() => handleCheckIn(activeRes)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold">Check In</button>
                )}
                {activeRes && activeRes.status === 'Checked-In' && (
                  <button onClick={() => handleCheckOut(activeRes)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg font-semibold">Check Out</button>
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
