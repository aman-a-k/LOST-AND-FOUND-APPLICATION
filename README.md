# Sahyadri College Lost & Found System

A web application for managing lost and found items at Sahyadri College of Engineering and Management.

## Features

- Report lost items
- Report found items
- User authentication (students, faculty, and admin roles)
- Email notifications for item matches
- Dashboard for administrators
- Automated escalation system for unclaimed items
- Image upload support
- Mobile-responsive design

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lost-and-found-application
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

3. Install required packages:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env
```
Edit the `.env` file and update the following variables:
- `SECRET_KEY`: A secure random string
- `MAIL_USERNAME`: Your email address
- `MAIL_PASSWORD`: Your email app-specific password

5. Initialize the database:
```bash
flask db upgrade
```

## Running the Application

1. Start the Flask development server:
```bash
python run.py
```

2. Access the application at `http://localhost:5000`

## Usage

### For Students
1. Register an account using your college email
2. Use "Report Lost Item" to report items you've lost
3. Use "Report Found Item" to report items you've found
4. Receive email notifications when matching items are found

### For Administrators
1. Log in with admin credentials
2. Access the dashboard to view all lost and found items
3. Process item returns and verify claims
4. Monitor escalated items

## Email Notifications

The system sends email notifications for:
- Potential matches between lost and found items
- Item claim confirmations
- Escalations for unclaimed items (after 7 days)

## Directory Structure

```
backend/
├── app/
│   ├── models/
│   │   ├── item.py
│   │   └── user.py
│   ├── routes/
│   │   ├── auth.py
│   │   └── main.py
│   ├── static/
│   │   ├── css/
│   │   └── uploads/
│   ├── templates/
│   │   ├── auth/
│   │   └── ...
│   ├── utils/
│   │   ├── email.py
│   │   └── tasks.py
│   └── __init__.py
├── config.py
├── requirements.txt
└── run.py
```

## Security Considerations

- All passwords are hashed before storage
- File uploads are validated and restricted
- CSRF protection is enabled
- User roles control access to sensitive functions
- Email notifications use TLS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Contact

For support or queries, contact:
- Email: aman.kekkar@gmail.com

## License

This project is licensed under the MIT License.