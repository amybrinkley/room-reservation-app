import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, Users, User, PlusCircle, AlertCircle, CheckCircle2, 
  BarChart2, X, MapPin, Plus, Minus, Filter, RefreshCw, TrendingUp, 
  CheckCircle, LogOut, Bookmark, PieChart as PieIcon, Activity, Flame,
  ChevronLeft, ChevronRight, DoorOpen
} from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// Set your Google Apps Script Web App URL here after deployment
const GOOGLE_SCRIPT_URL = "";

const ROOMS = [
  { id: '31', name: 'Pink Room (31)', color: 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200', headerBg: 'bg-pink-600 text-white', colBg: 'bg-pink-50/40', gradientBg: 'bg-gradient-to-r from-pink-200/90 to-pink-100/70 border-pink-300 text-pink-950', themeColor: '#db2777' },
  { id: '33', name: 'Blue Room (33)', color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200', headerBg: 'bg-blue-600 text-white', colBg: 'bg-blue-50/40', gradientBg: 'bg-gradient-to-r from-blue-200/90 to-blue-100/70 border-blue-300 text-blue-950', themeColor: '#2563eb' },
  { id: '34', name: 'Yellow Room (34)', color: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200', headerBg: 'bg-amber-500 text-white', colBg: 'bg-amber-50/40', gradientBg: 'bg-gradient-to-r from-amber-200/90 to-amber-100/70 border-amber-300 text-amber-950', themeColor: '#d97706' },
  { id: '59', name: 'Green Room (59)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200', headerBg: 'bg-emerald-600 text-white', colBg: 'bg-emerald-50/40', gradientBg: 'bg-gradient-to-r from-emerald-200/90 to-emerald-100/70 border-emerald-300 text-emerald-950', themeColor: '#059669' }
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

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getCurrentDayName = () => {
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return DAYS_OF_WEEK.includes(dayName) ? dayName : "Monday";
};

const getFormattedDateString = (dayName, weekSelection) => {
  const today = new Date();
  const dayMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5 };
  
  const currentDayOfWeek = today.getDay();
  const daysToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  
  const targetMonday = new Date(today);
  targetMonday.setDate(today.getDate() + daysToMonday + (weekSelection === 'next_week' ? 7 : 0));
  
  const targetDate = new Date(targetMonday);
  targetDate.setDate(targetMonday.getDate() + (dayMap[dayName] - 1));
  
  return targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const INITIAL_RESERVATIONS = [
  { id: 'res_101', week: 'this_week', day: 'Wednesday', room: '31', slot: '8:30 AM', time_in: '8:30 AM', time_out: '10:30 AM', barcode: 'w2195408', student_name: 'Student 1', people: 3, any_room: false, status: 'Checked Out', notes: 'Group study' },
  { id: 'res_102', week: 'this_week', day: 'Wednesday', room: '31', slot: '9:30 AM', time_in: '9:30 AM', time_out: '11:30 AM', barcode: '2208365', student_name: 'Rebecca', people: 2, any_room: true, status: 'Checked Out', notes: '' },
  { id: 'res_105', week: 'this_week', day: 'Wednesday', room: '31', slot: '1:30 PM', time_in: '1:30 PM', time_out: '', barcode: 'w2156737', student_name: 'Student 2', people: 1, any_room: false, status: 'Checked-In', notes: '' },
  { id: 'res_107', week: 'this_week', day: 'Wednesday', room: '33', slot: '9:00 AM', time_in: '9:00 AM', time_out: '11:00 AM', barcode: 'w2216701', student_name: 'Sarah', people: 1, any_room: true, status: 'Checked Out', notes: 'WebCam needed' },
  { id: 'res_110', week: 'this_week', day: 'Wednesday', room: '33', slot: '2:30 PM', time_in: '2:30 PM', time_out: '', barcode: 'w1889324', student_name: 'Ryan', people: 1, any_room: false, status: 'Checked-In', notes: '' },
  { id: 'res_111', week: 'this_week', day: 'Wednesday', room: '33', slot: '4:30 PM', time_in: '4:30 PM', time_out: '6:30 PM', barcode: '', student_name: 'Roman', people: '', any_room: false, status: 'Reserved', notes: '' },
  { id: 'res_112', week: 'this_week', day: 'Wednesday', room: '34', slot: '8:00 AM', time_in: '8:00 AM', time_out: '10:00 AM', barcode: '', student_name: 'Lilly', people: 1, any_room: false, status: 'Checked Out', notes: '' },
  { id: 'res_116', week: 'this_week', day: 'Wednesday', room: '59', slot: '8:00 AM', time_in: '8:00 AM', time_out: '10:00 AM', barcode: '2218883', student_name: 'Zoey', people: 1, any_room: false, status: 'Checked Out', notes: '' },
  { id: 'res_119', week: 'this_week', day: 'Wednesday', room: '59', slot: '3:30 PM', time_in: '3:30 PM', time_out: '5:30 PM', barcode: '', student_name: 'Sarah', people: 2, any_room: true, status: 'Reserved', notes: '' },
  { id: 'res_201', week: 'this_week', day: 'Monday', room: '31', slot: '10:00 AM', time_in: '10:00 AM', time_out: '12:00 PM', barcode: 'w998123', student_name: 'Alex', people: 4, any_room: false, status: 'Checked Out', notes: 'Math project' },
  { id: 'res_202', week: 'this_week', day: 'Tuesday', room: '34', slot: '1:00 PM', time_in: '1:00 PM', time_out: '3:00 PM', barcode: 'w882190', student_name: 'Maria', people: 2, any_room: false, status: 'Checked Out', notes: '' },
  { id: 'res_203', week: 'this_week', day: 'Thursday', room: '59', slot: '11:00 AM', time_in: '11:00 AM', time_out: '1:00 PM', barcode: 'w119023', student_name: 'David', people: 5, any_room: false, status: 'Reserved', notes: 'Group discussion' },
  { id: 'res_204', week: 'this_week', day: 'Friday', room: '33', slot: '2:00 PM', time_in: '2:00 PM', time_out: '4:00 PM', barcode: 'w334910', student_name: 'Chloe', people: '', any_room: true, status: 'Reserved', notes: '' }
];

const INITIAL_TURNAWAYS = [
  { id: 'ta_1', week: 'this_week', day: 'Wednesday', slot: '10:00 AM' },
  { id: 'ta_2', week: 'this_week', day: 'Wednesday', slot: '10:00 AM' },
  { id: 'ta_3', week: 'this_week', day: 'Wednesday', slot: '1:30 PM' },
  { id: 'ta_4', week: 'this_week', day: 'Wednesday', slot: '2:30 PM' },
  { id: 'ta_5', week: 'this_week', day: 'Monday', slot: '11:00 AM' },
  { id: 'ta_6', week: 'this_week', day: 'Thursday', slot: '2:00 PM' }
];

const STATUS_COLORS = {
  'Reserved': '#3b82f6',
  'Checked-In': '#10b981',
  'Checked Out': '#64748b'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedWeek, setSelectedWeek] = useState('this_week');
  const [selectedDay, setSelectedDay] = useState(getCurrentDayName);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [turnAways, setTurnAways] = useState(INITIAL_TURNAWAYS);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRes, setActiveRes] = useState(null);

  // Analytics Dashboard Filter State
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('all');
  const [analyticsStartDate, setAnalyticsStartDate] = useState('');
  const [analyticsEndDate, setAnalyticsEndDate] = useState('');
  const [analyticsDay, setAnalyticsDay] = useState('all');
  const [analyticsRoom, setAnalyticsRoom] = useState('all');
  const [analyticsStatus, setAnalyticsStatus] = useState('all');

  const [formData, setFormData] = useState({
    room: '31', time_in: '8:00 AM', time_out: '', barcode: '', student_name: '', people: '', any_room: false, notes: '', status: 'Reserved'
  });

  const handleResetToToday = () => {
    setSelectedWeek('this_week');
    setSelectedDay(getCurrentDayName());
  };

  const handlePrevDay = () => {
    const currentIndex = DAYS_OF_WEEK.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(DAYS_OF_WEEK[currentIndex - 1]);
    } else if (selectedWeek === 'next_week') {
      setSelectedWeek('this_week');
      setSelectedDay(DAYS_OF_WEEK[DAYS_OF_WEEK.length - 1]);
    }
  };

  const handleNextDay = () => {
    const currentIndex = DAYS_OF_WEEK.indexOf(selectedDay);
    if (currentIndex < DAYS_OF_WEEK.length - 1) {
      setSelectedDay(DAYS_OF_WEEK[currentIndex + 1]);
    } else if (selectedWeek === 'this_week') {
      setSelectedWeek('next_week');
      setSelectedDay(DAYS_OF_WEEK[0]);
    }
  };

  const handleResetAnalyticsFilters = () => {
    setAnalyticsTimeframe('all');
    setAnalyticsStartDate('');
    setAnalyticsEndDate('');
    setAnalyticsDay('all');
    setAnalyticsRoom('all');
    setAnalyticsStatus('all');
  };

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
      setFormData({ any_room: false, ...existing, people: existing.people !== undefined && existing.people !== null ? existing.people : '' });
    } else {
      const startIdx = DETAILED_TIMES.indexOf(initialSlot) !== -1 ? DETAILED_TIMES.indexOf(initialSlot) : 0;
      
      setActiveRes(null);
      setFormData({ 
        room, 
        time_in: DETAILED_TIMES[startIdx] || '8:00 AM', 
        time_out: '', 
        barcode: '', 
        student_name: '', 
        people: '', 
        any_room: false,
        notes: '', 
        status: 'Reserved' 
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    const numPeople = formData.people === '' ? '' : Number(formData.people);
    if (activeRes) {
      setReservations(reservations.map(r => r.id === activeRes.id ? { ...r, ...formData, people: numPeople } : r));
    } else {
      const newRes = { 
        ...formData, 
        people: numPeople,
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
    const numPeople = formData.people === '' ? '' : Number(formData.people);
    setReservations(reservations.map(r => r.id === res.id ? { ...r, ...formData, people: numPeople, status: 'Checked-In', time_out: '' } : r));
    setModalOpen(false);
  };

  const handleCheckOut = (res) => {
    const timeOut = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setReservations(reservations.map(r => r.id === res.id ? { ...r, status: 'Checked Out', time_out: timeOut } : r));
    setModalOpen(false);
  };

  const handleCancelReservation = (res) => {
    setReservations(reservations.filter(r => r.id !== res.id));
    setModalOpen(false);
  };

  const filteredReservations = reservations.filter(r => 
    r.week === selectedWeek && r.day === selectedDay
  );

  const activeTurnAways = turnAways.filter(t => t.week === selectedWeek && t.day === selectedDay);

  const totalOccupancyToday = filteredReservations.reduce((sum, res) => sum + (Number(res.people) || 0), 0);

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

  const getOccupancyInfo = (roomId, slot) => {
    const currentSlotMinutes = parseTimeToMinutes(slot);
    if (currentSlotMinutes === null) return null;

    const roomReservations = filteredReservations.filter(r => r.room === roomId);

    for (let res of roomReservations) {
      const startMinutes = parseTimeToMinutes(res.time_in || res.slot);
      if (startMinutes === null) continue;

      const endMinutes = res.time_out ? parseTimeToMinutes(res.time_out) : null;
      const effectiveEndMinutes = endMinutes !== null ? endMinutes : startMinutes + 120;

      const startSlotRowMinutes = Math.floor(startMinutes / 30) * 30;
      let endSlotRowMinutes = Math.ceil(effectiveEndMinutes / 30) * 30;
      if (endSlotRowMinutes === startSlotRowMinutes) endSlotRowMinutes += 30;

      const totalSpanRows = Math.max(1, Math.ceil((effectiveEndMinutes - startSlotRowMinutes) / 30));

      if (currentSlotMinutes === startSlotRowMinutes) {
        const topOffsetPct = ((startMinutes - startSlotRowMinutes) / 30) * 100;
        const bottomOffsetPct = ((endSlotRowMinutes - effectiveEndMinutes) / 30) * 100;

        return { 
          reservation: res, 
          displayType: 'full_reservation', 
          rowSpan: totalSpanRows,
          topOffsetPct,
          bottomOffsetPct
        };
      }

      if (currentSlotMinutes > startSlotRowMinutes && currentSlotMinutes < endSlotRowMinutes) {
        return { displayType: 'overlapped' };
      }
    }

    return null;
  };

  // ---------------- ANALYTICS COMPUTATIONS ----------------
  const analyticsReservations = useMemo(() => {
    return reservations.filter(res => {
      if (analyticsTimeframe !== 'all') {
        if (analyticsTimeframe === 'this_week' && res.week !== 'this_week') return false;
        if (analyticsTimeframe === 'next_week' && res.week !== 'next_week') return false;
      }
      if (analyticsDay !== 'all' && res.day !== analyticsDay) return false;
      if (analyticsRoom !== 'all' && res.room !== analyticsRoom) return false;
      if (analyticsStatus !== 'all' && res.status !== analyticsStatus) return false;
      return true;
    });
  }, [reservations, analyticsTimeframe, analyticsDay, analyticsRoom, analyticsStatus]);

  const analyticsTurnAways = useMemo(() => {
    return turnAways.filter(ta => {
      if (analyticsTimeframe !== 'all') {
        if (analyticsTimeframe === 'this_week' && ta.week !== 'this_week') return false;
        if (analyticsTimeframe === 'next_week' && ta.week !== 'next_week') return false;
      }
      if (analyticsDay !== 'all' && ta.day !== analyticsDay) return false;
      return true;
    });
  }, [turnAways, analyticsTimeframe, analyticsDay]);

  const totalFilteredBookings = analyticsReservations.length;
  const totalFilteredPeople = analyticsReservations.reduce((acc, curr) => acc + (Number(curr.people) || 0), 0);
  const totalFilteredTurnAways = analyticsTurnAways.length;
  const avgGroupSize = totalFilteredBookings > 0 ? (totalFilteredPeople / totalFilteredBookings).toFixed(1) : 0;

  // Chart Data 1: Bookings by Room
  const usageByRoomData = useMemo(() => {
    return ROOMS.map(rm => {
      const count = analyticsReservations.filter(r => r.room === rm.id).length;
      return {
        name: rm.name,
        bookings: count,
        fill: rm.themeColor
      };
    });
  }, [analyticsReservations]);

  // Chart Data 2: Turn-aways by Time Slot
  const turnAwaysBySlotData = useMemo(() => {
    return TIME_SLOTS.map(s => ({
      time: s,
      turnAways: analyticsTurnAways.filter(t => t.slot === s).length
    }));
  }, [analyticsTurnAways]);

  // Chart Data 3: Bookings by Day of Week
  const bookingsByDayData = useMemo(() => {
    return DAYS_OF_WEEK.map(day => ({
      day: day.substring(0, 3),
      fullDay: day,
      bookings: analyticsReservations.filter(r => r.day === day).length,
      turnAways: analyticsTurnAways.filter(t => t.day === day).length
    }));
  }, [analyticsReservations, analyticsTurnAways]);

  // Heat Map Data 1: Booking Density (Days vs Time Slots + All Column)
  const occupancyHeatMap = useMemo(() => {
    let maxCount = 1;
    const grid = TIME_SLOTS.map(slot => {
      const row = { slot };
      const slotMins = parseTimeToMinutes(slot);
      let totalSlotBookings = 0;

      DAYS_OF_WEEK.forEach(day => {
        const count = analyticsReservations.filter(res => {
          if (res.day !== day) return false;
          const start = parseTimeToMinutes(res.time_in || res.slot);
          const end = res.time_out ? parseTimeToMinutes(res.time_out) : start + 120;
          return slotMins >= start && slotMins < end;
        }).length;

        row[day] = count;
        totalSlotBookings += count;
        if (count > maxCount) maxCount = count;
      });

      row['All'] = totalSlotBookings;
      if (totalSlotBookings > maxCount) maxCount = totalSlotBookings;

      return row;
    });

    return { grid, maxCount };
  }, [analyticsReservations]);

  // Heat Map Data 2: Turn-Away Intensity (Days vs Time Slots + All Column)
  const turnAwayHeatMap = useMemo(() => {
    let maxCount = 1;
    const grid = TIME_SLOTS.map(slot => {
      const row = { slot };
      let totalSlotTurnAways = 0;

      DAYS_OF_WEEK.forEach(day => {
        const count = analyticsTurnAways.filter(ta => ta.day === day && ta.slot === slot).length;
        row[day] = count;
        totalSlotTurnAways += count;
        if (count > maxCount) maxCount = count;
      });

      row['All'] = totalSlotTurnAways;
      if (totalSlotTurnAways > maxCount) maxCount = totalSlotTurnAways;

      return row;
    });

    return { grid, maxCount };
  }, [analyticsTurnAways]);

  const getHeatMapColor = (count, maxCount, type = 'booking') => {
    if (count === 0) return 'bg-slate-100/70 text-slate-400';
    const ratio = count / maxCount;

    if (type === 'booking') {
      if (ratio <= 0.25) return 'bg-blue-100 text-blue-800 font-medium';
      if (ratio <= 0.5) return 'bg-blue-300 text-blue-900 font-semibold';
      if (ratio <= 0.75) return 'bg-blue-500 text-white font-bold';
      return 'bg-blue-700 text-white font-black shadow-inner';
    } else {
      if (ratio <= 0.25) return 'bg-rose-100 text-rose-800 font-medium';
      if (ratio <= 0.5) return 'bg-rose-300 text-rose-900 font-semibold';
      if (ratio <= 0.75) return 'bg-rose-500 text-white font-bold';
      return 'bg-rose-700 text-white font-black shadow-inner';
    }
  };

  const getDisplayNameAndId = (res) => {
    const hasName = Boolean(res.student_name && res.student_name.trim());
    const hasId = Boolean(res.barcode && res.barcode.trim());

    if (hasName && hasId) {
      return `${res.student_name} (${res.barcode})`;
    }
    if (hasName) {
      return res.student_name;
    }
    if (hasId) {
      return res.barcode;
    }
    return 'Reserved';
  };

  return (
    <div className="min-h-screen bg-white/30 font-sans text-slate-800">
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">Library Study Rooms</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
              <button 
                onClick={() => setActiveTab('schedule')} 
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </button>
              <button 
                onClick={() => setActiveTab('analytics')} 
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> Usage Analytics
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200">
              <Users className="w-4 h-4 text-blue-400" /> Total Occupancy Today: <span className="text-sm font-bold text-white">{totalOccupancyToday}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200">
              <DoorOpen className="w-4 h-4 text-slate-400" /> Total Turn-Aways Today: <span className="text-sm font-bold text-white">{activeTurnAways.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'schedule' && (
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            {/* Today Button & Navigation Arrows grouped together */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetToToday}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition shadow-sm mr-1"
                title="Return schedule to today"
              >
                Today
              </button>
              <button 
                onClick={handlePrevDay} 
                className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition shadow-sm"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextDay} 
                className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition shadow-sm"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Centered Large Date Display */}
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight text-center">
              {getFormattedDateString(selectedDay, selectedWeek)}
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold">
                <button onClick={() => setSelectedWeek('this_week')} className={`px-3 py-1.5 rounded-md ${selectedWeek === 'this_week' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}>This Week</button>
                <button onClick={() => setSelectedWeek('next_week')} className={`px-3 py-1.5 rounded-md ${selectedWeek === 'next_week' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}>Next Week</button>
              </div>
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="bg-white border border-slate-300 text-sm font-semibold px-3 py-1.5 rounded-lg text-slate-700">
                {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'schedule' ? (
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-800 text-white text-xs uppercase tracking-wider w-[10%] text-center border-b border-slate-700 border-r border-slate-700">
                    Time
                  </th>
                  
                  {ROOMS.map(room => (
                    <th key={room.id} className={`p-3 text-xs uppercase tracking-wider text-center font-bold border-b border-slate-200 w-[19.5%] ${room.headerBg}`}>
                      {room.name}
                    </th>
                  ))}

                  <th className="p-3 bg-slate-800 text-white text-xs uppercase tracking-wider w-[12%] text-center border-b border-slate-700">
                    Turn-Away
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-sm">
                {TIME_SLOTS.map((slot, idx) => {
                  const slotTurnAwayCount = activeTurnAways.filter(t => t.slot === slot).length;
                  const rowBgGradientClass = idx % 2 === 0 
                    ? 'bg-gradient-to-r from-slate-50/90 via-slate-50/50 to-slate-50/90' 
                    : 'bg-white';

                  return (
                    <tr key={slot} className={`h-16 ${rowBgGradientClass} hover:bg-slate-100/70 transition-colors`}>
                      <td className="p-3 font-semibold text-slate-700 text-center bg-white/90 border-r border-slate-200 whitespace-nowrap text-xs h-16 align-middle">
                        {slot}
                      </td>

                      {ROOMS.map(room => {
                        const occInfo = getOccupancyInfo(room.id, slot);
                        const res = occInfo?.reservation;
                        const isFullBlock = occInfo?.displayType === 'full_reservation';
                        const isOverlapped = occInfo?.displayType === 'overlapped';

                        if (isOverlapped) return null;

                        const cardBgClass = res?.any_room 
                          ? 'bg-white text-slate-800 border-slate-300 hover:bg-white' 
                          : room.gradientBg;

                        return (
                          <td 
                            key={room.id} 
                            rowSpan={occInfo?.rowSpan || 1}
                            className={`p-1 border-r border-slate-200 text-center transition-colors align-top relative ${room.colBg}`}
                          >
                            {isFullBlock ? (
                              <div 
                                className="absolute left-1 right-1 z-10"
                                style={{
                                  top: `${occInfo.topOffsetPct / (occInfo.rowSpan || 1)}%`,
                                  bottom: `${occInfo.bottomOffsetPct / (occInfo.rowSpan || 1)}%`
                                }}
                              >
                                <button 
                                  onClick={() => handleOpenModal(room.id, slot, res)} 
                                  className={`w-full h-full p-2 rounded-lg text-xs font-semibold border text-left transition shadow-sm flex flex-col justify-center ${cardBgClass}`}
                                >
                                  <div className="font-bold flex justify-between items-center">
                                    <span>{getDisplayNameAndId(res)}</span> 
                                    <span className="text-[10px] opacity-80">[{res.status}]</span>
                                  </div>
                                  <div className="text-[10px] opacity-80 mt-0.5">
                                    🕒 {res.time_in} – {res.time_out || 'In Session'}
                                  </div>
                                  <div className="text-[10px] opacity-75 mt-0.5">
                                    {res.people !== '' && res.people !== null && res.people !== undefined 
                                      ? `${res.people} Person(s)` 
                                      : 'People: Unspecified'}
                                  </div>
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => handleOpenModal(room.id, slot)} className="w-full h-full py-2 border border-dashed border-slate-300 bg-white/70 hover:bg-white rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-600 text-xs transition flex items-center justify-center">
                                + Book
                              </button>
                            )}
                          </td>
                        );
                      })}

                      <td className="p-2 bg-white/90 text-center h-16 align-middle border-l border-slate-200">
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
            {/* Filter Toolbar with Comprehensive Options */}
            <div className="bg-white p-5 rounded-xl shadow border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-800">Analytics Dashboard Filters</h2>
                </div>
                <button 
                  onClick={handleResetAnalyticsFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition self-start md:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Timeframe (Week)</label>
                  <select 
                    value={analyticsTimeframe} 
                    onChange={(e) => setAnalyticsTimeframe(e.target.value)} 
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="this_year">This Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                  <input 
                    type="date"
                    value={analyticsStartDate} 
                    onChange={(e) => setAnalyticsStartDate(e.target.value)} 
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                  <input 
                    type="date"
                    value={analyticsEndDate} 
                    onChange={(e) => setAnalyticsEndDate(e.target.value)} 
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Day of Week</label>
                  <select 
                    value={analyticsDay} 
                    onChange={(e) => setAnalyticsDay(e.target.value)} 
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Days</option>
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Room Filter</label>
                  <select 
                    value={analyticsRoom} 
                    onChange={(e) => setAnalyticsRoom(e.target.value)} 
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Rooms</option>
                    {ROOMS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Reservation Status</label>
                  <select 
                    value={analyticsStatus} 
                    onChange={(e) => setAnalyticsStatus(e.target.value)} 
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Checked-In">Checked-In</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* KPI Cards Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalFilteredBookings}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Bookmark className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Occupants</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalFilteredPeople}</h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Turn-Away Events</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalFilteredTurnAways}</h3>
                </div>
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                  <DoorOpen className="w-6 h-6 text-rose-600" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Group Size</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{avgGroupSize}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Heat Maps Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Heat Map 1: Booking Density */}
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-blue-600" /> Booking Density Heat Map
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                    <span>Low</span>
                    <span className="w-3 h-3 rounded bg-blue-100"></span>
                    <span className="w-3 h-3 rounded bg-blue-300"></span>
                    <span className="w-3 h-3 rounded bg-blue-500"></span>
                    <span className="w-3 h-3 rounded bg-blue-700"></span>
                    <span>High</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border-collapse min-w-[450px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="p-2 text-left font-semibold">Time</th>
                        {DAYS_OF_WEEK.map(day => (
                          <th key={day} className="p-2 font-semibold">{day.substring(0, 3)}</th>
                        ))}
                        <th className="p-2 font-bold text-blue-800 bg-blue-50/50 rounded-t">All</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {occupancyHeatMap.grid.map(row => (
                        <tr key={row.slot} className="hover:bg-white">
                          <td className="p-2 text-left font-medium text-slate-500 whitespace-nowrap">{row.slot}</td>
                          {DAYS_OF_WEEK.map(day => {
                            const count = row[day];
                            const bgClass = getHeatMapColor(count, occupancyHeatMap.maxCount, 'booking');
                            return (
                              <td key={day} className="p-1">
                                <div className={`py-1.5 rounded transition ${bgClass}`} title={`${day} ${row.slot}: ${count} active booking(s)`}>
                                  {count}
                                </div>
                              </td>
                            );
                          })}
                          <td className="p-1 bg-blue-50/30">
                            <div className={`py-1.5 rounded transition ${getHeatMapColor(row['All'], occupancyHeatMap.maxCount, 'booking')}`} title={`Total at ${row.slot} across all days: ${row['All']}`}>
                              {row['All']}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Heat Map 2: Turn-Away Hotspots */}
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-600" /> Turn-Away Hotspots Heat Map
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                    <span>Low</span>
                    <span className="w-3 h-3 rounded bg-rose-100"></span>
                    <span className="w-3 h-3 rounded bg-rose-300"></span>
                    <span className="w-3 h-3 rounded bg-rose-500"></span>
                    <span className="w-3 h-3 rounded bg-rose-700"></span>
                    <span>High</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border-collapse min-w-[450px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="p-2 text-left font-semibold">Time</th>
                        {DAYS_OF_WEEK.map(day => (
                          <th key={day} className="p-2 font-semibold">{day.substring(0, 3)}</th>
                        ))}
                        <th className="p-2 font-bold text-rose-800 bg-rose-50/50 rounded-t">All</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {turnAwayHeatMap.grid.map(row => (
                        <tr key={row.slot} className="hover:bg-slate-50">
                          <td className="p-2 text-left font-medium text-slate-500 whitespace-nowrap">{row.slot}</td>
                          {DAYS_OF_WEEK.map(day => {
                            const count = row[day];
                            const bgClass = getHeatMapColor(count, turnAwayHeatMap.maxCount, 'turnaway');
                            return (
                              <td key={day} className="p-1">
                                <div className={`py-1.5 rounded transition ${bgClass}`} title={`${day} ${row.slot}: ${count} turn-away(s)`}>
                                  {count}
                                </div>
                              </td>
                            );
                          })}
                          <td className="p-1 bg-rose-50/30">
                            <div className={`py-1.5 rounded transition ${getHeatMapColor(row['All'], turnAwayHeatMap.maxCount, 'turnaway')}`} title={`Total turn-aways at ${row.slot} across all days: ${row['All']}`}>
                              {row['All']}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Visual Analytics Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart 1: Bookings by Room */}
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" /> Bookings by Room
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageByRoomData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                        {usageByRoomData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Bookings & Turn-Aways by Day */}
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Daily Demand vs Turn-Aways
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsByDayData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar name="Bookings" dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar name="Turn-Aways" dataKey="turnAways" fill="#f43f5e" radius={[4, 4, 0, 0]} />
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
                  <input type="text" value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg bg-white" placeholder="Student name" />
                </div>

                <div>
                  <label className="block font-semibold mb-1">ID Number</label>
                  <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg bg-white" placeholder="e.g. w1234567" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Room</label>
                    <select value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full p-2 bg-white border border-slate-300 rounded-lg">
                      {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Number of People</label>
                    <select 
                      value={formData.people} 
                      onChange={(e) => setFormData({ ...formData, people: e.target.value })} 
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""></option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
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

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
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
                  <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg bg-white" placeholder="Needs TV, webcam, etc." />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex gap-2">
                  {activeRes && activeRes.status === 'Reserved' && (
                    <>
                      <button onClick={() => handleCheckIn(activeRes)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold">Check In Now</button>
                      <button onClick={() => handleCancelReservation(activeRes)} className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-lg font-semibold">Cancel Reservation</button>
                    </>
                  )}
                  {activeRes && activeRes.status === 'Checked-In' && (
                    <button onClick={() => handleCheckOut(activeRes)} className="bg-blue-600 hover:bg-blue-700 text-xs text-white px-3 py-2 rounded-lg font-semibold">Check Out Now</button>
                  )}
                </div>
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600">Close</button>
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
