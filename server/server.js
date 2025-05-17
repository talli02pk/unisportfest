
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQL Server Configuration
const config = {
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || 'yourStrong(!)Password',
  server: process.env.SQL_SERVER || 'localhost',
  database: process.env.SQL_DATABASE || 'SportsFestDB',
  options: {
    encrypt: true, // Use this if you're on Azure
    trustServerCertificate: true // Use this for local dev / self-signed certs
  }
};

// Test database connection
async function testConnection() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server successfully!');
    
    // Create tables if they don't exist
    await createTables();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

// Create tables if they don't exist
async function createTables() {
  try {
    await sql.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Registrations' AND xtype='U')
      CREATE TABLE Registrations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fullName NVARCHAR(255) NOT NULL,
        rollNumber NVARCHAR(50) NOT NULL,
        department NVARCHAR(100) NOT NULL,
        section NVARCHAR(50) NOT NULL,
        gender NVARCHAR(20) NOT NULL,
        games NVARCHAR(MAX) NOT NULL,
        registrationDate DATETIME DEFAULT GETDATE()
      )
    `);
    console.log('Database tables verified/created.');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

// API endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, rollNumber, department, section, gender, games } = req.body;
    
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('rollNumber', sql.NVarChar, rollNumber)
      .input('department', sql.NVarChar, department)
      .input('section', sql.NVarChar, section)
      .input('gender', sql.NVarChar, gender)
      .input('games', sql.NVarChar, JSON.stringify(games))
      .query(`
        INSERT INTO Registrations (fullName, rollNumber, department, section, gender, games)
        VALUES (@fullName, @rollNumber, @department, @section, @gender, @games);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      id: result.recordset[0].id
    });
  } catch (err) {
    console.error('Error registering participant:', err);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: err.message
    });
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Registrations');
    
    res.json({
      success: true,
      registrations: result.recordset
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: err.message
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  testConnection();
});
