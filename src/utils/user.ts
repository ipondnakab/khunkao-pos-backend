import { UserShopRole } from '@/enums/userShopRole.enum';
import { ShopInterface } from '@/models/shop.model';
import { validateObjectId } from './validate';
import shopRepository from '@/repositories/shop.repository';
import { SystemException, Trace } from '@/core/errors';
import { StatusCodes } from 'http-status-codes';

export const getRoleInShop = (shop: ShopInterface, userId: string) => {
    if (shop.owner.toString() === userId.toString()) {
        return UserShopRole.OWNER;
    }
    if (shop.managers.includes(userId)) {
        return UserShopRole.MANAGER;
    }
    if (shop.staffs.includes(userId)) {
        return UserShopRole.STAFF;
    }
    return UserShopRole.UNASSIGNED;
};

export const verifyRoleInShop = async (
    userId: string,
    shopId: string,
    acceptRole: UserShopRole[],
) => {
    const ownerId = validateObjectId(userId);
    const shop = await shopRepository.getById(validateObjectId(shopId));
    const role = getRoleInShop(shop.toObject(), ownerId.toString());
    if (!acceptRole.includes(role)) {
        throw new SystemException({
            trace: Trace.HANDLER,
            message: 'User is not owner or manager',
            statusCode: StatusCodes.BAD_REQUEST,
        });
    }
    return {
        shop,
        role,
    };
};
