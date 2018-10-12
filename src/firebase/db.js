import { auth, db } from "./firebase";

// User API
export const getOtherUsers = async () => {
  let others = [];
  let snapshot = await db.collection("users").get();
  snapshot.forEach(doc => {
    if (doc.get("uid") !== auth.currentUser.uid) {
      others.push(doc.data());
    }
  });
  return others;
};

export const getMyUser = async () => {
  let snapshot = await db.collection("users").get();
  let data = null;
  snapshot.forEach(doc => {
    if (doc.get("uid") === auth.currentUser.uid) {
      data = doc.data();
    }
  });
  return data;
};

// export const getAllBills = async () => {
//   let bills = [];
//   let snapshot = await db.collection("years/2018/months/October/bills").get();
//   snapshot.forEach(doc => {
//     bills.push(doc.data());
//   });
//   return bills;
// };

export const getAllBills = async () => {
  let bills = [];
  let snapshot = await db.collection("years/2018/months/October/bills").get();
  await Promise.all(
    snapshot.docs.map(async doc => {
      let isPayed = doc.get("isPayed");
      let billDoc = await doc.get("ref").get();
      bills.push({
        isPayed,
        name: billDoc.get("name"),
        mPayment: billDoc.get("mPayment")
      });
      // bills.push(billDoc.data());
    })
  );
  return bills;
};

export const addBill = async (name, value) => {
  let docRef = await db.collection("bills").add({
    name,
    mPayment: parseFloat(value)
  });

  db.collection("years/2018/months/October/bills").add({
    isPayed: false,
    ref: docRef
  });
};
