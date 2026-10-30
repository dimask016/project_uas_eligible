import { usePage } from '@inertiajs/react';

export function hasAnyPermission(permissions) {
    // Ambil auth dari props Inertia secara terproteksi
    const { auth } = usePage().props;
    
    // Pastikan permissions ada dan bernilai object
    let allPermissions = auth?.permissions || {};
    let hasPermission = false;

    if (Array.isArray(permissions)) {
        permissions.forEach(function(item) {
            if (allPermissions[item]) {
                hasPermission = true;
            }
        });
    }

    return hasPermission;
}
