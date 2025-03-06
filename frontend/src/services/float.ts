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
import { FloatTransaction } from '../store/slices/floatSlice';

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

export const getFloatTransactions = async (userId: string, limitCount = 10): Promise<FloatTransaction[]> => {
  try {
    const q = query(
      collection(db, 'floatTransactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Mock data if no transactions exist yet
    if (querySnapshot.empty) {
      return Array(3).fill(null).map((_, index) => ({
        id: `mock-${index}`,
        amount: 50000 * (index + 1),
        timestamp: Date.now() - (index * 86400000),
        provider: ['Vodacom', 'Airtel', 'Tigo'][index % 3],
        status: 'completed' as const,
        repaymentAmount: 5000 * (index + 1),
        type: 'top-up' as const,
        date: new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0],
        description: `Float top-up transaction #${index + 1}`
      }));
    }
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount || 0,
        timestamp: data.timestamp?.toMillis() || Date.now(),
        provider: data.provider || 'Unknown',
        status: data.status || 'completed',
        repaymentAmount: data.repaymentAmount || 0,
        type: data.type || 'top-up',
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description || 'Float transaction'
      } as FloatTransaction;
    });
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
