"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.getProductHandler = exports.updateProductHandler = exports.createProductHandler = void 0;
const product_service_1 = require("../service/product.service");
/**
 * @param req
 * @param res
 * @param next
 * create new  product controller
 */
function createProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const body = req.body;
        const product = yield (0, product_service_1.createProduct)(Object.assign(Object.assign({}, body), { user: userId }));
        return res.send(product);
    });
}
exports.createProductHandler = createProductHandler;
/**
 * @param req
 * @param res
 * @param next
 * update product controller
 */
function updateProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // get product ID from params
        const productId = req.params.productId;
        // we need to fin the product
        const product = yield (0, product_service_1.findProduct)({ productId });
        // if the product does not exist then return 404 status
        if (!product)
            return res.sendStatus(404);
        return res.status(200).send(product);
    });
}
exports.updateProductHandler = updateProductHandler;
/**
 * @param req
 * @param res
 * @param next
 * get product list controller
 */
function getProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.params.productId;
        const product = yield (0, product_service_1.getAllProduct)();
        if (!product) {
            return res.sendStatus(404);
        }
        return res.send(product);
    });
}
exports.getProductHandler = getProductHandler;
/**
 * @param req
 * @param res
 * @param next
 * delete product controller
 */
function deleteProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const productId = req.params.productId;
        const product = yield (0, product_service_1.findProduct)({ productId });
        if (!productId)
            return res.status(404);
        if (String(product === null || product === void 0 ? void 0 : product.user) !== userId) {
            return res.sendStatus(403);
        }
        yield (0, product_service_1.deleteProduct)({ productId });
        return res.sendStatus(200);
    });
}
exports.deleteProductHandler = deleteProductHandler;
