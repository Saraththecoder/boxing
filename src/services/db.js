// LocalStorage Database Layer for Boxing Academy Management Software
import { 
  initialStudents, 
  initialTrainers, 
  initialTrainerAttendance, 
  initialAttendance, 
  initialPayments, 
  initialAnnouncements,
  initialActivities 
} from '../data/mockData';

const DB_KEYS = {
  STUDENTS: 'apex_boxing_students',
  TRAINERS: 'apex_boxing_trainers',
  TRAINER_ATTENDANCE: 'apex_boxing_trainer_attendance',
  ATTENDANCE: 'apex_boxing_attendance',
  PAYMENTS: 'apex_boxing_payments',
  ANNOUNCEMENTS: 'apex_boxing_announcements',
  ACTIVITIES: 'apex_boxing_activities'
};

let isDbInitialized = false;

// Initialize database if empty
export const initDatabase = () => {
  if (isDbInitialized) return;
  
  let hasMissing = false;
  const keys = Object.values(DB_KEYS);
  for (let i = 0; i < keys.length; i++) {
    if (!localStorage.getItem(keys[i])) {
      hasMissing = true;
      break;
    }
  }

  if (hasMissing) {
    if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(initialStudents));
    }
    if (!localStorage.getItem(DB_KEYS.TRAINERS)) {
      localStorage.setItem(DB_KEYS.TRAINERS, JSON.stringify(initialTrainers));
    }
    if (!localStorage.getItem(DB_KEYS.TRAINER_ATTENDANCE)) {
      localStorage.setItem(DB_KEYS.TRAINER_ATTENDANCE, JSON.stringify(initialTrainerAttendance));
    }
    if (!localStorage.getItem(DB_KEYS.ATTENDANCE)) {
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
    }
    if (!localStorage.getItem(DB_KEYS.PAYMENTS)) {
      localStorage.setItem(DB_KEYS.PAYMENTS, JSON.stringify(initialPayments));
    }
    if (!localStorage.getItem(DB_KEYS.ANNOUNCEMENTS)) {
      localStorage.setItem(DB_KEYS.ANNOUNCEMENTS, JSON.stringify(initialAnnouncements));
    }
    if (!localStorage.getItem(DB_KEYS.ACTIVITIES)) {
      localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
    }
  }
  isDbInitialized = true;
};

// Helper: Get data
const getData = (key) => {
  if (!isDbInitialized) {
    initDatabase();
  }
  return JSON.parse(localStorage.getItem(key)) || [];
};

// Helper: Save data
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Students API ---
export const db = {
  // Students
  getStudents: () => getData(DB_KEYS.STUDENTS),
  saveStudent: (student) => {
    const students = getData(DB_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === student.id);
    
    if (index >= 0) {
      students[index] = { ...students[index], ...student };
      db.addActivity('info', `Updated student profile: ${student.name}`);
    } else {
      // New student ID generation
      const nextNum = students.length > 0 
        ? Math.max(...students.map(s => parseInt(s.id.split('-')[1]) || 0)) + 1 
        : 1;
      const newId = `STU-${String(nextNum).padStart(3, '0')}`;
      student.id = newId;
      student.joinDate = student.joinDate || new Date().toISOString().split('T')[0];
      students.push(student);
      db.addActivity('success', `Registered new student: ${student.name}`);
    }
    saveData(DB_KEYS.STUDENTS, students);
    return student;
  },
  deleteStudent: (id) => {
    const students = getData(DB_KEYS.STUDENTS);
    const student = students.find(s => s.id === id);
    const filtered = students.filter(s => s.id !== id);
    saveData(DB_KEYS.STUDENTS, filtered);
    if (student) {
      db.addActivity('danger', `Removed student record for ${student.name}`);
    }
  },

  // Trainers
  getTrainers: () => getData(DB_KEYS.TRAINERS),
  saveTrainer: (trainer) => {
    const trainers = getData(DB_KEYS.TRAINERS);
    const index = trainers.findIndex(t => t.id === trainer.id);
    if (index >= 0) {
      trainers[index] = trainer;
    } else {
      const nextNum = trainers.length > 0 ? Math.max(...trainers.map(t => parseInt(t.id.split('-')[1]) || 0)) + 1 : 1;
      trainer.id = `TRN-${String(nextNum).padStart(3, '0')}`;
      trainers.push(trainer);
    }
    saveData(DB_KEYS.TRAINERS, trainers);
    return trainer;
  },

  // Student Attendance
  getAttendance: () => getData(DB_KEYS.ATTENDANCE),
  saveAttendanceRecord: (record) => {
    const attendance = getData(DB_KEYS.ATTENDANCE);
    // Find if a record exists for this student on this date
    const index = attendance.findIndex(a => a.studentId === record.studentId && a.date === record.date);
    
    if (index >= 0) {
      attendance[index].status = record.status;
    } else {
      const nextNum = attendance.length > 0 ? Math.max(...attendance.map(a => parseInt(a.id.split('-')[1]) || 0)) + 1 : 1;
      record.id = `ATT-${String(nextNum).padStart(3, '0')}`;
      attendance.push(record);
    }
    saveData(DB_KEYS.ATTENDANCE, attendance);
    
    // Log activity occasionally or specifically
    const students = db.getStudents();
    const student = students.find(s => s.id === record.studentId);
    if (student && record.status === 'Present') {
      db.addActivity('success', `${student.name} checked in.`);
    }
  },
  
  // Trainer Attendance
  getTrainerAttendance: () => getData(DB_KEYS.TRAINER_ATTENDANCE),
  saveTrainerAttendanceRecord: (record) => {
    const trnAttendance = getData(DB_KEYS.TRAINER_ATTENDANCE);
    const index = trnAttendance.findIndex(a => a.trainerId === record.trainerId && a.date === record.date);
    
    if (index >= 0) {
      trnAttendance[index].status = record.status;
    } else {
      const nextNum = trnAttendance.length > 0 ? Math.max(...trnAttendance.map(a => parseInt(a.id.split('-')[1]) || 0)) + 1 : 1;
      record.id = `TA-${String(nextNum).padStart(2, '0')}`;
      trnAttendance.push(record);
    }
    saveData(DB_KEYS.TRAINER_ATTENDANCE, trnAttendance);
    
    const trainers = db.getTrainers();
    const trainer = trainers.find(t => t.id === record.trainerId);
    if (trainer) {
      db.addActivity('info', `Trainer ${trainer.name} marked ${record.status.toLowerCase()}.`);
    }
  },

  // Payments & Fees
  getPayments: () => getData(DB_KEYS.PAYMENTS),
  savePayment: (payment) => {
    const payments = getData(DB_KEYS.PAYMENTS);
    const nextNum = payments.length > 0 ? Math.max(...payments.map(p => parseInt(p.id.split('-')[1]) || 0)) + 1 : 1;
    payment.id = `PAY-${String(nextNum).padStart(3, '0')}`;
    payment.paymentDate = payment.paymentDate || new Date().toISOString().split('T')[0];
    
    // Generate receipt number
    const dateStr = payment.paymentDate.replace(/-/g, '').substring(2);
    payment.receiptNumber = `REC-${dateStr}-${String(nextNum).padStart(2, '0')}`;
    
    payments.push(payment);
    saveData(DB_KEYS.PAYMENTS, payments);

    const students = db.getStudents();
    const student = students.find(s => s.id === payment.studentId);
    if (student) {
      db.addActivity('success', `Collected fee of $${payment.amount} from ${student.name}.`);
    }
    return payment;
  },

  // Announcements
  getAnnouncements: () => getData(DB_KEYS.ANNOUNCEMENTS),
  saveAnnouncement: (announcement) => {
    const announcements = getData(DB_KEYS.ANNOUNCEMENTS);
    const index = announcements.findIndex(a => a.id === announcement.id);
    
    if (index >= 0) {
      announcements[index] = announcement;
      db.addActivity('info', `Updated Announcement: ${announcement.title}`);
    } else {
      const nextNum = announcements.length > 0 ? Math.max(...announcements.map(a => parseInt(a.id.split('-')[1]) || 0)) + 1 : 1;
      announcement.id = `ANN-${String(nextNum).padStart(3, '0')}`;
      announcement.date = new Date().toISOString().split('T')[0];
      announcement.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      announcements.unshift(announcement); // Newest first
      db.addActivity('info', `New Announcement: ${announcement.title}`);
    }
    saveData(DB_KEYS.ANNOUNCEMENTS, announcements);
    return announcement;
  },
  deleteAnnouncement: (id) => {
    const announcements = getData(DB_KEYS.ANNOUNCEMENTS);
    const filtered = announcements.filter(a => a.id !== id);
    saveData(DB_KEYS.ANNOUNCEMENTS, filtered);
  },

  // Activities log
  getActivities: () => getData(DB_KEYS.ACTIVITIES),
  addActivity: (type, text) => {
    const activities = getData(DB_KEYS.ACTIVITIES);
    const nextNum = activities.length > 0 ? Math.max(...activities.map(a => parseInt(a.id.split('-')[1]) || 0)) + 1 : 1;
    const newActivity = {
      id: `ACT-${String(nextNum).padStart(3, '0')}`,
      type,
      text,
      time: "Just now"
    };
    activities.unshift(newActivity);
    // Keep last 50 activities only
    if (activities.length > 50) activities.pop();
    saveData(DB_KEYS.ACTIVITIES, activities);
  },

  // Database Backup Support & Reset
  getCompleteData: () => {
    const complete = {};
    Object.keys(DB_KEYS).forEach(k => {
      complete[DB_KEYS[k]] = getData(DB_KEYS[k]);
    });
    return complete;
  },
  restoreCompleteData: (data) => {
    try {
      Object.keys(DB_KEYS).forEach(k => {
        const keyVal = DB_KEYS[k];
        if (data[keyVal]) {
          localStorage.setItem(keyVal, JSON.stringify(data[keyVal]));
        }
      });
      db.addActivity('success', 'Database restored from backup file.');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  resetDatabase: () => {
    localStorage.removeItem(DB_KEYS.STUDENTS);
    localStorage.removeItem(DB_KEYS.TRAINERS);
    localStorage.removeItem(DB_KEYS.TRAINER_ATTENDANCE);
    localStorage.removeItem(DB_KEYS.ATTENDANCE);
    localStorage.removeItem(DB_KEYS.PAYMENTS);
    localStorage.removeItem(DB_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(DB_KEYS.ACTIVITIES);
    isDbInitialized = false;
    initDatabase();
  }
};
