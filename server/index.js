import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
dotenv.config();

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: "postgres://default:jdufK9cJw6tn@ep-quiet-boat-a2qe39zy.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Patients endpoints
app.get('/api/patients', async (req, res) => {
  try {
    const query = 'SELECT id, name, phone, tckn, created_at FROM patients ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Hasta listesi yüklenirken bir hata oluştu' });
  }
});

app.post('/api/patients', async (req, res) => {
  const { name, phone, tckn } = req.body;
  
  try {
    // Check if TCKN already exists
    const existingPatient = await pool.query('SELECT id FROM patients WHERE tckn = $1', [tckn]);
    if (existingPatient.rows.length > 0) {
      return res.status(400).json({ message: 'Bu TCKN numarası ile kayıtlı bir hasta bulunmaktadır' });
    }

    const query = `
      INSERT INTO patients (name, phone, tckn)
      VALUES ($1, $2, $3)
      RETURNING id, name, phone, tckn, created_at
    `;
    const result = await pool.query(query, [name, phone, tckn]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating patient:', err);
    res.status(500).json({ message: 'Hasta kaydı oluşturulurken bir hata oluştu' });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, tckn } = req.body;
  
  try {
    // Check if TCKN already exists for another patient
    const existingPatient = await pool.query(
      'SELECT id FROM patients WHERE tckn = $1 AND id != $2',
      [tckn, id]
    );
    if (existingPatient.rows.length > 0) {
      return res.status(400).json({ message: 'Bu TCKN numarası ile kayıtlı başka bir hasta bulunmaktadır' });
    }

    const query = `
      UPDATE patients 
      SET name = $1, phone = $2, tckn = $3
      WHERE id = $4
      RETURNING id, name, phone, tckn, created_at
    `;
    const result = await pool.query(query, [name, phone, tckn, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hasta bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'Hasta bilgileri güncellenirken bir hata oluştu' });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First check if patient has any appointments
    const appointmentCheck = await pool.query(
      'SELECT id FROM appointments WHERE patient_id = $1 LIMIT 1',
      [id]
    );
    
    if (appointmentCheck.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Bu hasta kaydı silinemez çünkü randevuları bulunmaktadır. Önce randevuları silmelisiniz.' 
      });
    }

    const query = 'DELETE FROM patients WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hasta bulunamadı' });
    }
    
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).json({ message: 'Hasta kaydı silinirken bir hata oluştu' });
  }
});

app.get('/api/patients/tckn/:tckn', async (req, res) => {
  const { tckn } = req.params;
  
  try {
    const query = 'SELECT id, name, phone, tckn, created_at FROM patients WHERE tckn = $1';
    const result = await pool.query(query, [tckn]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hasta bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ message: 'Hasta bilgileri yüklenirken bir hata oluştu' });
  }
});

// Departments endpoint
app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM departments ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Bölümler yüklenirken bir hata oluştu' });
  }
});

// Appointments endpoints
app.get('/api/appointments', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.status,
        p.name as patient_name,
        d.name as doctor_name,
        dep.name as department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN departments dep ON a.department_id = dep.id
      ORDER BY a.appointment_date DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Randevular yüklenirken bir hata oluştu' });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { patientId, department, appointmentDate } = req.body;
  
  try {
    // First find or create department
    let departmentResult = await pool.query('SELECT id FROM departments WHERE name = $1', [department]);
    let departmentId;

    if (departmentResult.rows.length === 0) {
      // Create new department
      departmentResult = await pool.query('INSERT INTO departments (name) VALUES ($1) RETURNING id', [department]);
    }
    departmentId = departmentResult.rows[0].id;

    // Get or create a doctor for this department
    let doctorResult = await pool.query('SELECT id FROM doctors WHERE department_id = $1 LIMIT 1', [departmentId]);
    let doctorId;

    if (doctorResult.rows.length === 0) {
      // Create a placeholder doctor if none exists
      doctorResult = await pool.query(
        'INSERT INTO doctors (name, department_id, phone, email) VALUES ($1, $2, $3, $4) RETURNING id',
        [`Dr. ${department}`, departmentId, '000-000-0000', `${department.toLowerCase()}@hastane.com`]
      );
    }
    doctorId = doctorResult.rows[0].id;
    
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, department_id, appointment_date, status)
      VALUES ($1, $2, $3, $4, 'Bekliyor')
      RETURNING id
    `;
    
    const result = await pool.query(query, [patientId, doctorId, departmentId, appointmentDate]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Randevu oluşturulurken bir hata oluştu' });
  }
});

app.put('/api/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const query = 'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Randevu bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ message: 'Randevu durumu güncellenirken bir hata oluştu' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'DELETE FROM appointments WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Randevu bulunamadı' });
    }
    
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'Randevu silinirken bir hata oluştu' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});