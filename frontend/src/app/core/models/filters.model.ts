export class Filters {
    limit?: number;
    offset?: number;
    price_min?: number;
    price_max?: number;
    category?: string;
    name?: string;
    
    constructor(
        limit?: number,
        offset?: number,
        price_min?: number,
        price_max?: number,
        category?: string,
        name?: string,
    ) 
    {
        this.limit = limit || 3;
        this.offset = offset || 0;
        this.price_min = price_min;
        this.price_max = price_max;
        this.category = category;
        this.name = name;
    }

    public length(): number {
        let count: number = 0;
        if (this.price_min) count++;
        if (this.price_max) count++;
        if (this.category) count++;
        if (this.name) count++;
        return count;
    }
}