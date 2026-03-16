import { CommunitiesService } from "./communities.service";
import { AuthService } from "../auth/auth.service";
export declare class CommunitiesController {
    private readonly communitiesService;
    private readonly authService;
    constructor(communitiesService: CommunitiesService, authService: AuthService);
    list(query?: string): Promise<{
        communities: any;
    }>;
    create(payload: {
        name: string;
        description: string;
    }, authorization?: string): Promise<{
        community: any;
        competition: any;
    }>;
    join(communityId: number, authorization?: string): Promise<{
        competition: any;
    }>;
}
