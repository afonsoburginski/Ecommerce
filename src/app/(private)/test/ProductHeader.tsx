"use client";

import React from "react";

export default function ProductHeader({ users, selectedUser, handleUserChange }) {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-bold">Selecione um Usuário</h1>
      <select
        onChange={handleUserChange}
        className="border rounded p-2"
        value={selectedUser?.id || ""}
      >
        <option value="">Selecione um usuário</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.email}
          </option>
        ))}
      </select>
    </div>
  );
}
