"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWeaponDamage = exports.WEAPON_BASE_DAMAGE = void 0;
exports.WEAPON_BASE_DAMAGE = 4;
const calculateWeaponDamage = (heroAttack, enemyDefense) => {
    const normalizedAttack = Number.isFinite(heroAttack) ? Math.floor(heroAttack) : 0;
    const normalizedDefense = Number.isFinite(enemyDefense) ? Math.floor(enemyDefense) : 0;
    return Math.max(1, exports.WEAPON_BASE_DAMAGE + normalizedAttack - normalizedDefense);
};
exports.calculateWeaponDamage = calculateWeaponDamage;
