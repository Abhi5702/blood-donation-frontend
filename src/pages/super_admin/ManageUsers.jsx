import { useEffect, useState } from "react";
import {
  Users, Search, RefreshCw, Shield,
  Trash2, ToggleLeft, ToggleRight, ChevronDown
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const ROLES = ["SUPER_ADMIN","ADMIN","HOSPITAL_STAFF","DONOR"];

const roleVariant = {
  SUPER_ADMIN:    "purple",
  ADMIN:          "blue",
  HOSPITAL_STAFF: "red",
  DONOR:          "green",
};

const Skel = () => (
  <div style={{
    height:64, borderRadius:12,
    background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
    backgroundSize:"200% 100%", animation:"muSkelShim 1.4s infinite", marginBottom:8,
  }} />
);

const ManageUsers = () => {
  const [users,     setUsers]     = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [roleFilter,setRoleFilter]= useState("ALL");
  const [modal,     setModal]     = useState(null); // { type: "role"|"delete"|"verify", user }
  const [newRole,   setNewRole]   = useState("");
  const [acting,    setActing]    = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.ALL_USERS);
      setUsers(res.data.data || []);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  // ── Client-side filter ────────────────────────────────
  useEffect(() => {
    let list = [...users];
    if (roleFilter !== "ALL") list = list.filter(u => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [users, search, roleFilter]);

  // ── Actions ───────────────────────────────────────────
  const handleRoleUpdate = async () => {
    if (!newRole || newRole === modal.user.role) {
      setModal(null); return;
    }
    setActing(true);
    try {
      await axiosInstance.patch(ENDPOINTS.UPDATE_ROLE(modal.user.id), { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally { setActing(false); }
  };

  const handleDelete = async () => {
    setActing(true);
    try {
      await axiosInstance.delete(ENDPOINTS.DELETE_USER(modal.user.id));
      toast.success("User deleted");
      setModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally { setActing(false); }
  };

  const handleToggleVerify = async (user) => {
    try {
      await axiosInstance.patch(ENDPOINTS.TOGGLE_VERIFIED(user.id));
      toast.success(`User ${user.isVerified ? "unverified" : "verified"}`);
      fetch();
    } catch (err) {
      toast.error("Failed to toggle verification");
    }
  };

  const initials = (name) =>
    name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "??";

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes muSkelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin       { to{transform:rotate(360deg)} }

        .mu-page    { font-family:'Outfit',sans-serif; }
        .mu-header  { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .mu-title   { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .mu-title span { color:#7c3aed; }
        .mu-sub     { font-size:12px; color:#9ca3af; margin-top:3px; }
        .mu-refresh { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; border:none; background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .mu-refresh:hover { background:#f5f3ff; border-color:#ddd6fe; color:#7c3aed; }

        /* stat chips */
        .mu-chips { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; animation:fadeUp .32s ease both; }
        .mu-chip  { display:flex; align-items:center; gap:8px; padding:10px 14px; background:#fff; border:1px solid #f3f4f6; border-radius:12px; cursor:pointer; transition:all .15s; }
        .mu-chip:hover  { border-color:#ddd6fe; }
        .mu-chip.active { border-color:#7c3aed; background:#f5f3ff; }
        .mu-chip-num    { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#111; }
        .mu-chip-lbl    { font-size:11px; color:#9ca3af; }

        /* toolbar */
        .mu-toolbar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; animation:fadeUp .34s ease both; }
        .mu-search  { flex:1; min-width:220px; position:relative; }
        .mu-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
        .mu-search input {
          width:100%; padding:10px 12px 10px 38px;
          background:#fff; border:1px solid #e5e7eb; border-radius:10px;
          font-size:13px; font-family:'Outfit',sans-serif; color:#111;
          outline:none; transition:all .15s; box-sizing:border-box;
        }
        .mu-search input::placeholder { color:#9ca3af; }
        .mu-search input:focus { border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.08); }

        /* user row */
        .mu-list  { display:flex; flex-direction:column; gap:8px; }
        .mu-row   {
          display:flex; align-items:center; gap:14px;
          padding:14px 18px; background:#fff;
          border:1px solid #f3f4f6; border-radius:12px;
          transition:all .15s; animation:fadeUp .4s ease both;
        }
        .mu-row:hover { border-color:#ddd6fe; box-shadow:0 2px 10px rgba(124,58,237,0.05); }
        .mu-avatar {
          width:40px; height:40px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#fff;
          overflow:hidden;
        }
        .mu-avatar img { width:100%; height:100%; object-fit:cover; }
        .mu-info    { flex:1; min-width:0; }
        .mu-name    { font-size:13px; font-weight:500; color:#111; }
        .mu-email   { font-size:11px; color:#9ca3af; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .mu-actions { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        .mu-action-btn {
          width:30px; height:30px; border-radius:8px;
          border:1px solid #e5e7eb; background:#f9fafb;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .15s; color:#9ca3af;
        }
        .mu-action-btn:hover.role   { background:#f5f3ff; border-color:#ddd6fe; color:#7c3aed; }
        .mu-action-btn:hover.delete { background:#fef2f2; border-color:#fecaca; color:#dc2626; }
        .mu-verify-btn {
          display:flex; align-items:center; gap:4px;
          padding:5px 10px; border-radius:7px; border:1px solid #e5e7eb;
          background:#f9fafb; font-size:11px; font-weight:500;
          cursor:pointer; font-family:'Outfit',sans-serif; transition:all .15s; color:#6b7280;
        }
        .mu-verify-btn.verified   { background:#f0fdf4; border-color:#bbf7d0; color:#16a34a; }
        .mu-verify-btn.unverified { background:#fef2f2; border-color:#fecaca; color:#dc2626; }
        .mu-verify-btn:hover { opacity:0.8; }

        /* empty */
        .mu-empty { display:flex; flex-direction:column; align-items:center; padding:56px 32px; text-align:center; background:#fff; border:1px dashed #ddd6fe; border-radius:16px; animation:fadeUp .4s ease both; }

        /* modal */
        .mu-modal-form { display:flex; flex-direction:column; gap:14px; }
        .mu-role-select { width:100%; padding:11px 12px; background:#fff; border:1.5px solid #e5e7eb; border-radius:9px; font-size:13px; font-family:'Outfit',sans-serif; color:#111; outline:none; cursor:pointer; box-sizing:border-box; transition:border-color .15s; }
        .mu-role-select:focus { border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.08); }
        .mu-modal-btn { width:100%; padding:12px; border:none; border-radius:9px; font-size:13px; font-weight:500; font-family:'Syne',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .15s; }
        .mu-modal-btn.purple { background:#7c3aed; color:#fff; box-shadow:0 2px 10px rgba(124,58,237,0.25); }
        .mu-modal-btn.purple:hover:not(:disabled) { background:#6d28d9; }
        .mu-modal-btn.red    { background:#dc2626; color:#fff; box-shadow:0 2px 10px rgba(220,38,38,0.25); }
        .mu-modal-btn.red:hover:not(:disabled) { background:#b91c1c; }
        .mu-modal-btn:disabled { opacity:0.6; cursor:not-allowed; }

        .mu-delete-warn { padding:14px 16px; background:#fef2f2; border:1px solid #fecaca; border-radius:10px; font-size:13px; color:#dc2626; display:flex; align-items:flex-start; gap:10px; }
      `}</style>

      <DashboardLayout>
        <div className="mu-page">

          {/* Header */}
          <div className="mu-header">
            <div>
              <div className="mu-title">Manage <span>Users</span></div>
              <div className="mu-sub">View, update roles and manage all platform users</div>
            </div>
            <button className="mu-refresh" onClick={fetch}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Role chips */}
          <div className="mu-chips">
            <div
              className={`mu-chip ${roleFilter === "ALL" ? "active" : ""}`}
              onClick={() => setRoleFilter("ALL")}
            >
              <div style={{ width:28, height:28, borderRadius:8, background:"#f5f3ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Users size={14} color="#7c3aed" />
              </div>
              <div>
                <div className="mu-chip-num">{users.length}</div>
                <div className="mu-chip-lbl">All Users</div>
              </div>
            </div>
            {ROLES.map(r => (
              <div
                key={r}
                className={`mu-chip ${roleFilter === r ? "active" : ""}`}
                onClick={() => setRoleFilter(r)}
              >
                <div>
                  <div className="mu-chip-num">{roleCounts[r] || 0}</div>
                  <div className="mu-chip-lbl">{r.replace("_"," ")}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="mu-toolbar">
            <div className="mu-search">
              <Search size={15} className="mu-search-icon" />
              <input
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* User list */}
          {loading ? (
            <div>{[0,1,2,3,4].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="mu-empty">
              <Users size={28} color="#c4b5fd" style={{ marginBottom:12 }} />
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6 }}>
                No users found
              </div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>
                {search ? `No results for "${search}"` : "No users in this role"}
              </div>
            </div>
          ) : (
            <div className="mu-list">
              {filtered.map((user, i) => (
                <div
                  key={user.id}
                  className="mu-row"
                  style={{ animationDelay:`${i*30}ms` }}
                >
                  {/* Avatar */}
                  <div className="mu-avatar">
                    {user.profileImageUrl
                      ? <img src={user.profileImageUrl} alt={user.fullName} />
                      : initials(user.fullName)
                    }
                  </div>

                  {/* Info */}
                  <div className="mu-info">
                    <div className="mu-name">{user.fullName}</div>
                    <div className="mu-email">{user.email}</div>
                  </div>

                  {/* Role badge */}
                  <Badge
                    label={user.role.replace("_"," ")}
                    variant={roleVariant[user.role] || "gray"}
                  />

                  {/* Verified toggle */}
                  <button
                    className={`mu-verify-btn ${user.isVerified ? "verified" : "unverified"}`}
                    onClick={() => handleToggleVerify(user)}
                    title={user.isVerified ? "Click to unverify" : "Click to verify"}
                  >
                    {user.isVerified
                      ? <><ToggleRight size={13} /> Verified</>
                      : <><ToggleLeft  size={13} /> Unverified</>
                    }
                  </button>

                  {/* Actions */}
                  <div className="mu-actions">
                    {/* Change role */}
                    <button
                      className="mu-action-btn role"
                      title="Change role"
                      onClick={() => { setModal({ type:"role", user }); setNewRole(user.role); }}
                    >
                      <Shield size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      className="mu-action-btn delete"
                      title="Delete user"
                      onClick={() => setModal({ type:"delete", user })}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change Role Modal */}
        <Modal
          isOpen={modal?.type === "role"}
          onClose={() => setModal(null)}
          title="Change User Role"
        >
          <div className="mu-modal-form">
            <div style={{ padding:"12px 14px", background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:10 }}>
              <div style={{ fontSize:13, fontWeight:500, color:"#111" }}>{modal?.user?.fullName}</div>
              <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{modal?.user?.email}</div>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151", marginBottom:7, display:"block" }}>
                New Role
              </label>
              <select
                className="mu-role-select"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r.replace("_"," ")}</option>
                ))}
              </select>
            </div>
            <button
              className="mu-modal-btn purple"
              disabled={acting}
              onClick={handleRoleUpdate}
            >
              {acting
                ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Updating...</>
                : <><Shield size={14} /> Update Role</>
              }
            </button>
          </div>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal
          isOpen={modal?.type === "delete"}
          onClose={() => setModal(null)}
          title="Delete User"
        >
          <div className="mu-modal-form">
            <div className="mu-delete-warn">
              <Trash2 size={16} style={{ flexShrink:0, marginTop:1 }} />
              <div>
                <div style={{ fontWeight:500, marginBottom:3 }}>This action cannot be undone</div>
                <div>
                  Deleting <strong>{modal?.user?.fullName}</strong> will permanently remove their account and all associated data including donor profile, appointments, and requests.
                </div>
              </div>
            </div>
            <button
              className="mu-modal-btn red"
              disabled={acting}
              onClick={handleDelete}
            >
              {acting
                ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Deleting...</>
                : <><Trash2 size={14} /> Delete User Permanently</>
              }
            </button>
          </div>
        </Modal>

      </DashboardLayout>
    </>
  );
};

export default ManageUsers;