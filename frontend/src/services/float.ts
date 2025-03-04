import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getOverdraftData } from './overdraft';

export interface FloatTopUp {
  amount: number;
  provider: string;
  reference?: string;
  notes?: string;
}

export const getFloatBalance = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.floatBalance || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting float balance:', error);
    throw error;
  }
};

export const getFloatTransactions = async (userId: string, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'floatTransactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting float transactions:', error);
    throw error;
  }
};

export const topUpFloat = async (userId: string, topUpData: FloatTopUp) => {
  try {
    // Get current overdraft data
    const overdraftData = await getOverdraftData(userId);
    
    // Calculate repayment amount (if there's an outstanding overdraft)
    let repaymentAmount = 0;
    if (overdraftData && overdraftData.currentBalance > 0) {
      repaymentAmount = topUpData.amount * (overdraftData.repaymentPercentage / 100);
      
      // Cap repayment at the outstanding balance
      if (repaymentAmount > overdraftData.currentBalance) {
        repaymentAmount = overdraftData.currentBalance;
      }
    }
    
    // Calculate actual float amount after repayment deduction
    const actualFloatAmount = topUpData.amount - repaymentAmount;
    
    // Create transaction record
    const transactionRef = await addDoc(collection(db, 'floatTransactions'), {
      userId,
      amount: topUpData.amount,
      actualFloatAmount,
      repaymentAmount,
      provider: topUpData.provider,
      reference: topUpData.reference || '',
      notes: topUpData.notes || '',
      status: 'completed',
      timestamp: serverTimestamp(),
    });
    
    // Update user's float balance
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentBalance = userDoc.data().floatBalance || 0;
      await updateDoc(userRef, {
        floatBalance: currentBalance + actualFloatAmount,
        lastUpdated: serverTimestamp()
      });
    } else {
      throw new Error('User document not found');
    }
    
    // Update overdraft balance if repayment was made
    if (repaymentAmount > 0 && overdraftData) {
      const overdraftRef = doc(db, 'overdrafts', userId);
      await updateDoc(overdraftRef, {
        currentBalance: overdraftData.currentBalance - repaymentAmount,
        totalRepaid: (overdraftData.totalRepaid || 0) + repaymentAmount,
        lastRepaymentDate: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      
      // Add repayment record
      await addDoc(collection(db, 'repayments'), {
        userId,
        amount: repaymentAmount,
        source: 'float-top-up',
        transactionId: transactionRef.id,
        timestamp: serverTimestamp()
      });
    }
    
    return {
      transactionId: transactionRef.id,
      topUpAmount: topUpData.amount,
      actualFloatAmount,
      repaymentAmount
    };
  } catch (error) {
    console.error('Error topping up float:', error);
    throw error;
  }
};
