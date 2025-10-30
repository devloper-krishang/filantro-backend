import bcrypt from 'bcryptjs';
import { MODULES } from '..//config/permissions.config';
import { ROLES } from '../config/roles.config';
import { Permission } from '../models/permission';
import { Role } from '../models/role';
import { User } from '../modules/user';

function toKey(name: string) {
  return name.toLowerCase().replace(/\s+/g, '_');
}

async function seedPermissions() {
  for (const [moduleKey, actions] of Object.entries(MODULES)) {
    for (const action of actions) {
      const key = `${moduleKey}_${action}`;
      await Permission.updateOne({ key }, { moduleKey, action, key }, { upsert: true });
    }
  }
  console.log('✅ Permissions seeded');
}

async function seedRoles() {
  for (const role of ROLES) {
    const key = toKey(role.name);
    let permissions = role.permissions;

    // Expand "*" into all permissions
    if (permissions.includes('*')) {
      const allPerms = (await Permission.find().lean()) as Array<{ key: string }>;
      permissions = allPerms.map((p) => p.key);
    }

    await Role.updateOne({ key }, { ...role, key, permissions }, { upsert: true });
  }
  console.log('✅ Roles seeded');
}

async function seedSuperAdmin() {
  const passwordHash = await bcrypt.hash('Test@123', 10);

  await User.updateOne(
    { email: 'superadmin@example.com' },
    {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: passwordHash,
      roleKey: 'super_admin', // matches role key
      isSuperAdmin: true,
      status: 'active',
    },
    { upsert: true }
  );

  console.log('✅ Super Admin user seeded');
}

export async function seedRBAC() {
  await seedPermissions();
  await seedRoles();
  await seedSuperAdmin();
  console.log('🎉 RBAC seeding complete');
}
