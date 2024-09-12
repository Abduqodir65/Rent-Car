class ApiFeature {
    #_query;
    #_queryString;
  
    constructor(query, queryString) {
      this.#_query = query;
      this.#_queryString = queryString;
    }
  
    filter() {
      let queryStr = { ...this.#_queryString };
      // Filtering
      const excludedQueries = ["limit", "page", "sort", "fields"];
  
      // Remove excluded fields from query
      excludedQueries.map((efl) => delete queryStr[efl]);
  
      // Replacing query fields
      queryStr = JSON.parse(
        JSON.stringify(queryStr).replace(
          /\b(lt|lte|gt|gte)\b/g,
          (match) => `$${match}`
        )
      );
  
      this.#_query = this.#_query.find(queryStr);
  
      return this;
    }
  
    paginate(defaultLimit = 10) {
      // Pagination
      const limit = this.#_queryString?.limit || defaultLimit;
      const offset = this.#_queryString?.page
        ? (this.#_queryString.page - 1) * limit
        : 0;
  
      this.#_query = this.#_query.limit(limit).skip(offset);
  
      return this;
    }
  
    sort(defaultSortField) {
      if (this.#_queryString.sort) {
        const sortFields = this.#_queryString.sort.split(",").join(" ");
        this.#_query = this.#_query.sort(sortFields);
      } else {
        this.#_query = this.#_query.sort(defaultSortField);
      }
  
      return this;
    }
  
    limitFields() {
      // Field limiting
      if (this.#_queryString?.fields) {
        const selectedFields = this.#_queryString.fields.split(",").join(" ");
        this.#_query = this.#_query.select(selectedFields);
      }
  
      return this;
    }
  
    getQuery() {
      return this.#_query;
    }
  }
  
  export default ApiFeature;