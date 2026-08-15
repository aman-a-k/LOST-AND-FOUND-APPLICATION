from datetime import datetime
from .. import db

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='lost')  # lost, found, claimed, returned
    location = db.Column(db.String(100))
    image_path = db.Column(db.String(200))
    
    # Timestamps
    date_reported = db.Column(db.DateTime, default=datetime.utcnow)
    date_lost = db.Column(db.DateTime)
    date_found = db.Column(db.DateTime)
    date_claimed = db.Column(db.DateTime)
    
    # Relationships
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    finder_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    claimed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Additional fields for specific items
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    color = db.Column(db.String(30))
    identifying_features = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Item {self.name} - {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'status': self.status,
            'location': self.location,
            'date_reported': self.date_reported.isoformat() if self.date_reported else None,
            'date_lost': self.date_lost.isoformat() if self.date_lost else None,
            'date_found': self.date_found.isoformat() if self.date_found else None,
            'image_path': self.image_path
        }