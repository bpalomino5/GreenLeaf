import { auth, db, dbTools } from "./firebase";

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

export const getAllBills = async (year = "", month = "") => {
  if (year === "" || month === "") {
    let date = new Date();
    year = date.toLocaleString("en-us", { year: "numeric" });
    month = date.toLocaleString("en-us", { month: "long" });
  }

  let bills = [];

  let docRef = db.collection(`years/${year}/months`).doc(month);
  let doc = await docRef.get();
  if (doc.exists) {
    await Promise.all(
      doc.get("bills").map(async item => {
        let mainDoc = await item.ref.get();
        bills.push({
          ref: item.ref,
          amountPayed: item.amountPayed,
          isPayed: item.isPayed,
          url: mainDoc.get("url"),
          paymentType: mainDoc.get("paymentType"),
          due: mainDoc.get("due"),
          username: mainDoc.get("username"),
          password: mainDoc.get("password"),
          notes: mainDoc.get("notes"),
          name: mainDoc.get("name"),
          mPayment: mainDoc.get("mPayment")
        });
      })
    );
  } else {
    // no local bill set created for that month and year
    // create new local set of bills from master set
    let localBills = [];
    let snapshot = await db.collection("bills").get();
    snapshot.forEach(doc => {
      localBills.push({
        isPayed: false,
        amountPayed: 0,
        ref: doc.ref
      });

      bills.push({
        isPayed: false,
        amountPayed: 0,
        ref: doc.ref,
        url: doc.get("url"),
        paymentType: doc.get("paymentType"),
        due: doc.get("due"),
        username: doc.get("username"),
        password: doc.get("password"),
        notes: doc.get("notes"),
        name: doc.get("name"),
        mPayment: doc.get("mPayment")
      });
    });

    await db
      .collection(`years/${year}/months`)
      .doc(month)
      .set(
        {
          bills: localBills
        },
        { merge: true }
      );
  }
  return bills;
};

export const updateMasterBills = async bills => {
  await Promise.all(
    bills.map(async bill => {
      await bill.ref.update({
        name: bill.name,
        due: bill.due,
        paymentType: bill.paymentType,
        url: bill.url,
        username: bill.username,
        password: bill.password,
        notes: bill.notes
      });
    })
  );
};

export const updateCurrentBills = async (bills, year, month) => {
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

export const addBill = async (billItem, year, month) => {
  let docRef = await db.collection("bills").add({
    name: billItem.name,
    mPayment: parseFloat(billItem.mPayment),
    due: billItem.due,
    url: billItem.url,
    username: billItem.username,
    password: billItem.password,
    notes: billItem.notes,
    paymentType: billItem.paymentType
  });

  await db
    .collection(`years/${year}/months`)
    .doc(month)
    .set(
      {
        bills: dbTools.arrayUnion({
          isPayed: false,
          amountPayed: 0,
          ref: docRef
        })
      },
      { merge: true }
    );
};
