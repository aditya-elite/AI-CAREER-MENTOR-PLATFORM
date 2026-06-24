import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

let dbConnected = false;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OFFLINE_DATA_DIR = path.join(__dirname, 'data');
const OFFLINE_USERS_PATH = path.join(OFFLINE_DATA_DIR, 'offline-users.json');

async function readOfflineUsers() {
  try {
    const raw = await readFile(OFFLINE_USERS_PATH, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOfflineUsers(users) {
  await mkdir(OFFLINE_DATA_DIR, { recursive: true });
  await writeFile(OFFLINE_USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
}

function toFrontendUser(userRow, token) {
  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    profile: {
      skills: userRow.skills || [],
      learningSkills: userRow.learning_skills || [],
      nonTechnicalSkills: userRow.non_technical_skills || [],
      age: userRow.age ?? "",
      qualification: userRow.qualification || "",
      hasDegree: userRow.has_degree ?? null,
      workTypePreference: userRow.work_type_preference || "",
      jobTypePreference: userRow.job_type_preference || "",
      education: userRow.education || "",
      institution: userRow.institution || "",
      interests: userRow.interests || "",
      projects: userRow.projects || "",
      resumeText: userRow.resume_text || "",
      resumeOverview: userRow.resume_overview || ""
    },
    joinedAt: userRow.created_at,
    token,
    xp: 0,
    badges: []
  };
}

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'careerforge',
  password: process.env.DB_PASSWORD || 'password', // Put the actual password in a .env
  port: Number(process.env.DB_PORT) || 5432,
});

// Suppress pool connection errors since we handle them in initializeDatabase
pool.on('error', (err) => {
  // Don't log connection errors as they're expected in offline mode
  if (!dbConnected) {
    // Silently ignore errors when offline
  } else {
    console.error('Unexpected pool error:', err);
  }
});

// Try to connect to database, but don't block server startup
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        skills TEXT[] DEFAULT '{}',
        learning_skills TEXT[] DEFAULT '{}',
        non_technical_skills TEXT[] DEFAULT '{}',
        age INT,
        qualification TEXT,
        has_degree BOOLEAN,
        work_type_preference TEXT,
        job_type_preference TEXT,
        education TEXT,
        interests TEXT,
        projects TEXT,
        resume_text TEXT,
        resume_overview TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS learning_skills TEXT[] DEFAULT '{}'`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS non_technical_skills TEXT[] DEFAULT '{}'`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS qualification TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_degree BOOLEAN`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS work_type_preference TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS job_type_preference TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS institution TEXT`);
    console.log('Database connected and users table verified.');
    dbConnected = true;
    client.release();
  } catch (err) {
    console.warn('Database not available - running in offline mode. Error:', err.message);
    dbConnected = false;
  }
};

initializeDatabase();

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, age, qualification, hasDegree, workTypePreference, jobTypePreference } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!dbConnected) {
      const users = await readOfflineUsers();
      const exists = users.some((u) => (u.email || '').toLowerCase() === (email || '').toLowerCase());
      if (exists) return res.status(400).json({ error: 'User already exists' });

      const now = new Date().toISOString();
      const nextId = users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1;
      const row = {
        id: nextId,
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        skills: [],
        learning_skills: [],
        non_technical_skills: [],
        age: Number.isFinite(Number(age)) ? Number(age) : null,
        qualification: qualification || "",
        has_degree: typeof hasDegree === "boolean" ? hasDegree : null,
        work_type_preference: workTypePreference || "",
        job_type_preference: jobTypePreference || "",
        education: "",
        institution: "",
        interests: "",
        projects: "",
        resume_text: "",
        resume_overview: "",
        created_at: now
      };
      users.push(row);
      await writeOfflineUsers(users);

      const token = jwt.sign({ id: row.id, role: row.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
      return res.json({ user: toFrontendUser(row, token), token, offline: true });
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role, age, qualification, has_degree, work_type_preference, job_type_preference) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, email, role, skills, learning_skills, non_technical_skills, age, qualification, has_degree, work_type_preference, job_type_preference, education, institution, interests, projects, resume_text, resume_overview, created_at',
      [
        name,
        email,
        hashedPassword,
        role || 'user',
        Number.isFinite(Number(age)) ? Number(age) : null,
        qualification || "",
        typeof hasDegree === "boolean" ? hasDegree : null,
        workTypePreference || "",
        jobTypePreference || ""
      ]
    );

    const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    return res.json({ user: toFrontendUser(newUser.rows[0], token), token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!dbConnected) {
      const users = await readOfflineUsers();
      const user = users.find((u) => (u.email || '').toLowerCase() === (email || '').toLowerCase());
      if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
      return res.json({ user: toFrontendUser(user, token), token, offline: true });
    }

    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    return res.json({ user: toFrontendUser(user, token), token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/profile/update', async (req, res) => {
  try {
    const {
      email, skills, learningSkills, nonTechnicalSkills,
      age, qualification, hasDegree, workTypePreference, jobTypePreference,
      education, institution, interests, projects, resumeText, resumeOverview
    } = req.body;

    if (!dbConnected) {
      const users = await readOfflineUsers();
      const idx = users.findIndex((u) => (u.email || '').toLowerCase() === (email || '').toLowerCase());
      if (idx === -1) return res.status(404).json({ error: 'User not found' });

      users[idx] = {
        ...users[idx],
        skills: skills || [],
        learning_skills: learningSkills || [],
        non_technical_skills: nonTechnicalSkills || [],
        age: Number.isFinite(Number(age)) ? Number(age) : null,
        qualification: qualification ?? "",
        has_degree: typeof hasDegree === "boolean" ? hasDegree : null,
        work_type_preference: workTypePreference ?? "",
        job_type_preference: jobTypePreference ?? "",
        education: education ?? "",
        institution: institution ?? "",
        interests: interests ?? "",
        projects: projects ?? "",
        resume_text: resumeText ?? "",
        resume_overview: resumeOverview ?? ""
      };
      await writeOfflineUsers(users);
      return res.json({ success: true, offline: true });
    }

    await pool.query(
      'UPDATE users SET skills = $1, learning_skills = $2, non_technical_skills = $3, age = $4, qualification = $5, has_degree = $6, work_type_preference = $7, job_type_preference = $8, education = $9, institution = $10, interests = $11, projects = $12, resume_text = $13, resume_overview = $14 WHERE email = $15',
      [
        skills,
        learningSkills || [],
        nonTechnicalSkills || [],
        Number.isFinite(Number(age)) ? Number(age) : null,
        qualification,
        typeof hasDegree === "boolean" ? hasDegree : null,
        workTypePreference,
        jobTypePreference,
        education,
        institution,
        interests,
        projects,
        resumeText,
        resumeOverview,
        email
      ]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
