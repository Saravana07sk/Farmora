require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { calculateOrderTotals } = require('./pricing');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Notification.deleteMany();
    await AuditLog.deleteMany();

    console.log('[Seed] Creating demo users...');

    // 1 Admin
    const admin = await User.create({
      name: 'AgriLink Administrator',
      email: 'admin@agrilink.demo',
      password: 'Password123!',
      phone: '+919876543210',
      role: 'admin',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      address: { street: 'HQ Tower, Tech Park', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    });

    // 5 Farmers
    const farmer1 = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@agrilink.demo',
      password: 'Password123!',
      phone: '+919812345678',
      role: 'farmer',
      isVerified: true,
      verificationStatus: 'APPROVED',
      farmName: 'Patel Organic Farms',
      farmSize: '12 Acres',
      farmingType: 'Organic',
      crops: ['Tomatoes', 'Onions', 'Potatoes'],
      profileImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
      address: { street: 'NH-8 Farm Road', city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
      verificationDocuments: [
        { docType: '7/12 Land Certificate', docUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800' },
      ],
      rating: 4.9,
      numReviews: 18,
    });

    const farmer2 = await User.create({
      name: 'Gurpreet Singh',
      email: 'gurpreet@agrilink.demo',
      password: 'Password123!',
      phone: '+919823456789',
      role: 'farmer',
      isVerified: true,
      verificationStatus: 'APPROVED',
      farmName: 'Green Punjab Grain Farm',
      farmSize: '25 Acres',
      farmingType: 'Conventional',
      crops: ['Basmati Rice', 'Sharbati Wheat'],
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      address: { street: 'GT Road', city: 'Ludhiana', state: 'Punjab', pincode: '141001' },
      rating: 4.8,
      numReviews: 12,
    });

    const farmer3 = await User.create({
      name: 'Suresh Gowda',
      email: 'suresh@agrilink.demo',
      password: 'Password123!',
      phone: '+919834567890',
      role: 'farmer',
      isVerified: true,
      verificationStatus: 'APPROVED',
      farmName: 'Kaveri Valley Produce',
      farmSize: '8 Acres',
      farmingType: 'Natural / Hydroponic',
      crops: ['Bananas', 'Turmeric'],
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Mandya Highway', city: 'Mysuru', state: 'Karnataka', pincode: '570001' },
      rating: 4.7,
      numReviews: 9,
    });

    const farmer4 = await User.create({
      name: 'Venkateswarlu Reddy',
      email: 'reddy@agrilink.demo',
      password: 'Password123!',
      phone: '+919845678901',
      role: 'farmer',
      isVerified: false,
      verificationStatus: 'PENDING',
      farmName: 'Guntur Spice Estate',
      farmSize: '15 Acres',
      farmingType: 'Organic',
      crops: ['Guntur Red Chilli', 'Groundnuts'],
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Mirchi Yard Road', city: 'Guntur', state: 'Andhra Pradesh', pincode: '522001' },
      rating: 4.5,
      numReviews: 4,
    });

    const farmer5 = await User.create({
      name: 'Vikram Thakur',
      email: 'vikram@agrilink.demo',
      password: 'Password123!',
      phone: '+919856789012',
      role: 'farmer',
      isVerified: true,
      verificationStatus: 'APPROVED',
      farmName: 'Himalayan Orchard Direct',
      farmSize: '10 Acres',
      farmingType: 'Organic',
      crops: ['Royal Delicious Apples'],
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Apple Belt Road', city: 'Shimla', state: 'Himachal Pradesh', pincode: '171001' },
      rating: 5.0,
      numReviews: 22,
    });

    // 10 Buyers
    const buyers = [];
    const mainBuyer = await User.create({
      name: 'Ananya Sharma',
      email: 'buyer@agrilink.demo',
      password: 'Password123!',
      phone: '+919911223344',
      role: 'buyer',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      address: { street: 'Bandra West, 14th Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
    });
    buyers.push(mainBuyer);

    const buyerNames = [
      'Priya Nair', 'Vikram Malhotra', 'Sneha Kulkarni', 'Arjun Verma',
      'Kavita Roy', 'Rajesh Iyer', 'Deepak Gupta', 'Meera Rao', 'Siddharth Das'
    ];
    for (let i = 0; i < buyerNames.length; i++) {
      const b = await User.create({
        name: buyerNames[i],
        email: `buyer${i + 2}@agrilink.demo`,
        password: 'Password123!',
        phone: `+91990000000${i}`,
        role: 'buyer',
        address: { street: `Street ${i + 1}`, city: 'Bengaluru', state: 'Karnataka', pincode: `56000${i + 2}` },
      });
      buyers.push(b);
    }

    console.log('[Seed] Creating 20 agricultural products...');

    const sampleProducts = [
      {
        name: 'Fresh Red Farm Tomatoes',
        category: 'Vegetables',
        price: 32,
        unit: 'kg',
        quantityAvailable: 1500,
        minimumOrderQuantity: 10,
        farmer: farmer1._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Maharashtra', city: 'Nashik' },
        description: 'Vine-ripened, firm, juicy organic tomatoes directly harvested from Nashik fields. Free of synthetic chemicals.',
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Nashik Red Onions (Premium)',
        category: 'Vegetables',
        price: 28,
        unit: 'kg',
        quantityAvailable: 3000,
        minimumOrderQuantity: 25,
        farmer: farmer1._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Maharashtra', city: 'Nashik' },
        description: 'Pungent, high-grade Nashik red onions with long shelf life. Ideal for wholesale, restaurants, and retail distribution.',
        images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Organic Table Potatoes',
        category: 'Vegetables',
        price: 24,
        unit: 'kg',
        quantityAvailable: 2500,
        minimumOrderQuantity: 20,
        farmer: farmer1._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Maharashtra', city: 'Nashik' },
        description: 'Freshly harvested soil-cleaned table potatoes with golden skin and excellent cooking quality.',
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Superfine 1121 Basmati Rice',
        category: 'Grains',
        price: 110,
        unit: 'kg',
        quantityAvailable: 5000,
        minimumOrderQuantity: 50,
        farmer: farmer2._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Conventional',
        location: { state: 'Punjab', city: 'Ludhiana' },
        description: 'Aged 1121 Extra Long Grain Basmati Rice grown in nutrient-rich Punjab soil. Exceptionally aromatic when cooked.',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Golden Sharbati Wheat Grains',
        category: 'Grains',
        price: 45,
        unit: 'kg',
        quantityAvailable: 8000,
        minimumOrderQuantity: 100,
        farmer: farmer2._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Conventional',
        location: { state: 'Punjab', city: 'Ludhiana' },
        description: 'Sun-dried premium Sharbati wheat grains producing soft, golden rotis. Rich in fiber and natural protein.',
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Fresh Yelakki Bananas',
        category: 'Fruits',
        price: 65,
        unit: 'kg',
        quantityAvailable: 800,
        minimumOrderQuantity: 15,
        farmer: farmer3._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Natural / Hydroponic',
        location: { state: 'Karnataka', city: 'Mysuru' },
        description: 'Sweet, highly fragrant Yelakki (Robusta small) bananas grown naturally in Kaveri river basin farms.',
        images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Organic Salem Turmeric Roots',
        category: 'Spices',
        price: 180,
        unit: 'kg',
        quantityAvailable: 600,
        minimumOrderQuantity: 5,
        farmer: farmer3._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Karnataka', city: 'Mysuru' },
        description: 'High-curcumin organic whole turmeric finger roots. Unpolished and full of natural essential oils.',
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Fiery Guntur S4 Red Chilli',
        category: 'Spices',
        price: 240,
        unit: 'kg',
        quantityAvailable: 1200,
        minimumOrderQuantity: 10,
        farmer: farmer4._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Andhra Pradesh', city: 'Guntur' },
        description: 'Famous Guntur S4 dry red chillies with intense heat and deep crimson color. Sun-dried carefully.',
        images: ['https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Raw Bold Groundnuts',
        category: 'Pulses',
        price: 125,
        unit: 'kg',
        quantityAvailable: 1800,
        minimumOrderQuantity: 20,
        farmer: farmer4._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Andhra Pradesh', city: 'Guntur' },
        description: 'Hand-sorted raw bold groundnuts with high oil content and nutty crunch.',
        images: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Shimla Royal Delicious Apples',
        category: 'Fruits',
        price: 160,
        unit: 'kg',
        quantityAvailable: 1000,
        minimumOrderQuantity: 10,
        farmer: farmer5._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Himachal Pradesh', city: 'Shimla' },
        description: 'Crisp, naturally sweet high-altitude Shimla Royal Delicious apples packed in wooden crates.',
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Alphonso Mangoes (Devgad)',
        category: 'Fruits',
        price: 650,
        unit: 'crate',
        quantityAvailable: 250,
        minimumOrderQuantity: 1,
        farmer: farmer1._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Maharashtra', city: 'Ratnagiri' },
        description: 'GI-tagged authentic Devgad Alphonso mangoes. 1 dozen crate ripened naturally in hay.',
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Organic Desi Cow Milk (Fresh)',
        category: 'Dairy',
        price: 75,
        unit: 'liter',
        quantityAvailable: 200,
        minimumOrderQuantity: 5,
        farmer: farmer3._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Karnataka', city: 'Mysuru' },
        description: 'Pure A2 Gir cow milk pasteurized naturally without preservatives.',
        images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Green Peas (Matar)',
        category: 'Vegetables',
        price: 55,
        unit: 'kg',
        quantityAvailable: 700,
        minimumOrderQuantity: 10,
        farmer: farmer5._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Himachal Pradesh', city: 'Shimla' },
        description: 'Freshly podded sweet green peas from cold hilly slopes.',
        images: ['https://images.unsplash.com/photo-1587411768515-eeac0647deed?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Yellow Toor Dal (Arhar)',
        category: 'Pulses',
        price: 140,
        unit: 'kg',
        quantityAvailable: 2000,
        minimumOrderQuantity: 25,
        farmer: farmer1._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Maharashtra', city: 'Nashik' },
        description: 'Unpolished protein-rich yellow split pigeon peas (Toor dal) processed traditionally.',
        images: ['https://images.unsplash.com/photo-1585994191611-726a884f181d?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Organic Whole Cardamom (Elaichi)',
        category: 'Spices',
        price: 2200,
        unit: 'kg',
        quantityAvailable: 100,
        minimumOrderQuantity: 1,
        farmer: farmer3._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Karnataka', city: 'Mysuru' },
        description: '8mm extra-bold green cardamom pods with intense flavor and rich essential oil content.',
        images: ['https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Fresh Sweet Corn',
        category: 'Vegetables',
        price: 35,
        unit: 'kg',
        quantityAvailable: 1200,
        minimumOrderQuantity: 10,
        farmer: farmer2._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Conventional',
        location: { state: 'Punjab', city: 'Ludhiana' },
        description: 'Tender, high-brix golden sweet corn cobs harvested early in the morning.',
        images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Black Pepper Cones (Kali Mirch)',
        category: 'Spices',
        price: 580,
        unit: 'kg',
        quantityAvailable: 400,
        minimumOrderQuantity: 5,
        farmer: farmer3._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Karnataka', city: 'Mysuru' },
        description: 'Heavy Malabar black pepper whole peppercorns. Pungent and intensely aromatic.',
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Kashmiri Saffron (Kesar)',
        category: 'Spices',
        price: 250000,
        unit: 'kg',
        quantityAvailable: 2,
        minimumOrderQuantity: 0.01,
        farmer: farmer5._id,
        qualityGrade: 'Grade A+',
        farmingMethod: 'Organic',
        location: { state: 'Himachal Pradesh', city: 'Shimla' },
        description: 'Pure Mongra grade Kashmiri saffron threads with deep ruby color and floral honey aroma.',
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Organic Chana Dal',
        category: 'Pulses',
        price: 95,
        unit: 'kg',
        quantityAvailable: 1500,
        minimumOrderQuantity: 20,
        farmer: farmer4._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Andhra Pradesh', city: 'Guntur' },
        description: 'Nutritious unpolished Bengal gram dal harvested from organic rainfed farms.',
        images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=800'],
      },
      {
        name: 'Farm Fresh Garlic Bulbs',
        category: 'Vegetables',
        price: 130,
        unit: 'kg',
        quantityAvailable: 900,
        minimumOrderQuantity: 10,
        farmer: farmer1._id,
        qualityGrade: 'Grade A',
        farmingMethod: 'Organic',
        location: { state: 'Maharashtra', city: 'Nashik' },
        description: 'Solid, white-skinned Ooty/Nashik garlic bulbs with intense pungency and tight cloves.',
        images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=800'],
      },
    ];

    const createdProducts = [];
    for (const p of sampleProducts) {
      const slug = `${slugify(p.name, { lower: true, strict: true })}-${Date.now().toString().slice(-4)}`;
      const prod = await Product.create({
        ...p,
        slug,
        isVerified: true,
        status: 'active',
      });
      createdProducts.push(prod);
    }

    console.log('[Seed] Creating demo orders...');

    // Order 1: Delivered (Main Buyer -> Farmer 1)
    const order1Items = [
      {
        product: createdProducts[0]._id,
        name: createdProducts[0].name,
        image: createdProducts[0].images[0],
        price: createdProducts[0].price,
        unit: createdProducts[0].unit,
        quantity: 20,
        farmer: farmer1._id,
      },
      {
        product: createdProducts[1]._id,
        name: createdProducts[1].name,
        image: createdProducts[1].images[0],
        price: createdProducts[1].price,
        unit: createdProducts[1].unit,
        quantity: 30,
        farmer: farmer1._id,
      },
    ];

    const totals1 = calculateOrderTotals(order1Items);
    const order1 = await Order.create({
      orderNumber: 'AGR-2026-1001',
      buyer: mainBuyer._id,
      farmer: farmer1._id,
      items: order1Items,
      subtotal: totals1.subtotal,
      platformFee: totals1.platformFee,
      deliveryFee: totals1.deliveryFee,
      totalAmount: totals1.totalAmount,
      shippingAddress: {
        name: mainBuyer.name,
        phone: mainBuyer.phone,
        street: mainBuyer.address.street,
        city: mainBuyer.address.city,
        state: mainBuyer.address.state,
        pincode: mainBuyer.address.pincode,
      },
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      statusHistory: [
        { status: 'PLACED', note: 'Order placed by buyer' },
        { status: 'CONFIRMED', note: 'Farmer accepted order' },
        { status: 'DELIVERED', note: 'Delivered safely to Mumbai address' },
      ],
    });

    // Create Review for Order 1
    await Review.create({
      buyer: mainBuyer._id,
      farmer: farmer1._id,
      product: createdProducts[0]._id,
      order: order1._id,
      rating: 5,
      comment: 'Extremely fresh tomatoes! Delivered right from Nashik in sturdy crates. Outstanding direct purchase.',
    });

    // Order 2: Processing (Main Buyer -> Farmer 2)
    const order2Items = [
      {
        product: createdProducts[3]._id,
        name: createdProducts[3].name,
        image: createdProducts[3].images[0],
        price: createdProducts[3].price,
        unit: createdProducts[3].unit,
        quantity: 50,
        farmer: farmer2._id,
      },
    ];
    const totals2 = calculateOrderTotals(order2Items);
    await Order.create({
      orderNumber: 'AGR-2026-1002',
      buyer: mainBuyer._id,
      farmer: farmer2._id,
      items: order2Items,
      subtotal: totals2.subtotal,
      platformFee: totals2.platformFee,
      deliveryFee: totals2.deliveryFee,
      totalAmount: totals2.totalAmount,
      shippingAddress: {
        name: mainBuyer.name,
        phone: mainBuyer.phone,
        street: mainBuyer.address.street,
        city: mainBuyer.address.city,
        state: mainBuyer.address.state,
        pincode: mainBuyer.address.pincode,
      },
      paymentMethod: 'ONLINE',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      statusHistory: [
        { status: 'PLACED', note: 'Order placed by buyer' },
        { status: 'CONFIRMED', note: 'Farmer accepted order' },
        { status: 'PROCESSING', note: 'Basmati rice batch packed in Ludhiana warehouse' },
      ],
    });

    // Seed Notifications
    await Notification.create({
      user: farmer1._id,
      title: 'Order Completed 🎉',
      message: 'Order #AGR-2026-1001 was delivered successfully. Revenue added to account.',
      type: 'order_status',
      link: `/farmer/orders/${order1._id}`,
    });

    await Notification.create({
      user: mainBuyer._id,
      title: 'Order Delivered 🚚',
      message: 'Your order #AGR-2026-1001 has been delivered. Leave a review for Ramesh Patel!',
      type: 'order_status',
      link: `/buyer/orders/${order1._id}`,
    });

    console.log('[Seed] Demo database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS:');
    console.log('Admin:  admin@agrilink.demo  / Password123!');
    console.log('Farmer: farmer@agrilink.demo / Password123!');
    console.log('Buyer:  buyer@agrilink.demo  / Password123!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
