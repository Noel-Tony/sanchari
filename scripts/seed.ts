
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "TODO: Add your API key",
  authDomain: "TODO: Add your auth domain",
  projectId: "TODO: Add your project ID",
  storageBucket: "TODO: Add your storage bucket",
  messagingSenderId: "TODO: Add your messaging sender ID",
  appId: "TODO: Add your app ID",
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
