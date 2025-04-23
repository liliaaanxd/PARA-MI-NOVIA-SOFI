import app from "./app.js";
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js'


export async function SubscriptionToHellfireClub(Subscription) {

const database = getFirestore(app)
const hellfireClubCollection = collection (database, 'hellfire-clube')
const docRef = await addDoc(hellfireClubCollection, Subscription)
return docRef.id
}

