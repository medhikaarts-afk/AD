require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env!");
    process.exit(1);
}

// Schemas
const clientSchema = new mongoose.Schema({ id: String, name: String, phone: String, email: String, location: String, pts: Number, ltv: String, av: String }, { bufferCommands: false });
const staffSchema = new mongoose.Schema({ id: String, name: String, gender: String, spec: String, rating: String, av: String, services: [String], status: String }, { bufferCommands: false });
const serviceSchema = new mongoose.Schema({ id: String, name: String, cat: String, duration: Number, price: Number, prices: [Number], icon: String, gender: String }, { bufferCommands: false });
const inventorySchema = new mongoose.Schema({ id: String, name: String, cat: String, stock: Number, min: Number, unit: String, cost: Number }, { bufferCommands: false });
const bookingSchema = new mongoose.Schema({ id: String, clientId: String, clientName: String, services: [String], staffId: String, date: String, time: String, total: Number, status: String, notes: String, source: String, location: String, deposit: Boolean, timestamp: String }, { bufferCommands: false });
const eventSchema = new mongoose.Schema({ id: String, title: String, date: String, time: String, type: String, description: String }, { bufferCommands: false });
const expenseSchema = new mongoose.Schema({ id: String, cat: String, desc: String, amount: Number, date: String, method: String }, { bufferCommands: false });
const campaignSchema = new mongoose.Schema({ id: String, name: String, message: String, mediaUrls: [String], recipientsCount: Number, status: String, timestamp: String, results: Array }, { bufferCommands: false });
const ticketSchema = new mongoose.Schema({}, { strict: false }); // dynamic schema for tickets

const Client = mongoose.model('Client', clientSchema);
const Staff = mongoose.model('Staff', staffSchema);
const Service = mongoose.model('Service', serviceSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Event = mongoose.model('Event', eventSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);
const Ticket = mongoose.model('Ticket', ticketSchema, 'tickets');

async function migrate() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    console.log("Reading db.json...");
    let db = {};
    if (fs.existsSync('db.json')) {
        db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    } else {
        console.error("db.json not found!");
        process.exit(1);
    }

    console.log("Migrating collections...");

    if (db.clients && db.clients.length > 0) {
        await Client.deleteMany({});
        await Client.insertMany(db.clients);
        console.log(`Migrated ${db.clients.length} clients.`);
    }

    if (db.staff && db.staff.length > 0) {
        await Staff.deleteMany({});
        await Staff.insertMany(db.staff);
        console.log(`Migrated ${db.staff.length} staff.`);
    }

    if (db.services && db.services.length > 0) {
        await Service.deleteMany({});
        await Service.insertMany(db.services);
        console.log(`Migrated ${db.services.length} services.`);
    }

    if (db.inventory && db.inventory.length > 0) {
        await Inventory.deleteMany({});
        await Inventory.insertMany(db.inventory);
        console.log(`Migrated ${db.inventory.length} inventory items.`);
    }

    if (db.bookings && db.bookings.length > 0) {
        await Booking.deleteMany({});
        await Booking.insertMany(db.bookings);
        console.log(`Migrated ${db.bookings.length} bookings.`);
    }

    if (db.events && db.events.length > 0) {
        await Event.deleteMany({});
        await Event.insertMany(db.events);
        console.log(`Migrated ${db.events.length} events.`);
    }

    if (db.expenses && db.expenses.length > 0) {
        await Expense.deleteMany({});
        await Expense.insertMany(db.expenses);
        console.log(`Migrated ${db.expenses.length} expenses.`);
    }

    if (db.campaigns && db.campaigns.length > 0) {
        await Campaign.deleteMany({});
        await Campaign.insertMany(db.campaigns);
        console.log(`Migrated ${db.campaigns.length} campaigns.`);
    }

    if (db.tickets && db.tickets.length > 0) {
        await Ticket.deleteMany({});
        await Ticket.insertMany(db.tickets);
        console.log(`Migrated ${db.tickets.length} tickets.`);
    }

    console.log("Migration complete!");
    mongoose.connection.close();
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    mongoose.connection.close();
});
