
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
  "projectId": "studio-3316398508-b2fcd",
  "appId": "1:19824187978:web:42dd808527776e6e7364b3",
  "storageBucket": "studio-3316398508-b2fcd.firebasestorage.app",
  "apiKey": "AIzaSyBWg91oUgyRNCVQKa3EwKnuSLtT3Htng4w",
  "authDomain": "studio-3316398508-b2fcd.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "19824187978"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dummyTrips = [
  {
    "tripId": "t001",
    "userId": "u001",
    "startTime": new Date("2025-09-12T07:30").getTime(),
    "endTime": new Date("2025-09-12T07:55").getTime(),
    "startLocation": "Kochi",
    "endLocation": "Ernakulam",
    "mode": "public transport",
    "purpose": "work",
    "coTravellers": 0,
    "distance": 3.0
  },
  {
    "tripId": "t002",
    "userId": "u002",
    "startTime": new Date("2025-09-12T08:10").getTime(),
    "endTime": new Date("2025-09-12T08:25").getTime(),
    "startLocation": "Vyttila",
    "endLocation": "Kaloor",
    "mode": "car",
    "purpose": "school",
    "coTravellers": 1,
    "distance": 4.0
  },
  {
    "tripId": "t003",
    "userId": "u003",
    "startTime": new Date("2025-09-12T09:00").getTime(),
    "endTime": new Date("2025-09-12T09:20").getTime(),
    "startLocation": "Aluva",
    "endLocation": "Edappally",
    "mode": "bike",
    "purpose": "shopping",
    "coTravellers": 2,
    "distance": 2.5
  },
  {
    "tripId": "t004",
    "userId": "u004",
    "startTime": new Date("2025-09-12T10:15").getTime(),
    "endTime": new Date("2025-09-12T10:45").getTime(),
    "startLocation": "Palarivattom",
    "endLocation": "Infopark",
    "mode": "bike",
    "purpose": "leisure",
    "coTravellers": 0,
    "distance": 5.0
  },
  {
    "tripId": "t005",
    "userId": "u005",
    "startTime": new Date("2025-09-12T11:00").getTime(),
    "endTime": new Date("2025-09-12T11:20").getTime(),
    "startLocation": "Tripunithura",
    "endLocation": "M.G. Road",
    "mode": "public transport",
    "purpose": "work",
    "coTravellers": 0,
    "distance": 8.0
  },
  {
    "tripId": "t006",
    "userId": "u001",
    "startTime": new Date("2025-09-13T18:00").getTime(),
    "endTime": new Date("2025-09-13T18:45").getTime(),
    "startLocation": "Kakkanad",
    "endLocation": "Lulu Mall",
    "mode": "car",
    "purpose": "shopping",
    "coTravellers": 3,
    "distance": 7.0
  },
  {
    "tripId": "t007",
    "userId": "u002",
    "startTime": new Date("2025-09-13T19:00").getTime(),
    "endTime": new Date("2025-09-13T19:30").getTime(),
    "startLocation": "Marine Drive",
    "endLocation": "Fort Kochi",
    "mode": "public transport",
    "purpose": "leisure",
    "coTravellers": 1,
    "distance": 9.0
  },
  {
    "tripId": "t008",
    "userId": "u003",
    "startTime": new Date("2025-09-14T09:30").getTime(),
    "endTime": new Date("2025-09-14T09:45").getTime(),
    "startLocation": "Edappally",
    "endLocation": "Amrita Hospital",
    "mode": "bike",
    "purpose": "work",
    "coTravellers": 0,
    "distance": 2.0
  },
  {
    "tripId": "t009",
    "userId": "u004",
    "startTime": new Date("2025-09-14T14:00").getTime(),
    "endTime": new
Date("2025-09-14T14:20").getTime(),
    "startLocation": "Kaloor",
    "endLocation": "Centre Square Mall",
    "mode": "car",
    "purpose": "leisure",
    "coTravellers": 2,
    "distance": 1.5
  },
  {
    "tripId": "t010",
    "userId": "u005",
    "startTime": new Date("2025-09-15T08:00").getTime(),
    "endTime": new Date("2025-09-15T08:30").getTime(),
    "startLocation": "Vyttila Hub",
    "endLocation": "Infopark",
    "mode": "public transport",
    "purpose": "work",
    "coTravellers": 0,
    "distance": 11.0
  }
];

async function seedDatabase() {
  const tripsCollection = collection(db, 'trips');
  console.log('Seeding database...');
  for (const trip of dummyTrips) {
    try {
      await addDoc(tripsCollection, trip);
      console.log(`Added trip ${trip.tripId}`);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  console.log('Seeding complete.');
}

seedDatabase();
