import mongoose from 'mongoose';
import { Book, BookIssue } from './src/model/library.model.js';
import { RoomAllocation } from './src/model/hostel.model.js';
import { Transport } from './src/model/transport.model.js';

const MONGO_URL = 'mongodb+srv://patelliya04_db_user:9qh9NfMcEmvEm8PV@studentcluster.vleq0in.mongodb.net/Management_DB';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB for seeding');

    // 1. Get a student
    const StudentModel = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const students = await StudentModel.find({});
    console.log(`Found ${students.length} students in DB.`);
    
    let targetStudentId = 'ST-2026-0001'; // Default backup
    if (students.length > 0) {
      const student = students[0];
      targetStudentId = student.studentId || student._id.toString();
      console.log(`Using student: ${student.firstName} ${student.lastName} (ID: ${targetStudentId})`);
    }

    // 2. Seed Books
    await Book.deleteMany({});
    const b1 = await Book.create({ title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', isbn: '978-0133591620', quantity: 5, availableQuantity: 4 });
    const b2 = await Book.create({ title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', quantity: 10, availableQuantity: 10 });
    const b3 = await Book.create({ title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', quantity: 3, availableQuantity: 3 });
    console.log('Books seeded.');

    // Seed Book Issue Log
    await BookIssue.deleteMany({});
    await BookIssue.create({
      bookId: b1._id,
      studentId: targetStudentId,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'Issued'
    });
    console.log('Book Issue Log seeded.');

    // 3. Seed Rooms
    await RoomAllocation.deleteMany({});
    const r1 = await RoomAllocation.create({ roomNumber: '101', block: 'Block A', type: 'Shared', status: 'Allocated', studentId: targetStudentId });
    const r2 = await RoomAllocation.create({ roomNumber: '202', block: 'Block B', type: 'Shared', status: 'Available' });
    const r3 = await RoomAllocation.create({ roomNumber: '303', block: 'Block A', type: 'Single', status: 'Available' });
    console.log('Rooms seeded.');

    // 4. Seed Transport Routes
    await Transport.deleteMany({});
    const t1 = await Transport.create({
      routeNumber: '1',
      driverName: 'Michael Scott',
      driverPhone: '555-0199',
      vehicleNumber: 'BUS-101',
      stops: ['Downtown', 'Main Campus', 'West Hostel'],
      studentIds: [targetStudentId]
    });
    const t2 = await Transport.create({
      routeNumber: '2',
      driverName: 'Dwight Schrute',
      driverPhone: '555-0200',
      vehicleNumber: 'SHUTTLE-5',
      stops: ['East Campus', 'Main Campus', 'North Hostel'],
      studentIds: []
    });
    console.log('Transport routes seeded.');

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
