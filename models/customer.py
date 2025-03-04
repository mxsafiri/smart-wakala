from datetime import datetime
from app import db

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Customer details
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    id_type = db.Column(db.String(20))  # National ID, Voter ID, etc.
    id_number = db.Column(db.String(64))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    transactions = db.relationship('Transaction', backref='customer', lazy='dynamic')
    
    def __repr__(self):
        return f'<Customer {self.id}: {self.first_name} {self.last_name}>'
