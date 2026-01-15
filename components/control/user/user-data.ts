// app/control/user/user-data.ts

// 1) DTO đúng theo API của bạn (/api/users, /api/users/:id)
export type StaffDto = {
  _id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  roles: string[];
  address?: any[];
  createdAt?: string;
  updatedAt?: string;
};

// 2) Model cho UI table (giữ đúng shape bạn đang render)
export interface UserRow {
  id: string;          // dùng _id từ DB
  name: string;        // firstname + lastname
  email: string;
  role: "Admin" | "Staff" | "Customer";
  department: string;  // hiện API chưa có -> tạm "—" hoặc map từ schema nếu bạn có
  status: string;      // hiện API chưa có -> tạm "Active"
  lastActive: string;  // hiện API chưa có -> tạm "—"
  avatar: string;      // hiện API chưa có -> tạm ""
}

// 3) Helpers: map roles[] -> role label
export function getPrimaryRoleLabel(roles: string[] | undefined): UserRow["role"] {
  const r = (roles || []).map((x) => String(x).toLowerCase());
  if (r.includes("admin")) return "Admin";
  if (r.includes("staff")) return "Staff";
  if (r.includes("customer")) return "Customer";
  return "Customer";
}

// 4) Helpers: build full name
export function getFullName(u: StaffDto): string {
  const fn = (u.firstname || "").trim();
  const ln = (u.lastname || "").trim();
  const full = `${fn} ${ln}`.trim();
  return full || u.email;
}

// 5) Convert API -> UI row
export function mapStaffToUserRow(u: StaffDto): UserRow {
  return {
    id: u._id,
    name: getFullName(u),
    email: u.email,
    role: getPrimaryRoleLabel(u.roles),

    // Vì API bạn chưa có các field này, để placeholder.
    // Nếu sau này bạn thêm vào schema (department/status/lastActive/avatar),
    // chỉ cần sửa map tại đây.
    department: "—",
    status: "Active",
    lastActive: "—",
    avatar: "",
  };
}

/**
 * 6) Fetch list users (admin-only)
 * Trả về UserRow[] để UI dùng thẳng.
 */
export async function fetchUsers(): Promise<UserRow[]> {
  const res = await fetch("/api/users", { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());

  const data = (await res.json()) as StaffDto[];
  return data.map(mapStaffToUserRow);
}

/**
 * 7) Fetch 1 user theo id (admin-only) - dùng cho trang edit
 * Trả về StaffDto để fill form edit.
 */
export async function fetchUserById(id: string): Promise<StaffDto> {
  const res = await fetch(`/api/users/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as StaffDto;
}

/**
 * 8) Delete user (admin-only)
 */
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
}

/**
 * 9) Update user (admin-only)
 * API PUT chỉ cho phép: email, firstname, lastname, phone, roles
 * roles phải là mảng: ["admin"] | ["staff"] | ["customer"]
 */
export type UpdateUserPayload = {
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  roles?: string[];
};

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const safePayload: UpdateUserPayload = {};

  if (payload.email !== undefined) safePayload.email = String(payload.email).trim().toLowerCase();
  if (payload.firstname !== undefined) safePayload.firstname = String(payload.firstname).trim();
  if (payload.lastname !== undefined) safePayload.lastname = String(payload.lastname).trim();
  if (payload.phone !== undefined) safePayload.phone = String(payload.phone).trim();

  // roles: convert từ select 1 giá trị -> ["staff"]... trước khi gọi updateUser
  if (payload.roles !== undefined) {
    safePayload.roles = Array.isArray(payload.roles)
        ? payload.roles.map((r) => String(r).trim().toLowerCase())
        : [];
  }

  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(safePayload),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json(); // trả về user đã update (StaffDto)
}

/**
 * 10) (OPTIONAL) Dữ liệu mock để dev UI
 * Nếu bạn không cần mock nữa thì có thể xoá hoàn toàn.
 */
export const MOCK_USERS: UserRow[] = [
  {
    id: "mock-1",
    name: "Demo Admin",
    email: "admin@demo.com",
    role: "Admin",
    department: "IT",
    status: "Active",
    lastActive: "Vừa xong",
    avatar: "",
  },
];
