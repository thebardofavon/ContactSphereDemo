import axios from "axios";

const BASE_URL = "http://localhost:5000/contacts";

export const fetchContacts = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addContact = async (contact) => {
  await axios.post(BASE_URL, contact);
};

export const deleteContact = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getContactById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch contact");
  return response.json();
};

export const updateContact = async (id, contactData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  if (!response.ok) throw new Error("Failed to update contact");
  return response.json();
};
