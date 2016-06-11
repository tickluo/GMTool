var ModelFactory = function () {
    this.models = {};
};

var pro = ModelFactory.prototype;


/**
 * Get model by name.
 *
 * @param  {String}  name             The model's name.
 * @return {Object}                   Mongoose model object.
 */
pro.getModel = function(name) {
    return this.models[name];
};

/**
 * Get default model, if not exist, create one.
 *
 * @param  {Object}  dbConn           The DBConn object.
 * @param  {String}  name             The model's name.
 * @param  {Object}  schema           Mongoose schema object.
 * @return {Object}                   Mongoose model object.
 */
pro.createDefaultModel = function(dbConn, name, schema) {
    var model = this.models[name];
    if (!model) {
        model = dbConn.db.model(name, schema);
        this.models[name] = model;
        model.ensureIndexes(function(err) {
            if (err) {
                throw err;
            }
        });
    }

    return model;
};

/**
 * Create model.
 *
 * @param  {Object}  dbConn           The DBConn object.
 * @param  {String}  name             The model's name.
 * @param  {Object}  schema           Mongoose schema object.
 * @return {Object}                   Mongoose model object. 
 */
pro.createModel = function(dbConn, name, schema) {
    return dbConn.db.model(name, schema);
};

module.exports = ModelFactory;
