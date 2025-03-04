import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface OverdraftData {
  currentBalance: number;
  limit: number;
  repaymentPercentage: number;
  totalRepaid: number;
  collateralAmount: number;
  startDate: Timestamp;
  lastRepaymentDate?: Timestamp;
}

export const getOverdraftData = async (userId: string): Promise<OverdraftData | null> => {
  try {
    const overdraftDoc = await getDoc(doc(db, 'overdrafts', userId));
    
    if (overdraftDoc.exists()) {
      return overdraftDoc.data() as OverdraftData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting overdraft data:', error);
    throw error;
  }
};

export const getRepaymentHistory = async (userId: string, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'repayments'),
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
    console.error('Error getting repayment history:', error);
    throw error;
  }
};

export const calculateRepaymentProgress = (overdraftData: OverdraftData) => {
  if (!overdraftData || overdraftData.limit === 0) {
    return 0;
  }
  
  const totalAmount = overdraftData.currentBalance + overdraftData.totalRepaid;
  const repaidPercentage = (overdraftData.totalRepaid / totalAmount) * 100;
  
  return Math.min(repaidPercentage, 100);
};
