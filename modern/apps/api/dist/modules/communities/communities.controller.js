"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunitiesController = void 0;
const common_1 = require("@nestjs/common");
const communities_service_1 = require("./communities.service");
const auth_service_1 = require("../auth/auth.service");
let CommunitiesController = class CommunitiesController {
    constructor(communitiesService, authService) {
        this.communitiesService = communitiesService;
        this.authService = authService;
    }
    list(query) {
        return this.communitiesService.list(query);
    }
    create(payload, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.communitiesService.create(userId, payload.name, payload.description);
    }
    join(communityId, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.communitiesService.join(communityId, userId);
    }
};
exports.CommunitiesController = CommunitiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("query")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":communityId/join"),
    __param(0, (0, common_1.Param)("communityId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "join", null);
exports.CommunitiesController = CommunitiesController = __decorate([
    (0, common_1.Controller)("api/communities"),
    __metadata("design:paramtypes", [communities_service_1.CommunitiesService,
        auth_service_1.AuthService])
], CommunitiesController);
//# sourceMappingURL=communities.controller.js.map