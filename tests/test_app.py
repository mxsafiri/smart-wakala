import unittest
from app import app, db
from models.user import User
from models.transaction import Transaction
from models.customer import Customer

class SmartWakalaTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
            
    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_index_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Smart Wakala', response.data)
    
    def test_login_page(self):
        response = self.app.get('/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sign in to your Smart Wakala account', response.data)
    
    def test_user_model(self):
        with app.app_context():
            user = User(username='testuser', email='test@example.com')
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            
            user_from_db = User.query.filter_by(username='testuser').first()
            self.assertIsNotNone(user_from_db)
            self.assertEqual(user_from_db.email, 'test@example.com')
            self.assertTrue(user_from_db.check_password('password123'))
            self.assertFalse(user_from_db.check_password('wrongpassword'))
    
    def test_transaction_model(self):
        with app.app_context():
            user = User(username='testuser', email='test@example.com')
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            
            transaction = Transaction(
                user_id=user.id,
                transaction_type='deposit',
                amount=50000,
                provider='M-Pesa',
                reference_number='MP12345',
                phone_number='+255712345678'
            )
            db.session.add(transaction)
            db.session.commit()
            
            transaction_from_db = Transaction.query.filter_by(reference_number='MP12345').first()
            self.assertIsNotNone(transaction_from_db)
            self.assertEqual(transaction_from_db.amount, 50000)
            self.assertEqual(transaction_from_db.provider, 'M-Pesa')

if __name__ == '__main__':
    unittest.main()
