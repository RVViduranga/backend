"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedData = getPaginatedData;
async function getPaginatedData(Model, queryParams, populate) {
    const page = parseInt(queryParams.page) || 1;
    const pageSize = parseInt(queryParams.pageSize) || 10;
    const sortBy = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder === 'desc' ? -1 : 1;
    const filters = {};
    // Remove special params and build filters
    Object.keys(queryParams).forEach(key => {
        if (["page", "pageSize", "sortBy", "sortOrder", "populate"].includes(key))
            return;
        const value = queryParams[key];
        if (value === '' || value === undefined)
            return;
        // Range filter: field_min, field_max
        if (key.endsWith('_min')) {
            const field = key.replace('_min', '');
            filters[field] = filters[field] || {};
            filters[field]['$gte'] = value;
        }
        else if (key.endsWith('_max')) {
            const field = key.replace('_max', '');
            filters[field] = filters[field] || {};
            filters[field]['$lte'] = value;
        }
        // Partial match: field_like
        else if (key.endsWith('_like')) {
            const field = key.replace('_like', '');
            filters[field] = { $regex: value, $options: 'i' };
        }
        // Default: exact match
        else {
            filters[key] = value;
        }
    });
    let query = Model.find(filters)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    // Flexible population: string, array, or object
    if (populate)
        query = query.populate(populate);
    else if (typeof queryParams.populate === 'string')
        query = query.populate(queryParams.populate);
    const [data, total] = await Promise.all([
        query,
        Model.countDocuments(filters)
    ]);
    return { data, total };
}
