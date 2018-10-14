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

export const getAllBills = async () => {
  let date = new Date();
  let year = date.toLocaleString("en-us", { year: "numeric" });
  let month = date.toLocaleString("en-us", { month: "long" });

  let bills = [];

  let doc = await db
    .collection(`years/${year}/months`)
    .doc(month)
    .get();
  if (doc.exists) {
    await Promise.all(
      doc.get("bills").map(async item => {
        let mainDoc = await item.ref.get();
        bills.push({
          ref: item.ref,
          amountPayed: item.amountPayed,
          isPayed: item.isPayed,
          name: mainDoc.get("name"),
          mPayment: mainDoc.get("mPayment")
        });
      })
    );
    return bills;
  }
};

export const updateMasterBill = async (bills, index) => {
  await bills[index].ref.update({ name: bills[index].name });
};

export const updateCurrentBills = async bills => {
  let date = new Date();
  let year = date.toLocaleString("en-us", { year: "numeric" });
  let month = date.toLocaleString("en-us", { month: "long" });

  let currentBills = [];
  bills.forEach(bill =>
    currentBills.push({
      isPayed: bill.isPayed,
      amountPayed: bill.amountPayed,
      ref: bill.ref
    })
  );

  await db
    .collection(`years/${year}/months`)
    .doc(month)
    .update({ bills: currentBills });
};

// let snapshot = await db
//   .collection(`years/${year}/months/${month}/bills`)
//   .get();
// await Promise.all(
//   snapshot.docs.map(async doc => {
//     let isPayed = doc.get("isPayed");
//     let billDoc = await doc.get("ref").get();
//     bills.push({
//       isPayed,
//       name: billDoc.get("name"),
//       mPayment: billDoc.get("mPayment")
//     });
//     // bills.push(billDoc.data());
//   })
// );
// return bills;

export const addBill = async (name, value) => {
  let docRef = await db.collection("bills").add({
    name,
    mPayment: parseFloat(value)
  });

  let date = new Date();
  let year = date.toLocaleString("en-us", { year: "numeric" });
  let month = date.toLocaleString("en-us", { month: "long" });

  db.collection(`years/${year}/months/${month}/bills`).add({
    isPayed: false,
    ref: docRef
  });
};
