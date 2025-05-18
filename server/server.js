
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

// Azure SQL Server Configuration
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true, // For Azure SQL
    trustServerCertificate: false, // For Azure SQL
    enableArithAbort: true,
    connectTimeout: 30000 // 30 seconds timeout
  }
};

// Test database connection
async function testConnection() {
  let pool;
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server successfully!');
    
    // Create tables if they don't exist
    await createTables();
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (closeErr) {
        console.error('Error closing connection pool in testConnection:', closeErr);
      }
    }
  }
}

// Create tables if they don't exist
async function createTables() {
  let pool;
  try {
    pool = await sql.connect(config);
    
    // Create schema if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dbo')
      BEGIN
        EXEC('CREATE SCHEMA dbo')
      END
    `);
    
    // Check if Registrations table exists
    const tableResult = await pool.request()
      .query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Registrations'`);
    
    // If table doesn't exist, create it
    if (tableResult.recordset.length === 0) {
      console.log('Creating Registrations table...');
      await pool.request().query(`
        CREATE TABLE dbo.Registrations (
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
      console.log('Registrations table created successfully.');
    } else {
      console.log('Registrations table already exists.');
    }

    // Create a Games table to track available games
    const gamesTableResult = await pool.request()
      .query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Games'`);
    
    if (gamesTableResult.recordset.length === 0) {
      console.log('Creating Games table...');
      await pool.request().query(`
        CREATE TABLE dbo.Games (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(100) NOT NULL,
          maxParticipants INT DEFAULT 50,
          currentParticipants INT DEFAULT 0,
          isActive BIT DEFAULT 1
        )
      `);
      
      // Insert default games
      await pool.request().query(`
        INSERT INTO dbo.Games (name) VALUES
        ('Cricket'),
        ('Football'),
        ('Badminton'),
        ('Table Tennis'),
        ('Athletics')
      `);
      console.log('Games table created and populated with default games.');
    } else {
      console.log('Games table already exists.');
    }
    
    // Verify tables by querying them
    try {
      const verifyRegistrations = await pool.request().query('SELECT TOP 1 * FROM dbo.Registrations');
      console.log('Verified Registrations table access.');
    } catch (verifyErr) {
      console.log('Registrations table verification failed:', verifyErr.message);
    }
    
    try {
      const verifyGames = await pool.request().query('SELECT TOP 1 * FROM dbo.Games');
      console.log('Verified Games table access.');
    } catch (verifyErr) {
      console.log('Games table verification failed:', verifyErr.message);
    }
    
    console.log('Database schema setup complete.');
  } catch (err) {
    console.error('Error creating database schema:', err);
    throw err; // Re-throw to be caught by the calling function
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (closeErr) {
        console.error('Error closing connection pool:', closeErr);
      }
    }
  }
}

// API endpoints
app.post('/api/register', async (req, res) => {
  let pool;
  try {
    const { fullName, rollNumber, department, section, gender, games } = req.body;
    
    // Validate required fields
    if (!fullName || !rollNumber || !department || !section || !gender || !games || !Array.isArray(games) || games.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required. Games must be a non-empty array.'
      });
    }
    
    pool = await sql.connect(config);
    
    // Begin a transaction to ensure data consistency
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    
    try {
      // Insert into Registrations table
      const request = new sql.Request(transaction);
      const result = await request
        .input('fullName', sql.NVarChar, fullName)
        .input('rollNumber', sql.NVarChar, rollNumber)
        .input('department', sql.NVarChar, department)
        .input('section', sql.NVarChar, section)
        .input('gender', sql.NVarChar, gender)
        .input('games', sql.NVarChar, JSON.stringify(games))
        .query(`
          INSERT INTO dbo.Registrations (fullName, rollNumber, department, section, gender, games)
          VALUES (@fullName, @rollNumber, @department, @section, @gender, @games);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      const registrationId = result.recordset[0].id;
      
      // Update the count of participants for each game
      // This is an optional enhancement that uses the Games table we created
      for (const game of games) {
        await new sql.Request(transaction)
          .input('gameName', sql.NVarChar, game)
          .query(`
            UPDATE dbo.Games 
            SET currentParticipants = currentParticipants + 1 
            WHERE name = @gameName
          `);
      }
      
      // Commit the transaction
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        registrationId: registrationId
      });
    } catch (transactionErr) {
      // If there's an error, roll back the transaction
      await transaction.rollback();
      throw transactionErr;
    }
  } catch (err) {
    console.error('Error registering participant:', err);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: err.message
    });
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (closeErr) {
        console.error('Error closing connection pool:', closeErr);
      }
    }
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);
    
    // Get registrations with optional filtering
    const result = await pool.request().query(`
      SELECT * FROM dbo.Registrations 
      ORDER BY registrationDate DESC
    `);
    
    res.json({
      success: true,
      count: result.recordset.length,
      registrations: result.recordset
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: err.message
    });
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (closeErr) {
        console.error('Error closing connection pool:', closeErr);
      }
    }
  }
});

// Get games statistics
app.get('/api/games-stats', async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);
    
    // Get statistics about games participation
    const result = await pool.request().query(`
      SELECT name, maxParticipants, currentParticipants, 
        CASE 
          WHEN maxParticipants > 0 THEN 
            CAST((CAST(currentParticipants AS FLOAT) / CAST(maxParticipants AS FLOAT) * 100) AS INT) 
          ELSE 0 
        END AS fillPercentage,
        isActive
      FROM dbo.Games
      ORDER BY name
    `);
    
    res.json({
      success: true,
      count: result.recordset.length,
      games: result.recordset
    });
  } catch (err) {
    console.error('Error fetching games statistics:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch games statistics',
      error: err.message
    });
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (closeErr) {
        console.error('Error closing connection pool:', closeErr);
      }
    }
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
