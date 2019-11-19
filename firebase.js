const firebase = require('firebase')

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "algorand-tournament.firebaseapp.com",
  databaseURL: "https://algorand-tournament.firebaseio.com",
  projectId: "algorand-tournament",
  storageBucket: "algorand-tournament.appspot.com",
  messagingSenderId: "283477236370",
  appId: "1:283477236370:web:c7558718f40fabd7cf244b"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const competitionsRef = db.collection('competitions');

async function getCompetitions() {
  let snapshot = await competitionsRef.orderBy('number').get()
  let data = []
  await snapshot.forEach(doc => {
    let docData = doc.data()
    data.push({
      "number": docData.number,
  		"algorandEscrowAddress": docData.algorandEscrowAddress,
  		"isSolved": docData.isSolved,
      "solverName": docData.solverName ? docData.solverName : undefined,
      "solution": docData.solution ? docData.solution : {},
      "solveDate": docData.solveDate ? docData.solveDate : undefined
    })
  })
  return data
}

async function getCompetitionIDByNumber(number) {
  console.log('in getCompetitionIDByNumber, number is', 6);
  let snapshot = await competitionsRef.where('number', '==', parseInt(number)).get()
  let competitionDocID = ""
  if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
  await snapshot.forEach(doc => {
    console.log(doc.id);
    competitionDocID = doc.id
  })
  return competitionDocID
}

async function saveSolutionToDB(number, a, b, c, solverName, solverAlgorandAddress, solverEmail) {
  // console.log('in saveSolutionToDB number:', number, 'a:', a, 'b:', b, 'c:', c, 'solverName:', solverName, 'solverAlgorandAddress:', solverAlgorandAddress, 'solverEmail', solverEmail )
  let competitionDocID = await getCompetitionIDByNumber(number)
  let competitionRef = competitionsRef.doc(competitionDocID)
  competitionRef.update({
    solverName: solverName,
    solverAlgorandAddress: solverAlgorandAddress,
    solverEmail: solverEmail,
    solution: {
      a: a,
      b: b,
      c: c
    }
  })
}

module.exports = { saveSolutionToDB }
