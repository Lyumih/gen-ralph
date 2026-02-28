export const WEAPON_BASE_DAMAGE = 4;
export const calculateWeaponDamage = (heroAttack, enemyDefense) => {
    const normalizedAttack = Number.isFinite(heroAttack) ? Math.floor(heroAttack) : 0;
    const normalizedDefense = Number.isFinite(enemyDefense) ? Math.floor(enemyDefense) : 0;
    return Math.max(1, WEAPON_BASE_DAMAGE + normalizedAttack - normalizedDefense);
};
