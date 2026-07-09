import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, Users, User } from 'lucide-react';

export const UsersPanel = ({ users, loading, onBlockUser }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filtered = users.filter((u) => {
    const matchRole = roleFilter ? u.role === roleFilter : true;
    const matchSearch = search
      ? u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Customers</h2>
          <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            {filtered.length} of {users.length} users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.25rem', width: '210px' }}
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }} />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ background: 'var(--color-surface-container-lowest)', overflow: 'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16" style={{ color: 'var(--color-on-surface-variant)' }}>
            <div className="spinner mr-3" /> Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={40} />
            <h3>No Users Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 flex items-center justify-center flex-shrink-0 overflow-hidden"
                          style={{
                            background: user.role === 'admin' ? 'var(--color-primary-fixed)' : 'var(--color-surface-container)',
                            borderRadius: 'var(--radius-full)',
                            color: user.role === 'admin' ? 'var(--color-primary-dark)' : 'var(--color-on-surface-variant)',
                          }}
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} />
                          )}
                        </div>
                        <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                          {user.name || user.fullName || '—'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{user.email}</span>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
                          : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => onBlockUser(user._id, user.isBlocked)}
                          className="flex items-center gap-1.5 btn btn-sm"
                          style={{
                            background: user.isBlocked ? 'var(--color-success-container)' : 'var(--color-error-container)',
                            color: user.isBlocked ? 'var(--color-success)' : 'var(--color-error)',
                            border: 'none',
                            padding: '0.375rem 0.75rem',
                          }}
                        >
                          {user.isBlocked
                            ? <><ShieldOff size={12} /> Unblock</>
                            : <><Shield size={12} /> Block</>}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPanel;
