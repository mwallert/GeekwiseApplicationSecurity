class Blog {
    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    toString() {
        return `Post: ${this.post}, By: ${this.sig}`;
    }
}

module.exports = Blog;