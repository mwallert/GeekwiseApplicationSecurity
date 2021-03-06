const Car = require('../models/car.model');
const CarDb = require('../db/car.db');
const Common = require('./common');

class CarController {
    constructor(router) {
        router.route('/car/search')
            .post(this.search);
        router.route('/car/:id')
            .get(this.getOne)
            .put(this.updateOne)
            .delete(this.deleteOne);
        router.route('/car')
            .get(this.getAll)
            .post(this.insertOne);
    }

    async getOne(req, res, next) {
        try {
            const data = await CarDb.getOne(req.params.id);
            if (data) {
                let car = new Car(data);
                return Common.resultOk(res, car);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async updateOne(req, res, next) {
        try {
            const data = await CarDb.updateOne(req.params.id, req.body);
            if (data) {
                let car = new Car(data);
                return Common.resultOk(res, car);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async insertOne(req, res, next) {
        try {
            const data = await CarDb.insertOne(req.body);
            if (data) {
                let car = new Car(data);
                return Common.resultOk(res, car);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code && e.code === 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async deleteOne(req, res, next) {
        try {
            const data = await CarDb.deleteOne(req.params.id);
            if (data) {
                return Common.resultOk(res, data);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code && e.code === 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await CarDb.getAll();
            if (data) {
                let cars = data.map(car => { return new Car(car) });
                return Common.resultOk(res, cars);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            return Common.resultErr(res, e.message);
        }
    }

    async search(req, res, next) {
        try {
            const data = await CarDb.search(req.body.search);
            if (data) {
                let cars = data.map(car => { return new Car(car) });
                return Common.resultOk(res, cars);
            } else {
                return Common.resultOk([]);
            }
        } catch (e) {
            console.log('catch', e)
            return Common.resultErr(res, e.message);
        }
    }
}

module.exports = CarController;