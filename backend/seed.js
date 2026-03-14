import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TouristPlace from './models/TouristPlace.js';
import Dustbin from './models/Dustbin.js';
import User from './models/User.js';
import GarbageReport from './models/GarbageReport.js';
import Event from './models/Event.js';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected for seeding');

    // Clear existing data
    await TouristPlace.deleteMany();
    await Dustbin.deleteMany();
    await User.deleteMany();
    await GarbageReport.deleteMany();
    await Event.deleteMany();
    console.log('🗑️  Existing data cleared');

    // Seed Admin User
    const adminUser = await User.create({
      name: "Admin User",
      email: "Saloni@example.com",
      password: "123456",
      role: "admin"
    });
    console.log('✅ Admin User seeded (Saloni@example.com)');

    const places = [
      {
        name: "Taj Mahal",
        location: "Agra, Uttar Pradesh",
        latitude: 27.1751,
        longitude: 78.0421,
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 9.2,
        ratings: [{ userId: adminUser._id, rating: 9 }]
      },
      {
        name: "Qutub Minar",
        location: "New Delhi",
        latitude: 28.5245,
        longitude: 77.1855,
        imageUrl: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 8.5,
        ratings: [{ userId: adminUser._id, rating: 8 }]
      },
      {
        name: "Amber Fort",
        location: "Jaipur, Rajasthan",
        latitude: 26.9855,
        longitude: 75.8513,
        imageUrl: "https://images.unsplash.com/photo-1590593162211-f1442aa029a7?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 7.8,
        ratings: [{ userId: adminUser._id, rating: 8 }]
      },
      {
        name: "Gateway of India",
        location: "Mumbai, Maharashtra",
        latitude: 18.9220,
        longitude: 72.8347,
        imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 6.5,
        ratings: [{ userId: adminUser._id, rating: 6 }]
      },
      {
        name: "Hawa Mahal",
        location: "Jaipur, Rajasthan",
        latitude: 26.9239,
        longitude: 75.8267,
        imageUrl: "https://images.unsplash.com/photo-1628151523450-482f65a48677?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 8.0,
        ratings: [{ userId: adminUser._id, rating: 8 }]
      },
      {
        name: "Golden Temple",
        location: "Amritsar, Punjab",
        latitude: 31.6200,
        longitude: 74.8765,
        imageUrl: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 9.8,
        ratings: [{ userId: adminUser._id, rating: 10 }]
      },
      {
        name: "Varanasi Ghats",
        location: "Varanasi, Uttar Pradesh",
        latitude: 25.3176,
        longitude: 83.0062,
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 6.8,
        ratings: [{ userId: adminUser._id, rating: 7 }]
      },
      {
        name: "Victoria Memorial",
        location: "Kolkata, West Bengal",
        latitude: 22.5448,
        longitude: 88.3426,
        imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 8.2,
        ratings: [{ userId: adminUser._id, rating: 8 }]
      },
      {
        name: "Mysore Palace",
        location: "Mysuru, Karnataka",
        latitude: 12.3051,
        longitude: 76.6552,
        imageUrl: "https://images.unsplash.com/photo-1581422116246-0f726715834b?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 8.9,
        ratings: [{ userId: adminUser._id, rating: 9 }]
      },
      {
        name: "Meenakshi Temple",
        location: "Madurai, Tamil Nadu",
        latitude: 9.9195,
        longitude: 78.1193,
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1000",
        cleanlinessScore: 7.5,
        ratings: [{ userId: adminUser._id, rating: 7 }]
      }
    ];

    await TouristPlace.insertMany(places);
    console.log('✅ Tourist Places (India) seeded');

    // Seed Reports (Multiple Locations)
    const reports = [
      {
        userId: adminUser._id,
        photo: "https://images.unsplash.com/photo-1552033349-2ed86bbbd008?auto=format&fit=crop&q=80&w=1000",
        latitude: 28.5250,
        longitude: 77.1860,
        description: "Litter near the entrance of Qutub Minar",
        status: "Pending"
      },
      {
        userId: adminUser._id,
        photo: "https://images.unsplash.com/photo-1605600611284-1b2167bd1847?auto=format&fit=crop&q=80&w=1000",
        latitude: 26.9245,
        longitude: 75.8270,
        description: "Plastic waste near Hawa Mahal",
        status: "In Progress"
      },
      {
        userId: adminUser._id,
        photo: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=1000",
        latitude: 27.1755,
        longitude: 78.0425,
        description: "Garbage pile near Taj Mahal east gate",
        status: "Pending"
      },
      {
        userId: adminUser._id,
        photo: "https://images.unsplash.com/photo-1552033349-2ed86bbbd008?auto=format&fit=crop&q=80&w=1000",
        latitude: 31.6210,
        longitude: 74.8770,
        description: "Overflowing bin near Golden Temple",
        status: "Cleaned"
      }
    ];
    await GarbageReport.insertMany(reports);
    console.log('✅ Garbage Reports seeded');

    // Seed Events (Multiple Locations)
    const events = [
      {
        title: "Qutub Minar Clean Drive",
        description: "Let's clean the surroundings of Qutub Minar.",
        location: "Qutub Minar Main Gate",
        latitude: 28.5245,
        longitude: 77.1855,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        volunteers: [adminUser._id]
      },
      {
        title: "Jaipur Heritage Cleanup",
        description: "Cleaning drive near Hawa Mahal and surrounding markets.",
        location: "Hawa Mahal Front",
        latitude: 26.9239,
        longitude: 75.8267,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        volunteers: [adminUser._id]
      },
      {
        title: "Taj Mahal Eco Walk",
        description: "Volunteer drive to pick up plastic around Taj Mahal complex.",
        location: "Taj Mahal Gate",
        latitude: 27.1751,
        longitude: 78.0421,
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        volunteers: [adminUser._id]
      }
    ];
    await Event.insertMany(events);
    console.log('✅ Events seeded');

    // Seed Dustbins (around New Delhi center for demo)
    const dustbins = [
      {
        locationName: "Connaught Place Block A",
        latitude: 28.6328,
        longitude: 77.2197,
        type: "normal"
      },
      {
        locationName: "India Gate Circle",
        latitude: 28.6129,
        longitude: 77.2295,
        type: "recycle"
      },
      {
        locationName: "Red Fort Entrance",
        latitude: 28.6558,
        longitude: 77.2403,
        type: "normal"
      },
      {
        locationName: "Lodhi Garden North Gate",
        latitude: 28.5933,
        longitude: 77.2189,
        type: "recycle"
      }
    ];

    await Dustbin.insertMany(dustbins);
    console.log('✅ Dustbins seeded');

    process.exit();
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
