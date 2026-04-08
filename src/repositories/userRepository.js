let users = [];
let autoIncrementId = 1;

class UserRepository {
    findAll() {
        return users;
    }

    findByUsername(username) {
        return users.find(u => u.username === username);
    }

    save(user) {
        user.id = autoIncrementId++;
        users.push(user);
        return user;
    }
}

module.exports = new UserRepository();