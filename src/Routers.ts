import {Route} from "./abstract/Route";
import { OllamaRoute } from "./routers/OllamaRoute";
import { PageRoute } from "./routers/pageRoute";
import { UserRoute } from "./routers/UserRoute";

export const router: Array<Route> = [
    new PageRoute(),new UserRoute(),new OllamaRoute()
];

