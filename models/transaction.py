from datetime import datetime
from app import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    
    # Transaction details
    transaction_type = db.Column(db.String(20), nullable=False)  # deposit, withdrawal, transfer
    amount = db.Column(db.Float, nullable=False)
    fee = db.Column(db.Float, default=0.0)
    provider = db.Column(db.String(20), nullable=False)  # M-Pesa, Tigo Pesa, Airtel Money, etc.
    reference_number = db.Column(db.String(64), unique=True)
    phone_number = db.Column(db.String(20), nullable=False)
    
    # Status and timestamps
    status = db.Column(db.String(20), default='completed')  # pending, completed, failed
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Additional information
    notes = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Transaction {self.id}: {self.transaction_type} {self.amount}>'
