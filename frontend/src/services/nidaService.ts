// This is a mock implementation for demo purposes
// TODO: Replace with actual NIDA API integration in production

interface NidaUserDetail {
  Nin: string;
  Firstname: string;
  Middlename: string;
  Surname: string;
  Sex: string;
  Dateofbirth: string;
  Nationality: string;
  Phonenumber: string;
}

export const fetchUserByNationalId = async (nationalId: string): Promise<NidaUserDetail> => {
  try {
    // For demo purposes, we'll return mock data
    // In production, this should make an actual API call to NIDA
    console.log('Validating National ID:', nationalId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For testing purposes, we'll accept TEST123456789
    if (nationalId === 'TEST123456789') {
      return {
        Nin: nationalId,
        Firstname: 'John',
        Middlename: 'Demo',
        Surname: 'Doe',
        Sex: 'M',
        Dateofbirth: '1990-01-01',
        Nationality: 'Tanzanian',
        Phonenumber: '+255123456789'
      };
    }
    
    throw new Error('Invalid National ID');
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
