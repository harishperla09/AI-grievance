require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Department = require('./models/Department');
const Notification = require('./models/Notification');
const Reward = require('./models/Reward');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grievance_portal';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Department.deleteMany({});
    await Notification.deleteMany({});
    await Reward.deleteMany({});

    // Create departments
    const departments = [
      { department_name: 'Sanitation Department', department_email: 'sanitation@city.gov', department_head: 'Dr. Priya Sharma', icon: '🗑️' },
      { department_name: 'Water Department', department_email: 'water@city.gov', department_head: 'Eng. Rajesh Kumar', icon: '💧' },
      { department_name: 'Electrical Department', department_email: 'electrical@city.gov', department_head: 'Eng. Anita Verma', icon: '💡' },
      { department_name: 'Public Works Department', department_email: 'publicworks@city.gov', department_head: 'Mr. Suresh Patel', icon: '🛣️' },
      { department_name: 'Traffic & Transport Department', department_email: 'traffic@city.gov', department_head: 'IPS Deepak Singh', icon: '🚦' },
      { department_name: 'Health Department', department_email: 'health@city.gov', department_head: 'Dr. Meena Iyer', icon: '🏥' },
      { department_name: 'Parks & Recreation Department', department_email: 'parks@city.gov', department_head: 'Ms. Kavita Rao', icon: '🌳' },
      { department_name: 'Housing & Urban Development', department_email: 'housing@city.gov', department_head: 'Mr. Vikram Joshi', icon: '🏗️' }
    ];
    await Department.insertMany(departments);
    console.log('✅ Departments seeded');

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@grievance.gov',
      phone: '9876543210',
      password: hashedPassword,
      role: 'admin',
      reward_points: 0,
      badges: [{ name: 'Administrator', icon: '🛡️' }]
    });

    const citizen1 = await User.create({
      name: 'Rahul Mehta',
      email: 'rahul@example.com',
      phone: '9876543211',
      password: hashedPassword,
      role: 'citizen',
      reward_points: 45,
      badges: [
        { name: 'New Citizen', icon: '🌟' },
        { name: 'Active Citizen', icon: '🏆' }
      ]
    });

    const citizen2 = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      phone: '9876543212',
      password: hashedPassword,
      role: 'citizen',
      reward_points: 30,
      badges: [{ name: 'New Citizen', icon: '🌟' }]
    });

    const citizen3 = await User.create({
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543213',
      password: hashedPassword,
      role: 'citizen',
      reward_points: 20,
      badges: [{ name: 'New Citizen', icon: '🌟' }]
    });

    console.log('✅ Users seeded');

    // Create demo complaints
    const complaints = [
      {
        user_id: citizen1._id,
        complaint_text: 'Garbage has not been collected from our street for the past 5 days. The trash bins are overflowing and causing a terrible smell in the neighborhood.',
        location: 'MG Road, Sector 15, Bangalore',
        department: 'Sanitation Department',
        priority_level: 'red',
        status: 'In Progress',
        upvotes: 12,
        ai_suggestion: 'While we process your complaint, please ensure garbage is kept in covered bins to prevent health hazards.',
        created_at: new Date('2026-03-08')
      },
      {
        user_id: citizen1._id,
        complaint_text: 'Street light near the park entrance has not been working for 2 weeks. The area becomes very dark and unsafe at night.',
        location: 'Jubilee Park, Anna Nagar, Chennai',
        department: 'Electrical Department',
        priority_level: 'yellow',
        status: 'Pending',
        upvotes: 8,
        ai_suggestion: 'Please stay away from any exposed wires or damaged electrical equipment. Use flashlights instead of candles.',
        created_at: new Date('2026-03-10')
      },
      {
        user_id: citizen2._id,
        complaint_text: 'Severe water leakage from the main pipeline near the school. Water is flooding the road and wasting thousands of liters. This is urgent!',
        location: 'Government School, Koramangala, Bangalore',
        department: 'Water Department',
        priority_level: 'red',
        status: 'Pending',
        upvotes: 25,
        ai_suggestion: 'As a temporary measure, please turn off the main valve if there\'s a leak. Avoid using contaminated water.',
        created_at: new Date('2026-03-11')
      },
      {
        user_id: citizen2._id,
        complaint_text: 'Large pothole on the main highway causing accidents. Multiple vehicles have been damaged. Road repair is urgently needed.',
        location: 'NH-44, Near Toll Plaza, Hyderabad',
        department: 'Public Works Department',
        priority_level: 'red',
        status: 'In Progress',
        upvotes: 34,
        assigned_staff: 'Eng. Mohan Das',
        ai_suggestion: 'Please be cautious around the damaged area. Use alternate routes if possible.',
        created_at: new Date('2026-03-09')
      },
      {
        user_id: citizen3._id,
        complaint_text: 'Traffic signal at the main junction is malfunctioning, showing green in all directions. Very dangerous situation.',
        location: 'Central Junction, MG Road, Pune',
        department: 'Traffic & Transport Department',
        priority_level: 'red',
        status: 'Pending',
        upvotes: 18,
        ai_suggestion: 'Please follow traffic rules and use alternative routes to avoid congested areas.',
        created_at: new Date('2026-03-11')
      },
      {
        user_id: citizen3._id,
        complaint_text: 'Park playground equipment is broken and rusty. Children are at risk of injury. Need immediate maintenance.',
        location: 'Central Park, Whitefield, Bangalore',
        department: 'Parks & Recreation Department',
        priority_level: 'yellow',
        status: 'Pending',
        upvotes: 6,
        ai_suggestion: 'Please avoid the affected area until maintenance is complete.',
        created_at: new Date('2026-03-10')
      },
      {
        user_id: citizen1._id,
        complaint_text: 'Mosquito breeding due to stagnant water in the vacant lot. Multiple dengue cases reported in the area.',
        location: 'Vacant Plot, HSR Layout, Bangalore',
        department: 'Health Department',
        priority_level: 'red',
        status: 'In Progress',
        upvotes: 15,
        assigned_staff: 'Dr. Ramesh N.',
        ai_suggestion: 'Please maintain hygiene and consult a nearby health center if you notice any symptoms.',
        created_at: new Date('2026-03-07')
      },
      {
        user_id: citizen2._id,
        complaint_text: 'Garbage collection service has been very irregular this month. Bins are always full.',
        location: 'Indira Nagar, 12th Main, Bangalore',
        department: 'Sanitation Department',
        priority_level: 'yellow',
        status: 'Resolved',
        upvotes: 9,
        ai_suggestion: 'While we process your complaint, please ensure garbage is kept in covered bins to prevent health hazards.',
        created_at: new Date('2026-03-01')
      },
      {
        user_id: citizen3._id,
        complaint_text: 'Minor road crack developing near the bus stop. Not urgent but should be fixed before monsoon.',
        location: 'Bus Stop, Yelahanka, Bangalore',
        department: 'Public Works Department',
        priority_level: 'green',
        status: 'Resolved',
        upvotes: 3,
        ai_suggestion: 'Please be cautious around the damaged area. Use alternate routes if possible.',
        created_at: new Date('2026-02-25')
      },
      {
        user_id: citizen1._id,
        complaint_text: 'Illegal construction happening in residential area without proper permits. Causing noise and dust pollution.',
        location: 'Block C, Saket, New Delhi',
        department: 'Housing & Urban Development',
        priority_level: 'yellow',
        status: 'Pending',
        upvotes: 7,
        ai_suggestion: 'Please document any unauthorized construction with photos and keep a safe distance.',
        created_at: new Date('2026-03-12')
      }
    ];

    await Complaint.insertMany(complaints);
    console.log('✅ Complaints seeded');

    // Create notifications
    const createdComplaints = await Complaint.find({});
    const notifications = createdComplaints.map(c => ({
      user_id: c.user_id,
      complaint_id: c._id,
      message: `Your complaint has been submitted and assigned to ${c.department}.`
    }));
    await Notification.insertMany(notifications);
    console.log('✅ Notifications seeded');

    // Create rewards
    const rewards = [
      { user_id: citizen1._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen1._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen1._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen1._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen1._id, points: 5, reason: 'Complaint resolved' },
      { user_id: citizen2._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen2._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen2._id, points: 5, reason: 'Complaint resolved' },
      { user_id: citizen2._id, points: 5, reason: 'Complaint resolved' },
      { user_id: citizen3._id, points: 10, reason: 'Submitted a new complaint' },
      { user_id: citizen3._id, points: 10, reason: 'Submitted a new complaint' },
    ];
    await Reward.insertMany(rewards);
    console.log('✅ Rewards seeded');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('  Admin:   admin@grievance.gov / password123');
    console.log('  Citizen: rahul@example.com / password123');
    console.log('  Citizen: sneha@example.com / password123');
    console.log('  Citizen: amit@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
