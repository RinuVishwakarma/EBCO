export interface MenuProp {
    id: number;
    label: string;
    route: string;
    children?: MenuProp[];
    name?: string | undefined;
    image?: string;
}



export type MenuItem = {
    id: number;
    label: string;
    route: string;
    children?: MenuItem[];
    isOpen?: boolean;
};

export type MenuMobileProp = {
    id: number;
    label: string;
    route: string;
    children?: MenuItem[];
    isOpen?: boolean;
};
