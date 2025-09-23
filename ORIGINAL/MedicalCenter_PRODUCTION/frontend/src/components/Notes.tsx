import React, { useState, useEffect } from "react";

interface Note { _id?: string; title: string; content: string; createdAt?: string; }

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<Note>({ title: "", content: "" });

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => { if (data.ok) setNotes(data.notes); });
  }, []);

  const addNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    const data = await res.json();
    if (data.ok) {
      setNotes([data.note, ...notes]);
      setNewNote({ title: "", content: "" });
    }
  };

  const updateNote = async (id: string, updated: Partial<Note>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    if (data.ok) setNotes(notes.map((n) => (n._id === id ? data.note : n)));
  };

  const deleteNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) setNotes(notes.filter((n) => n._id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 الملاحظات</h2>
      <div style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="العنوان" value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
        <textarea placeholder="المحتوى" value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} />
        <button onClick={addNote}>➕ إضافة</button>
      </div>
      {notes.map((note) => (
        <div key={note._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <small>📅 {note.createdAt?.slice(0, 10)}</small>
          <div>
            <button onClick={() => updateNote(note._id!, { title: note.title + " (معدل)" })}>✏️ تعديل</button>
            <button onClick={() => deleteNote(note._id!)}>🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}
