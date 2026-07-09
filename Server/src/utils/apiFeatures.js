class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search(fields = ["name"]) {
        if (this.queryString.search) {
            const keyword = this.queryString.search.trim();
            this.query = this.query.find({
                $or: fields.map((field) => ({
                    [field]: { $regex: keyword, $options: "i" },
                })),
            });
        }

        return this;
    }

    filter(allowedFields = []) {
        const filters = {};

        allowedFields.forEach((field) => {
            if (this.queryString[field]) {
                filters[field] = this.queryString[field];
            }
        });

        if (this.queryString.minPrice || this.queryString.maxPrice) {
            filters.price = {};
            if (this.queryString.minPrice) filters.price.$gte = Number(this.queryString.minPrice);
            if (this.queryString.maxPrice) filters.price.$lte = Number(this.queryString.maxPrice);
        }

        if (this.queryString.minRating) {
            filters["ratings.average"] = { $gte: Number(this.queryString.minRating) };
        }

        this.query = this.query.find(filters);
        return this;
    }

    sort(defaultSort = "-createdAt") {
        const sortBy = this.queryString.sort
            ? this.queryString.sort.split(",").join(" ")
            : defaultSort;

        this.query = this.query.sort(sortBy);
        return this;
    }

    paginate(defaultLimit = 12) {
        const page = Math.max(Number(this.queryString.page) || 1, 1);
        const limit = Math.max(Number(this.queryString.limit) || defaultLimit, 1);
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        this.pagination = { page, limit };
        return this;
    }
}

export default ApiFeatures;
