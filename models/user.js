function findUser(id, callback) {
    callback(null, {
        "user": {
            name: "이승원"
        }
    });
}

function findOrCreate(profile, callback) {
    callback(null, profile.id);
}
module.exports.findUser = findUser;
module.exports.findOrCreate = findOrCreate;