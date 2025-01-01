const db = require('../config/db');

const validateContactFields = (data) => {
    const errors = [];
    if (!data.first_name) errors.push("First name is required.");
    if (!data.last_name) errors.push("Last name is required.");
    if (!data.email) errors.push("Email is required.");
    if (!data.phone) errors.push("Phone number is required.");
    return errors;
};

exports.getContacts = (req, res) => {
    const sql = 'SELECT * FROM contacts';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching contacts:", err.message);
            return res.status(500).json({ error: "Failed to retrieve contacts." });
        }
        res.json(results);
        // console.log("Request URL:", req.url);
        // console.log("Request Method:", req.method);
        // console.log("Request Body:", req.body);
    });
};

exports.createContact = (req, res) => {
    const { first_name, last_name, email, phone, company, job_title } = req.body;

    const errors = validateContactFields(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const checkDuplicateSql = 'SELECT * FROM contacts WHERE email = ? OR phone = ?';
    db.query(checkDuplicateSql, [email, phone], (err, results) => {
        if (err) {
            console.error("Error checking duplicates:", err.message);
            return res.status(500).json({ error: "Failed to validate duplicate entries." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'A contact with this email or phone number already exists.' });
        }

        const sql = 'INSERT INTO contacts (first_name, last_name, email, phone, company, job_title) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [first_name, last_name, email, phone, company, job_title], (err, result) => {
            if (err) {
                console.error("Error inserting contact:", err.message);
                return res.status(500).json({ error: "Failed to add contact." });
            }
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    });
};

exports.updateContact = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, company, job_title } = req.body;

    const errors = validateContactFields(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const checkContactSql = 'SELECT * FROM contacts WHERE id = ?';
    db.query(checkContactSql, [id], (err, results) => {
        if (err) {
            console.error("Error checking contact existence:", err.message);
            return res.status(500).json({ error: "Failed to validate contact existence." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Contact not found." });
        }

        const checkDuplicateSql = 'SELECT * FROM contacts WHERE (email = ? OR phone = ?) AND id != ?';
        db.query(checkDuplicateSql, [email, phone, id], (err, results) => {
            if (err) {
                console.error("Error checking duplicates:", err.message);
                return res.status(500).json({ error: "Failed to validate duplicate entries." });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Another contact with this email or phone number already exists.' });
            }

            const sql = 'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, company = ?, job_title = ? WHERE id = ?';
            db.query(sql, [first_name, last_name, email, phone, company, job_title, id], (err) => {
                if (err) {
                    console.error("Error updating contact:", err.message);
                    return res.status(500).json({ error: "Failed to update contact." });
                }
                res.status(200).json({ message: 'Contact updated successfully' });
            });
        });
    });
};

exports.deleteContact = (req, res) => {
    const { id } = req.params;

    const checkContactSql = 'SELECT * FROM contacts WHERE id = ?';
    db.query(checkContactSql, [id], (err, results) => {
        if (err) {
            console.error("Error checking contact existence:", err.message);
            return res.status(500).json({ error: "Failed to validate contact existence." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Contact not found." });
        }

        const sql = 'DELETE FROM contacts WHERE id = ?';
        db.query(sql, [id], (err) => {
            if (err) {
                console.error("Error deleting contact:", err.message);
                return res.status(500).json({ error: "Failed to delete contact." });
            }
            res.status(200).json({ message: "Contact deleted successfully." });
        });
    });
};

exports.getContactById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM contacts WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching contact:", err.message);
            return res.status(500).json({ error: "Failed to retrieve contact." });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.json(results[0]);
    });
};
